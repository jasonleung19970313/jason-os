import {
  dateDisplay,
  isRealTodo,
  loadGratitude,
  loadPlan,
  planTargetDate,
  saveGratitude,
  savePlan,
  todayHk,
  type Plan,
} from "./store.js";

function parseIsoDate(raw: string): string | null {
  const iso = raw.match(/(\d{4}-\d{2}-\d{2})/);
  if (iso?.[1]) return iso[1];
  const dmy = raw.match(/\b(\d{1,2})[\/\-.](\d{1,2})(?:[\/\-.](\d{2,4}))?\b/);
  if (!dmy) return null;
  let year = dmy[3] || todayHk().slice(0, 4);
  if (year.length === 2) year = `20${year}`;
  return `${year}-${dmy[2].padStart(2, "0")}-${dmy[1].padStart(2, "0")}`;
}

function extractTodos(text: string): string[] {
  const items: string[] = [];
  for (const line of text.split("\n")) {
    const m = line.trim().match(/^[1-3][\.\)、]\s*(.+)$/);
    if (m?.[1]) items.push(m[1].trim());
  }
  if (items.length) return items.slice(0, 3);
  const pipe = text.split("|").map((s) => s.trim()).filter(Boolean);
  if (pipe.length >= 2) return pipe.slice(0, 3);
  return [];
}

export async function applyTelegramText(text: string): Promise<string | null> {
  const t = text.trim();
  if (!t || /^(應該係|日子錯|搞錯)/.test(t)) return null;

  if (/^\/plan\b/i.test(t)) return "SHOW_PLAN";

  const fix = t.match(/^\/fix\s+(\S+)/i);
  if (fix?.[1]) {
    const d = parseIsoDate(fix[1]);
    if (!d) return null;
    const plan = await loadPlan();
    plan.date = d;
    await savePlan(plan);
    return `✅ 已改做 ${dateDisplay(d)}`;
  }

  if (/^\/thanks?\b/i.test(t)) {
    const body = t.replace(/^\/thanks?\s*/i, "").trim();
    const gLine = t.match(/感恩[：:]\s*(.+)/)?.[1]?.trim();
    const text2 = body || gLine || "";
    if (!text2) return "請回覆：/thanks 今日感恩嘅事";
    await saveGratitude({ date: todayHk(), text: text2 });
    return `🙏 已記低今日感恩：${text2}`;
  }

  const target = planTargetDate();
  const plan = await loadPlan();
  if (plan.date !== target) {
    plan.date = target;
    plan.todos = [];
  }

  let changed = false;

  if (/^\/todo\b/i.test(t)) {
    const todos = extractTodos(t.replace(/^\/todo\s*/i, ""));
    if (todos.length) {
      while (todos.length < 3) todos.push("（待補）");
      plan.todos = todos;
      changed = true;
    }
  }

  if (/^\/work\b/i.test(t) || /返工[：:]/.test(t)) {
    const loc = t.match(/^\/work\s+(.+)/i)?.[1]?.trim() || t.match(/返工[：:]\s*(.+)/)?.[1]?.trim();
    if (loc) {
      plan.workLocation = loc.split("|")[0].trim();
      changed = true;
    }
  }

  const todos = extractTodos(t);
  if (todos.length) {
    while (todos.length < 3) todos.push("（待補）");
    plan.todos = todos;
    changed = true;
  }

  const g = t.match(/感恩[：:]\s*(.+)/)?.[1]?.trim();
  if (g) {
    await saveGratitude({ date: todayHk(), text: g });
  }

  if (!changed && !g) return null;

  if (changed) {
    plan.date = target;
    await savePlan(plan);
  }

  const todoLines = plan.todos.filter(isRealTodo).map((x, i) => `${i + 1}. ${x}`).join("\n");
  return [
    `✅ 已記低 ${dateDisplay(plan.date)}`,
    plan.workLocation ? `📍 ${plan.workLocation}` : "",
    todoLines ? `📝 ${todoLines}` : "",
    "朝早 8:30 會通知你。晚安 Boss 🌙",
  ]
    .filter(Boolean)
    .join("\n");
}

export async function planSummary(): Promise<string> {
  const plan = await loadPlan();
  const g = await loadGratitude();
  return [
    `📋 ${dateDisplay(plan.date)}`,
    plan.workLocation ? `📍 ${plan.workLocation}` : "",
    ...plan.todos.filter(isRealTodo).map((t, i) => `${i + 1}. ${t}`),
    g.date === todayHk() && g.text ? `🙏 感恩：${g.text}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}
