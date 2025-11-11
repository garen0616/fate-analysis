import { useEffect, useState } from 'react'
import { drawTarotMock, type TarotCardResult } from '../lib/tarotMock'
import {
  createId,
  loadTarotRecords,
  saveTarotRecords,
  type TarotRecord,
} from '../lib/storage'
import { decodeSharePayload, encodeSharePayload } from '../lib/share'
import clsx from 'clsx'

const topics = ['事業 / 財運', '婚姻 / 伴侶', '愛情 / 新關係', '家庭 / 孩子', '健康 / 身心']
const spreads = [
  { label: '三張日常卡', value: '3' as const },
  { label: '六芒星', value: '6' as const },
  { label: '凱爾特十字（簡化）', value: 'cross' as const },
  { label: '關係牌陣', value: 'relation' as const },
  { label: '決策牌陣', value: 'decision' as const },
]

export function TarotSection() {
  const [selectedTopic, setSelectedTopic] = useState(topics[0])
  const [selectedSpread, setSelectedSpread] = useState<(typeof spreads)[number]['value']>(spreads[0].value)
  const [allowReverse, setAllowReverse] = useState(true)
  const [cards, setCards] = useState<TarotCardResult[]>([])
  const [summary, setSummary] = useState('尚未抽牌，請選擇主題。')
  const [records, setRecords] = useState<TarotRecord[]>([])
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [shareStatus, setShareStatus] = useState<string | null>(null)

  useEffect(() => {
    const stored = loadTarotRecords()
    if (stored.length > 0) {
      setRecords(stored)
      setCards(stored[0].cards)
      setSummary(stored[0].summary)
      setSelectedRecordId(stored[0].id)
      setSelectedTopic(stored[0].topic)
      setSelectedSpread(stored[0].spread as (typeof spreads)[number]['value'])
      setAllowReverse(stored[0].allowReverse)
    }

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const token = params.get('tarot')
      if (token) {
        const payload = decodeSharePayload<{
          topic: string
          spread: (typeof spreads)[number]['value']
          allowReverse: boolean
          summary: string
          cards: TarotCardResult[]
        }>(token)
        if (payload) {
          setSelectedTopic(payload.topic)
          setSelectedSpread(payload.spread)
          setAllowReverse(payload.allowReverse)
          const normalizedCards = (payload.cards ?? []).filter(
            (card): card is TarotCardResult => Boolean(card && card.name && card.focus),
          )
          setCards(normalizedCards)
          setSummary(payload.summary)
          const record: TarotRecord = {
            id: createId(),
            topic: payload.topic,
            spread: payload.spread,
            allowReverse: payload.allowReverse,
            cards: normalizedCards,
            summary: payload.summary,
            createdAt: Date.now(),
          }
          setSelectedRecordId(record.id)
          persistRecord(record)
        }
        window.history.replaceState({}, '', window.location.pathname)
      }
    }
  }, [])

  const persistRecord = (record: TarotRecord) => {
    const sanitized = record.cards.filter(
      (card): card is TarotCardResult => Boolean(card && card.name && card.focus),
    )
    if (sanitized.length === 0) return
    const next = [
      { ...record, cards: sanitized },
      ...records.filter((item) => item.id !== record.id),
    ]
    setRecords(next)
    saveTarotRecords(next)
  }

  const handleDraw = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    try {
      const { cards: newCards, summary: newSummary } = await drawTarotMock({
        topic: selectedTopic,
        spread: selectedSpread,
        allowReverse,
      })
      setCards(newCards)
      setSummary(newSummary)
      const record: TarotRecord = {
        id: createId(),
        topic: selectedTopic,
        spread: selectedSpread,
        allowReverse,
        cards: newCards,
        summary: newSummary,
        createdAt: Date.now(),
      }
      setSelectedRecordId(record.id)
      persistRecord(record)
    } finally {
      setLoading(false)
    }
  }

  const handleLoadRecord = (recordId: string) => {
    if (!recordId) return
    const record = records.find((item) => item.id === recordId)
    if (!record) return
    setSelectedRecordId(record.id)
    setCards(record.cards ?? [])
    setSummary(record.summary)
    setSelectedTopic(record.topic ?? topics[0])
    setSelectedSpread(record.spread as (typeof spreads)[number]['value'])
    setAllowReverse(record.allowReverse)
  }

  const handleDeleteRecord = (recordId: string) => {
    const filtered = records.filter((item) => item.id !== recordId)
    setRecords(filtered)
    saveTarotRecords(filtered)
    if (recordId === selectedRecordId) {
      setSelectedRecordId(null)
      setCards([])
      setSummary('尚未抽牌，請選擇主題。')
    }
  }

  const handleRenameRecord = (recordId: string) => {
    const record = records.find((item) => item.id === recordId)
    if (!record) return
    const newName = prompt('輸入新的標籤', record.topic)
    if (!newName) return
    const updated = { ...record, topic: newName }
    const next = records.map((item) => (item.id === recordId ? updated : item))
    setRecords(next)
    saveTarotRecords(next)
    if (recordId === selectedRecordId) {
      setSelectedTopic(newName)
    }
  }

  const handleShare = async () => {
    if (cards.length === 0 || typeof window === 'undefined') return
    const token = encodeSharePayload({
      topic: selectedTopic,
      spread: selectedSpread,
      allowReverse,
      summary,
      cards,
    })
    const url = new URL(window.location.href)
    url.searchParams.set('tarot', token)
    const payload = url.toString()
    try {
      if (navigator.share) {
        await navigator.share({
          title: '塔羅牌陣分享',
          text: '朋友分享的塔羅結果',
          url: payload,
        })
        setShareStatus('已透過裝置分享')
      } else {
        await navigator.clipboard.writeText(payload)
        setShareStatus('已複製分享連結')
      }
      setTimeout(() => setShareStatus(null), 2500)
    } catch {
      setShareStatus('瀏覽器不支援自動複製')
    }
  }

  return (
    <section id="tarot" className="space-y-6 rounded-4xl border border-neutral-100 bg-white p-8 shadow-2xl">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-tarot">TAROT DRAW</p>
        <h2 className="text-3xl font-semibold">塔羅抽牌 · 主題選擇</h2>
        <p className="text-sm text-neutral-600">
          選擇主題與牌陣後即可抽牌。此為假資料展示，正式版會根據真實牌組運算結果。
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-indigo-100 bg-indigo-50/60 px-4 py-3 text-sm text-neutral-700">
        <span className="font-semibold text-tarot">歷史牌陣</span>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedRecordId ?? ''}
            onChange={(event) => handleLoadRecord(event.target.value)}
            className="rounded-2xl border border-neutral-200 px-3 py-2 text-sm"
          >
            {records.length === 0 && <option value="">尚無紀錄</option>}
            {records.map((record) => (
              <option key={record.id} value={record.id}>
                {new Date(record.createdAt).toLocaleString()} · {record.topic}
              </option>
            ))}
          </select>
          {selectedRecordId && (
            <>
              <button
                type="button"
                onClick={() => handleRenameRecord(selectedRecordId)}
                className="rounded-2xl border border-tarot/40 px-3 py-1 text-xs text-tarot"
              >
                重新命名
              </button>
              <button
                type="button"
                onClick={() => handleDeleteRecord(selectedRecordId)}
                className="rounded-2xl border border-rose-200 px-3 py-1 text-xs text-rose-500"
              >
                刪除紀錄
              </button>
            </>
          )}
        </div>
      </div>

      <form className="grid gap-4 rounded-3xl border border-indigo-50 bg-indigo-50/60 p-6 lg:grid-cols-3" onSubmit={handleDraw}>
        <label className="text-sm font-medium text-neutral-700">
          想了解的主題
          <select
            value={selectedTopic}
            onChange={(event) => setSelectedTopic(event.target.value)}
            className="mt-1 w-full rounded-2xl border border-neutral-200 px-3 py-2"
          >
            {topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-medium text-neutral-700">
          牌陣
          <select
            value={selectedSpread}
            onChange={(event) =>
              setSelectedSpread(event.target.value as (typeof spreads)[number]['value'])
            }
            className="mt-1 w-full rounded-2xl border border-neutral-200 px-3 py-2"
          >
            {spreads.map((spread) => (
              <option key={spread.value} value={spread.value}>
                {spread.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm text-neutral-600">
          <input
            type="checkbox"
            checked={allowReverse}
            onChange={(event) => setAllowReverse(event.target.checked)}
            className="h-4 w-4 rounded border-neutral-300 text-tarot focus:ring-tarot"
          />
          允許逆位
        </label>

        <div className="lg:col-span-3">
          <button
            type="submit"
            className="mt-2 w-full rounded-2xl bg-gradient-to-r from-tarot to-primary-500 px-4 py-3 text-sm font-semibold text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
            disabled={loading}
          >
            {loading ? '抽牌中...' : '抽牌'}
          </button>
        </div>
      </form>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-neutral-200 bg-white/80 p-6 text-sm text-neutral-500">
            目前沒有牌面，請先抽牌或載入歷史紀錄。
          </p>
        ) : (
          cards.map((card, index) => (
            <article
              key={`${card.name}-${index}`}
              className={clsx(
                'rounded-3xl border border-neutral-100 bg-white/90 p-5 shadow transition hover:-translate-y-1',
                {
                  'shadow-indigo-100': card.position === '正位',
                  'shadow-rose-100': card.position === '逆位',
                },
              )}
            >
              <p className="text-xs font-semibold text-neutral-400">
                第 {index + 1} 張 · {summary} · {card.slotMeaning}
              </p>
              <div className="mt-1 flex items-center justify-between">
                <h4 className="text-lg font-semibold text-tarot">{card.name}</h4>
                <span
                  className={clsx('rounded-full px-2 py-1 text-xs font-semibold', {
                    'bg-indigo-100 text-indigo-600': card.position === '正位',
                    'bg-rose-100 text-rose-600': card.position === '逆位',
                  })}
                >
                  {card.position}
                </span>
              </div>
              <p className="mt-2 text-sm text-neutral-700">{card.focus}</p>
              <p className="mt-2 text-xs text-neutral-500">行動建議：{card.action}</p>
              <p className="mt-1 text-xs text-neutral-500">反思問題：{card.reflection}</p>
            </article>
          ))
        )}
      </div>
      {cards.length > 0 && (
        <div className="rounded-3xl border border-neutral-100 bg-white/90 p-4 text-sm text-neutral-600">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-tarot">分享這組牌陣</span>
            <button
              onClick={handleShare}
              className="rounded-2xl border border-tarot/30 px-3 py-1 text-xs font-semibold text-tarot"
            >
              分享連結
            </button>
            {shareStatus && <span className="text-xs text-neutral-500">{shareStatus}</span>}
          </div>
        </div>
      )}
    </section>
  )
}
