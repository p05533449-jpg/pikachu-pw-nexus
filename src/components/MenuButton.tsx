import { Menu } from "lucide-react";

export function MenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open navigation menu"
      className="rounded-xl border border-primary/20 bg-surface/90 p-3 text-primary shadow-[0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-md transition-colors hover:border-primary/40 hover:bg-primary/10"
    >
      <Menu className="h-6 w-6" />
    </button>
  );
}
