export const BLESSING = "今天是美好的一天，感恩擁有的一切，奇蹟將會一個接一個出現。";

const QUOTES = [
  "The secret of getting ahead is getting started. — Mark Twain",
  "Done is better than perfect. — Sheryl Sandberg",
  "Small daily improvements lead to staggering long-term results.",
  "Your network is your net worth. — Porter Gale",
  "Discipline is choosing between what you want now and what you want most.",
  "The best time to plant a tree was 20 years ago. The second best time is now.",
  "Success is the sum of small efforts, repeated day in and day out.",
  "Don't watch the clock; do what it does. Keep going. — Sam Levenson",
  "Dream big. Start small. Act now.",
  "Make each day your masterpiece. — John Wooden",
  "The only way to do great work is to love what you do. — Steve Jobs",
  "Be so good they can't ignore you. — Steve Martin",
  "Consistency beats intensity every time.",
  "It always seems impossible until it's done. — Nelson Mandela",
  "Start where you are. Use what you have. Do what you can. — Arthur Ashe",
  "You miss 100% of the shots you don't take. — Wayne Gretzky",
  "Believe you can and you're halfway there. — Theodore Roosevelt",
  "The way to get started is to quit talking and begin doing. — Walt Disney",
  "Fall seven times, stand up eight. — Japanese proverb",
  "Quality is not an act, it is a habit. — Aristotle",
  "Push yourself, because no one else is going to do it for you.",
  "Great things never come from comfort zones.",
  "Don't stop when you're tired. Stop when you're done.",
  "One day or day one. You decide.",
  "Stay hungry. Stay foolish. — Steve Jobs",
  "The comeback is always stronger than the setback.",
  "Excuses will always be there for you. Opportunity won't.",
  "Don't wish for it. Work for it.",
  "Your only limit is you.",
  "Create the life you can't wait to wake up to.",
  "I never lose. I either win or learn. — Nelson Mandela",
  "When you feel like quitting, think about why you started.",
  "Difficult roads often lead to beautiful destinations.",
  "Progress over perfection.",
  "Ship it. Then improve it.",
  "Less overthinking. More doing.",
  "The compound effect of daily action is unstoppable.",
  "Don't wait for opportunity. Create it.",
  "The distance between your dreams and reality is called action.",
  "Rise up. Start fresh. See the bright opportunity in each new day.",
  "Gratitude turns what we have into enough.",
  "Joy is the simplest form of gratitude. — Karl Barth",
  "When we focus on our gratitude, the tide of disappointment goes out.",
  "Gratitude is the healthiest of all human emotions. — Zig Ziglar",
  "There is always something to be thankful for.",
  "Gratitude unlocks the fullness of life.",
  "The root of joy is gratefulness. — David Steindl-Rast",
  "If the only prayer you ever say is thank you, it will be enough.",
  "When you are grateful, fear disappears and abundance appears. — Tony Robbins",
  "Be present in all things and thankful for all things. — Maya Angelou",
  "Kindness is a language which the deaf can hear and the blind can see. — Mark Twain",
  "No act of kindness, no matter how small, is ever wasted. — Aesop",
  "Be kind whenever possible. It is always possible. — Dalai Lama",
  "In a world where you can be anything, be kind.",
  "How do we change the world? One random act of kindness at a time.",
  "We rise by lifting others. — Robert Ingersoll",
  "The best way to find yourself is to lose yourself in the service of others. — Gandhi",
  "Happiness doesn't result from what we get, but from what we give. — Ben Carson",
  "Either you run the day, or the day runs you. — Jim Rohn",
  "Yesterday is gone. Tomorrow has not yet come. We have only today. — Mother Teresa",
  "The bad news is time flies. The good news is you're the pilot.",
  "Time is the coin of your life. Spend it wisely.",
  "Lost time is never found again. — Benjamin Franklin",
  "The key is in not spending time, but in investing it. — Stephen R. Covey",
  "Until you value your time, you won't value your life.",
  "Focus on being productive instead of busy. — Tim Ferriss",
  "A goal without a plan is just a wish. — Antoine de Saint-Exupéry",
  "You don't have to be great to start, but you have to start to be great.",
  "Energy and persistence conquer all things. — Benjamin Franklin",
  "Opportunities don't happen. You create them. — Chris Grosser",
  "What you do today can improve all your tomorrows. — Ralph Marston",
  "Well done is better than well said. — Benjamin Franklin",
  "A year from now you may wish you had started today.",
  "Do something today that your future self will thank you for.",
  "Little things make big days.",
  "It's going to be hard, but hard does not mean impossible.",
  "Winners are not people who never fail, but people who never quit.",
  "Invest in yourself. It pays the best interest.",
  "Strive for progress, not perfection.",
  "Every accomplishment starts with the decision to try.",
  "You are capable of amazing things.",
  "Keep going. Everything you need will come to you.",
  "Trust the process. Your time is coming.",
  "Today is your opportunity to build the tomorrow you want.",
  "Turn your wounds into wisdom. — Oprah Winfrey",
  "Act as if what you do makes a difference. It does. — William James",
  "Nothing will work unless you do. — Maya Angelou",
  "Go the extra mile. It's never crowded.",
  "It does not matter how slowly you go as long as you do not stop. — Confucius",
  "If you're going through hell, keep going. — Winston Churchill",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "You are one decision away from a completely different life.",
  "The expert in anything was once a beginner.",
  "Prove them wrong.",
  "Make today so awesome that yesterday gets jealous.",
  "Today is a good day to have a good day.",
  "Morning is when the day defines itself. Make it count, Boss.",
  "Set a goal that makes you want to jump out of bed.",
  "Each morning we are born again. What we do today matters most.",
  "Good Morning Boss — today is yours to win.",
  "Show up. Stand out. Boss mode on.",
  "Your future is created by what you do today.",
  "One focused day beats a scattered week.",
  "Clarity comes from action, not thought.",
  "Build the empire one morning at a time.",
  "Today: one step closer to the five-year vision.",
  "Boss moves only. Let's go.",
];

