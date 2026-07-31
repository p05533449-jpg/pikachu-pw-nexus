import { Link } from "@tanstack/react-router";
import { Home, X } from "lucide-react";
import { PlatformLogo } from "./PlatformLogo";
import { Mascot } from "./Mascot";
import type { Platform, SiteSettings } from "@/hooks/useSiteContent";

type Props = {
  open: boolean;
  onClose: () => void;
  platforms: Platform[];
  settings: SiteSettings | null;
};

export function SideNav({ open, onClose, platforms, settings }: Props) {
  const brand = settings?.brand_name ?? "PW Nexus";
  const [first, ...restWords] = brand.split(" ");
  const rest = restWords.join(" ");

  return (
    <div
      className={`fixed inset-0 z-50 ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        className={`glass-panel absolute inset-y-0 left-0 flex w-[80%] max-w-xs flex-col rounded-r-3xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border p-4">
          <Link
            to="/admin"
            onClick={onClose}
            className="flex min-w-0 items-center gap-3"
            aria-label="Admin panel"
          >
            <div className="h-11 w-11 shrink-0">
              <Mascot src={settings?.mascot_url ?? null} className="!w-11" />
            </div>
            <span className="truncate font-display text-xl font-bold">
              {first}
              <span className="text-primary">{rest ? ` ${rest}` : ""}</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-surface-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          <Link
            to="/"
            onClick={onClose}
            activeProps={{ className: "bg-primary/10 accent-ring text-primary" }}
            className="flex items-center gap-3 rounded-2xl px-3 py-3 font-display text-base transition-colors hover:bg-surface-2"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-primary/40 bg-surface-2 text-primary">
              <Home className="h-5 w-5" />
            </span>
            Home
          </Link>

          {platforms.map((p) => (
            <Link
              key={p.id}
              to="/view/$id"
              params={{ id: p.id }}
              onClick={onClose}
              activeProps={{ className: "bg-primary/10 accent-ring text-primary" }}
              className="flex items-center gap-3 rounded-2xl px-3 py-3 font-display text-base text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
            >
              <PlatformLogo name={p.name} logoUrl={p.logo_url} size="sm" />
              <span className="truncate">{p.name}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </div>
  );
}
