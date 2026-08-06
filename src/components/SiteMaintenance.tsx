import { Link } from "@tanstack/react-router";
import { Mascot } from "./Mascot";

type Props = {
  brand: string;
  mascotUrl: string | null;
};

/** Full-screen site-wide maintenance page shown to normal visitors. */
export function SiteMaintenance({ brand, mascotUrl }: Props) {
  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 py-12">
      <div aria-hidden className="app-canvas fixed inset-0 z-[-1]" />
      <div className="glass-panel animate-rise w-full max-w-md rounded-[28px] p-7 text-center">
        <Mascot src={mascotUrl} className="!w-[96px]" />
        <p className="mt-4 font-display text-xs uppercase tracking-[0.28em] text-primary">
          {brand}
        </p>
        <h1 className="mt-3 font-display text-[2rem] font-black leading-tight">
          <span className="hero-glow-white">We&apos;re Currently</span>{" "}
          <span className="hero-glow-green text-primary">Upgrading</span>{" "}
          <span className="hero-glow-white">the Site</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-zinc-400">
          We are performing scheduled maintenance to improve your experience. Thank you for your
          patience — we&apos;ll be back shortly.
        </p>

        <div
          role="progressbar"
          aria-label="Maintenance in progress"
          className="mt-7 h-1.5 w-full overflow-hidden rounded-full bg-white/10"
        >
          <div className="maintenance-bar h-full w-1/3 rounded-full bg-primary shadow-[0_0_14px_rgba(16,185,129,0.6)]" />
        </div>

        <div className="mt-5 flex items-center justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2 w-2 rounded-full bg-primary/70"
              style={{ animation: `pulse-dot 1.2s ${i * 0.16}s ease-in-out infinite` }}
            />
          ))}
        </div>

        <Link
          to="/admin"
          className="mt-7 inline-block text-[11px] text-zinc-500 transition-colors hover:text-zinc-300"
        >
          Admin access
        </Link>
      </div>
    </main>
  );
}
