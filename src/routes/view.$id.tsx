import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";
import { MenuButton } from "@/components/MenuButton";
import { SideNav } from "@/components/SideNav";

export const Route = createFileRoute("/view/$id")({
  head: () => ({
    meta: [
      { title: "Study Viewer — PW Nexus" },
      {
        name: "description",
        content: "Open your study platform inside the PW Nexus built-in viewer, distraction-free.",
      },
      { property: "og:title", content: "Study Viewer — PW Nexus" },
      {
        property: "og:description",
        content: "Browse your learning platforms inside PW Nexus without leaving the app.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ViewerPage,
});

function ViewerPage() {
  const { id } = Route.useParams();
  const { visiblePlatforms, settings, isLoading } = useSiteContent();
  const [menuOpen, setMenuOpen] = useState(false);
  const platform = visiblePlatforms.find((p) => p.id === id);

  return (
    <>
      <SideNav
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        platforms={visiblePlatforms}
        settings={settings}
      />

      <div className="flex h-screen flex-col">
        <header className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-background/80 px-3 py-3 backdrop-blur">
          <MenuButton onClick={() => setMenuOpen(true)} />
          <h1 className="truncate font-display text-lg font-bold">
            {platform?.name ?? (isLoading ? "Loading…" : "Not available")}
          </h1>
          {platform && (
            <a
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open in new tab"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-surface-2 text-primary"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </header>

        <div className="relative flex-1 bg-surface">
          {platform ? (
            <iframe
              key={platform.id}
              src={platform.url}
              title={platform.name}
              className="h-full w-full border-0"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              referrerPolicy="no-referrer"
            />
          ) : (
            !isLoading && (
              <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  This platform is unavailable or hidden.
                </p>
                <Link
                  to="/"
                  className="rounded-2xl bg-primary px-5 py-3 font-display text-sm font-semibold text-primary-foreground"
                >
                  Back home
                </Link>
              </div>
            )
          )}
          {platform && (
            <p className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-background/80 px-3 py-1 text-[11px] text-muted-foreground">
              If the site refuses to load, use the open icon above.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
