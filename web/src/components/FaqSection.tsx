const faqs = [
  {
    q: '會保存我的個資嗎？',
    a: '不會。所有輸入資料僅存在你的瀏覽器 LocalStorage，關閉頁面即可清除，也不需登入。',
  },
  {
    q: '紫微排盤的演算法精準嗎？',
    a: '正式版會結合真太陽時、節氣與大限推演，目前為內測假資料，主要展示流程與介面。',
  },
  {
    q: '塔羅可以使用自己的牌義嗎？',
    a: '會提供可編輯的牌義資料庫，讓你依照老師或自家團隊的解讀邏輯做客製化輸出。',
  },
]

export function FaqSection() {
  return (
    <section id="faq" className="space-y-5 rounded-4xl border border-neutral-100 bg-white p-8 shadow-2xl">
      <div>
        <p className="text-sm font-semibold text-primary-600">FAQ</p>
        <h2 className="text-3xl font-semibold">常見問題 / 保護資訊說明</h2>
        <p className="text-sm text-neutral-600">這是一個朋友專用的 side project，歡迎依照需求調整內容或提出功能建議。</p>
      </div>
      <div className="space-y-4">
        {faqs.map((item) => (
          <article key={item.q} className="rounded-3xl border border-neutral-100 bg-white/90 p-5 shadow">
            <h4 className="text-base font-semibold text-[#1f1235]">{item.q}</h4>
            <p className="mt-2 text-sm text-neutral-700">{item.a}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
