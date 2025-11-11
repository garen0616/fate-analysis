const topicKeys = ['事業', '婚姻', '愛情', '家庭', '健康'] as const
export type TopicKey = (typeof topicKeys)[number]

export type TarotCard = {
  id: string
  name: string
  suit: 'major' | 'wands' | 'cups' | 'swords' | 'pentacles'
  keywords: Record<TopicKey, string>
  actions: Record<TopicKey, string>
  reflections: Record<TopicKey, string>
}

export type TarotCardResult = {
  name: string
  position: '正位' | '逆位'
  focus: string
  advice: string
  action: string
  reflection: string
  slotMeaning: string
}

const deck: TarotCard[] = [
  {
    id: 'sun',
    name: '太陽',
    suit: 'major',
    keywords: {
      事業: '成功、聚光燈、公開肯定',
      婚姻: '坦誠相對、共享喜悅',
      愛情: '熱情表白、陽光能量',
      家庭: '家庭聚會、親子同樂',
      健康: '活力充沛、需要節奏',
    },
    actions: {
      事業: '公開分享成果並邀請回饋。',
      婚姻: '安排共同慶祝的儀式或旅行。',
      愛情: '製造可愛驚喜、主動說出喜歡。',
      家庭: '召集家人共餐或週末出遊。',
      健康: '維持規律運動與日光浴。',
    },
    reflections: {
      事業: '我希望被看見的亮點是什麼？',
      婚姻: '哪些喜悅還沒與伴侶分享？',
      愛情: '我能如何用行動帶來溫暖？',
      家庭: '多久沒與家人一起歡笑了？',
      健康: '哪些習慣讓我真正有活力？',
    },
  },
  {
    id: 'moon',
    name: '月亮',
    suit: 'major',
    keywords: {
      事業: '潛意識、信息未明',
      婚姻: '情緒波動、需要傾聽',
      愛情: '曖昧混沌、放慢腳步',
      家庭: '家人敏感、需要陪伴',
      健康: '睡眠與情緒需留意',
    },
    actions: {
      事業: '暫緩重大決策，蒐集更多訊息。',
      婚姻: '用溫柔方式詢問對方感受。',
      愛情: '別急著下定論，讓關係自然發展。',
      家庭: '用陪伴與對話安撫情緒。',
      健康: '調整作息，記錄夢境與心情。',
    },
    reflections: {
      事業: '我是否忽略了直覺給的警訊？',
      婚姻: '我有坦誠分享自己的不安嗎？',
      愛情: '我害怕面對的真相是什麼？',
      家庭: '我能打造更安全的溝通空間嗎？',
      健康: '什麼樣的生活節奏讓我安心？',
    },
  },
  {
    id: 'chariot',
    name: '戰車',
    suit: 'major',
    keywords: {
      事業: '行動、勝利、掌控',
      婚姻: '對齊方向、共同目標',
      愛情: '主動追求、掌握節奏',
      家庭: '搬遷/出行相關決策',
      健康: '訓練、競賽、保持動能',
    },
    actions: {
      事業: '制定里程碑、堅定執行計畫。',
      婚姻: '與伴侶討論下一階段藍圖。',
      愛情: '勇敢邀約，展現明確誠意。',
      家庭: '規劃旅行或搬家細節。',
      健康: '設定運動計畫並追蹤成果。',
    },
    reflections: {
      事業: '我真正要征服的戰場是什麼？',
      婚姻: '我們是否朝同個方向前進？',
      愛情: '我的行動是否尊重對方節奏？',
      家庭: '此決定對每位家人意味著什麼？',
      健康: '我給身體/心靈多大的壓力？',
    },
  },
  {
    id: 'temperance',
    name: '節制',
    suit: 'major',
    keywords: {
      事業: '平衡節奏、整合資源',
      婚姻: '互相調和、溫柔對話',
      愛情: '慢慢磨合差異',
      家庭: '界線與共處的平衡',
      健康: '身心療癒、飲食調整',
    },
    actions: {
      事業: '安排休息、檢視工作步調。',
      婚姻: '固定開啟「只聊感受」的時間。',
      愛情: '尊重雙方步調並設立安全詞。',
      家庭: '制定家庭儀式保持和諧。',
      健康: '嘗試冥想/瑜珈/寫日記。',
    },
    reflections: {
      事業: '我在哪些地方用力過猛？',
      婚姻: '我們需要怎樣的緩衝空間？',
      愛情: '我能否更耐心理解對方？',
      家庭: '界線與親密如何並存？',
      健康: '哪些儀式能讓我安定？',
    },
  },
  {
    id: 'lovers',
    name: '戀人',
    suit: 'major',
    keywords: {
      事業: '合作、價值觀選擇',
      婚姻: '親密、誠實、承諾',
      愛情: '互相吸引、需要抉擇',
      家庭: '凝聚共識、家庭契合',
      健康: '身心連結、傾聽自己',
    },
    actions: {
      事業: '檢視合作是否符合價值。',
      婚姻: '坦誠需求並做共同決定。',
      愛情: '勇敢定義關係。',
      家庭: '召開家庭會議，凝聚願景。',
      健康: '重新評估與自我契合的生活。',
    },
    reflections: {
      事業: '我是否為了妥協而失去自我？',
      婚姻: '我願意在關係裡更誠實嗎？',
      愛情: '我害怕承諾的原因是什麼？',
      家庭: '共同願景是什麼？',
      健康: '哪些選擇讓我更貼近真實自我？',
    },
  },
  {
    id: 'hermit',
    name: '隱者',
    suit: 'major',
    keywords: {
      事業: '研究、獨立、內省',
      婚姻: '需要個人空間、自我探索',
      愛情: '沉澱反思、暫緩互動',
      家庭: '長輩智慧、彼此給空間',
      健康: '靜心療癒、內在修復',
    },
    actions: {
      事業: '專注知識累積、優化流程。',
      婚姻: '誠實提出個人空間需求。',
      愛情: '給彼此喘息時間，理解真正需求。',
      家庭: '向長輩請教或整理家族故事。',
      健康: '安排靜心、閱讀或散步儀式。',
    },
    reflections: {
      事業: '我需要哪段獨處時間充電？',
      婚姻: '我有沒有好好說出自己的界線？',
      愛情: '我真的知道自己要的是什麼嗎？',
      家庭: '家族智慧對我有何啟發？',
      健康: '我有聽見內在聲音嗎？',
    },
  },
  {
    id: 'strength',
    name: '力量',
    suit: 'major',
    keywords: {
      事業: '以柔克剛、堅定領導',
      婚姻: '包容與療癒',
      愛情: '耐心、信任、勇敢',
      家庭: '守護與界線',
      健康: '心理韌性與身體力量',
    },
    actions: {
      事業: '以同理心帶領團隊堅守價值。',
      婚姻: '以溫柔語氣說出需求與界線。',
      愛情: '展現真誠關心與穩定力量。',
      家庭: '守護家人同時照顧自身界線。',
      健康: '練習肌力與心靈韌性。',
    },
    reflections: {
      事業: '我如何用柔性力量影響他人？',
      婚姻: '我是否願意以耐心取代批判？',
      愛情: '我能否同時堅定又溫柔？',
      家庭: '支持他人時，我照顧好自己了嗎？',
      健康: '哪些練習讓我更有韌性？',
    },
  },
  {
    id: 'wheel',
    name: '命運之輪',
    suit: 'major',
    keywords: {
      事業: '轉折、機會、變動',
      婚姻: '關係新階段、重要節點',
      愛情: '命定相遇、突發事件',
      家庭: '家庭角色轉換',
      健康: '起伏變化、需預防',
    },
    actions: {
      事業: '把握突如其來的邀約並做風險管理。',
      婚姻: '討論未來計畫與責任分工。',
      愛情: '敞開心胸迎接未知緣分。',
      家庭: '為可能的生活變化做準備。',
      健康: '提早健檢與建立備援方案。',
    },
    reflections: {
      事業: '有哪些變化正在敲門？',
      婚姻: '我們準備好迎接新的階段嗎？',
      愛情: '我願意接受命運帶來的驚喜嗎？',
      家庭: '家人的節奏需如何重新協調？',
      健康: '我是否忽略了生活節奏的變化？',
    },
  },
]

