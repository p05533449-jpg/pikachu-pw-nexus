import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUpRight, Wrench } from "lucide-react";
import { useSiteContent, type Platform } from "@/hooks/useSiteContent";
import { MenuButton } from "@/components/MenuButton";
import { SideNav } from "@/components/SideNav";
import { Mascot } from "@/components/Mascot";
import { PlatformLogo } from "@/components/PlatformLogo";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { MaintenanceDialog } from "@/components/MaintenanceDialog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PW Nexus — Premium Learning Hub" },
      {
        name: "description",
        content:
          "PW Nexus is a fast, clean and distraction-free learning hub that opens all your study platforms in one premium app.",
      },
      { property: "og:title", content: "PW Nexus — Premium Learning Hub" },
      {
        property: "og:description",
        content: "All your study platforms in one premium, distraction-free learning hub.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { visiblePlatforms, settings, isLoading } = useSiteContent();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [maintenanceOf, setMaintenanceOf] = useState<Platform | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem("nexus-welcomed") !== "1") setShowWelcome(true);
  }, []);

  const dismissWelcome = () => {
    sessionStorage.setItem("nexus-welcomed", "1");
    setShowWelcome(false);
  };

  const brand = settings?.brand_name ?? "PW Nexus";
  const homeTitle = settings?.home_title ?? `Welcome to ${brand}`;
  const titleWords = homeTitle.split(" ");
  const lead = titleWords.slice(0, Math.max(1, titleWords.length - 2)).join(" ");
  const highlight = titleWords.slice(Math.max(1, titleWords.length - 2)).join(" ");

  const openPlatform = (p: Platform) => {
    if (p.maintenance) {
      setMaintenanceOf(p);
      return;
    }
    void navigate({ to: "/view/$id", params: { id: p.id } });
  };

  return (
    <>
      {showWelcome && (
        <WelcomeScreen
          title={settings?.welcome_title ?? brand}
          subtitle={settings?.welcome_subtitle ?? ""}
          buttonText={settings?.welcome_button ?? "🔥 Open Now 🔥"}
          onEnter={dismissWelcome}
        />
      )}

      <SideNav
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        platforms={visiblePlatforms}
        settings={settings}
        onMaintenance={setMaintenanceOf}
      />

      {maintenanceOf && (
        <MaintenanceDialog name={maintenanceOf.name} onClose={() => setMaintenanceOf(null)} />
      )}

      <main className="mx-auto min-h-screen w-full max-w-3xl px-4 pb-20 sm:px-6">
        <div className="flex items-center justify-between py-4">
          <MenuButton onClick={() => setMenuOpen(true)} />
          <span className="font-display text-sm font-semibold tracking-tight text-muted-foreground">
            {brand}
          </span>
        </div>

        <section className="flex flex-col items-center pt-2 text-center">
          <Mascot src={settings?.mascot_url ?? null} />
          <h1 className="mt-5 font-display text-[2rem] font-extrabold leading-[1.08] tracking-tight sm:text-5xl">
            {lead} <span className="text-accent-gradient block">{highlight}</span>
          </h1>
          <p className="mt-3 max-w-md text-balance text-[15px] leading-relaxed text-muted-foreground">
            {settings?.home_subtitle ??
              "Your Premium Learning Sanctuary. Fast, clean, and distraction-free."}
          </p>
        </section>

        {settings?.banner_url && (
          <img
            src={settings.banner_url}
            alt="Featured banner"
            loading="lazy"
            decoding="async"
            className="mt-8 w-full rounded-3xl border border-border object-cover"
          />
        )}

        <div className="mt-10 flex items-baseline justify-between">
          <h2 className="font-display text-lg font-bold">Your platforms</h2>
          {!isLoading && visiblePlatforms.length > 0 && (
            <span className="text-xs text-muted-foreground">{visiblePlatforms.length} available</span>
          )}
        </div>

        <section className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {isLoading &&
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-3xl border border-border bg-surface" />
            ))}

          {!isLoading &&
            visiblePlatforms.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => openPlatform(p)}
                className="group relative flex flex-col items-center gap-3 rounded-3xl border border-border bg-surface p-4 text-center transition-[transform,border-color,background-color] duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-surface-2 active:scale-[0.98]"
              >
                {p.maintenance && (
                  <span className="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-full bg-primary/12 text-primary">
                    <Wrench className="h-3 w-3" />
                  </span>
                )}
                <PlatformLogo name={p.name} logoUrl={p.logo_url} />
                <span className="line-clamp-2 font-display text-sm font-bold leading-snug">
                  {p.name}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary">
                  {p.maintenance ? "Maintenance" : "Open"}
                  {!p.maintenance && <ArrowUpRight className="h-3 w-3" />}
                </span>
              </button>
            ))}
        </section>

        {!isLoading && visiblePlatforms.length === 0 && (
          <p className="mt-12 text-center text-sm text-muted-foreground">
            No platforms yet. Add them from the admin panel.
          </p>
        )}

        <footer className="mt-16 text-center text-xs text-muted-foreground/70">
          <Link to="/" className="hover:text-foreground">
            {brand}
          </Link>{" "}
          · Built for focused study
        </footer>
      </main>
    </>
  );
}
