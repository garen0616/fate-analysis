export type ZiweiInput = {
  name: string
  gender: string
  calendar: 'solar' | 'lunar'
  date: string
  time: string
  city: string
  trueSolar: boolean
}

export type ZiweiTimelineEntry = {
  label: string
  tip: string
}

export type ZiweiPalaceDetail = {
  name: string
  mainStar: string
  element: string
  comment: string
}

export type ZiweiStarInfluence = {
  type: '吉' | '凶'
  name: string
  tip: string
}

export type ZiweiQuarterTrend = {
  quarter: string
  theme: string
  focus: string
  energy: number
}

export type ZiweiCycleInfo = {
  major: string
  minor: string
}

export type ZiweiRelationHints = {
  ally: string
  opposite: string
  triad: string
}

export type ZiweiStarAlert = {
  type: '四化' | '吉' | '凶'
  label: string
  detail: string
}

export type ZiweiTopicResult = {
  topic: string
  score: number
  insight: string
  action: string
  timeline: ZiweiTimelineEntry[]
  palace: ZiweiPalaceDetail
  stars: ZiweiStarInfluence[]
  quarterTrends: ZiweiQuarterTrend[]
  cycleInfo: ZiweiCycleInfo
  relationHints: ZiweiRelationHints
  starAlerts: ZiweiStarAlert[]
  annualTrends: Array<{
    yearLabel: string
    highlight: string
    focus: string
  }>
  useGod: string
  avoidGod: string
}

export type FiveElementState = {
  element: '木' | '火' | '土' | '金' | '水'
  value: number
  advice: string
  color: string
}

export type ZiweiReport = {
  results: ZiweiTopicResult[]
  summary: string
  fiveElements: FiveElementState[]
}

