const token = () => process.env.TELEGRAM_BOT_TOKEN?.trim();
const chatId = () => process.env.TELEGRAM_CHAT_ID?.trim();

export async function sendTelegram(text: string, dryRun = false) {
  const bot = token();
  const chat = chatId();
  if (!bot || !chat) throw new Error("缺少 TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID");

  if (dryRun) {
    console.log("[telegram]\n" + text);
    return;
  }

  const res = await fetch(`https://api.telegram.org/bot${bot}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chat, text, disable_web_page_preview: true }),
  });
  if (!res.ok) throw new Error(`telegram ${res.status}`);
}

export async function sendNtfy(title: string, body: string, dryRun = false) {
  const topic = process.env.NTFY_TOPIC?.trim();
  if (!topic) return;

  if (dryRun) {
    console.log("[ntfy] " + title);
    return;
  }

  const ascii = title.replace(/[^\x00-\x7F]/g, "").trim() || "Jason OS";
  await fetch(`https://ntfy.sh/${topic}`, {
    method: "POST",
    headers: { Title: ascii, Priority: "4" },
    body: `${title}\n\n${body}`,
  });
}

export async function notify(title: string, body: string, dryRun = false) {
  const channels = (process.env.NOTIFY_CHANNELS || "telegram,ntfy").split(",").map((s) => s.trim());
  if (channels.includes("telegram")) await sendTelegram(`${title}\n\n${body}`, dryRun);
  if (channels.includes("ntfy")) await sendNtfy(title, body, dryRun);
}

export async function pollTelegram(onText: (text: string) => Promise<void>) {
  const bot = token();
  const chat = chatId();
  if (!bot || !chat) return;

  const { loadTelegramOffset, saveTelegramOffset } = await import("./store.js");
  const offset = await loadTelegramOffset();
  const url = `https://api.telegram.org/bot${bot}/getUpdates?offset=${offset}&timeout=0`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`getUpdates ${res.status}`);
  const data = (await res.json()) as {
    result?: Array<{ update_id: number; message?: { chat?: { id?: number }; text?: string } }>;
  };

  let max = offset;
  for (const u of data.result || []) {
    max = Math.max(max, u.update_id + 1);
    const msg = u.message;
    if (!msg?.text || String(msg.chat?.id) !== chat) continue;
    await onText(msg.text);
  }
  if (max > offset) await saveTelegramOffset(max);
}
