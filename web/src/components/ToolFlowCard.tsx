export type ToolCard = {
  title: string
  subtitle: string
  tone: string
  steps: string[]
  actions: string[]
}

type ToolFlowCardProps = {
  card: ToolCard
}

export function ToolFlowCard({ card }: ToolFlowCardProps) {
  return (
    <div className={`rounded-4xl border border-neutral-100 ${card.tone} p-6 shadow-xl`}>
      <p className="text-sm font-semibold text-tarot">FLOW</p>
      <h3 className="mt-2 text-2xl font-semibold">{card.title}</h3>
      <p className="text-sm text-neutral-500">{card.subtitle}</p>
      <ol className="mt-5 space-y-3 text-sm text-neutral-700">
        {card.steps.map((step, index) => (
          <li key={step} className="flex gap-3">
            <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary-500/20 text-sm font-semibold text-primary-700">
              {index + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <div className="mt-6 flex flex-wrap gap-3">
        {card.actions.map((action) => (
          <button
            key={action}
            className="rounded-2xl border border-[#1f1235]/15 px-4 py-2 text-sm font-semibold text-[#1f1235] transition hover:-translate-y-0.5 hover:border-[#1f1235] hover:bg-white"
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  )
}
