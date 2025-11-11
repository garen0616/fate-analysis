import { HeroSection } from './components/HeroSection'
import { ResultPreview } from './components/ResultPreview'
import { TopicCard, type Topic } from './components/TopicCard'
import { ToolFlowCard, type ToolCard } from './components/ToolFlowCard'
import { ZiweiSection } from './components/ZiweiSection'
import { TarotSection } from './components/TarotSection'
import { FaqSection } from './components/FaqSection'

const topics: Topic[] = [
  {
    id: 'career',
    title: '事業 / 財運',
    description: '規劃職涯節奏與財務節點，先給出命宮 × 官祿宮的整體指數，再拆大運提醒。',
    icon: '💼',
    accent: 'from-amber-100 to-amber-200',
    focus: ['命宮', '官祿宮', '財帛宮'],
  },
  {
    id: 'marriage',
    title: '婚姻 / 伴侶',
    description: '以夫妻宮與對宮互動檢視關係狀態，附上溝通話題與緩衝時間建議。',
    icon: '💍',
    accent: 'from-rose-100 to-rose-200',
    focus: ['夫妻宮', '命宮', '流年化科'],
  },
  {
    id: 'love',
    title: '愛情 / 新關係',
    description: '桃花星、情感宮位與塔羅牌義雙軌呈現，適合與朋友分享的新對象觀察表。',
    icon: '✨',
    accent: 'from-pink-100 to-fuchsia-200',
    focus: ['桃花星', '遷移宮', '情緒指數'],
  },
  {
    id: 'family',
    title: '家庭（父母＋子女）',
    description: '父母宮關心長輩健康，子女宮關心陪伴節奏；一頁同步掌握上下兩代需要。',
    icon: '👨‍👩‍👧',
    accent: 'from-emerald-100 to-emerald-200',
    focus: ['父母宮', '子女宮', '疾厄宮'],
  },
  {
    id: 'health',
    title: '健康 / 身心',
    description: '疾厄宮與五行失衡顯示身體警示燈，搭配塔羅建議動靜與檢查時程。',
    icon: '🌱',
    accent: 'from-cyan-100 to-sky-200',
    focus: ['疾厄宮', '五行比例', '流年化忌'],
  },
]

const toolCards: ToolCard[] = [
  {
    title: '紫微排盤流程',
    subtitle: '輸入 → 即時雷達圖 → 主題卡片',
    tone: 'bg-white/70',
    steps: [
      '輸入姓名（可匿名）、出生年月日時、地點、曆法與真太陽時開關',
      '演算法即時輸出五大主題指數與十二宮摘要',
      '展開各主題卡查看流年按鈕、行動建議與分享工具',
    ],
    actions: ['快速排盤', '高級設定'],
  },
  {
    title: '塔羅抽牌流程',
    subtitle: '選主題 → 選牌陣 → 抽牌動畫',
    tone: 'bg-white/60',
    steps: [
      '先挑選關注主題與牌陣（3 卡、六芒星或十字），可設定是否允許逆位',
      '抽牌畫面顯示剩餘牌堆與動畫，完成後自動翻牌',
      '每張牌附關鍵詞、情境解讀、行動建議與分享/重抽按鈕',
    ],
    actions: ['塔羅抽牌', '查看牌意庫'],
  },
]

const navLinks = [
  { label: '主題介紹', target: 'topics' },
  { label: '紫微排盤', target: 'ziwei' },
  { label: '塔羅抽牌', target: 'tarot' },
  { label: '常見問題', target: 'faq' },
]

const heroStats = [
  { value: '5', label: '主題卡指數' },
  { value: '78', label: '塔羅牌義' },
  { value: '12', label: '紫微宮位摘要' },
]

const heroBullets = [
  '✅ 不收費、免登入、資料僅存本機',
  '✅ 支援真太陽時、曆法切換與自訂牌陣',
  '✅ 結果頁附分享連結與行動建議',
]

function App() {
  const scrollToSection = (target: string) => {
    const element = document.getElementById(target)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#120c1f] via-[#1f1235] to-[#f7f1ff] text-[#1f1235]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-12 pt-6 md:px-6 lg:px-8">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/20 bg-white/10 px-6 py-4 text-white shadow-lg backdrop-blur">
          <div className="flex items-center gap-3 text-lg font-semibold">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 text-2xl">
              🔮
            </div>
            紫微 × 塔羅
          </div>
          <nav className="flex flex-wrap gap-4 text-sm">
            {navLinks.map((link) => (
              <a
                key={link.target}
                href={`#${link.target}`}
                onClick={(event) => {
                  event.preventDefault()
                  scrollToSection(link.target)
                }}
                className="text-white/80 transition hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <button
            onClick={() => scrollToSection('ziwei')}
            className="rounded-2xl bg-white/90 px-4 py-2 text-sm font-semibold text-[#1f1235] transition hover:bg-white"
          >
            開始占卜
          </button>
        </header>

        <main className="flex flex-1 flex-col gap-12">
          <HeroSection
            tagline="紫微排盤 ＋ 塔羅抽牌"
            title={
              <>
                五大主題，一次掌握
                <br />
                朋友專屬的命盤指北
              </>
            }
            description="結合紫微斗數的精準盤勢與塔羅牌的情境轉譯，將「事業 / 婚姻 / 愛情 / 家庭 / 健康」整理為可分享的卡片，適合在聚會時即興查看，也能保存最近一次排盤供朋友續聊。"
            primaryCta="立即紫微排盤"
            secondaryCta="啟動塔羅抽牌"
            bullets={heroBullets}
            stats={heroStats}
            onPrimaryAction={() => scrollToSection('ziwei')}
            onSecondaryAction={() => scrollToSection('tarot')}
          />

          <section id="topics" className="space-y-6">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-ziwei">TOPIC HUB</p>
              <h2 className="text-3xl font-semibold">五大主題卡 · 生活語境優先</h2>
              <p className="text-base text-neutral-600">
                每張卡片固定包含指數條、核心觀察、時間節點與行動建議，也能延伸到紫微流年或塔羅再抽。
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {topics.map((topic) => (
                <TopicCard key={topic.id} topic={topic} />
              ))}
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            {toolCards.map((card) => (
              <ToolFlowCard key={card.title} card={card} />
            ))}
          </section>

          <ZiweiSection />

          <TarotSection />

          <ResultPreview />

          <FaqSection />
        </main>

        <footer className="mt-12 rounded-3xl border border-white/40 bg-white/10 px-6 py-4 text-center text-xs text-white/80">
          無廣告、不蒐集個資，僅供朋友交流與生活規劃參考。© {new Date().getFullYear()} 紫微 × 塔羅 Side Project
        </footer>
      </div>
    </div>
  )
}

export default App
