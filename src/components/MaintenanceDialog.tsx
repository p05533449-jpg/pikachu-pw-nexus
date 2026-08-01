import { Wrench, X } from "lucide-react";

type Props = {
  name: string;
  onClose: () => void;
};

export function MaintenanceDialog({ name, onClose }: Props) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${name} maintenance notice`}
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass-panel animate-rise relative w-full max-w-sm rounded-3xl p-6 text-center"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-surface-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/12 text-primary">
          <Wrench className="h-6 w-6" />
        </span>
        <h2 className="mt-4 font-display text-xl font-bold">{name} is under maintenance</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          This platform is currently under maintenance. Please wait a few hours and try again later.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-2xl bg-primary px-5 py-3.5 font-display text-sm font-semibold text-primary-foreground transition-transform active:scale-[0.97]"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
