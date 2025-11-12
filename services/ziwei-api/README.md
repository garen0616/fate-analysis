# Ziwei Doushu API Service

這個資料夾封裝了來自 `Samuelson368/ziwei-doushu-api-final` 的 Flask + Node.js 紫微斗數 API，方便與本專案一起部署。重點整理如下：

## 主要特色

- `/calculate`：支援 GET / POST，接收 `birth_datetime` 或 `birth_date` + `birth_time` 及 `gender`。
- 內建時間格式解析、防呆訊息、`/health` 與 `/test`。
- 排盤計算透過 `iztro` 套件在 Node.js 環境執行，輸出完整宮位／星曜資訊。

## 本地啟動

```bash
cd services/ziwei-api
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
npm install --production
python index.py   # 服務會跑在 http://127.0.0.1:5000
```

## Docker / Zeabur

此目錄提供 `Dockerfile`，會：

1. 使用 Node 18 安裝 `iztro` 套件。
2. 建立 Python 3.11 slim 環境並安裝 Flask/gunicorn。
3. 以 `gunicorn -b 0.0.0.0:5000 index:app` 啟動，供 Zeabur 或任何容器平台使用。

建置測試：

```bash
docker build -t ziwei-api:local services/ziwei-api
docker run --rm -e PORT=8080 -p 8080:8080 ziwei-api:local
```

## 與前端的介接

在 Vite 專案設定環境變數 `VITE_ZIWEI_API_BASE_URL`，例如：

```bash
VITE_ZIWEI_API_BASE_URL=https://your-ziwei-api.zeabur.app
```

前端會呼叫 `${BASE_URL}/calculate?birth_datetime=YYYY-MM-DD HH:mm&gender=male`，若 API 不可用則自動退回範例數據。若部署在僅開放 8080 的平台（如 Zeabur Docker service），可透過環境變數 `PORT` 覆寫對外埠號。
