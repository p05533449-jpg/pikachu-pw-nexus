import { useState } from "react";

type Props = {
  title: string;
  subtitle: string;
  buttonText: string;
  onEnter: () => void;
};

export function WelcomeScreen({ title, subtitle, buttonText, onEnter }: Props) {
  const [leaving, setLeaving] = useState(false);

  const enter = () => {
    setLeaving(true);
    window.setTimeout(onEnter, 420);
  };

  return (
    <div
      className={`fixed inset-0 z-[60] flex flex-col items-center justify-center gap-6 bg-white px-6 transition-all duration-400 ${
        leaving ? "scale-105 opacity-0" : "opacity-100"
      }`}
    >
      <h1 className="animate-rise text-center font-display text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl">
        {title}
      </h1>
      {subtitle && (
        <p className="animate-rise max-w-sm text-center text-sm text-neutral-500">{subtitle}</p>
      )}
      <button
        type="button"
        onClick={enter}
        className="animate-rise w-full max-w-sm rounded-3xl bg-neutral-950 px-8 py-5 text-center font-display text-lg font-semibold text-white shadow-[0_18px_40px_-16px_rgba(0,0,0,0.6)] transition-transform duration-200 active:scale-[0.97]"
      >
        {buttonText}
      </button>
    </div>
  );
}
