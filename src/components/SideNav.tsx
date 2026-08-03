import { Link } from "@tanstack/react-router";
import { Home, Wrench, X } from "lucide-react";
import { PlatformLogo } from "./PlatformLogo";
import { Mascot } from "./Mascot";
import type { Platform, SiteSettings } from "@/hooks/useSiteContent";

type Props = {
  open: boolean;
  onClose: () => void;
  platforms: Platform[];
  settings: SiteSettings | null;
  /** Handles maintenance popups, external opens and in-app viewer navigation. */
  onSelect: (p: Platform) => void;
};

export function SideNav({ open, onClose, platforms, settings, onSelect }: Props) {
  const brand = settings?.brand_name ?? "PW Nexus";
  const [first, ...restWords] = brand.split(" ");
  const rest = restWords.join(" ");

  const itemClass =
    "flex w-full items-center gap-4 rounded-2xl px-3 py-3 text-left font-display text-[17px] font-bold text-zinc-400 transition-colors hover:text-primary";

  return (
    <div
      className={`fixed inset-0 z-[60] ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/70 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        className={`absolute inset-y-0 left-0 flex w-[76%] max-w-[300px] flex-col border-r border-primary/10 bg-[#0a0a0a]/95 backdrop-blur-md transition-transform duration-300 ease-out will-change-transform ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-white/5 px-4 py-5">
          <Link
            to="/admin"
            onClick={onClose}
            className="flex min-w-0 items-center gap-3"
            aria-label="Admin panel"
          >
            <div className="h-11 w-11 shrink-0 rounded-2xl border border-primary/40 bg-black/60 p-1 shadow-[0_0_18px_rgba(16,185,129,0.25)]">
              <Mascot src={settings?.mascot_url ?? null} className="!w-full" static />
            </div>
            <span className="truncate font-display text-[22px] font-black">
              {first}
              <span className="text-primary">{rest ? rest : ""}</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-zinc-800/80 text-zinc-300 transition-colors hover:text-primary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <Link
            to="/"
            onClick={onClose}
            activeProps={{ className: "nav-active !text-primary" }}
            className={itemClass}
          >
            <Home className="h-6 w-6 shrink-0 text-primary" />
            Home
          </Link>

          {platforms.map((p) => (
            <div key={p.id}>
              <div className="mx-auto my-1 h-px w-[70%] bg-white/8" />
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSelect(p);
                }}
                className={`group ${itemClass}`}
              >
                <PlatformLogo name={p.name} logoUrl={p.logo_url} size="sm" />
                <span className="truncate">{p.name}</span>
                {p.maintenance && <Wrench className="ml-auto h-4 w-4 shrink-0 text-amber-300" />}
              </button>
            </div>
          ))}
        </nav>
      </aside>
    </div>
  );
}
