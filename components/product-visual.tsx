import { CategoryIcon } from "@/components/category-icon";

/**
 * Product artwork on the site's dark, grid-lit backdrop. Photos have transparent backgrounds,
 * so the themed backdrop shows through; without a photo a glowing category icon is shown.
 */
export function ProductVisual({
  imageUrl,
  icon,
  name,
  size = "md",
}: {
  imageUrl: string | null;
  icon: string;
  name: string;
  size?: "sm" | "md" | "lg";
}) {
  const iconSize = size === "lg" ? "size-28" : size === "sm" ? "size-7" : "size-16";
  const padding = size === "lg" ? "p-10" : size === "sm" ? "p-1.5" : "p-6";

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_45%,color-mix(in_oklab,var(--color-neon)_16%,transparent),transparent_65%)]">
      <div className="bg-grid absolute inset-0 opacity-60" />
      {size !== "sm" && (
        <>
          {!imageUrl && (
            <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-neon/10 to-transparent animate-scan" />
          )}
          <div className="absolute bottom-[12%] left-1/2 h-6 w-2/3 -translate-x-1/2 rounded-[50%] bg-neon/25 blur-xl transition-all duration-500 group-hover:w-3/4 group-hover:bg-neon-2/40" />
        </>
      )}
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- local and admin-provided URLs of any size
        <img
          src={imageUrl}
          alt={name}
          loading="lazy"
          className={`relative h-full w-full object-contain ${padding} drop-shadow-[0_12px_24px_rgba(0,0,0,0.55)] transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-110`}
        />
      ) : (
        <CategoryIcon
          name={icon}
          className={`${iconSize} relative text-neon drop-shadow-[0_0_18px_var(--color-neon)] transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:text-neon-2`}
        />
      )}
    </div>
  );
}
