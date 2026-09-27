// Removes the plain (white / light-grey) studio background from a product photo so it sits on
// the site's dark cards. The fill starts at the image border and stops at edges, so white parts
// of a product survive. Photos whose border isn't a light, even colour are kept as-is.
const sharp = require("sharp");

const MAX = 900;

function dist(r1, g1, b1, r2, g2, b2) {
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
}

async function cutout(input, opts = {}) {
  const tolerance = opts.tolerance ?? 9;
  const edgeLimit = opts.edgeLimit ?? 6;

  let source = sharp(input).rotate();
  if (opts.crop) {
    // Keep only part of the photo (fractions of the image), e.g. to drop a studio backdrop edge.
    const meta = await source.clone().metadata();
    const [cx, cy, cw, ch] = opts.crop;
    source = sharp(
      await source
        .extract({
          left: Math.round(cx * meta.width),
          top: Math.round(cy * meta.height),
          width: Math.round(cw * meta.width),
          height: Math.round(ch * meta.height),
        })
        .png()
        .toBuffer(),
    );
  }
  if (opts.erase) {
    // Paint a watermark area (fractions of the image) with the background colour before cutting.
    const meta = await source.clone().metadata();
    const [ex, ey, ew, eh] = opts.erase;
    const box = {
      left: Math.round(ex * meta.width),
      top: Math.round(ey * meta.height),
      width: Math.round(ew * meta.width),
      height: Math.round(eh * meta.height),
    };
    const patch = await sharp({ create: { width: box.width, height: box.height, channels: 3, background: "#ffffff" } }).png().toBuffer();
    source = sharp(await source.composite([{ input: patch, left: box.left, top: box.top }]).png().toBuffer());
  }
  const base = source.resize(MAX, MAX, { fit: "inside", withoutEnlargement: true });
  const { data, info } = await base.clone().ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { data: soft } = await base.clone().blur(1.2).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;

  // Background colour = the most common light colour on the border (the product may touch an edge).
  const border = [];
  for (let x = 0; x < w; x++) border.push(x, (h - 1) * w + x);
  for (let y = 0; y < h; y++) border.push(y * w, y * w + w - 1);
  const buckets = new Map();
  for (const p of border) {
    const key = ((soft[p * 3] >> 3) << 10) | ((soft[p * 3 + 1] >> 3) << 5) | (soft[p * 3 + 2] >> 3);
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }
  const topKey = [...buckets.entries()].sort((a, c) => c[1] - a[1])[0][0];
  const approx = [((topKey >> 10) & 31) * 8 + 4, ((topKey >> 5) & 31) * 8 + 4, (topKey & 31) * 8 + 4];
  let r = 0, g = 0, b = 0, n = 0;
  for (const p of border) {
    if (dist(soft[p * 3], soft[p * 3 + 1], soft[p * 3 + 2], ...approx) < 14) {
      r += soft[p * 3]; g += soft[p * 3 + 1]; b += soft[p * 3 + 2]; n++;
    }
  }
  r /= n; g /= n; b /= n;
  const share = n / border.length;
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  const removable = opts.force ?? (lum > 170 && share > (opts.minShare ?? 0.35));

  if (removable) {
    // Edge strength (Sobel on blurred luminance).
    const L = new Float32Array(w * h);
    for (let p = 0; p < w * h; p++) L[p] = 0.299 * soft[p * 3] + 0.587 * soft[p * 3 + 1] + 0.114 * soft[p * 3 + 2];
    const edge = new Float32Array(w * h);
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const p = y * w + x;
        const gx = L[p - w + 1] + 2 * L[p + 1] + L[p + w + 1] - L[p - w - 1] - 2 * L[p - 1] - L[p + w - 1];
        const gy = L[p + w - 1] + 2 * L[p + w] + L[p + w + 1] - L[p - w - 1] - 2 * L[p - w] - L[p - w + 1];
        edge[p] = Math.sqrt(gx * gx + gy * gy) / 4;
      }
    }

    const bg = new Uint8Array(w * h);
    const queue = new Int32Array(w * h);
    let head = 0, tail = 0;
    const accept = (q, from) => {
      if (edge[q] > edgeLimit) return false;
      const d = dist(soft[q * 3], soft[q * 3 + 1], soft[q * 3 + 2], r, g, b);
      if (d < tolerance) return true;
      // Soft gradients / floor shadows: follow them only through very flat areas.
      if (from >= 0 && d < 70 && edge[q] < edgeLimit / 2.5) {
        return dist(soft[q * 3], soft[q * 3 + 1], soft[q * 3 + 2], soft[from * 3], soft[from * 3 + 1], soft[from * 3 + 2]) < 2;
      }
      return false;
    };
    const seed = (p) => {
      if (!bg[p] && accept(p, -1)) { bg[p] = 1; queue[tail++] = p; }
    };
    for (const p of border) seed(p);
    while (head < tail) {
      const p = queue[head++];
      const x = p % w, y = (p / w) | 0;
      if (x + 1 < w) { const q = p + 1; if (!bg[q] && accept(q, p)) { bg[q] = 1; queue[tail++] = q; } }
      if (x > 0) { const q = p - 1; if (!bg[q] && accept(q, p)) { bg[q] = 1; queue[tail++] = q; } }
      if (y + 1 < h) { const q = p + w; if (!bg[q] && accept(q, p)) { bg[q] = 1; queue[tail++] = q; } }
      if (y > 0) { const q = p - w; if (!bg[q] && accept(q, p)) { bg[q] = 1; queue[tail++] = q; } }
    }

    // Drop small leftover specks (watermarks, stray text, dust) that aren't part of the product.
    const label = new Int32Array(w * h).fill(-1);
    const sizes = [];
    for (let p = 0; p < w * h; p++) {
      if (bg[p] || label[p] !== -1) continue;
      const id = sizes.length;
      let count = 0;
      head = 0; tail = 0;
      queue[tail++] = p; label[p] = id;
      while (head < tail) {
        const c = queue[head++];
        count++;
        const x = c % w, y = (c / w) | 0;
        for (const q of [x + 1 < w ? c + 1 : -1, x > 0 ? c - 1 : -1, y + 1 < h ? c + w : -1, y > 0 ? c - w : -1]) {
          if (q >= 0 && !bg[q] && label[q] === -1) { label[q] = id; queue[tail++] = q; }
        }
      }
      sizes.push(count);
    }
    const largest = Math.max(...sizes);
    for (let p = 0; p < w * h; p++) if (!bg[p] && sizes[label[p]] < largest * (opts.minComponent ?? 0.006)) bg[p] = 1;

    // Distance (in px, up to FRINGE) from the background, used to soften the cut edge.
    const FRINGE = 2;
    const near = new Uint8Array(w * h).fill(255);
    for (let p = 0; p < w * h; p++) if (bg[p]) near[p] = 0;
    for (let step = 1; step <= FRINGE; step++) {
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const p = y * w + x;
          if (near[p] !== 255) continue;
          if (near[p - 1] === step - 1 || near[p + 1] === step - 1 || near[p - w] === step - 1 || near[p + w] === step - 1) {
            near[p] = step;
          }
        }
      }
    }

    for (let p = 0; p < w * h; p++) {
      const i = p * 4;
      if (bg[p]) { data[i + 3] = 0; continue; }
      if (near[p] > FRINGE) { data[i + 3] = 255; continue; }
      // Edge pixel: estimate how much background colour is mixed in and remove it (no white halo).
      const d = dist(data[i], data[i + 1], data[i + 2], r, g, b);
      const a = Math.max(0.15, Math.min(1, d / 90 + (near[p] - 1) * 0.35));
      data[i] = Math.max(0, Math.min(255, Math.round((data[i] - (1 - a) * r) / a)));
      data[i + 1] = Math.max(0, Math.min(255, Math.round((data[i + 1] - (1 - a) * g) / a)));
      data[i + 2] = Math.max(0, Math.min(255, Math.round((data[i + 2] - (1 - a) * b) / a)));
      data[i + 3] = Math.round(a * 255);
    }
  }

  let img = sharp(data, { raw: { width: w, height: h, channels: 4 } });
  if (removable) img = sharp(await img.png().toBuffer()).trim({ threshold: 1 });
  return { image: img, removable };
}

module.exports = { cutout };
