"use client";

import { useEffect, useRef, useState } from "react";

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
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const done = () => {
      setFadeOut(true);
      window.setTimeout(() => onCompleteRef.current(), 600);
    };

    if (visibleCount >= LINES.length) {
      const t = window.setTimeout(done, 380);
      return () => clearTimeout(t);
    }
    const delay = visibleCount === 0 ? 120 : 220 + Math.random() * 180;
    const id = window.setTimeout(() => setVisibleCount((c) => c + 1), delay);
    return () => window.clearTimeout(id);
  }, [visibleCount]);

  useEffect(() => {
    const max = window.setTimeout(() => onCompleteRef.current(), 6000);
    return () => clearTimeout(max);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-30 flex items-center justify-center bg-[#0b0c0f] transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
      aria-live="polite"
    >
      <div className="font-mono text-xs leading-relaxed text-[#9a9a9a] sm:text-sm">
        {visibleCount === 0 ? (
          <p className="text-[#6a6a6a]">
            {">"} starting…
          </p>
        ) : null}
        {LINES.slice(0, visibleCount).map((line, i) => (
          <p key={line} className={i === visibleCount - 1 ? "text-[#c4c4c4]" : "text-[#6a6a6a]"}>
            {">"} {line}
          </p>
        ))}
      </div>
    </div>
  );
}
