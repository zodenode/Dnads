type Props = {
  value: number
  label?: string
}

export function Confidence({ value, label = 'Confidence' }: Props) {
  const pct = Math.round(value * 100)
  return (
    <span className="confidence" title={`${label}: model-estimated reliability`}>
      <span className="confidence__label">{label}</span>
      <span className="confidence__value">{pct}%</span>
    </span>
  )
}
