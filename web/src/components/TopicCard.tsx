export type Topic = {
  id: string
  title: string
  description: string
  icon: string
  accent: string
  focus: string[]
}

type TopicCardProps = {
  topic: Topic
}

export function TopicCard({ topic }: TopicCardProps) {
  return (
    <article className="flex h-full flex-col rounded-3xl border border-white/60 bg-white/90 p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl">
      <div
        className={`mb-4 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r ${topic.accent} px-3 py-1 text-sm font-semibold text-[#2c1233]`}
      >
        <span className="text-xl">{topic.icon}</span>
        {topic.title}
      </div>
      <p className="flex-1 text-sm text-neutral-600">{topic.description}</p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-ziwei">
        {topic.focus.map((item) => (
          <span key={item} className="rounded-full bg-ziwei/10 px-3 py-1">
            {item}
          </span>
        ))}
      </div>
      <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-ziwei to-tarot px-4 py-2 text-sm font-semibold text-white shadow-lg">
        查看主題流程 <span>→</span>
      </button>
    </article>
  )
}
