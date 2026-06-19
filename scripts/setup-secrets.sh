#!/usr/bin/env bash
# 复制 .env 去 GitHub Secrets（需 gh CLI + gh auth login）
set -euo pipefail
cd "$(dirname "$0")/.."
source .env

if ! command -v gh >/dev/null; then
  echo "请安装 gh: https://cli.github.com"
  echo "或手动去 GitHub → Settings → Secrets → Actions 加："
  echo "  TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, NTFY_TOPIC"
  exit 1
fi

gh secret set TELEGRAM_BOT_TOKEN --body "$TELEGRAM_BOT_TOKEN"
gh secret set TELEGRAM_CHAT_ID --body "$TELEGRAM_CHAT_ID"
gh secret set NTFY_TOPIC --body "$NTFY_TOPIC"
echo "✅ Secrets 已设置。去 Actions → Jason OS → Run workflow 试一次。"
