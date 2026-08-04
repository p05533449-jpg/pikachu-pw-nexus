type Props = {
  name: string;
  logoUrl: string | null;
  size?: "sm" | "lg";
};

/**
 * Gradient-ringed platform tile. The logo is always contained inside the tile:
 * any aspect ratio (portrait, landscape, square, SVG, transparent PNG) is
 * scaled down to fit and stays centred without stretching or cropping.
 */
export function PlatformLogo({ name, logoUrl, size = "lg" }: Props) {
  const box = size === "lg" ? "h-20 w-20 rounded-2xl" : "h-10 w-10 rounded-xl";
  const inner = size === "lg" ? "rounded-[14px]" : "rounded-[9px]";

  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className={`${box} shrink-0 bg-gradient-to-br from-green-400 to-emerald-600 p-[2px] shadow-[0_0_18px_rgba(16,185,129,0.28)] transition-all duration-300 group-hover:shadow-[0_0_26px_rgba(16,185,129,0.45)]`}
    >
      <div
        className={`${inner} relative flex h-full w-full items-center justify-center overflow-hidden bg-black`}
      >
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={`${name} logo`}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-contain object-center transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span className={`font-bold text-primary ${size === "lg" ? "text-xl" : "text-[10px]"}`}>
            {initials}
          </span>
        )}
      </div>
    </div>
  );
}

