FROM node:18-bullseye AS node_deps
WORKDIR /deps
COPY package*.json ./
RUN npm install --production

FROM python:3.11-slim AS runtime
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=5000

# 安裝 Node.js 18 供 iztro 腳本使用
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl gnupg ca-certificates bash \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY --from=node_deps /deps/node_modules ./node_modules
COPY --from=node_deps /deps/package*.json ./

COPY index.py .

EXPOSE 5000

CMD ["gunicorn", "-b", "0.0.0.0:5000", "index:app"]
