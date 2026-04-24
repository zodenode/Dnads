import type { Competitor, GrowthReportData, MarketOverview, ReasonSignal, StrategicAngle } from '../types/report'

function clampDetail(s: string, max = 100): string {
  const t = s.trim()
  if (t.length <= max) return t
  return `${t.slice(0, max - 1)}…`
}

function normalizeReasonSignals(signals: ReasonSignal[]): ReasonSignal[] {
  return signals.map((s) => ({
    label: s.label,
    detail: clampDetail(s.detail, 100),
  }))
}

function normalizeSpendBand(raw: string): Competitor['spendBand'] {
  const k = raw.toLowerCase().replace(/\s+/g, ' ').trim()
  if (k === 'very high' || k === 'veryhigh' || k.includes('very high')) return 'very high'
  if (k === 'high' || k.startsWith('high')) return 'high'
  if (k === 'medium' || k.includes('medium')) return 'medium'
  if (k === 'low' || k.startsWith('low')) return 'low'
  return 'medium'
}

function normalizeMarket(m: MarketOverview): MarketOverview {
  return {
    ...m,
    saturationNotes: m.saturationNotes?.trim() || m.weakGap || 'Saturation read pending; treat as directional.',
    reasonSignals: normalizeReasonSignals(m.reasonSignals),
  }
}

function normalizeAngle(a: StrategicAngle): StrategicAngle {
  return {
    ...a,
    whyItWorks: clampDetail(a.whyItWorks, 160),
    usageRecommendation: clampDetail(a.usageRecommendation, 100),
    reasonSignals: a.reasonSignals ? normalizeReasonSignals(a.reasonSignals) : undefined,
  }
}

/** If backend returns loose shapes, coerce into analyst-report shape (presentation only). */
export function normalizeReport(data: GrowthReportData): GrowthReportData {
  return {
    ...data,
    market: normalizeMarket(data.market),
    angles: data.angles.map(normalizeAngle),
    competitors: data.competitors.map((c) => ({
      ...c,
      spendBand: normalizeSpendBand(c.spendBand),
      reasonSignals: c.reasonSignals ? normalizeReasonSignals(c.reasonSignals) : undefined,
    })),
    winningAds: data.winningAds.map((ad) => ({
      ...ad,
      reasonSignals: normalizeReasonSignals(ad.reasonSignals),
    })),
    productionQueue: data.productionQueue.map((p) => ({
      ...p,
      reasonSignals: normalizeReasonSignals(p.reasonSignals),
    })),
  }
}
