type Stat = {
  value: string
  label: string
}

import type { ReactNode } from 'react'

type HeroSectionProps = {
  tagline: string
  title: ReactNode
  description: string
  primaryCta: string
  secondaryCta: string
  bullets: string[]
  stats: Stat[]
  onPrimaryAction?: () => void
  onSecondaryAction?: () => void
}

const StatBadge = ({ value, label }: Stat) => (
  <div className="rounded-2xl border border-white/40 bg-white/20 px-4 py-3 text-center text-sm text-white shadow-inner backdrop-blur">
    <div className="text-2xl font-semibold">{value}</div>
    <div>{label}</div>
  </div>
)

export function HeroSection({
  tagline,
  title,
  description,
  primaryCta,
  secondaryCta,
  bullets,
  stats,
  onPrimaryAction,
  onSecondaryAction,
}: HeroSectionProps) {
  return (
    <section className="grid gap-8 rounded-4xl bg-gradient-to-br from-[#2a174b] to-[#49256d] p-8 text-white shadow-2xl md:grid-cols-2">
      <div className="space-y-6">
        <p className="inline-flex items-center rounded-full border border-white/30 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/70">
          {tagline}
        </p>
        <h1 className="text-4xl font-semibold leading-snug md:text-5xl">{title}</h1>
        <p className="text-base text-white/80">{description}</p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onPrimaryAction}
            className="rounded-2xl bg-white px-5 py-2 text-sm font-semibold text-[#1f1235] shadow-lg transition hover:-translate-y-0.5"
          >
            {primaryCta}
          </button>
          <button
            onClick={onSecondaryAction}
            className="rounded-2xl border border-white/40 px-5 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5"
          >
            {secondaryCta}
          </button>
        </div>
      </div>
      <div className="flex flex-col justify-between">
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat) => (
            <StatBadge key={stat.label} value={stat.value} label={stat.label} />
          ))}
        </div>
        <div className="mt-8 rounded-3xl bg-white/10 p-6 text-sm leading-6 text-white/80 shadow-inner">
          {bullets.map((bullet) => (
            <p key={bullet}>{bullet}</p>
          ))}
        </div>
      </div>
    </section>
  )
}