const spreadsMap: Record<
  string,
  {
    label: string
    count: number
    slots: string[]
  }
> = {
  '3': {
    label: '三張日常卡',
    count: 3,
    slots: ['過去', '現在', '未來'],
  },
  '6': {
    label: '六芒星',
    count: 6,
    slots: ['議題核心', '阻力', '助力', '關鍵行動', '外在回饋', '結果'],
  },
  cross: {
    label: '凱爾特十字（簡化）',
    count: 6,
    slots: ['現況', '挑戰', '內在根源', '外在影響', '近期', '遠期'],
  },
  relation: {
    label: '關係牌陣',
    count: 4,
    slots: ['我', '對方', '互動', '提醒'],
  },
  decision: {
    label: '決策牌陣',
    count: 5,
    slots: ['情境', '方案 A', '方案 B', '隱藏因素', '最終趨勢'],
  },
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

const resolveTopicKey = (topic: string): TopicKey => {
  const key = topicKeys.find((item) => topic.startsWith(item))
  return key ?? '事業'
}

export const drawTarotMock = async ({
  topic,
  spread,
  allowReverse,
  seed = Date.now(),
}: TarotDrawOptions): Promise<{ cards: TarotCardResult[]; summary: string }> => {
  const { count, label, slots } = spreadsMap[spread]
  const workingDeck = [...deck]
  const cards: TarotCardResult[] = []
  const topicKey = resolveTopicKey(topic)

  for (let i = 0; i < count; i += 1) {
    const randomIndex = Math.floor(rand(seed + i) * workingDeck.length) % workingDeck.length
    const [card] = workingDeck.splice(randomIndex, 1)
    const shouldReverse = allowReverse && i % 2 === 1
    cards.push({
      name: card.name,
      focus: card.keywords[topicKey],
      advice: card.actions[topicKey],
      action: card.actions[topicKey],
      reflection: card.reflections[topicKey],
      slotMeaning: slots[i] ?? `位置 ${i + 1}`,
      position: shouldReverse ? '逆位' : '正位',
    })
  }

  await new Promise((resolve) => setTimeout(resolve, 350))

  const summary = `${label} · 關於 ${topic} 的洞察`
  return { cards, summary }
}
