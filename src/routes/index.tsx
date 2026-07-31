import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";
import { MenuButton } from "@/components/MenuButton";
import { SideNav } from "@/components/SideNav";
import { Mascot } from "@/components/Mascot";
import { PlatformLogo } from "@/components/PlatformLogo";
import { WelcomeScreen } from "@/components/WelcomeScreen";

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

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
      />

      <main className="mx-auto min-h-screen w-full max-w-2xl px-4 pb-16">
        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 py-4">
          <MenuButton onClick={() => setMenuOpen(true)} />
          <div />
          <div className="h-12 w-12" />
        </div>

        <section className="animate-rise flex flex-col items-center text-center">
          <Mascot src={settings?.mascot_url ?? null} />
          <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] sm:text-5xl">
            {lead}{" "}
            <span className="text-accent-gradient block">{highlight}</span>
          </h1>
          <p className="mt-4 max-w-md text-balance text-base text-muted-foreground">
            {settings?.home_subtitle ??
              "Your Premium Learning Sanctuary. Fast, clean, and distraction-free."}
          </p>
        </section>

        {settings?.banner_url && (
          <img
            src={settings.banner_url}
            alt="Featured banner"
            loading="lazy"
            className="glass-panel mt-8 w-full rounded-3xl object-cover"
          />
        )}

        <section className="mt-10 grid grid-cols-2 gap-4">
          {isLoading &&
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="glass-panel h-44 animate-pulse rounded-3xl" />
            ))}

          {!isLoading &&
            visiblePlatforms.map((p, i) => (
              <Link
                key={p.id}
                to="/view/$id"
                params={{ id: p.id }}
                style={{ animationDelay: `${i * 60}ms` }}
                className="glass-panel animate-rise group flex flex-col items-center gap-4 rounded-3xl p-5 transition-all duration-300 hover:-translate-y-1 hover:accent-ring active:scale-[0.97]"
              >
                <PlatformLogo name={p.name} logoUrl={p.logo_url} />
                <span className="line-clamp-2 text-center font-display text-base font-bold">
                  {p.name}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Open <ArrowUpRight className="h-3 w-3" />
                </span>
              </Link>
            ))}
        </section>

        {!isLoading && visiblePlatforms.length === 0 && (
          <p className="mt-12 text-center text-sm text-muted-foreground">
            No platforms yet. Add them from the admin panel.
          </p>
        )}
      </main>
    </>
  );
}
