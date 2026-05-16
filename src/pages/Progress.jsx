import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import api from "../api/axios";
import toast from "react-hot-toast";
import {
  Trophy,
  Flame,
  Star,
  Lock,
  ChevronRight,
  Zap,
  Target,
  BarChart2,
} from "lucide-react";

const MILESTONES = [3, 7, 14, 30, 60];
const LEVEL_NAMES = [
  "Beginner",
  "Explorer",
  "Tracker",
  "Reflector",
  "Mood Guru",
  "Zen Master",
];

const ACHIEVEMENTS = [
  { id: "first", emoji: "🌱", name: "First Step", desc: "Log your first mood" },
  { id: "3day", emoji: "🔥", name: "3-Day Streak", desc: "3 days in a row" },
  {
    id: "7day",
    emoji: "🏅",
    name: "Week Warrior",
    desc: "7-day streak",
    streakNeeded: 7,
  },
  { id: "happy", emoji: "😊", name: "Happy Days", desc: "Log happy 5 times" },
  { id: "night", emoji: "🌙", name: "Night Owl", desc: "Log after 10pm" },
  {
    id: "30day",
    emoji: "🌟",
    name: "Month Master",
    desc: "30-day streak",
    streakNeeded: 30,
  },
  {
    id: "journal",
    emoji: "📖",
    name: "Journaler",
    desc: "Save 5 journal entries",
  },
  {
    id: "100",
    emoji: "💯",
    name: "Centurion",
    desc: "100 total logs",
    logsNeeded: 100,
  },
];

const WEEKLY_CHALLENGES = [
  {
    emoji: "📅",
    name: "Log 5 days this week",
    current: 0,
    total: 5,
    reward: 50,
  },
  {
    emoji: "😢",
    name: "Track a difficult emotion",
    current: 0,
    total: 1,
    reward: 30,
  },
  {
    emoji: "🌅",
    name: "Morning log before 9am",
    current: 0,
    total: 3,
    reward: 40,
  },
];

