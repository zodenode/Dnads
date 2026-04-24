import type { StrategicAngle } from "../data/mockReport";
import { ConfidencePill, SectionShell } from "./ui";

function AngleCard({ angle }: { angle: StrategicAngle }) {
  return (
    <article className="min-w-[280px] max-w-sm flex-shrink-0 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm ring-1 ring-zinc-200">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-zinc-900">{angle.title}</h3>
        <ConfidencePill value={angle.confidence} />
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg bg-zinc-50 px-2.5 py-2">
          <dt className="font-medium text-zinc-500">Market usage</dt>
          <dd className="mt-0.5 font-semibold text-zinc-900">
            {angle.marketUsage}{" "}
            <span className="font-normal text-zinc-600">
              ({angle.marketUsagePct}%)
            </span>
          </dd>
        </div>
        <div className="rounded-lg bg-zinc-50 px-2.5 py-2">
          <dt className="font-medium text-zinc-500">Opportunity</dt>
          <dd className="mt-0.5 font-semibold text-zinc-900">{angle.opportunity}</dd>
        </div>
        <div className="col-span-2 rounded-lg bg-zinc-50 px-2.5 py-2">
          <dt className="font-medium text-zinc-500">Psychological framing</dt>
          <dd className="mt-0.5 text-zinc-800">{angle.psychologicalFraming}</dd>
        </div>
        <div className="col-span-2 rounded-lg bg-zinc-50 px-2.5 py-2">
          <dt className="font-medium text-zinc-500">Saturation level</dt>
          <dd className="mt-0.5 text-zinc-800">{angle.saturationLevel}</dd>
        </div>
      </dl>
      <div className="mt-4 border-t border-zinc-100 pt-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
          Why it works
        </p>
        <p className="mt-1 text-xs leading-relaxed text-zinc-700">{angle.whyItWorks}</p>
        <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
          Example positioning
        </p>
        <p className="mt-1 text-sm font-medium italic text-zinc-900">
          {angle.examplePositioning}
        </p>
        <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
          Usage recommendation
        </p>
        <p className="mt-1 text-xs leading-relaxed text-zinc-700">
          {angle.usageRecommendation}
        </p>
      </div>
    </article>
  );
}

export function StrategicAnglesSection({
  angles,
  visible,
}: {
  angles: StrategicAngle[];
  visible: boolean;
}) {
  if (!visible) {
    return (
      <SectionShell id="angles" eyebrow="Layer 2" title="Strategic angles">
        <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80 px-4 py-10 text-center text-sm text-zinc-500">
          Mapping psychological frames, saturation, and where to deploy each angle — before
          any ad cards surface.
        </div>
      </SectionShell>
    );
  }

  return (
    <SectionShell
      id="angles"
      eyebrow="Layer 2"
      title="Winning creative angles identified"
    >
      <p className="mb-4 max-w-2xl text-sm text-zinc-600">
        Agency-style interpretation: each angle is scored, contextualized, and paired with
        deployment guidance — not raw generations.
      </p>
      <div className="-mx-1 flex gap-4 overflow-x-auto pb-2 pt-1 px-1">
        {angles.map((a) => (
          <AngleCard key={a.id} angle={a} />
        ))}
      </div>
    </SectionShell>
  );
}