const topicTemplates = [
  {
    topic: '事業 / 財運',
    actionTemplate: '在接下來的兩週設定一次回顧，並優先完成最能帶來資源的合作。',
    insightTemplate: (input: ZiweiInput, score: number) =>
      `${input.city} 的地氣提升了職涯運勢，整體指數為 ${score}，適合推進新提案與財務節奏。`,
    palace: '官祿宮',
    element: '金',
    stars: ['武曲', '祿存'],
  },
  {
    topic: '婚姻 / 伴侶',
    actionTemplate: '安排沒有腳本的相處時光，隔三天再談正事，讓情緒沉澱。',
    insightTemplate: (_input: ZiweiInput, score: number) =>
      `目前溝通敏感度提高，指數 ${score}，建議以傾聽取代辯論，並運用共同回憶降溫。`,
    palace: '夫妻宮',
    element: '木',
    stars: ['天喜', '紅鸞'],
  },
  {
    topic: '愛情 / 新關係',
    actionTemplate: '把注意力放在日常細節，如訊息回覆節奏或共同活動。',
    insightTemplate: (input: ZiweiInput, score: number) =>
      `${input.name || '你'} 的桃花宮受到流年活化，指數 ${score}，若有新對象可慢慢升溫。`,
    palace: '遷移宮',
    element: '火',
    stars: ['貪狼', '右弼'],
  },
  {
    topic: '家庭（父母＋子女）',
    actionTemplate: '主動安排電話或共餐，記錄長輩健康狀態並與家人分享。',
    insightTemplate: (_input: ZiweiInput, score: number) =>
      `家庭互動指數 ${score}，提醒關心父母身心，同時給下一代更多陪伴。`,
    palace: '父母宮',
    element: '水',
    stars: ['天梁', '天鉞'],
  },
  {
    topic: '健康 / 身心',
    actionTemplate: '調整睡眠與飲食節奏，必要時安排檢查或靜心課程。',
    insightTemplate: (_input: ZiweiInput, score: number) =>
      `疾厄宮顯示指數 ${score}，若長期熬夜或久坐，務必為自己安排補給與運動。`,
    palace: '疾厄宮',
    element: '土',
    stars: ['天同', '地空'],
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

const elementAdvices: Record<FiveElementState['element'], { advice: string; color: string }> = {
  木: { advice: '多親近自然、補綠色蔬菜或芳療幫助放鬆。', color: '#3b873e' },
  火: { advice: '適合運動或陽光浴，紅色系穿著能增補能量。', color: '#d25b4d' },
  土: { advice: '保持規律作息與伸展，暖色系食物帶來穩定感。', color: '#c28f52' },
  金: { advice: '專注呼吸與冥想，整潔環境也能補強金氣。', color: '#c4b19b' },
  水: { advice: '多補水、接觸音樂或寫作幫助內在流動。', color: '#4a6fb3' },
}

export const mockZiweiReport = async (input: ZiweiInput): Promise<ZiweiReport> => {
  const seed = hashString(`${input.name}-${input.date}-${input.time}-${input.city}`)
  const currentYear = new Date().getFullYear()
  const results = topicTemplates.map((tpl, index) => {
    const variation = (seed >> (index + 2)) % 18
    const polarity = index % 2 === 0 ? 1 : -1
    const score = clamp(70 + polarity * variation)
    const quarterTrends = ['Q1', 'Q2', 'Q3', 'Q4'].map((label, quarterIndex) => {
      const base = score + (quarterIndex - 1) * 3 * polarity
      return {
        quarter: label,
        theme: polarity > 0 ? '推進' : '調整',
        focus: quarterIndex % 2 === 0 ? '維繫關係' : '自我優化',
        energy: clamp(base, 40, 95),
      }
    })

    const timeline: ZiweiTimelineEntry[] = [
      { label: '下個月', tip: polarity > 0 ? '適合推新計畫' : '先穩住節奏再前進' },
      { label: '三個月內', tip: score > 75 ? '持續增溫、主動出擊' : '留意情緒波動' },
      { label: '半年後', tip: polarity > 0 ? '有轉職/轉換的契機' : '建議累積籌碼再行動' },
    ]

    const starList: ZiweiStarInfluence[] = tpl.stars.map((starName, starIndex) => ({
      name: starName,
      type: starIndex === 0 ? '吉' : '凶',
      tip: starIndex === 0 ? `${starName} 幫助快速聚焦` : `${starName} 可能帶來雜訊，記得簡化流程`,
    }))

    const cycleInfo: ZiweiCycleInfo = {
      major: `${tpl.palace} 大限`,
      minor: starList[0]?.name ? `${starList[0].name} 小限` : '流年小限',
    }

    const relationHints: ZiweiRelationHints = {
      ally: `${tpl.palace} 與 ${tpl.topic.includes('家庭') ? '田宅宮' : '遷移宮'} 相助`,
      opposite: `${tpl.palace} 對宮需留意 ${tpl.topic.includes('事業') ? '田宅宮' : '官祿宮'}`,
      triad: `${tpl.palace} 三合 ${tpl.topic.includes('健康') ? '命宮/遷移宮' : '財帛/官祿宮'}`,
    }

    const starAlerts: ZiweiStarAlert[] = [
      {
        type: '四化',
        label: '化祿',
        detail: `${tpl.palace} 得祿，適合設定收益指標。`,
      },
      {
        type: '凶',
        label: '煞曜',
        detail: `留意 ${tpl.palace} 的外在干擾，簡化流程可降低波動。`,
      },
    ]

    return {
      topic: tpl.topic,
      score,
      insight: tpl.insightTemplate(input, score),
      action: tpl.actionTemplate,
      timeline,
      palace: {
        name: tpl.palace,
        mainStar: tpl.stars[0],
        element: tpl.element,
        comment: `${tpl.palace} 受 ${tpl.stars[0]} 影響，${tpl.element} 氣較為明顯。`,
      },
      stars: starList,
      quarterTrends,
      cycleInfo,
      relationHints,
      starAlerts,
      annualTrends: [
        {
          yearLabel: `${currentYear} 年`,
          highlight: polarity > 0 ? '能見度提升，適合把握主動' : '需要整理內部，避免倉促',
          focus: score > 75 ? '向外拓展、建立新合作' : '培養基本功、留意資源配置',
        },
        {
          yearLabel: `${currentYear + 1} 年`,
          highlight: polarity > 0 ? '進入收割期，做好指標管理' : '穩住根基，避免分心',
          focus: polarity > 0 ? '設定具體 KPI 與回顧節奏' : '專注重要關係與身心健康',
        },
      ],
      useGod: tpl.element === '木' || tpl.element === '水' ? '木' : '火',
      avoidGod: tpl.element === '土' ? '金' : '土',
    }
  })

  const elementSeed = seed % 5
  const fiveElements: FiveElementState[] = (['木', '火', '土', '金', '水'] as const).map(
    (element, idx) => {
      const base = 65 + ((seed >> (idx + 1)) % 25)
      const value = clamp(base + (idx === elementSeed ? 10 : -5))
      return {
        element,
        value,
        advice: elementAdvices[element].advice,
        color: elementAdvices[element].color,
      }
    },
  )

  const average = Math.round(results.reduce((acc, cur) => acc + cur.score, 0) / results.length)
  const summary = `平均 ${average} 分 · ${input.trueSolar ? '已校正真太陽時' : '未校正真太陽時'}，適合以 ${input.city} 的生活節奏為主要參考。`

  await new Promise((resolve) => setTimeout(resolve, 400))

  return { results, summary, fiveElements }
}
