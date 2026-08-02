import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useSiteContent, type Platform } from "@/hooks/useSiteContent";
import { MenuButton } from "@/components/MenuButton";
import { SideNav } from "@/components/SideNav";
import { MaintenanceDialog } from "@/components/MaintenanceDialog";

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
  const [maintenanceOf, setMaintenanceOf] = useState<Platform | null>(null);
  const platform = visiblePlatforms.find((p) => p.id === id);
  const blocked = platform?.maintenance ?? false;

  useEffect(() => {
    if (platform?.maintenance) setMaintenanceOf(platform);
  }, [platform]);

  const select = (p: Platform) => {
    if (p.maintenance) {
      setMaintenanceOf(p);
      return;
    }
    if (p.open_mode === "external") {
      window.open(p.url, "_blank", "noopener,noreferrer");
      return;
    }
    window.location.assign(`/view/${p.id}`);
  };

  return (
    <>
      <SideNav
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        platforms={visiblePlatforms}
        settings={settings}
        onSelect={select}
      />

      {maintenanceOf && (
        <MaintenanceDialog name={maintenanceOf.name} onClose={() => setMaintenanceOf(null)} />
      )}

      <div className="fixed inset-0 bg-black">
        {platform && !blocked ? (
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
              <p className="max-w-xs text-sm text-zinc-400">
                {blocked
                  ? "This platform is currently under maintenance. Please wait a few hours and try again later."
                  : "This platform is unavailable or hidden."}
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

        <div className="fixed left-4 top-4 z-50">
          <MenuButton onClick={() => setMenuOpen(true)} />
        </div>
      </div>
    </>
  );
}
