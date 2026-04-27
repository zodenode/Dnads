"use client";

import { useEffect, useState } from "react";

type Props = {
  tickIndex: number;
  density: number;
  solidBlocks: number;
  lastBirths: number;
  active: boolean;
};

function pickMessage(density: number, solidBlocks: number, lastBirths: number): string | null {
  if (solidBlocks >= 3) return "stable formation → saturated strategy region";
  if (density >= 0.34) return "cluster detected → high-performing creative region";
  if (lastBirths >= 8) return "new pattern emerging → mutation zone";
  if (density <= 0.14 && density > 0) return "isolated cells → weak creative signals";
  if (density < 0.08) return "sparse field → exploratory signal space";
  return null;
}

/**
 * Symbolic interpretation — not model reasoning. Updates occasionally to avoid noise.
 */
export function SimulationOverlay({ tickIndex, density, solidBlocks, lastBirths, active }: Props) {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!active || tickIndex === 0 || tickIndex % 6 !== 0) return;
    const next = pickMessage(density, solidBlocks, lastBirths);
    if (!next) return;
    const showId = window.setTimeout(() => setMessage(next), 0);
    const hideId = window.setTimeout(() => setMessage(null), 4500);
    return () => {
      window.clearTimeout(showId);
      window.clearTimeout(hideId);
    };
  }, [tickIndex, density, solidBlocks, lastBirths, active]);

  if (!active || !message) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-6 left-1/2 z-[1] max-w-[min(90vw,32rem)] -translate-x-1/2 px-4 font-mono text-[10px] leading-relaxed tracking-wide text-[#8a8a8a] opacity-70 transition-opacity duration-500"
      role="status"
    >
      <span className="text-[#5c5c5c]">simulation:</span> {message}
    </div>
  );
}