export default function Progress() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/gamification/stats")
      .then((r) => setStats(r.data))
      .catch(() => toast.error("Failed to load progress data"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-400 text-sm">Loading your progress…</div>
        </div>
      </AppShell>
    );
  }

  const streakDays = stats?.currentStreak ?? 0;
  const longestStreak = stats?.longestStreak ?? 0;
  const totalLogs = stats?.totalLogs ?? 0;
  const thisMonth = stats?.thisMonthLogs ?? 0;
  const completionRate = stats?.completionRate ?? 0;
  const todayLogged = stats?.todayLogged ?? false;
  const weekDays = stats?.weekDays ?? [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ];
  const xp = stats?.xp ?? 0;

  const XP_PER_LEVEL = 500;
  const level = Math.max(1, Math.floor(xp / XP_PER_LEVEL) + 1);
  const xpInLevel = xp % XP_PER_LEVEL;
  const xpPct = Math.round((xpInLevel / XP_PER_LEVEL) * 100);
  const levelName = LEVEL_NAMES[Math.min(level - 1, LEVEL_NAMES.length - 1)];

  const nextMilestone =
    MILESTONES.find((m) => m > streakDays) ?? MILESTONES[MILESTONES.length - 1];
  const prevMilestone =
    [...MILESTONES].reverse().find((m) => m <= streakDays) ?? 0;
  const milestonePct = Math.min(
    ((streakDays - prevMilestone) / (nextMilestone - prevMilestone)) * 100,
    100,
  );

  const isEarned = (a) => {
    if (a.streakNeeded) return streakDays >= a.streakNeeded;
    if (a.logsNeeded) return totalLogs >= a.logsNeeded;
    return (stats?.achievements ?? []).includes(a.id);
  };

  const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Today"];

  return (
    <AppShell>
      <div className="flex flex-col gap-4 h-full overflow-y-auto pb-6">
        {/* ── Header ──────────────────────────────────────────────── */}
        <div className="flex-shrink-0 flex items-center justify-between">
          <div>
            <h1 className="text-[17px] font-bold text-navy">Your Progress</h1>
            <p className="text-[10px] text-gray-500 mt-0.5">
              Streaks, XP and achievements
            </p>
          </div>
          <button
            onClick={() => navigate("/mood")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold border-none cursor-pointer transition-colors shadow-sm ${
              todayLogged
                ? "bg-green-100 text-green-700 ring-1 ring-green-300"
                : "bg-[#1976D2] text-white hover:bg-[#1565C0]"
            }`}
          >
            {todayLogged ? "✓ Logged Today" : "Log Today's Mood"}
            {!todayLogged && <ChevronRight size={13} />}
          </button>
        </div>

        {/* ── Today Banner ────────────────────────────────────────── */}
        <div
          className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl border ${
            todayLogged
              ? "bg-green-50 border-green-200"
              : "bg-amber-50 border-amber-200"
          }`}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0 ${
              todayLogged ? "bg-green-100" : "bg-amber-100"
            }`}
          >
            {todayLogged ? "😊" : "😐"}
          </div>
          <div className="flex-1">
            <p className="text-[12px] font-bold text-gray-800">
              {todayLogged ? "Mood logged today!" : "Haven't logged today yet"}
            </p>
            <p className="text-[10px] text-gray-500">
              {todayLogged
                ? `You're on a ${streakDays}-day streak. Come back tomorrow!`
                : "Log your mood to keep your streak alive"}
            </p>
          </div>
          <span
            className={`text-[9px] font-bold px-2.5 py-1 rounded-full ${
              todayLogged
                ? "bg-green-100 text-green-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {todayLogged ? "Done ✓" : "Pending"}
          </span>
        </div>

        {/* ── Main Grid ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* STREAK CARD — full width */}
          <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                <Flame size={16} className="text-orange-500" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-800">
                  Current Streak
                </p>
                <p className="text-[9px] text-gray-400">Keep logging daily</p>
              </div>
              <span className="ml-auto text-[9px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-600">
                {streakDays >= 14
                  ? "🔥 On fire!"
                  : streakDays >= 7
                    ? "⚡ Consistent"
                    : streakDays >= 3
                      ? "🌱 Building"
                      : "👋 Just started"}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-[clamp(2.5rem,6vw,4rem)] font-black text-gray-900 leading-none tabular-nums">
                {streakDays}
              </span>
              <span className="text-[13px] font-medium text-gray-400">
                days
              </span>
            </div>
            <p className="text-[10px] text-gray-400 mb-4">
              {streakDays >= MILESTONES[MILESTONES.length - 1]
                ? "🎉 You've hit all streak milestones!"
                : `${nextMilestone - streakDays} more day${nextMilestone - streakDays > 1 ? "s" : ""} to your ${nextMilestone}-day badge 🏅`}
            </p>

            {/* Milestone progress bar */}
            <div className="relative mb-1">
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#1976D2] to-indigo-400 rounded-full transition-all duration-700"
                  style={{ width: `${milestonePct}%` }}
                />
              </div>
            </div>
            <div className="flex justify-between mb-4">
              {MILESTONES.map((m) => (
                <span
                  key={m}
                  className={`text-[9px] font-bold ${
                    streakDays >= m
                      ? "text-[#1976D2]"
                      : m === nextMilestone
                        ? "text-amber-500"
                        : "text-gray-300"
                  }`}
                >
                  {m}d
                </span>
              ))}
            </div>

            {/* Weekly day pips */}
            <div className="flex gap-2">
              {weekDays.map((recorded, i) => {
                const isToday = i === weekDays.length - 1;
                let cls =
                  "flex-1 aspect-square max-w-[40px] rounded-xl flex items-center justify-center text-sm transition-all ";
                if (isToday && todayLogged)
                  cls += "bg-green-100 ring-2 ring-green-400";
                else if (isToday)
                  cls += "bg-gray-50 border-2 border-dashed border-gray-300";
                else if (recorded) cls += "bg-blue-50 ring-2 ring-[#1976D2]/30";
                else cls += "bg-gray-50 opacity-40";
                return (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className={cls}>
                      {(recorded && !isToday) || (isToday && todayLogged) ? (
                        <span className="text-green-600 font-bold text-[10px]">
                          ✓
                        </span>
                      ) : isToday ? (
                        <span className="text-gray-300">·</span>
                      ) : (
                        <span className="text-gray-300 text-[10px]">✗</span>
                      )}
                    </div>
                    <span
                      className={`text-[9px] font-bold ${
                        isToday ? "text-[#1976D2]" : "text-gray-400"
                      }`}
                    >
                      {DAY_LABELS[i]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* XP / LEVEL CARD */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                <Star size={16} className="text-indigo-500" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-800">
                  Experience Points
                </p>
                <p className="text-[9px] text-gray-400">
                  Level {level} · {levelName}
                </p>
              </div>
              <span className="ml-auto text-[9px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
                Lv. {level}
              </span>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-[clamp(1.8rem,4vw,2.5rem)] font-black text-gray-900 leading-none tabular-nums">
                {xpInLevel}
              </span>
              <span className="text-[11px] text-gray-400">
                / {XP_PER_LEVEL} XP
              </span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-400 rounded-full transition-all duration-700"
                style={{ width: `${xpPct}%` }}
              />
            </div>
            <div className="flex justify-between">
              <span className="text-[9px] text-gray-400">
                {XP_PER_LEVEL - xpInLevel} XP to Level {level + 1}
              </span>
              <span className="text-[9px] font-bold text-indigo-500">
                +10 XP per log
              </span>
            </div>
          </div>

          {/* STATS CARD */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <BarChart2 size={16} className="text-blue-500" />
              </div>
              <p className="text-[11px] font-bold text-gray-800">Your Stats</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Total logs", value: totalLogs },
                { label: "Best streak", value: `${longestStreak}d` },
                { label: "This month", value: thisMonth },
                { label: "Completion rate", value: `${completionRate}%` },
              ].map((s) => (
                <div key={s.label} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[16px] font-black text-gray-900 leading-tight tabular-nums">
                    {s.value}
                  </p>
                  <p className="text-[9px] text-gray-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ACHIEVEMENTS CARD */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center">
                <Trophy size={16} className="text-yellow-500" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-800">
                  Achievements
                </p>
                <p className="text-[9px] text-gray-400">
                  {ACHIEVEMENTS.filter(isEarned).length} / {ACHIEVEMENTS.length}{" "}
                  earned
                </p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {ACHIEVEMENTS.map((a) => {
                const earned = isEarned(a);
                return (
                  <div
                    key={a.id}
                    title={a.desc}
                    className={`flex flex-col items-center gap-1 ${
                      earned ? "" : "opacity-40 grayscale"
                    }`}
                  >
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl relative ${
                        earned
                          ? "bg-yellow-50 ring-2 ring-yellow-300"
                          : "bg-gray-100"
                      }`}
                    >
                      {a.emoji}
                      {!earned && (
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full border border-gray-200 flex items-center justify-center">
                          <Lock size={8} className="text-gray-400" />
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-[9px] font-bold text-center leading-tight ${
                        earned ? "text-yellow-600" : "text-gray-400"
                      }`}
                    >
                      {a.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* WEEKLY CHALLENGES — full width */}
          <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                  <Target size={16} className="text-orange-500" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-800">
                    Weekly Challenges
                  </p>
                  <p className="text-[9px] text-gray-400">
                    Resets every Monday
                  </p>
                </div>
              </div>
              <span className="text-[9px] text-gray-400">3 days left</span>
            </div>
            <div className="flex flex-col gap-3">
              {WEEKLY_CHALLENGES.map((c) => {
                const pct = Math.round((c.current / c.total) * 100);
                const done = c.current >= c.total;
                return (
                  <div
                    key={c.name}
                    className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3"
                  >
                    <span className="text-xl flex-shrink-0">{c.emoji}</span>
                    <div className="flex-1">
                      <p className="text-[11px] font-bold text-gray-800">
                        {c.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${pct}%`,
                              background: done ? "#4CAF50" : "#da7101",
                            }}
                          />
                        </div>
                        <span className="text-[9px] text-gray-400 tabular-nums whitespace-nowrap">
                          {c.current}/{c.total}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 text-[10px] font-bold text-yellow-600 flex-shrink-0">
                      <Zap size={11} className="text-yellow-500" />+{c.reward}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
