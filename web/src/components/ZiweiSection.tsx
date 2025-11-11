import { useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
import type { FiveElementState, ZiweiInput, ZiweiTopicResult } from '../lib/ziweiMock'
import { mockZiweiReport } from '../lib/ziweiMock'
import {
  createId,
  loadZiweiProfiles,
  saveZiweiProfiles,
  type ZiweiProfile,
} from '../lib/storage'
import { ScoreBar } from './ScoreBar'
import { decodeSharePayload, encodeSharePayload } from '../lib/share'
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from 'recharts'

const defaultInput: ZiweiInput = {
  name: '朋友 A',
  gender: 'female',
  calendar: 'solar',
  date: '1992-08-12',
  time: '20:30',
  city: '臺北',
  trueSolar: true,
}

const defaultResults: ZiweiTopicResult[] = [
  {
    topic: '事業 / 財運',
    score: 75,
    insight: '範例資料：官祿宮得祿馬，適合推進合作並設定收益節點。',
    action: '在下個月初前完成決策會議，並備妥兩種資源配置方案。',
    timeline: [
      { label: '下個月', tip: '適合推進新合作' },
      { label: '三個月內', tip: '維持節奏並定期檢視 KPI' },
      { label: '半年後', tip: '可評估轉職或合作擴張' },
    ],
    palace: {
      name: '官祿宮',
      mainStar: '武曲',
      element: '金',
      comment: '官祿宮受武曲影響，金氣偏旺，重視效率與行動。',
    },
    stars: [
      { type: '吉', name: '武曲', tip: '武曲帶來執行力，利於爭取資源。' },
      { type: '凶', name: '地劫', tip: '地劫提醒留意決策過快的風險。' },
    ],
    annualTrends: [
      { yearLabel: '今年', highlight: '能見度增加、適合把握主動。', focus: '設定 KPI 與公關節奏。' },
      { yearLabel: '明年', highlight: '收割成果並回顧流程。', focus: '調整人力配置與現金流。' },
    ],
    useGod: '木',
    avoidGod: '土',
  },
]

const defaultFiveElements: FiveElementState[] = [
  { element: '木', value: 70, advice: '多親近自然或補綠色蔬菜。', color: '#3b873e' },
  { element: '火', value: 68, advice: '安排運動或陽光浴補足火氣。', color: '#d25b4d' },
  { element: '土', value: 65, advice: '保持規律作息與伸展，帶來穩定。', color: '#c28f52' },
  { element: '金', value: 60, advice: '練習呼吸冥想、整理環境補金氣。', color: '#c4b19b' },
  { element: '水', value: 72, advice: '多補水並透過音樂寫作讓情緒流動。', color: '#4a6fb3' },
]

export function ZiweiSection() {
  const [formState, setFormState] = useState<ZiweiInput>(defaultInput)
  const [results, setResults] = useState<ZiweiTopicResult[]>(defaultResults)
  const [summary, setSummary] = useState('尚未排盤，請輸入資料。')
  const [fiveElements, setFiveElements] = useState<FiveElementState[]>(defaultFiveElements)
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [profiles, setProfiles] = useState<ZiweiProfile[]>([])
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null)
  const [compareProfileId, setCompareProfileId] = useState<string | null>(null)
  const [selectedYearIndex, setSelectedYearIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [shareStatus, setShareStatus] = useState<string | null>(null)
  const yearOptions = results[0]?.annualTrends ?? defaultResults[0].annualTrends

  useEffect(() => {
    if (!yearOptions || yearOptions.length === 0) return
    if (selectedYearIndex >= yearOptions.length) {
      setSelectedYearIndex(0)
    }
  }, [yearOptions, selectedYearIndex])

  const comparisonRows = useMemo(() => {
    if (!compareProfileId) return []
    const profile = profiles.find((item) => item.id === compareProfileId)
    if (!profile) return []
    return results
      .map((item) => {
        const target = profile.results.find((r) => r.topic === item.topic)
        if (!target) return null
        return {
          topic: item.topic,
          mine: item.score,
          friend: target.score,
          diff: item.score - target.score,
        }
      })
      .filter(Boolean) as Array<{ topic: string; mine: number; friend: number; diff: number }>
  }, [compareProfileId, profiles, results])

  useEffect(() => {
    const stored = loadZiweiProfiles()
    if (stored.length > 0) {
      setProfiles(stored)
      setSelectedProfileId(stored[0].id)
      setFormState(stored[0].input)
      setResults(stored[0].results)
      setSummary(stored[0].summary)
      setFiveElements(stored[0].fiveElements ?? defaultFiveElements)
      setNotes(stored[0].notes ?? {})
      setSelectedYearIndex(0)
    }

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const token = params.get('ziwei')
      if (token) {
        const payload = decodeSharePayload<{
          input: ZiweiInput
          summary: string
          results: ZiweiTopicResult[]
          fiveElements?: FiveElementState[]
        }>(token)
        if (payload) {
          setFormState(payload.input)
          setResults(payload.results)
          setSummary(payload.summary)
          setFiveElements(payload.fiveElements ?? defaultFiveElements)
          setNotes({})
          setSelectedYearIndex(0)
          const profile: ZiweiProfile = {
            id: createId(),
            name: payload.input.name || '朋友分享',
            input: payload.input,
            results: payload.results,
            summary: payload.summary,
            fiveElements: payload.fiveElements ?? defaultFiveElements,
            notes: {},
            updatedAt: Date.now(),
          }
          setSelectedProfileId(profile.id)
          persistProfile(profile)
        }
        window.history.replaceState({}, '', window.location.pathname)
      }
    }
  }, [])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = event.target
    const { name, value, type } = target
    const nextValue = type === 'checkbox' ? (target as HTMLInputElement).checked : value
    setFormState((prev) => ({
      ...prev,
      [name]: nextValue,
    }))
  }

  const persistProfile = (profile: ZiweiProfile) => {
    const nextProfiles = [profile, ...profiles.filter((item) => item.id !== profile.id)]
    setProfiles(nextProfiles)
    saveZiweiProfiles(nextProfiles)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    try {
      const report = await mockZiweiReport(formState)
      setResults(report.results)
      setSummary(report.summary)
      setFiveElements(report.fiveElements)
      const profile: ZiweiProfile = {
        id: selectedProfileId ?? createId(),
        name: formState.name || '未命名',
        input: formState,
        results: report.results,
        summary: report.summary,
        fiveElements: report.fiveElements,
        notes,
        updatedAt: Date.now(),
      }
      setSelectedProfileId(profile.id)
      persistProfile(profile)
    } finally {
      setLoading(false)
    }
  }

  const handleShare = async () => {
    if (typeof window === 'undefined') return
    const token = encodeSharePayload({ input: formState, summary, results, fiveElements })
    const url = new URL(window.location.href)
    url.searchParams.set('ziwei', token)
    const shareText = url.toString()
    try {
      if (navigator.share) {
        await navigator.share({
          title: '紫微排盤分享',
          text: '朋友分享的紫微排盤結果',
          url: shareText,
        })
        setShareStatus('已透過裝置分享')
      } else {
        await navigator.clipboard.writeText(shareText)
        setShareStatus('已複製分享連結')
      }
      setTimeout(() => setShareStatus(null), 2500)
    } catch {
      setShareStatus('瀏覽器不支援自動複製')
    }
  }

  const handleProfileSwitch = (profileId: string) => {
    if (!profileId) return
    const profile = profiles.find((item) => item.id === profileId)
    if (!profile) return
    setSelectedProfileId(profileId)
    setFormState(profile.input)
    setResults(profile.results)
    setSummary(profile.summary)
    setFiveElements(profile.fiveElements ?? defaultFiveElements)
    setNotes(profile.notes ?? {})
  }

  const handleNewProfile = () => {
    setSelectedProfileId(null)
    setFormState(defaultInput)
    setResults(defaultResults)
    setSummary('尚未排盤，請輸入資料。')
    setFiveElements(defaultFiveElements)
    setNotes({})
    setCompareProfileId(null)
    setSelectedYearIndex(0)
  }

  const handleDeleteProfile = (profileId: string) => {
    const filtered = profiles.filter((item) => item.id !== profileId)
    setProfiles(filtered)
    saveZiweiProfiles(filtered)
    if (profileId === selectedProfileId) {
      handleNewProfile()
    }
  }

  const handleRenameProfile = (profileId: string) => {
    const profile = profiles.find((item) => item.id === profileId)
    if (!profile) return
    const newName = prompt('輸入新的暱稱', profile.name)
    if (!newName) return
    const updatedProfile = { ...profile, name: newName }
    persistProfile(updatedProfile)
    if (profileId === selectedProfileId) {
      setFormState(updatedProfile.input)
      setResults(updatedProfile.results)
      setSummary(updatedProfile.summary)
    }
  }

  const handleNoteChange = (topic: string, value: string) => {
    setNotes((prev) => ({ ...prev, [topic]: value }))
    if (selectedProfileId) {
      const updatedProfiles = profiles.map((profile) =>
        profile.id === selectedProfileId
          ? { ...profile, notes: { ...(profile.notes ?? {}), [topic]: value } }
          : profile,
      )
      setProfiles(updatedProfiles)
      saveZiweiProfiles(updatedProfiles)
    }
  }

  return (
    <section id="ziwei" className="space-y-6 rounded-4xl border border-neutral-100 bg-white/90 p-8 shadow-2xl">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-ziwei">ZĬ WĒI SETUP</p>
        <h2 className="text-3xl font-semibold">紫微排盤 · 快速輸入</h2>
        <p className="text-sm text-neutral-600">
          資料僅存於瀏覽器。輸入出生資訊後立即得到五大主題指數與摘要，下一步可展開詳細宮位。
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-white/70 bg-white/70 px-4 py-3 text-sm text-neutral-700">
        <span className="font-semibold text-ziwei">快速切換</span>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedProfileId ?? ''}
            onChange={(event) => handleProfileSwitch(event.target.value)}
            className="rounded-2xl border border-neutral-200 px-3 py-2 text-sm"
          >
            {profiles.length === 0 && <option value="">尚無紀錄</option>}
            {profiles.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.name} · {new Date(profile.updatedAt).toLocaleDateString()}
              </option>
            ))}
          </select>
          {selectedProfileId && (
            <>
              <button
                type="button"
                onClick={() => handleRenameProfile(selectedProfileId)}
                className="rounded-2xl border border-ziwei/40 px-3 py-1 text-xs text-ziwei"
              >
                重新命名
              </button>
              <button
                type="button"
                onClick={() => handleDeleteProfile(selectedProfileId)}
                className="rounded-2xl border border-rose-200 px-3 py-1 text-xs text-rose-500"
              >
                刪除
              </button>
            </>
          )}
        </div>
        <button
          onClick={handleNewProfile}
          className="rounded-2xl border border-ziwei/40 px-3 py-1 text-sm text-ziwei"
        >
          新增/重設
        </button>
      </div>

      {profiles.length > 1 && (
        <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-white/70 bg-white/70 px-4 py-3 text-sm text-neutral-700">
          <span className="font-semibold text-ziwei">對照朋友</span>
          <select
            value={compareProfileId ?? ''}
            onChange={(event) => setCompareProfileId(event.target.value || null)}
            className="rounded-2xl border border-neutral-200 px-3 py-2 text-sm"
          >
            <option value="">不對照</option>
            {profiles
              .filter((profile) => profile.id !== selectedProfileId)
              .map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.name} · {new Date(profile.updatedAt).toLocaleDateString()}
                </option>
              ))}
          </select>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-neutral-700">
              暱稱
              <input
                type="text"
                name="name"
                value={formState.name}
                onChange={handleChange}
                className="mt-1 w-full rounded-2xl border border-neutral-200 px-3 py-2"
              />
            </label>
            <label className="text-sm font-medium text-neutral-700">
              性別
              <select
                name="gender"
                value={formState.gender}
                onChange={handleChange}
                className="mt-1 w-full rounded-2xl border border-neutral-200 px-3 py-2"
              >
                <option value="female">女性</option>
                <option value="male">男性</option>
                <option value="other">其他 / 不透露</option>
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-neutral-700">
              出生日期
              <input
                type="date"
                name="date"
                value={formState.date}
                onChange={handleChange}
                className="mt-1 w-full rounded-2xl border border-neutral-200 px-3 py-2"
              />
            </label>
            <label className="text-sm font-medium text-neutral-700">
              時間
              <input
                type="time"
                name="time"
                value={formState.time}
                onChange={handleChange}
                className="mt-1 w-full rounded-2xl border border-neutral-200 px-3 py-2"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-neutral-700">
              曆法
              <select
                name="calendar"
                value={formState.calendar}
                onChange={handleChange}
                className="mt-1 w-full rounded-2xl border border-neutral-200 px-3 py-2"
              >
                <option value="solar">國曆</option>
                <option value="lunar">農曆</option>
              </select>
            </label>
            <label className="text-sm font-medium text-neutral-700">
              出生地
              <input
                type="text"
                name="city"
                value={formState.city}
                onChange={handleChange}
                className="mt-1 w-full rounded-2xl border border-neutral-200 px-3 py-2"
                placeholder="城市 / 地區"
              />
            </label>
          </div>

          <label className="flex items-center gap-2 text-sm text-neutral-600">
            <input
              type="checkbox"
              name="trueSolar"
              checked={formState.trueSolar}
              onChange={handleChange}
              className="h-4 w-4 rounded border-neutral-300 text-ziwei focus:ring-ziwei"
            />
            自動換算真太陽時
          </label>

          <button
            type="submit"
            className="w-full rounded-2xl bg-gradient-to-r from-ziwei to-tarot px-4 py-3 text-sm font-semibold text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
            disabled={loading}
          >
            {loading ? '排盤中...' : '立即排盤'}
          </button>
        </form>

        <div className="space-y-4 rounded-3xl border border-neutral-100 bg-gradient-to-br from-white to-purple-50 p-6">
          <div>
            <p className="text-sm font-semibold text-ziwei">主題摘要</p>
            <p className="text-sm text-neutral-600">{summary}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-neutral-500">
              <button
                onClick={handleShare}
                className="rounded-2xl border border-ziwei/30 px-3 py-1 text-xs font-semibold text-ziwei"
              >
                分享連結
              </button>
              {shareStatus && <span>{shareStatus}</span>}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {yearOptions.map((trend, index) => (
                <button
                  key={trend.yearLabel}
                  onClick={() => setSelectedYearIndex(index)}
                  className={clsx(
                    'rounded-2xl px-4 py-1 text-xs font-semibold',
                    index === selectedYearIndex
                      ? 'bg-ziwei text-white'
                      : 'bg-white/70 text-ziwei border border-ziwei/20',
                  )}
                >
                  {trend.yearLabel}
                </button>
              ))}
            </div>
            {comparisonRows.length > 0 && (
              <div className="mt-4 rounded-2xl border border-white/70 bg-white/90 p-3 text-xs text-neutral-600">
                <p className="mb-2 font-semibold text-ziwei">與朋友指數比較</p>
                <div className="space-y-1">
                  {comparisonRows.map((row) => (
                    <div key={row.topic} className="flex items-center justify-between">
                      <span>{row.topic}</span>
                      <span>
                        我 {row.mine} / 朋友 {row.friend}
                        <span
                          className={clsx('ml-2 font-semibold', {
                            'text-emerald-600': row.diff >= 0,
                            'text-rose-600': row.diff < 0,
                          })}
                        >
                          {row.diff >= 0 ? '+' : ''}
                          {row.diff}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="h-64 rounded-2xl border border-white/70 bg-white/80 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={results} outerRadius="80%">
                <PolarGrid />
                <PolarAngleAxis dataKey="topic" />
                <Radar
                  name="指數"
                  dataKey="score"
                  stroke="#cc6b5a"
                  fill="#cc6b5a"
                  fillOpacity={0.35}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <p className="text-sm font-semibold text-ziwei">五行平衡</p>
            <div className="mt-3 space-y-3 text-sm">
              {fiveElements.map((item) => (
                <div key={item.element} className="rounded-2xl border border-white/70 bg-white/90 p-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-neutral-600">
                    <span>{item.element}</span>
                    <span>{item.value}</span>
                  </div>
                  <div className="mt-2">
                    <ScoreBar value={item.value} color={item.color} />
                  </div>
                  <p className="mt-2 text-xs text-neutral-500">{item.advice}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {results.map((item) => {
              const trend = item.annualTrends[selectedYearIndex] ?? item.annualTrends[0]
              return (
                <article key={item.topic} className="rounded-2xl border border-white/70 bg-white/90 p-4 shadow">
                  <div className="mb-2 rounded-2xl bg-ziwei/5 px-3 py-2 text-xs text-neutral-600">
                    <p className="font-semibold text-ziwei">{trend.yearLabel}</p>
                    <p>{trend.highlight}</p>
                    <p className="text-[11px] text-neutral-500">重點：{trend.focus}</p>
                  </div>
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-semibold text-ziwei">{item.topic}</h4>
                  <span className="text-sm font-semibold text-ziwei">{item.score} / 100</span>
                </div>
                <div className="my-2">
                  <ScoreBar value={item.score} color="#cc6b5a" />
                </div>
                <div className="rounded-2xl bg-ziwei/5 px-3 py-2 text-xs text-neutral-600">
                  <p>
                    <strong>{item.palace.name}</strong> · 主星 {item.palace.mainStar} · {item.palace.comment}
                  </p>
                  <p className="mt-1 text-[11px] text-neutral-500">
                    用神 {item.useGod} ｜ 忌神 {item.avoidGod}
                  </p>
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  {item.stars.map((star) => (
                    <span
                      key={star.name}
                      className={clsx('rounded-full px-3 py-1 font-semibold', {
                        'bg-emerald-100 text-emerald-600': star.type === '吉',
                        'bg-rose-100 text-rose-600': star.type === '凶',
                      })}
                    >
                      {star.name}
                      <span className="ml-1 text-[10px] font-normal">{star.tip}</span>
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-sm text-neutral-700">{item.insight}</p>
                <p className="mt-1 text-xs text-neutral-500">建議：{item.action}</p>
                <div className="mt-3 border-t border-neutral-100 pt-3">
                  <p className="text-xs font-semibold text-neutral-500">時間軸</p>
                  <div className="mt-2 space-y-2 text-xs text-neutral-600">
                    {item.timeline.map((node) => (
                      <div key={`${item.topic}-${node.label}`} className="rounded-xl bg-neutral-50 px-3 py-2">
                        <strong className="text-neutral-700">{node.label}</strong>
                        <p>{node.tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <label className="mt-3 block text-xs font-semibold text-neutral-500">
                  備忘 / 提醒
                  <textarea
                    className="mt-1 w-full rounded-2xl border border-neutral-200 px-3 py-2 text-sm"
                    placeholder="寫下想提醒自己的行動..."
                    value={notes[item.topic] ?? ''}
                    onChange={(event) => handleNoteChange(item.topic, event.target.value)}
                  />
                </label>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
