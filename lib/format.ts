export function formatPrice(value: number, currency = "Rs") {
  return `${currency} ${Number(value).toLocaleString("en-PK", { maximumFractionDigits: 0 })}`;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatDate(value: string) {
  return new Date(value).toLocaleString("en-PK", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
