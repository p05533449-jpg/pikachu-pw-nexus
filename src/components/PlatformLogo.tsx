type Props = {
  name: string;
  logoUrl: string | null;
  size?: "sm" | "lg";
};

export function PlatformLogo({ name, logoUrl, size = "lg" }: Props) {
  const box = size === "lg" ? "h-20 w-20 rounded-2xl" : "h-11 w-11 rounded-xl";

  if (logoUrl) {
    return (
      <div className={`${box} shrink-0 overflow-hidden border border-primary/40 bg-surface-2`}>
        <img
          src={logoUrl}
          alt={`${name} logo`}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className={`${box} grid shrink-0 place-items-center border border-primary/40 bg-surface-2 font-display text-primary ${
        size === "lg" ? "text-2xl" : "text-sm"
      }`}
    >
      {initials}
    </div>
  );
}
