import { Menu } from "lucide-react";

export function MenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open navigation menu"
      className="rounded-2xl border border-primary/30 bg-black/80 p-3.5 text-primary shadow-[0_0_20px_rgba(16,185,129,0.22),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md transition-all duration-300 hover:border-primary/60 hover:shadow-[0_0_28px_rgba(16,185,129,0.4)] active:scale-95"
    >
      <Menu className="h-6 w-6" strokeWidth={2.5} />
    </button>
  );
}

