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
    "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-[15px] font-semibold text-zinc-300 transition-colors hover:bg-primary/10 hover:text-primary";

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
        className={`absolute inset-y-0 left-0 flex w-[82%] max-w-xs flex-col border-r border-primary/10 bg-[#0a0a0a]/95 backdrop-blur-md transition-transform duration-300 ease-out will-change-transform ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-white/5 p-4">
          <Link
            to="/admin"
            onClick={onClose}
            className="flex min-w-0 items-center gap-3"
            aria-label="Admin panel"
          >
            <div className="h-10 w-10 shrink-0">
              <Mascot src={settings?.mascot_url ?? null} className="!w-10" static />
            </div>
            <span className="truncate font-display text-lg font-bold">
              {first}
              <span className="text-primary">{rest ? ` ${rest}` : ""}</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/5 bg-zinc-900/60 text-zinc-400 transition-colors hover:text-primary"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          <Link
            to="/"
            onClick={onClose}
            activeProps={{ className: "!bg-primary/10 !text-primary" }}
            className={itemClass}
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/5 bg-zinc-900/60 text-primary">
              <Home className="h-4.5 w-4.5" />
            </span>
            Home
          </Link>

          <p className="px-3 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
            Platforms
          </p>

          {platforms.map((p) => (
            <button
              key={p.id}
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
          ))}
        </nav>
      </aside>
    </div>
  );
}
