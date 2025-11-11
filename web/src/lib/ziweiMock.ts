export type ZiweiInput = {
  name: string
  gender: string
  calendar: 'solar' | 'lunar'
  date: string
  time: string
  city: string
  trueSolar: boolean
}

export type ZiweiTopicResult = {
  topic: string
  score: number
  insight: string
  action: string
}

export type ZiweiReport = {
  results: ZiweiTopicResult[]
  summary: string
}

const topicTemplates = [
  {
    topic: '事業 / 財運',
    actionTemplate: '在接下來的兩週設定一次回顧，並優先完成最能帶來資源的合作。',
    insightTemplate: (input: ZiweiInput, score: number) =>
      `${input.city} 的地氣提升了職涯運勢，整體指數為 ${score}，適合推進新提案與財務節奏。`,
  },
  {
    topic: '婚姻 / 伴侶',
    actionTemplate: '安排沒有腳本的相處時光，隔三天再談正事，讓情緒沉澱。',
    insightTemplate: (_input: ZiweiInput, score: number) =>
      `目前溝通敏感度提高，指數 ${score}，建議以傾聽取代辯論，並運用共同回憶降溫。`,
  },
  {
    topic: '愛情 / 新關係',
    actionTemplate: '把注意力放在日常細節，如訊息回覆節奏或共同活動。',
    insightTemplate: (input: ZiweiInput, score: number) =>
      `${input.name || '你'} 的桃花宮受到流年活化，指數 ${score}，若有新對象可慢慢升溫。`,
  },
  {
    topic: '家庭（父母＋子女）',
    actionTemplate: '主動安排電話或共餐，記錄長輩健康狀態並與家人分享。',
    insightTemplate: (_input: ZiweiInput, score: number) =>
      `家庭互動指數 ${score}，提醒關心父母身心，同時給下一代更多陪伴。`,
  },
  {
    topic: '健康 / 身心',
    actionTemplate: '調整睡眠與飲食節奏，必要時安排檢查或靜心課程。',
    insightTemplate: (_input: ZiweiInput, score: number) =>
      `疾厄宮顯示指數 ${score}，若長期熬夜或久坐，務必為自己安排補給與運動。`,
  },
]

const clamp = (value: number, min = 35, max = 95) => Math.max(min, Math.min(max, value))

const hashString = (text: string) => {
  let hash = 0
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

export const mockZiweiReport = async (input: ZiweiInput): Promise<ZiweiReport> => {
  const seed = hashString(`${input.name}-${input.date}-${input.time}-${input.city}`)
  const results = topicTemplates.map((tpl, index) => {
    const variation = (seed >> (index + 2)) % 18
    const polarity = index % 2 === 0 ? 1 : -1
    const score = clamp(70 + polarity * variation)
    return {
      topic: tpl.topic,
      score,
      insight: tpl.insightTemplate(input, score),
      action: tpl.actionTemplate,
    }
  })

  const average = Math.round(results.reduce((acc, cur) => acc + cur.score, 0) / results.length)
  const summary = `平均 ${average} 分 · ${input.trueSolar ? '已校正真太陽時' : '未校正真太陽時'}，適合以 ${input.city} 的生活節奏為主要參考。`

  await new Promise((resolve) => setTimeout(resolve, 400))

  return { results, summary }
}
