import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
    if (p.open_mode === "external") {
      window.open(p.url, "_blank", "noopener,noreferrer");
      return;
    }
    void navigate({ to: "/view/$id", params: { id: p.id } });
  };

  const tagline: string[] = (
    settings?.home_subtitle?.trim() || "Education Must Be Free For Everyone"
  ).split(" ");



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

      <div aria-hidden className="app-canvas fixed inset-0 z-[-1]" />

      <SideNav
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        platforms={visiblePlatforms}
        settings={settings}
        onSelect={openPlatform}
      />

      {maintenanceOf && (
        <MaintenanceDialog name={maintenanceOf.name} onClose={() => setMaintenanceOf(null)} />
      )}

      <div className="fixed left-4 top-4 z-50">
        <MenuButton onClick={() => setMenuOpen(true)} />
      </div>

      <main className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-14 pt-16 sm:pt-20">
        <section className="flex flex-col items-center text-center">
          <Mascot src={settings?.mascot_url ?? null} className="!w-[88px] sm:!w-[104px]" />
          <h1 className="mt-3 font-display text-[3.1rem] font-black leading-[1.02] tracking-tight sm:text-6xl">
            <span className="hero-glow-white">{lead}</span>{" "}
            <span className="hero-glow-green text-primary">{highlight}</span>
          </h1>
          <p className="mt-5 max-w-xl font-display text-lg font-bold leading-snug text-white sm:text-xl">
            {tagline.map((part, i) =>
              part.toLowerCase() === "free" ? (
                <span key={i} className="hero-glow-green text-primary">
                  {part}{" "}
                </span>
              ) : (
                <span key={i}>{part} </span>
              ),
            )}
          </p>
        </section>


        {settings?.banner_url && (
          <img
            src={settings.banner_url}
            alt="Featured banner"
            loading="lazy"
            decoding="async"
            className="mx-auto mt-8 w-full rounded-3xl border border-white/5 object-cover"
          />
        )}

        <section className="mx-auto mt-10 flex w-full max-w-6xl flex-wrap justify-center gap-4 md:gap-6">
          {isLoading &&
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-[168px] w-[calc(50%-0.5rem)] animate-pulse rounded-3xl border border-white/5 bg-zinc-900/40 sm:w-[180px] lg:w-[210px]"
              />
            ))}

          {!isLoading &&
            visiblePlatforms.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => openPlatform(p)}
                className="group relative flex w-[calc(50%-0.5rem)] flex-col items-center overflow-hidden rounded-3xl border border-primary/15 bg-white/[0.02] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/45 hover:shadow-[0_0_30px_rgba(16,185,129,0.25)] active:scale-[0.97] sm:w-[180px] md:p-6 lg:w-[210px]"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.06] via-transparent to-primary/10 opacity-60 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative mb-5">
                  <PlatformLogo name={p.name} logoUrl={p.logo_url} />
                </div>

                <span className="pointer-events-none text-center text-sm font-bold text-zinc-200 transition-colors duration-300 group-hover:text-primary md:text-base">
                  {p.name}
                </span>
                {p.maintenance && (
                  <span className="mt-2 text-[11px] font-medium text-amber-300">Maintenance</span>
                )}
              </button>
            ))}
        </section>

        {!isLoading && visiblePlatforms.length === 0 && (
          <p className="mt-12 text-center text-sm text-zinc-400">
            No platforms yet. Add them from the admin panel.
          </p>
        )}

        <footer className="mt-16 text-center text-xs text-zinc-500">
          <Link to="/" className="hover:text-zinc-300">
            {brand}
          </Link>{" "}
          · Built for focused study
        </footer>
      </main>
    </>
  );
}
