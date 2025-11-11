# 紫微 × 塔羅算命網站設計草圖

面向熟人社群的免費算命網站，無需會員與金流。主軸提供「紫微斗數」排盤與「塔羅牌」抽牌，並以五大主題（事業、婚姻、愛情、家庭〈父母＋子女〉、健康）串起整體資訊架構。

---

## 1. 使用者旅程與 IA

1. **Landing / Hero**
   - 兩顆主按鈕：`紫微排盤`、`塔羅抽牌`
   - 今日共通訊息（例如「本日整體能量」）＋免責聲明
2. **主題導覽區**
   - 五張大卡：事業、婚姻、愛情、家庭、健康
   - 點擊後進入 `Topic Hub`，可選紫微或塔羅工具
3. **工具頁**
   - 紫微：輸入表單 → 即時計算 → 結果摘要＋五大主題卡
   - 塔羅：選主題＋牌陣 → 抽牌動畫 → 結果摘要＋主題解讀
4. **結果分享**
   - 可複製連結（URL 參數帶入輸入資料）或下載截圖
   - LocalStorage 記住最近一次輸入供朋友快速切換

> 導覽永遠維持「Home / 紫微 / 塔羅 / FAQ / 關於」五個項目，確保任一分頁都有返回路徑。

---

## 2. 版面與元件

| 區塊 | 說明 | 關鍵元件 |
| --- | --- | --- |
| Hero + 快捷工具 | 全幅背景、主按鈕、提示文字 | `HeroBanner`, `PrimaryCTA`, `QuickInfoBadge` |
| 主題卡 | 五等份網格，卡片含 icon、摘要、進入按鈕 | `TopicCard` |
| 紫微輸入 | 兩欄表單：左欄基本資料、右欄進階設定（曆法、真太陽時、地點） | `InputPanel`, `DateTimePicker`, `GeoSelector`, `PresetLoader` |
| 紫微結果摘要 | 實心圓或雷達圖顯示五主題分數，搭配文字摘要 | `ResultRadar`, `SummaryChip` |
| 紫微主題卡 | 五張卡片固定順序：事業→婚姻→愛情→家庭→健康，各自列：吉凶指數、核心宮位、未來提醒、查看流年按鈕 | `TopicPanel`, `TimelineSwitcher` |
| 塔羅選擇 | Stepper：選主題→選牌陣→選牌組（正位/逆位設定） | `Stepper`, `SpreadCard`, `DeckSelector` |
| 塔羅結果 | 抽牌動畫＋每張牌：圖像、關鍵詞、情境解讀、行動建議 | `CardFlip`, `TarotInterpretation`, `ActionList` |
| 分享/收藏 | 按鈕列提供複製、下載 PNG、重算、回主題；小提示顯示資料保存於本機 | `ShareStrip`, `StorageNotice` |

**Mobile 搭配**
- Hero 改為單欄堆疊，主題卡以水平滑動呈現。
- 輸入表單使用 `accordion` 收合，以減少長度。
- 結果頁的雷達圖可改成五段式條狀圖。

---

## 3. UX Flow（紫微範例）

1. Landing 點擊 `紫微排盤`
2. `ToolSelector` 彈出選擇：快速排盤 / 高級排盤
3. 表單輸入：姓名（選填）、性別、出生日期時間、地點、曆法、是否修正真太陽時
4. 點擊「排盤」後進入結果頁
   - 頂部 `ResultRadar` 給出五主題分數
   - 下方依序顯示五張 `TopicPanel`
   - 每張卡有「查看流年」按鈕，展開 `TimelineDrawer`
   - 右側浮動 `ShareStrip`（重算 / 分享 / 儲存人物）

### UX Flow（塔羅範例）

1. Landing 點擊 `塔羅抽牌`
2. 選擇主題（五選一）→ 選擇牌陣（例如 3 卡/6 卡/十字）→ 選擇牌組或是否允許逆位
3. 抽牌畫面：顯示剩餘牌堆與抽牌動畫
4. 結果頁：
   - 頭部 `SummaryChip` 條列主題結論
   - 每張牌以 `CardFlip` 呈現圖像＋正逆位＋解讀
   - `ActionList` 列出建議與提醒日期
