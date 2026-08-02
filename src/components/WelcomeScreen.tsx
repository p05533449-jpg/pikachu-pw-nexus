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
    window.setTimeout(onEnter, 400);
  };

  return (
    <div
      className={`fixed inset-0 z-[60] flex flex-col items-center justify-center gap-4 bg-white px-6 transition-all duration-400 ${
        leaving ? "scale-105 opacity-0" : "opacity-100"
      }`}
    >
      <h1 className="animate-rise text-center font-display text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-3xl">
        {title}
      </h1>
      {subtitle && (
        <p className="animate-rise max-w-xs text-center text-[13px] leading-relaxed text-neutral-500">
          {subtitle}
        </p>
      )}
      <button
        type="button"
        onClick={enter}
        className="animate-rise mt-1 w-full max-w-[280px] rounded-2xl bg-neutral-950 px-6 py-3.5 text-center font-display text-[15px] font-semibold text-white shadow-[0_12px_28px_-14px_rgba(0,0,0,0.6)] transition-transform duration-200 active:scale-[0.97]"
      >
        {buttonText}
      </button>
    </div>
  );
}