/** 用 day-of-year，365 日内唔重复（QUOTES.length >= 100） */
export function dailyMotivation(dateIso: string): string {
  const d = new Date(`${dateIso}T12:00:00+08:00`);
  const start = new Date(d.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((d.getTime() - start.getTime()) / 86400000);
  return QUOTES[dayOfYear % QUOTES.length];
}

export function formatMorning(plan: {
  date: string;
  todos: string[];
  workLocation?: string;
  gratitudeYesterday?: string;
}) {
  const todos = plan.todos.filter((t) => t.trim() && !t.startsWith("（待"));
  const todoBlock = todos.length
    ? todos.map((t, i) => `${i + 1}. ${t}`).join("\n")
    : "（未設定 — 昨晚 Telegram 回覆 /todo 或 /work）";

  const work = plan.workLocation?.trim()
    ? `📍 返邊度：${plan.workLocation}`
    : "📍 返邊度：（未設定 — 回覆 /work 地點）";

  const lines = [
    "Good Morning Boss ☀️",
    "",
    work,
    "",
    "✅ 今日 To-do",
    todoBlock,
  ];

  if (plan.gratitudeYesterday?.trim()) {
    lines.push("", "🙏 昨日感恩", plan.gratitudeYesterday.trim());
  }

  lines.push("", BLESSING, "", `💬 ${dailyMotivation(plan.date)}`);
  return lines.join("\n");
}

export function formatNight(gratitudeToday?: string) {
  const lines = [
    "🌙 23:00 · Plan 聽日",
    "",
    "📝 聽日 To-do — 回覆：",
    "/todo 事1 | 事2 | 事3",
    "",
    "📍 返邊度 — 回覆：",
    "/work 返工地點",
    "",
    "🙏 今日感恩 — 回覆：",
    '/thanks 今日感恩嘅事',
  ];

  if (gratitudeToday?.trim()) {
    lines.push("", "✅ 已記低今日感恩：", gratitudeToday.trim());
  }

  lines.push("", "或者一次過 send：", "1. 事1", "2. 事2", "返工：地點", "感恩：...");
  return lines.join("\n");
}