5. 底部 CTA：`再抽一次`、`換主題`、`分享結果`

---

## 4. 技術建議

| 層 | 技術 | 理由 |
| --- | --- | --- |
| 前端框架 | **Astro + React/Preact islands** | Astro 預設靜態輸出適合 SEO，React islands 供互動元件（牌陣、雷達圖） |
| 樣式 | Tailwind CSS + CSS Variables | 快速建立主題色（木火土金水＋塔羅深紫），且方便暗色模式 |
| 狀態管理 | Astro/React hooks + Zustand（或 jotai） | 管理輸入資料、抽牌狀態、LocalStorage 同步 |
| 計算模組 | 獨立 TypeScript library `packages/core` 包含：干支、真太陽時計算、紫微宮位、塔羅牌義 | 保持可測試，未來可拆為 npm 套件 |
| 測試 | Vitest + Testing Library | 驗證演算法與關鍵元件（表單、抽牌） |
| Build/Deploy | GitHub Actions → Cloudflare Pages / Netlify | 靜態部署快速，支援環境變數（例如 API Key 若有） |

資料儲存僅在瀏覽器（LocalStorage / IndexedDB）記住「最近 5 位人物」與「最近 5 次塔羅結果」，頁面載入時提供快速切換；不需伺服器資料庫。

---

## 5. 五大主題內容模板

| 主題 | 紫微欄位 | 塔羅解讀角度 |
| --- | --- | --- |
| 事業 | 命宮、官祿宮、財帛宮、吉星/凶星、流年大限 | 工作能量、合作氛圍、行動建議 |
| 婚姻 | 夫妻宮、命宮合參、對宮影響 | 伴侶狀態、溝通重點、和解建議 |
| 愛情 | 夫妻宮 + 桃花星、情感宮位 | 新認識對象、情緒表達、吸引力 |
| 家庭（父母＋子女） | 父母宮、子女宮、疾厄宮互動 | 關心父母健康、孩子學習與情緒 |
| 健康 | 疾厄宮、命宮五行失衡、流年化忌 | 身體警訊、休息建議、生活節奏 |

每張 `TopicPanel` 共用以下欄位：
1. **指數條**（0–100，顏色依五行）
2. **核心觀察**（2 行文字）
3. **時間面**：本月、本年、下一階段
4. **行動建議**：兩則 bullet
5. **友善提示**：例如「適合與誰討論」「需避開的時間」

---

## 6. 後續 roadmap

1. **Prototype**
   - 以 Astro 建立基本頁面與主題卡，導入 Tailwind
   - 實作塔羅假資料與動畫，紫微先用 mock JSON
2. **Core Engine**
   - 引入農曆/干支計算（`solarlunar`、`chinese-lunar` 等套件或自製）
   - 建立牌義與主題對應 JSON
3. **UI 完整化**
   - 雷達圖（Chart.js 或 Recharts）
   - Timeline Drawer + 分享功能（`html2canvas` 截圖）
4. **內容深化**
   - 撰寫各主題模板文案
   - 新增 FAQ、使用指南
5. **驗證**
   - 朋友試用收集回饋，優化文案語氣與色彩對比

---

## 7. Ziwei API 與部署

- `services/ziwei-api/`：封裝 iztro-based Flask API，可本地啟動或以 Dockerfile 佈署到 Zeabur／Railway。
- `VITE_ZIWEI_API_BASE_URL`：讓前端決定是否呼叫遠端 API；未設定時自動使用 mock 範例確保體驗不中斷。
- `scripts/deploy-zeabur.sh`：一次完成 Vite build、打包 dist.zip、建置 API 映像並（可選）推送到 Zeabur Registry，方便在 Zeabur 建立「前端 Static + 後端 Docker」雙服務架構。

此設計可直接在 VS Code + Codex 中逐步開發，先用靜態 JSON 驗證流程，再迭代演算法與 UI 細節。
