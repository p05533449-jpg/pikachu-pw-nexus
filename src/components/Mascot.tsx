import pikachu from "@/assets/pikachu.png";

type Props = {
  src?: string | null;
  className?: string;
};

/**
 * Idle-animated mascot: gentle breathing float, glowing aura, natural blink and
 * subtle pupil drift. Overlay eyes only render for the default mascot artwork.
 */
export function Mascot({ src, className = "" }: Props) {
  const isDefault = !src;
  const image = src || pikachu;

  return (
    <div className={`relative mx-auto aspect-[64/68] w-32 sm:w-40 ${className}`}>
      <div
        aria-hidden
        className="animate-glow absolute inset-0 rounded-full blur-2xl"
        style={{ background: "var(--gradient-accent)" }}
      />
      <div className="animate-float relative h-full w-full will-change-transform">
        <img
          src={image}
          alt="PW Nexus mascot"
          className="h-full w-full object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.55)]"
          loading="eager"
          decoding="async"
        />
        {isDefault && (
          <>
            {[52, 74].map((left) => (
              <span
                key={left}
                aria-hidden
                className="absolute h-[2.6%] w-[2.4%] rounded-full bg-black/85"
                style={{
                  left: `${left}%`,
                  top: "35%",
                  animation: "pupil 4.5s ease-in-out infinite",
                }}
              />
            ))}
            {[50.5, 72.5].map((left) => (
              <span
                key={`lid-${left}`}
                aria-hidden
                className="absolute h-[5.5%] w-[6%] origin-top rounded-b-full bg-[#f6c53c]"
                style={{
                  left: `${left}%`,
                  top: "31.5%",
                  animation: "blink 6s ease-in-out infinite",
                }}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
