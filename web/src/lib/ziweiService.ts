import type { FiveElementState, ZiweiInput, ZiweiReport, ZiweiTopicResult } from './ziweiMock'
import { mockZiweiReport } from './ziweiMock'

type ApiStar = {
  name?: string
  brightness?: string
  mutagen?: string
}

type ApiPalace = {
  name?: string
  earthlyBranch?: string
  heavenlyStem?: string
  majorStars?: ApiStar[]
  minorStars?: ApiStar[]
}

type ZiweiApiPayload = {
  success?: boolean
  result?: {
    basic_info?: {
      birth_date?: string
      birth_time?: string
      solar_date?: string
      lunar_date?: string
      time_chen?: string
      time_range?: string
      five_elements_class?: string
      zodiac?: string
      sign?: string
      soul?: string
      body?: string
    }
    palaces?: ApiPalace[]
    summary?: {
      description?: string
      time_info?: string
      soul_palace?: string
      body_palace?: string
    }
  }
  message?: string
  error?: string
}

type ZiweiApiResult = NonNullable<ZiweiApiPayload['result']>

const PALACE_ALIASES: Record<string, string[]> = {
  '事業 / 財運': ['官祿宮', '官禄宫', '事业宫'],
  '婚姻 / 伴侶': ['夫妻宮', '夫妻宫'],
  '愛情 / 新關係': ['遷移宮', '迁移宫', '福德宮', '福德宫'],
  '家庭（父母＋子女）': ['父母宮', '父母宫', '田宅宮', '田宅宫'],
  '健康 / 身心': ['疾厄宮', '疾厄宫', '命宮', '命宫'],
}

const charReplacement: Record<string, string> = {
  宫: '宮',
  禄: '祿',
  禬: '祿',
  迁: '遷',
  阳: '陽',
  阴: '陰',
  业: '業',
}

const normalizeName = (name?: string) =>
  (name ?? '')
    .trim()
    .replace(/[宫禄迁阳阴业]/g, (char) => charReplacement[char] ?? char)

const isMaleficStar = (name?: string) => {
  if (!name) return false
  return /忌|煞|劫|空|耗|刑|陷|破|衰|喪|丧/.test(name)
}

const formatStarTip = (star: ApiStar) => {
  if (!star.name) return '暫無描述'
  if (star.mutagen) return `${star.name} · ${star.mutagen}`
  return isMaleficStar(star.name) ? `${star.name} 需留意波動` : `${star.name} 可善用優勢`
}

const enhancePalace = (result: ZiweiTopicResult, palace?: ApiPalace): ZiweiTopicResult => {
  if (!palace) return result
  const majorStars = palace.majorStars ?? []
  const minorStars = palace.minorStars ?? []
  const mergedStars = [...majorStars, ...minorStars]

  return {
    ...result,
    palace: {
      name: palace.name ?? result.palace.name,
      mainStar: majorStars[0]?.name ?? result.palace.mainStar,
      element: result.palace.element,
      comment: [
        palace.heavenlyStem ? `天干 ${palace.heavenlyStem}` : null,
        palace.earthlyBranch ? `地支 ${palace.earthlyBranch}` : null,
        majorStars.length > 0 ? `主星 ${majorStars.map((star) => star.name).join('、')}` : null,
      ]
        .filter(Boolean)
        .join(' · ') || result.palace.comment,
    },
    stars:
      mergedStars.length > 0
        ? mergedStars.slice(0, 6).map((star) => ({
            type: isMaleficStar(star.name) ? '凶' : '吉',
            name: star.name ?? '未知星曜',
            tip: formatStarTip(star),
          }))
        : result.stars,
  }
}

const enhanceFiveElements = (
  states: FiveElementState[],
  fiveElementClass?: string,
): FiveElementState[] => {
  if (!fiveElementClass) return states
  const targetElement = (['木', '火', '土', '金', '水'] as const).find((element) =>
    fiveElementClass.includes(element),
  )
  if (!targetElement) return states
  return states.map((state) =>
    state.element === targetElement
      ? {
          ...state,
          advice: `${state.advice}（命盤屬 ${fiveElementClass}）`,
          value: Math.min(99, state.value + 6),
        }
      : state,
  )
}

const formatSummary = (
  template: ZiweiReport,
  basicInfo?: ZiweiApiResult['basic_info'],
  summary?: ZiweiApiResult['summary'],
) => {
  const parts: string[] = []
  if (summary?.description) parts.push(summary.description)
  if (summary?.time_info) parts.push(summary.time_info)
  if (basicInfo?.sign) parts.push(`命宮：${basicInfo.sign}`)
  if (basicInfo?.five_elements_class) parts.push(basicInfo.five_elements_class)
  if (summary?.soul_palace && summary?.body_palace) {
    parts.push(`命身：${summary.soul_palace} / ${summary.body_palace}`)
  }
  return parts.length > 0 ? parts.join(' · ') : template.summary
}

const resolvePalaceForTopic = (topic: string, palaces: ApiPalace[]) => {
  const aliases = PALACE_ALIASES[topic]
  if (!aliases) return undefined
  const normalizedAliases = aliases.map((alias) => normalizeName(alias))
  return palaces.find((palace) => normalizedAliases.includes(normalizeName(palace.name)))
}

const mergeApiIntoReport = (
  template: ZiweiReport,
  apiResult?: ZiweiApiPayload['result'],
): ZiweiReport => {
  if (!apiResult) return template
  const result = apiResult
  const palaces = result.palaces ?? []

  const enhancedResults = template.results.map((item) =>
    enhancePalace(item, resolvePalaceForTopic(item.topic, palaces)),
  )

  return {
    results: enhancedResults,
    summary: formatSummary(template, result.basic_info, result.summary),
    fiveElements: enhanceFiveElements(template.fiveElements, result.basic_info?.five_elements_class),
  }
}

const normalizeGender = (gender: string) => {
  if (gender === 'male' || gender === 'female') return gender
  if (gender === 'other') return 'female'
  return gender.toLowerCase().startsWith('m') ? 'male' : 'female'
}

const getApiBase = () => {
  const raw = import.meta.env.VITE_ZIWEI_API_BASE_URL?.trim()
  if (!raw) return null
  return raw.endsWith('/') ? raw.slice(0, -1) : raw
}

export type ZiweiReportResponse = {
  report: ZiweiReport
  source: 'api' | 'mock'
  error?: string
}

export const fetchZiweiReport = async (input: ZiweiInput): Promise<ZiweiReportResponse> => {
  const fallbackPromise = mockZiweiReport(input)
  const baseUrl = getApiBase()

  if (!baseUrl) {
    return {
      report: await fallbackPromise,
      source: 'mock',
      error: '尚未設定 VITE_ZIWEI_API_BASE_URL，使用範例數據',
    }
  }

  try {
    const response = await fetch(`${baseUrl}/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        birth_datetime: `${input.date} ${input.time}`,
        gender: normalizeGender(input.gender),
      }),
    })

    if (!response.ok) {
      throw new Error(`API 回應 ${response.status}`)
    }

    const payload = (await response.json()) as ZiweiApiPayload
    if (!payload.success || !payload.result) {
      throw new Error(payload.error || payload.message || 'API 回傳資料異常')
    }

    const template = await fallbackPromise
    return {
      report: mergeApiIntoReport(template, payload.result),
      source: 'api',
    }
  } catch (error) {
    const fallback = await fallbackPromise
    return {
      report: fallback,
      source: 'mock',
      error: error instanceof Error ? error.message : '無法連線到 Ziwei API',
    }
  }
}
