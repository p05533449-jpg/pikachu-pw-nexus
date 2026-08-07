type Props = {
  name: string;
  logoUrl: string | null;
  size?: "sm" | "lg";
};

/**
 * Gradient-ringed platform tile. Every tile has identical outer dimensions and
 * identical inner padding, so any uploaded logo (portrait, landscape, square,
 * SVG, transparent PNG) renders at a consistent visual size, centred, with its
 * original aspect ratio preserved — never stretched, cropped or overflowing.
 */
export function PlatformLogo({ name, logoUrl, size = "lg" }: Props) {
  const isSidebar = size === "sm";
  const box = isSidebar
    ? "h-10 w-10 rounded-full border border-white/10 bg-black"
    : "h-[74px] w-[74px] rounded-[22px] bg-gradient-to-br from-green-400 to-emerald-600 p-[2.5px] shadow-[0_0_18px_rgba(16,185,129,0.28)] transition-shadow duration-300 group-hover:shadow-[0_0_26px_rgba(16,185,129,0.45)]";
  const inner = isSidebar ? "rounded-full" : "rounded-[20px] p-[7px]";

  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className={`${box} shrink-0 overflow-hidden`}
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
            className={
              isSidebar
                ? "absolute inset-0 h-full w-full object-cover object-center"
                : "max-h-full max-w-full object-contain object-center"
            }
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
