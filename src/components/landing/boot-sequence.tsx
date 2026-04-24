"use client";

import { useEffect, useState } from "react";

const LINES = [
  "initializing dnads...",
  "loading market simulation layer...",
  "activating selection pressure model...",
  "starting evolutionary grid...",
  "system online",
] as const;

type Props = {
  onComplete: () => void;
};

export function BootSequence({ onComplete }: Props) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (visibleCount >= LINES.length) {
      const t = window.setTimeout(() => {
        setFadeOut(true);
        window.setTimeout(onComplete, 600);
      }, 380);
      return () => clearTimeout(t);
    }
    const delay = visibleCount === 0 ? 120 : 220 + Math.random() * 180;
    const id = window.setTimeout(() => setVisibleCount((c) => c + 1), delay);
    return () => clearTimeout(id);
  }, [visibleCount, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-30 flex items-center justify-center bg-[#0b0c0f] transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
      aria-live="polite"
    >
      <div className="font-mono text-xs leading-relaxed text-[#9a9a9a] sm:text-sm">
        {LINES.slice(0, visibleCount).map((line, i) => (
          <p key={line} className={i === visibleCount - 1 ? "text-[#c4c4c4]" : "text-[#6a6a6a]"}>
            {">"} {line}
          </p>
        ))}
      </div>
    </div>
  );
}
