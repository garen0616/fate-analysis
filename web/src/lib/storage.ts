import type { FiveElementState, ZiweiInput, ZiweiTopicResult } from './ziweiMock'
import type { TarotCardResult } from './tarotMock'

const ZIWEI_KEY = 'ziweiProfiles'
const TAROT_KEY = 'tarotRecords'

const isBrowser = () => typeof window !== 'undefined'

const safeParse = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

export type ZiweiProfile = {
  id: string
  name: string
  input: ZiweiInput
  results: ZiweiTopicResult[]
  summary: string
  fiveElements: FiveElementState[]
  notes?: Record<string, string>
  updatedAt: number
}

export type TarotRecord = {
  id: string
  topic: string
  spread: string
  allowReverse: boolean
  cards: TarotCardResult[]
  summary: string
  createdAt: number
}

const limitedSave = <T>(key: string, data: T[], limit = 5) => {
  if (!isBrowser()) return
  const trimmed = data.slice(0, limit)
  window.localStorage.setItem(key, JSON.stringify(trimmed))
}

export const loadZiweiProfiles = (): ZiweiProfile[] => {
  if (!isBrowser()) return []
  return safeParse<ZiweiProfile[]>(window.localStorage.getItem(ZIWEI_KEY), [])
}

export const saveZiweiProfiles = (profiles: ZiweiProfile[]) => {
  limitedSave(ZIWEI_KEY, profiles, 6)
}

export const loadTarotRecords = (): TarotRecord[] => {
  if (!isBrowser()) return []
  const raw = safeParse<TarotRecord[]>(window.localStorage.getItem(TAROT_KEY), [])
  return raw
    .map((record) => ({
      ...record,
      cards: (record.cards ?? []).filter(
        (card) => card && typeof card.name === 'string' && typeof card.focus === 'string',
      ),
    }))
    .filter((record) => record.cards.length > 0)
}

export const saveTarotRecords = (records: TarotRecord[]) => {
  limitedSave(TAROT_KEY, records, 8)
}

export const createId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}
