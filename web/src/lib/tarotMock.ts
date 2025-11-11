export type TarotCard = {
  id: string
  name: string
  suit: 'major' | 'wands' | 'cups' | 'swords' | 'pentacles'
  keywords: Record<string, string>
  actions: Record<string, string>
  reflections: Record<string, string>
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
      婚姻: '坦誠相見、共享喜悅',
      愛情: '熱情表白、陽光能量',
      家庭: '家庭聚會、親子同樂',
      健康: '活力充沛、需要節奏',
    },
    actions: {
      事業: '分享專案成果並邀請回饋。',
      婚姻: '安排共同慶祝活動，分享彼此喜訊。',
      愛情: '創造充滿陽光與笑聲的約會。',
      家庭: '安排家庭出遊或家常聚會。',
      健康: '維持規律運動與充足日光。',
    },
    reflections: {
      事業: '我想被看到的亮點是什麼？',
      婚姻: '有哪些喜悅值得與伴侶分享？',
      愛情: '我能透過什麼行動傳遞溫暖？',
      家庭: '多久沒與家人一起歡笑了？',
      健康: '什麼習慣讓我真正有活力？',
    },
  },
  {
    id: 'moon',
    name: '月亮',
    suit: 'major',
    keywords: {
      事業: '潛在資訊、尚未明朗',
      婚姻: '情緒起伏、需要傾聽',
      愛情: '曖昧朦朧、需要時間釐清',
      家庭: '家人情緒敏感、需要陪伴',
      健康: '睡眠與情緒需留意',
    },
    actions: {
      事業: '暫緩重大決策，蒐集更多資訊。',
      婚姻: '開放談論感受，避免猜測。',
      愛情: '慢慢觀察而非急著定義關係。',
      家庭: '陪伴家人並確認彼此情緒。',
      健康: '記錄夢境與身體感受，調整作息。',
    },
    reflections: {
      事業: '有哪些訊號我還沒看懂？',
      婚姻: '我是否把不安說出口了？',
      愛情: '我真正害怕的是什麼？',
      家庭: '我能如何建立安全的溝通空間？',
      健康: '怎麼做能讓自己睡得更安穩？',
    },
  },
  {
    id: 'chariot',
    name: '戰車',
    suit: 'major',
    keywords: {
      事業: '行動、勝利、掌控',
      婚姻: '需要明確方向與共識',
      愛情: '積極追求、掌握主導',
      家庭: '搬遷/出行相關決策',
      健康: '訓練、競賽、保持動能',
    },
    actions: {
      事業: '制定里程碑並執行。',
      婚姻: '釐清共同目標並討論行動。',
      愛情: '勇敢表達心意並提出具體邀約。',
      家庭: '規劃家族旅行或搬遷細節。',
      健康: '設定運動計畫並追蹤成果。',
    },
    reflections: {
      事業: '我需要專注在哪個戰場？',
      婚姻: '我們可否同向前進？',
      愛情: '我的行動是否尊重對方節奏？',
      家庭: '這次的決策對每個人意味著什麼？',
      健康: '我對身體下了哪些過度要求？',
    },
  },
  {
    id: 'temperance',
    name: '節制',
    suit: 'major',
    keywords: {
      事業: '平衡、節奏、整合',
      婚姻: '互相調和、溫柔對話',
      愛情: '慢慢磨合彼此差異',
      家庭: '安排共處時間與界線',
      健康: '身心療癒、飲食調整',
    },
    actions: {
      事業: '安排休息與回顧，避免過勞。',
      婚姻: '建立固定的對話儀式。',
      愛情: '尊重雙方步調並設安全詞。',
      家庭: '制定家庭儀式維持和諧。',
      健康: '嘗試冥想、寫日記或泡腳儀式。',
    },
    reflections: {
      事業: '我在哪些地方過度用力？',
      婚姻: '我們需要怎樣的緩衝空間？',
      愛情: '我能如何更耐心地理解對方？',
      家庭: '哪些界線需要重新調整？',
      健康: '哪些儀式能讓我感到穩定？',
    },
  },
  {
    id: 'lovers',
    name: '戀人',
    suit: 'major',
    keywords: {
      事業: '合作、選擇、價值觀',
      婚姻: '親密、誠實、承諾',
      愛情: '互相吸引、需要選擇',
      家庭: '家人同心、議題需共識',
      健康: '身心連結、需要傾聽自己',
    },
    actions: {
      事業: '確認夥伴價值觀，選擇適合的合作。',
      婚姻: '溝通彼此需求並做出共同決定。',
      愛情: '勇敢表達並定義關係。',
      家庭: '召開家庭會議，凝聚共識。',
      健康: '多傾聽身體訊號，調整生活選擇。',
    },
    reflections: {
      事業: '這段合作是否符合我真實的價值？',
      婚姻: '我是否願意在這段關係中更坦誠？',
      愛情: '我害怕承諾的原因是什麼？',
      家庭: '我們真正需要的家庭願景是什麼？',
      健康: '有哪些習慣與真正的自己相違背？',
    },
  },
  {
    id: 'hermit',
    name: '隱者',
    suit: 'major',
    keywords: {
      事業: '研究、獨立、內省',
      婚姻: '需要個人空間、自我探索',
      愛情: '沉潛反思、暫緩互動',
      家庭: '彼此給空間、長輩智慧',
      健康: '養生、靜心、療癒',
    },
    actions: {
      事業: '專注於知識累積與內部優化。',
      婚姻: '坦誠提出個人空間需求。',
      愛情: '給彼此喘息時間，理解真正需求。',
      家庭: '向長輩請教或整理家族故事。',
      健康: '安排獨處靜心或療癒課程。',
    },
    reflections: {
      事業: '我需要獨立完成的研究是什麼？',
      婚姻: '我有沒有說出自己的空間需求？',
      愛情: '我真正在找的是什麼樣的關係？',
      家庭: '家族經驗能帶給我什麼智慧？',
      健康: '我是否忽略了內在聲音？',
    },
  },
  {
    id: 'strength',
    name: '力量',
    suit: 'major',
    keywords: {
      事業: '溫柔堅毅、以柔制剛',
      婚姻: '包容、互相療癒',
      愛情: '耐心、理解、信任',
      家庭: '守護、界線、支持',
      健康: '重視心理韌性與身體力量',
    },
    actions: {
      事業: '用同理心引導團隊，堅守價值。',
      婚姻: '以溫柔方式說界線。',
      愛情: '展現真誠關心與包容。',
      家庭: '為家人提供實際支持並維持界線。',
      健康: '練習肌力與心理韌性並重。',
    },
    reflections: {
      事業: '我如何以柔性力量領導？',
      婚姻: '是否願意用耐心取代批判？',
      愛情: '我能如何同時堅定又溫柔？',
      家庭: '支持他人時是否也尊重自己的界線？',
      健康: '哪些練習能培養身心韌性？',
    },
  },
  {
    id: 'wheel',
    name: '命運之輪',
    suit: 'major',
    keywords: {
      事業: '轉折、機會、變動',
      婚姻: '關係進入新階段',
      愛情: '意外相遇、命定緣分',
      家庭: '家庭角色轉換',
      健康: '起伏變化、需要預防',
    },
    actions: {
      事業: '把握突如其來的機會並做風險管理。',
      婚姻: '討論下一階段藍圖。',
      愛情: '敞開心胸迎接未知關係。',
      家庭: '準備應對家庭角色或生活型態的變化。',
      健康: '建立備援方案，提早安排檢查。',
    },
    reflections: {
      事業: '哪些變化正在敲門？',
      婚姻: '我們能如何一起迎接轉變？',
      愛情: '我是否願意面對命運帶來的驚喜？',
      家庭: '家人各自的節奏是否需要重新協調？',
      健康: '我準備好面對生活節奏的變動嗎？',
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

const topicKeys = ['事業', '婚姻', '愛情', '家庭', '健康'] as const
type TopicKey = (typeof topicKeys)[number]

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
