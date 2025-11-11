#!/usr/bin/env bash

# 簡易 Zeabur 部署腳本：
# 1. 在 web/ 目錄執行 npm ci && npm run build，產生 dist 與 dist.zip。
# 2. 在 services/ziwei-api 建立 Docker 映像，可依需要推送到 Zeabur Registry。
# 3. 結束後會輸出下一步在 Zeabur 控制台要填寫的參考資訊。

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FRONTEND_DIR="${ROOT_DIR}/web"
API_DIR="${ROOT_DIR}/services/ziwei-api"
DIST_ARCHIVE="${DIST_ARCHIVE:-${FRONTEND_DIR}/dist.zip}"
API_IMAGE_TAG="${ZEABUR_API_IMAGE:-ziwei-api:latest}"

echo "==> 1/3 建置 Vite 前端"
pushd "${FRONTEND_DIR}" >/dev/null
npm ci
npm run build
if command -v zip >/dev/null 2>&1; then
  rm -f "${DIST_ARCHIVE}"
  zip -qr "${DIST_ARCHIVE}" dist
  echo "    已將 dist 打包為 ${DIST_ARCHIVE}"
else
  echo "    ⚠️ 未找到 zip，略過 dist 打包"
fi
popd >/dev/null

echo "==> 2/3 建置 Ziwei API Docker 映像 (${API_IMAGE_TAG})"
docker build -t "${API_IMAGE_TAG}" "${API_DIR}"

if [[ -n "${ZEABUR_REGISTRY:-}" ]]; then
  REGISTRY_IMAGE="${ZEABUR_REGISTRY%/}/${API_IMAGE_TAG}"
  echo "==> 2b 推送到 Zeabur Registry: ${REGISTRY_IMAGE}"
  docker tag "${API_IMAGE_TAG}" "${REGISTRY_IMAGE}"
  docker push "${REGISTRY_IMAGE}"
else
  echo "    （未設定 ZEABUR_REGISTRY，僅建置本地映像）"
fi

echo "==> 3/3 提示"
cat <<'EOF'
部署建議：
- 前端（Static）服務：選擇 Vite 模板或提供 dist.zip，啟用環境變數 VITE_ZIWEI_API_BASE_URL=https://<your-api-domain>
- Ziwei API 服務：使用 scripts/deploy-zeabur.sh 產出的 Docker 映像，啟動指令可沿用 Dockerfile 中的 gunicorn
- 若要更新：重新執行本腳本並於 Zeabur 介面選擇對應映像 / dist.zip 重新部署
EOF
