import { Menu } from "lucide-react";

export function MenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open navigation menu"
      className="glass-panel grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-primary transition-transform duration-200 active:scale-95 hover:accent-ring"
    >
      <Menu className="h-6 w-6" strokeWidth={2.6} />
    </button>
  );
}
