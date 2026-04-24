export function ConfidenceInline({
  value,
  label = "Confidence",
}: {
  value: number;
  label?: string;
}) {
  const pct = Math.round(value * 100);
  return (
    <span className="inline-flex items-baseline gap-1.5 text-[11px] text-[var(--text-muted)]">
      <span className="font-medium tracking-wide text-[var(--text-secondary)]">{label}</span>
      <span className="tabular-nums font-mono text-[var(--text-primary)]">{pct}%</span>
    </span>
  );
}

export function ReasonSignal({ text }: { text: string }) {
  return (
    <p className="mt-1 text-[12px] leading-relaxed text-[var(--text-muted)]">
      <span className="font-medium text-[var(--text-secondary)]">Signal: </span>
      {text}
    </p>
  );
}
