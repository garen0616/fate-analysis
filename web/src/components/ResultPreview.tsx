export function ResultPreview() {
  return (
    <section className="rounded-4xl border border-neutral-100 bg-white/90 p-8 shadow-2xl">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-tarot">RESULT PREVIEW</p>
        <h3 className="text-2xl font-semibold">紫微雷達圖 × 塔羅卡片預覽</h3>
        <p className="text-sm text-neutral-600">
          先顯示五大主題分數與摘要，再展開個別卡片。塔羅結果可以按主題再次抽牌，或將現有結果複製給朋友。
        </p>
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-neutral-100 bg-gradient-to-br from-white to-purple-50 p-6 shadow-inner">
          <h4 className="text-lg font-semibold text-ziwei">紫微主題卡示意</h4>
          <ul className="mt-4 space-y-4 text-sm text-neutral-600">
            <li>
              <strong className="text-ziwei">事業 78 / 100：</strong> 官祿宮得祿馬，適合推進新合作，記得 12 月前完成簽核。
            </li>
            <li>
              <strong className="text-ziwei">婚姻 62 / 100：</strong> 夫妻宮化忌進入交流區，建議 2 週後再談重要議題。
            </li>
          </ul>
        </div>
        <div className="rounded-3xl border border-neutral-100 bg-gradient-to-br from-white to-indigo-50 p-6 shadow-inner">
          <h4 className="text-lg font-semibold text-tarot">塔羅解讀示意</h4>
          <div className="mt-4 space-y-3 text-sm text-neutral-600">
            <p>
              <strong className="text-tarot">戀人（正位） · 愛情：</strong> 關係中有誠實對話機會，安排一場無手機晚餐。
            </p>
            <p>
              <strong className="text-tarot">節制（逆位） · 健康：</strong> 身心失衡，建議調整作息與補水，必要時找專業協助。
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
