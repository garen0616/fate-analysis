type ScoreBarProps = {
  value: number
  max?: number
  color?: string
}

export function ScoreBar({ value, max = 100, color = '#cc6b5a' }: ScoreBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div className="h-2 w-full rounded-full bg-neutral-200/70">
      <div
        className="h-2 rounded-full transition-all duration-300"
        style={{ width: `${percentage}%`, background: color }}
      />
    </div>
  )
}
