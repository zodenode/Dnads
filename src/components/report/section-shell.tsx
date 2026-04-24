export function SectionShell({
  kicker,
  title,
  children,
  id,
}: {
  kicker?: string;
  title: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] py-12 last:border-b-0"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {kicker ? (
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--text-muted)]">
            {kicker}
          </p>
        ) : null}
        <h2 className="mb-8 text-lg font-semibold tracking-tight text-[var(--text-primary)]">{title}</h2>
        {children}
      </div>
    </section>
  );
}
