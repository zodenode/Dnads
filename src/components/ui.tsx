import type { ReactNode } from "react";

export function SectionShell({
  id,
  eyebrow,
  title,
  children,
  delayClass = "",
}: {
  id?: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
  delayClass?: string;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-24 rounded-2xl border border-zinc-200/80 bg-surface-raised shadow-sm shadow-zinc-900/5 ${delayClass}`}
    >
      <div className="border-b border-zinc-100 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          {eyebrow}
        </p>
        <h2 className="mt-1 text-lg font-semibold tracking-tight text-zinc-900">
          {title}
        </h2>
      </div>
      <div className="px-6 py-6">{children}</div>
    </section>
  );
}

export function ConfidencePill({
  value,
  label = "Confidence",
}: {
  value: number;
  label?: string;
}) {
  const pct = Math.round(value * 100);
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-xs font-medium text-zinc-700"
      title={`${label}: ${pct}% — model-assisted estimate, not a guarantee`}
    >
      <span className="text-zinc-500">{label}</span>
      <span className="tabular-nums text-zinc-900">{pct}%</span>
    </span>
  );
}

export function ReasonSignals({
  items,
  compact,
}: {
  items: string[];
  compact?: boolean;
}) {
  if (!items.length) return null;
  return (
    <div className={compact ? "mt-2" : "mt-3"}>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
        Reason signals
      </p>
      <ul className="mt-1.5 list-inside list-disc text-xs leading-relaxed text-zinc-600">
        {items.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </div>
  );
}

export function TrendGlyph({ trend }: { trend: "up" | "flat" | "down" }) {
  if (trend === "up") return <span className="text-emerald-700">↑</span>;
  if (trend === "down") return <span className="text-rose-700">↓</span>;
  return <span className="text-zinc-500">→</span>;
}

export function MarketPressureBadge({
  level,
}: {
  level: "LOW" | "MEDIUM" | "HIGH";
}) {
  const map = {
    LOW: { label: "LOW", dot: "bg-emerald-500", text: "text-emerald-800" },
    MEDIUM: {
      label: "MEDIUM",
      dot: "bg-amber-500",
      text: "text-amber-900",
    },
    HIGH: { label: "HIGH", dot: "bg-rose-500", text: "text-rose-800" },
  }[level];
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-xs font-semibold ${map.text}`}
    >
      <span className={`h-2 w-2 rounded-full ${map.dot}`} aria-hidden />
      Market Pressure: {map.label}
    </span>
  );
}
