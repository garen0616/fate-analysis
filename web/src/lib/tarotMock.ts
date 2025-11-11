export type TarotCard = {
  id: string
  name: string
  suit: 'major' | 'wands' | 'cups' | 'swords' | 'pentacles'
  keyword: string
  advice: string
}

export type TarotCardResult = {
  name: string
  position: '正位' | '逆位'
  focus: string
  advice: string
}

const deck: TarotCard[] = [
  {
    id: 'sun',
    name: '太陽',
    suit: 'major',
    keyword: '成功、公開、樂觀',
    advice: '勇於發光並與朋友分享成果，適合推進重要告白或上台提案。',
  },
  {
    id: 'moon',
    name: '月亮',
    suit: 'major',
    keyword: '直覺、潛意識、迷霧',
    advice: '暫緩重大決策，記錄夢境與感受，等待資訊更清楚再前進。',
  },
  {
    id: 'chariot',
    name: '戰車',
    suit: 'major',
    keyword: '行動、勝利、掌控',
    advice: '保持專注並明確行程表，過程中別忘照顧身體與休息節奏。',
  },
  {
    id: 'temperance',
    name: '節制',
    suit: 'major',
    keyword: '平衡、療癒、整合',
    advice: '刻意安排身心平衡的儀式，如瑜珈、寫日記或泡腳。',
  },
  {
    id: 'lovers',
    name: '戀人',
    suit: 'major',
    keyword: '選擇、親密、信任',
    advice: '誠實面對彼此需求，讓對話回到「我如何感受」而非責備。',
  },
  {
    id: 'hermit',
    name: '隱者',
    suit: 'major',
    keyword: '沉澱、研究、內在老師',
    advice: '給自己留白時間，閱讀或自學能帶來新的答案。',
  },
  {
    id: 'strength',
    name: '力量',
    suit: 'major',
    keyword: '柔性堅定、勇氣',
    advice: '用溫柔的方式說出界線，勇敢為自己站出來。',
  },
  {
    id: 'wheel',
    name: '命運之輪',
    suit: 'major',
    keyword: '轉折、機會',
    advice: '留意突如其來的邀約，善用貴人資源並保持彈性。',
  },
]

const spreadsMap: Record<string, { label: string; count: number }> = {
  '3': { label: '三張日常卡', count: 3 },
  '6': { label: '六芒星', count: 6 },
  cross: { label: '十字占卜', count: 4 },
}

const rand = (seed: number) => {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export type TarotDrawOptions = {
  topic: string
  spread: keyof typeof spreadsMap
  allowReverse: boolean
  seed?: number
}

export const drawTarotMock = async ({
  topic,
  spread,
  allowReverse,
  seed = Date.now(),
}: TarotDrawOptions): Promise<{ cards: TarotCardResult[]; summary: string }> => {
  const { count, label } = spreadsMap[spread]
  const workingDeck = [...deck]
  const cards: TarotCardResult[] = []

  for (let i = 0; i < count; i += 1) {
    const randomIndex = Math.floor(rand(seed + i) * workingDeck.length) % workingDeck.length
    const [card] = workingDeck.splice(randomIndex, 1)
    const shouldReverse = allowReverse && i % 2 === 1
    cards.push({
      name: card.name,
      focus: card.keyword,
      advice: card.advice,
      position: shouldReverse ? '逆位' : '正位',
    })
  }

  await new Promise((resolve) => setTimeout(resolve, 350))

  const summary = `${label} · 關於 ${topic} 的洞察`
  return { cards, summary }
}
