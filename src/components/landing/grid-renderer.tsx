"use client";

import type { Grid } from "@/hooks/useGameOfLife";
import { GOL_COLS, GOL_ROWS } from "@/hooks/useGameOfLife";

const ALIVE = "▣";
const DEAD = "░";

function gridToAscii(g: Grid): string {
  const lines: string[] = [];
  for (let y = 0; y < GOL_ROWS; y++) {
    let line = "";
    for (let x = 0; x < GOL_COLS; x++) {
      line += g[y][x] ? ALIVE : DEAD;
    }
    lines.push(line);
  }
  return lines.join("\n");
}

type Props = {
  grid: Grid;
  className?: string;
};

export function GridRenderer({ grid, className = "" }: Props) {
  const text = gridToAscii(grid);
  return (
    <pre
      className={`pointer-events-none select-none whitespace-pre font-mono text-[0.55rem] leading-none tracking-tighter text-[#6b6b6b] opacity-[0.18] sm:text-[0.62rem] md:text-[0.68rem] ${className}`}
      aria-hidden
    >
      {text}
    </pre>
  );
}
