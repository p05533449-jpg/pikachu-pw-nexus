type Props = {
  name: string;
  logoUrl: string | null;
  size?: "sm" | "lg";
};

/** Gradient-ringed platform tile, matching the reference card artwork treatment. */
export function PlatformLogo({ name, logoUrl, size = "lg" }: Props) {
  const box = size === "lg" ? "h-20 w-20 rounded-2xl" : "h-11 w-11 rounded-xl";
  const inner = size === "lg" ? "rounded-2xl" : "rounded-[10px]";

  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className={`${box} shrink-0 bg-gradient-to-br from-green-400 to-emerald-600 p-[2px] shadow-lg transition-all duration-300 group-hover:shadow-primary/20`}
    >
      <div
        className={`${inner} flex h-full w-full items-center justify-center overflow-hidden bg-black`}
      >
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={`${name} logo`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <span
            className={`font-bold text-primary ${size === "lg" ? "text-xl" : "text-[11px]"}`}
          >
            {initials}
          </span>
        )}
      </div>
    </div>
  );
}
