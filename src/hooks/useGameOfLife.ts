"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export const GOL_COLS = 40;
export const GOL_ROWS = 25;

export type Grid = boolean[][];

function randomSeed(cols: number, rows: number, fillProbability = 0.32): Grid {
  const g: Grid = [];
  for (let y = 0; y < rows; y++) {
    const row: boolean[] = [];
    for (let x = 0; x < cols; x++) {
      row.push(Math.random() < fillProbability);
    }
    g.push(row);
  }
  return g;
}

function countNeighbors(g: Grid, x: number, y: number): number {
  let n = 0;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= GOL_COLS || ny >= GOL_ROWS) continue;
      if (g[ny][nx]) n++;
    }
  }
  return n;
}

function step(g: Grid): { next: Grid; births: number } {
  let births = 0;
  const next: Grid = [];
  for (let y = 0; y < GOL_ROWS; y++) {
    const row: boolean[] = [];
    for (let x = 0; x < GOL_COLS; x++) {
      const alive = g[y][x];
      const neighbors = countNeighbors(g, x, y);
      let nextAlive: boolean;
      if (alive) {
        nextAlive = neighbors === 2 || neighbors === 3;
      } else {
        nextAlive = neighbors === 3;
        if (nextAlive) births++;
      }
      row.push(nextAlive);
    }
    next.push(row);
  }
  return { next, births };
}

function countAlive(g: Grid): number {
  let c = 0;
  for (let y = 0; y < GOL_ROWS; y++) {
    for (let x = 0; x < GOL_COLS; x++) {
      if (g[y][x]) c++;
    }
  }
  return c;
}

function countSolidBlocks(g: Grid): number {
  let blocks = 0;
  for (let y = 0; y < GOL_ROWS - 1; y++) {
    for (let x = 0; x < GOL_COLS - 1; x++) {
      if (g[y][x] && g[y][x + 1] && g[y + 1][x] && g[y + 1][x + 1]) blocks++;
    }
  }
  return blocks;
}

export function useGameOfLife(enabled: boolean) {
  const [grid, setGrid] = useState<Grid>(() => randomSeed(GOL_COLS, GOL_ROWS));
  const [tickIndex, setTickIndex] = useState(0);
  const [lastBirths, setLastBirths] = useState(0);
  const tickMsRef = useRef(1000);

  const aliveCount = useMemo(() => countAlive(grid), [grid]);
  const density = aliveCount / (GOL_COLS * GOL_ROWS);
  const solidBlocks = useMemo(() => countSolidBlocks(grid), [grid]);

  const advance = useCallback(() => {
    setGrid((prev) => {
      const { next, births } = step(prev);
      setLastBirths(births);
      return next;
    });
    setTickIndex((t) => t + 1);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    tickMsRef.current = 800 + Math.floor(Math.random() * 401);
    const id = window.setInterval(advance, tickMsRef.current);
    return () => window.clearInterval(id);
  }, [enabled, advance]);

  return {
    grid,
    tickIndex,
    density,
    solidBlocks,
    lastBirths,
    aliveCount,
  };
}
