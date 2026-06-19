import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
export const HK_TZ = "Asia/Hong_Kong";

export type Plan = {
  date: string;
  todos: string[];
  workLocation?: string;
};

export type NotifyState = {
  morningSentDate?: string;
  nightSentDate?: string;
};

export type Gratitude = { date: string; text: string };

export function todayHk(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: HK_TZ });
}

export function tomorrowHk(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toLocaleDateString("en-CA", { timeZone: HK_TZ });
}

export function yesterdayHk(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toLocaleDateString("en-CA", { timeZone: HK_TZ });
}

export function nowHkHour(): number {
  return Number(
    new Intl.DateTimeFormat("en-GB", { timeZone: HK_TZ, hour: "2-digit", hour12: false }).format(new Date()),
  );
}

export function nowHkMinute(): number {
  return Number(
    new Intl.DateTimeFormat("en-GB", { timeZone: HK_TZ, minute: "2-digit", hour12: false }).format(new Date()),
  );
}

/** 23:00 → 聽日；00:00–08:29 → 今日；08:30+ → 今日 */
export function planTargetDate(): string {
  const h = nowHkHour();
  if (h === 23) return tomorrowHk();
  return todayHk();
}

export function dateDisplay(dateIso: string): string {
  const d = new Date(`${dateIso}T12:00:00+08:00`);
  return d.toLocaleDateString("zh-HK", { timeZone: HK_TZ, weekday: "long", month: "long", day: "numeric" });
}

async function readJson<T>(path: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await readFile(path, "utf8")) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(path: string, data: unknown) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(data, null, 2) + "\n");
}

const data = (f: string) => join(ROOT, "data", f);

export const paths = {
  plan: data("plan.json"),
  notify: data("notify-state.json"),
  offset: data("telegram-offset.json"),
  gratitude: data("gratitude.json"),
};

export async function loadPlan() {
  return readJson<Plan>(paths.plan, { date: todayHk(), todos: [], workLocation: "" });
}

export async function savePlan(plan: Plan) {
  await writeJson(paths.plan, plan);
}

export async function loadNotifyState() {
  return readJson<NotifyState>(paths.notify, {});
}

export async function saveNotifyState(s: NotifyState) {
  await writeJson(paths.notify, s);
}

export async function loadGratitude() {
  return readJson<Gratitude>(paths.gratitude, { date: "", text: "" });
}

export async function saveGratitude(g: Gratitude) {
  await writeJson(paths.gratitude, g);
}

export async function loadTelegramOffset() {
  const o = await readJson<{ offset: number }>(paths.offset, { offset: 0 });
  return o.offset || 0;
}

export async function saveTelegramOffset(offset: number) {
  await writeJson(paths.offset, { offset, updatedAt: new Date().toISOString() });
}

export function isRealTodo(t: string) {
  const s = t.trim();
  return Boolean(s) && !s.startsWith("（待");
}
