import "dotenv/config";
import { applyTelegramText, planSummary } from "./plan.js";
import { formatMorning, formatNight } from "./messages.js";
import { notify, pollTelegram, sendTelegram } from "./notify.js";
import {
  loadGratitude,
  loadNotifyState,
  loadPlan,
  nowHkHour,
  nowHkMinute,
  saveNotifyState,
  todayHk,
  yesterdayHk,
} from "./store.js";

async function runMorning(dryRun: boolean) {
  const plan = await loadPlan();
  const today = todayHk();
  const g = await loadGratitude();
  const body = formatMorning({
    date: today,
    todos: plan.date === today ? plan.todos : [],
    workLocation: plan.date === today ? plan.workLocation : undefined,
    gratitudeYesterday: g.date === yesterdayHk() ? g.text : undefined,
  });
  await notify("Good Morning Boss", body, dryRun);
  console.log("[jason-os] morning sent");
}

async function runNight(dryRun: boolean) {
  const g = await loadGratitude();
  const body = formatNight(g.date === todayHk() ? g.text : undefined);
  await notify("🌙 Plan 聽日", body, dryRun);
  console.log("[jason-os] night sent");
}

function shouldSendMorning(sent?: string) {
  if (sent === todayHk()) return false;
  const h = nowHkHour();
  const m = nowHkMinute();
  if (h < 8 || (h === 8 && m < 30)) return false;
  if (h >= 12) return false;
  return true;
}

function shouldSendNight(sent?: string) {
  if (sent === todayHk()) return false;
  const h = nowHkHour();
  return h === 23 || h < 3;
}

async function runAuto(dryRun: boolean) {
  const state = await loadNotifyState();
  const h = nowHkHour();
  const m = nowHkMinute();

  if (shouldSendMorning(state.morningSentDate)) {
    await runMorning(dryRun);
    if (!dryRun) await saveNotifyState({ ...state, morningSentDate: todayHk() });
    return;
  }

  if (shouldSendNight(state.nightSentDate)) {
    await runNight(dryRun);
    if (!dryRun) await saveNotifyState({ ...state, nightSentDate: todayHk() });
    return;
  }

  console.log(`[jason-os] idle ${todayHk()} ${h}:${String(m).padStart(2, "0")}`);
}

async function runTelegramInbox() {
  await pollTelegram(async (text) => {
    const result = await applyTelegramText(text);
    if (result === "SHOW_PLAN") await sendTelegram(await planSummary());
    else if (result) await sendTelegram(result);
  });
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  await runTelegramInbox();
  if (process.argv.includes("--morning")) {
    await runMorning(dryRun);
    return;
  }
  if (process.argv.includes("--night")) {
    await runNight(dryRun);
    return;
  }
  await runAuto(dryRun);
}

main().catch((err) => {
  console.error("[jason-os]", err instanceof Error ? err.message : err);
  process.exit(1);
});
