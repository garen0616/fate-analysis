# 紫微 × 塔羅前端

這個子專案使用 Vite + React + TypeScript + Tailwind 建置，現階段主要接上「假資料演算法」與 LocalStorage 以驗證 UX。未來要串接真的紫微排盤或塔羅引擎時，可以沿用目前的資料流。

## 開發指令

```bash
cd web
npm install
npm run dev   # 啟動本機開發伺服器
npm run build # TypeScript + Vite 打包
```

## Mock API / 資料流說明

### 紫微 (`src/lib/ziweiMock.ts`)
- `mockZiweiReport(input: ZiweiInput)`：根據使用者輸入（含真太陽時開關、地點等）產生五大主題分數與摘要。演算法目前使用固定模板 + hash variation，延遲 400ms 模擬網路呼叫。
- `ZiweiSection` 在送出表單後即呼叫此函式，並將結果寫入 LocalStorage（最多 6 位人物），方便快速切換、重新命名與刪除，同時可產生分享連結（`?ziwei=`）供朋友貼上瀏覽器，進站後自動匯入。

### 塔羅 (`src/lib/tarotMock.ts`)
- `drawTarotMock({ topic, spread, allowReverse })`：從簡化牌組中抽取指定張數，回傳每張牌的正/逆位、關鍵詞與建議。以 `Date.now()` 做為 seed，延遲 350ms。
- `TarotSection` 會把抽牌結果存成歷史紀錄（最多 8 筆），支援重新命名與刪除，也可產出分享連結（`?tarot=`）或透過 Web Share API 直接分享給朋友。

### LocalStorage (`src/lib/storage.ts`)
- 提供 `load/saveZiweiProfiles`、`load/saveTarotRecords`，並封裝 `createId`。資料格式限定於瀏覽器，並限制保存筆數以免佔用太多空間。

## 待接入真正演算法時的建議

1. **建立 `packages/core` 或後端 API**：把紫微排盤、塔羅洗牌邏輯寫成單獨套件，前端只需要呼叫 `await getZiweiReport(input)` 類似的函式，方便在不同平台重複利用。
2. **加入版本欄位**：在 LocalStorage payload 中保留 `engineVersion`，未來演算法更新時可以判斷是否需要重新計算。
3. **Error Handling**：現在的 mock 函式只會成功，導入真實服務後需在 UI 補上錯誤訊息（例如 API timeout）。
4. **分享連結 / Web Share**：目前已支援 `?ziwei=` / `?tarot=` share link 與 Web Share API；之後可加上縮網址、QR Code 或 payload 簽章。

## 目錄結構摘要

```
web/
├── src/
│   ├── components/          # React UI 元件
│   ├── lib/                 # mock 演算法與 storage
│   ├── App.tsx              # 主頁面
│   ├── main.tsx             # React 入口
│   └── index.css            # 全域樣式
├── tailwind.config.js
├── README.md (本檔)
└── package.json
```

之後若要整合朋友自有的紫微或塔羅資料庫，只要在 `src/lib` 新增真正的 API client，並在 `ZiweiSection` / `TarotSection` 將 mock 呼叫替換掉即可。
