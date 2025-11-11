import { HeroSection } from './components/HeroSection'
import { ResultPreview } from './components/ResultPreview'
import { ZiweiSection } from './components/ZiweiSection'
import { TarotSection } from './components/TarotSection'
import { FaqSection } from './components/FaqSection'

const navLinks = [
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
