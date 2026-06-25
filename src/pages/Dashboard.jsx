import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import CrisisModal from "../components/CrisisModal";
import { useCrisisAlert } from "../hooks/useCrisisAlert";
import api from "../api/axios";
import toast from "react-hot-toast";
import {
  RefreshCw,
  Trophy,
  Flame,
  Moon,
  Lock,
  Activity,
  Star,
  BookOpen,
  CheckCircle,
  ChevronRight,
  Zap,
  FileText,
  Play,
  Mic,
  BarChart2,
  Smile,
  Meh,
  Phone,
} from "lucide-react";

const EMOJIS = ["😭", "😢", "😐", "🙂", "😁"];
const LABELS = ["Awful", "Bad", "Okay", "Good", "Great"];

const RESOURCE_TYPE_META = {
  article: {
    label: "ARTICLE",
    color: "#2196F3",
    bg: "#E3F2FD",
    badgeBg: "#2196F3",
    Icon: FileText,
  },
  video: {
    label: "VIDEO",
    color: "#F44336",
    bg: "#FFEBEE",
    badgeBg: "#F44336",
    Icon: Play,
  },
  podcast: {
    label: "PODCAST",
    color: "#9C27B0",
    bg: "#F3E5F5",
    badgeBg: "#9C27B0",
    Icon: Mic,
  },
  infographic: {
    label: "INFOGRAPHIC",
    color: "#4CAF50",
    bg: "#E8F5E9",
    badgeBg: "#4CAF50",
    Icon: BarChart2,
  },
};

const today = new Date().toLocaleDateString("en-MY", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default function Dashboard() {
  const navigate = useNavigate();

  const [affirmation, setAffirmation] = useState("");
  const [goals, setGoals] = useState([]);
  const [resources, setResources] = useState([]);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [moodNote, setMoodNote] = useState("");
  const [moodScore, setMoodScore] = useState(5);
  const [journalContent, setJournalContent] = useState("");
  const [xp, setXp] = useState(0);
  const [streakDays, setStreakDays] = useState(0);
  const [todayLogged, setTodayLogged] = useState(false);

  const { alertOpen, alertReason, triggerAlert, dismissAlert } =
    useCrisisAlert();

  const xpNeeded = 500;
  const level = Math.max(1, Math.floor(xp / xpNeeded) + 1);
  const currentLevelXp = xp % xpNeeded;
  const xpProgress = (currentLevelXp / xpNeeded) * 100;

  useEffect(() => {
    Promise.all([
      api.get("/api/dashboard/affirmation"),
      api.get("/api/goals"),
      api.get("/api/resources"),
      api.get("/api/gamification/stats"),
    ])
      .then(([aff, g, r, stats]) => {
        setAffirmation(aff?.data?.[0]?.content || "");
        setGoals(g?.data?.slice(0, 3) || []);
        setResources(r?.data?.slice(0, 3) || []);
        setXp(stats?.data?.xp ?? 0);
        setStreakDays(stats?.data?.currentStreak ?? 0);
        setTodayLogged(stats?.data?.todayLogged ?? false);
      })
      .catch(() => toast.error("Failed to load dashboard data"));

    api
      .get("/api/crisis/check")
      .then((res) => {
        if (res.data?.hasPendingAlert) {
          triggerAlert(res.data.lastTrigger?.trigger_type || "general");
        }
      })
      .catch(() => {});
  }, [triggerAlert]);

  const saveMood = async () => {
    if (selectedEmoji === null) return toast.error("Please select an emoji");
    try {
      const formData = new FormData();
      formData.append("emoji", EMOJIS[selectedEmoji]);
      formData.append("score", moodScore);
      formData.append("label", LABELS[selectedEmoji]);
      formData.append("note", moodNote);

      const res = await api.post("/api/moods", formData);

      if (res.data?.showCrisisAlert) {
        triggerAlert(res.data.reason || "general");
      }

      toast.success("Mood saved! +10 XP");
      setXp((prev) => prev + 10);
      setTodayLogged(true);
      if (!todayLogged) setStreakDays((prev) => prev + 1);
      setSelectedEmoji(null);
      setMoodNote("");
    } catch {
      toast.error("Failed to save mood");
    }
  };

  const saveJournal = async () => {
    if (!journalContent.trim()) return toast.error("Write something first");
    try {
      const formData = new FormData();
      formData.append("content", journalContent);
      formData.append(
        "prompt",
        "What is one thing you are grateful for today?",
      );

      const res = await api.post("/api/journal", formData);

      if (res.data?.showCrisisAlert) {
        triggerAlert("journal_keyword");
      }

      toast.success("Journal entry saved! +50 XP");
      setXp((prev) => prev + 50);
      setJournalContent("");
    } catch {
      toast.error("Failed to save journal");
    }
  };

  return (
    <AppShell>
      {/* ── Crisis Modal ──────────────────────────────────────── */}
      <CrisisModal
        isOpen={alertOpen}
        reason={alertReason}
        onDismiss={dismissAlert}
      />

      <style>{`
        .progress-bar-striped {
          background-image: linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);
          background-size: 1rem 1rem;
        }
        .animate-stripes { animation: progress-stripes 1s linear infinite; }
        @keyframes progress-stripes {
          from { background-position: 1rem 0; }
          to   { background-position: 0 0; }
        }
      `}</style>

      {/* Outer wrapper: full height, no page-level scroll — inner sections scroll if needed */}
      <div className="flex flex-col gap-3 h-full">
        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="flex-shrink-0 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2 sm:gap-0">
          <div>
            <h1 className="text-lg font-bold text-navy">Dashboard</h1>
            <p className="text-xs text-gray-500 mt-0.5">{today}</p>
          </div>
          <div className="bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm flex items-center gap-3 w-fit">
            <div className="flex items-center gap-1.5 text-xs font-bold text-navy">
              <Trophy size={14} className="text-yellow-500" />
              <span>Lvl {level}</span>
            </div>
            <div className="w-px h-3 bg-gray-300" />
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
              <Flame size={12} className="text-orange-500" />
              <span>{streakDays}d streak</span>
            </div>
            <div className="w-px h-3 bg-gray-300" />
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
              <span className="text-purple-600">{currentLevelXp}</span> /{" "}
              {xpNeeded} XP
            </div>
          </div>
        </div>

        {/* ── Affirmation Banner (slim) + Your Journey ──────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-3 flex-shrink-0">
          {/* Affirmation Banner — compact ribbon */}
          <div className="bg-[#FFFBEA] border-[1.5px] border-[#F5C842] rounded-xl px-3 py-2 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#F5C842] flex items-center justify-center flex-shrink-0">
              <Star size={16} className="text-[#5C3D00]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-[#B8860B] uppercase tracking-[0.5px] mb-0.5">
                Today's Affirmation
              </div>
              <p className="text-xs text-[#5C4A00] italic truncate">
                "{affirmation}"
              </p>
            </div>
            <button
              onClick={() =>
                api
                  .get("/api/affirmations/daily")
                  .then((r) => setAffirmation(r.data?.[0]?.content || ""))
              }
              className="bg-[#F5C842] border-none rounded-md px-2.5 py-1 text-xs font-bold text-[#5C3D00] cursor-pointer flex items-center gap-1 hover:bg-[#E5B832] transition-colors flex-shrink-0"
            >
              <RefreshCw size={11} /> Refresh
            </button>
          </div>

          {/* Your Journey Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transform hover:scale-[1.01] transition-transform duration-300 flex flex-col">
            <div className="px-4 py-3 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white flex justify-between items-center relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl" />
              <div className="absolute right-12 -bottom-6 w-16 h-16 bg-white opacity-10 rounded-full blur-lg" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 shadow-sm">
                  <Trophy
                    className="text-yellow-300 drop-shadow-md"
                    size={18}
                  />
                </div>
                <div>
                  <h2
                    onClick={() => navigate("/progress")}
                    className="font-bold text-sm leading-tight cursor-pointer hover:underline"
                  >
                    Your Journey
                  </h2>
                  <p className="text-xs text-indigo-100 uppercase tracking-widest font-semibold mt-0.5">
                    Mental Wellness
                  </p>
                </div>
              </div>
              <div className="text-xs font-bold text-indigo-700 bg-white shadow-md px-2.5 py-1 rounded-full relative z-10 flex items-center gap-1.5">
                <Star className="text-yellow-400 fill-yellow-400" size={12} />{" "}
                Lvl {level}
              </div>
            </div>

            <div className="p-4 flex flex-col flex-1">
              {/* Today mood status */}
              <div
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl mb-3 border ${todayLogged ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${todayLogged ? "bg-green-100" : "bg-amber-100"}`}
                >
                  {todayLogged ? (
                    <Smile size={13} className="text-green-600" />
                  ) : (
                    <Meh size={13} className="text-amber-500" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-700">
                    {todayLogged ? "Mood logged today!" : "Log your mood today"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {todayLogged
                      ? `${streakDays}-day streak — keep it going!`
                      : "Don't break your streak"}
                  </p>
                </div>
                {!todayLogged && (
                  <button
                    onClick={() => navigate("/mood")}
                    className="text-xs font-bold bg-amber-400 text-white border-none px-2 py-1 rounded-lg cursor-pointer hover:bg-amber-500 transition-colors whitespace-nowrap"
                  >
                    Log Now
                  </button>
                )}
              </div>

              {/* Streak + XP mini stats */}
              <div className="flex gap-2 mb-3">
                <div className="flex-1 bg-orange-50 rounded-xl px-3 py-2 flex items-center gap-2">
                  <Flame size={13} className="text-orange-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-black text-gray-900 leading-tight tabular-nums">
                      {streakDays}
                    </p>
                    <p className="text-xs text-gray-400">day streak</p>
                  </div>
                </div>
                <div className="flex-1 bg-indigo-50 rounded-xl px-3 py-2 flex items-center gap-2">
                  <Zap size={13} className="text-indigo-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-black text-gray-900 leading-tight tabular-nums">
                      {currentLevelXp}
                    </p>
                    <p className="text-xs text-gray-400">XP this level</p>
                  </div>
                </div>
              </div>

              {/* XP progress bar */}
              <div className="mb-4">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Level Progress
                  </span>
                  <span className="text-indigo-500 text-xs font-bold bg-indigo-50 px-2 py-0.5 rounded">
                    {xpNeeded - currentLevelXp} XP to Lvl {level + 1}
                  </span>
                </div>
                <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner relative">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full progress-bar-striped animate-stripes relative"
                    style={{ width: `${xpProgress}%` }}
                  >
                    <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/40 blur-sm" />
                  </div>
                </div>
              </div>

              {/* Recent Badges */}
              <div className="mt-auto">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Recent Badges
                  </h3>
                  <button
                    onClick={() => navigate("/progress")}
                    className="text-xs font-bold text-indigo-500 cursor-pointer hover:text-indigo-700 bg-transparent border-none"
                  >
                    View All
                  </button>
                </div>
                <div className="flex gap-3">
                  <div className="flex flex-col items-center gap-1.5 group cursor-pointer">
                    <div
                      className={`w-10 h-10 rounded-full border-2 border-white flex items-center justify-center shadow-md transition-all duration-300 transform group-hover:-translate-y-1 group-hover:shadow-lg ${streakDays >= 7 ? "bg-gradient-to-br from-orange-100 to-red-100 ring-2 ring-orange-200" : "bg-gray-100 ring-2 ring-gray-200 opacity-50 grayscale"}`}
                    >
                      <Flame
                        className={
                          streakDays >= 7
                            ? "text-orange-500 drop-shadow-sm"
                            : "text-gray-400"
                        }
                        size={18}
                      />
                    </div>
                    <span className="text-xs font-bold text-gray-700 text-center leading-tight">
                      7-Day
                      <br />
                      Streak
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5 group cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 border-2 border-white ring-2 ring-blue-200 flex items-center justify-center shadow-md transition-all duration-300 transform group-hover:-translate-y-1 group-hover:shadow-lg">
                      <Moon
                        className="text-blue-500 drop-shadow-sm"
                        size={18}
                      />
                    </div>
                    <span className="text-xs font-bold text-gray-700 text-center leading-tight">
                      Sleep
                      <br />
                      Master
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5 group cursor-pointer opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                    <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white ring-2 ring-gray-200 flex items-center justify-center shadow-sm">
                      <Lock className="text-gray-400" size={14} />
                    </div>
                    <span className="text-xs font-bold text-gray-400 text-center leading-tight">
                      Zen
                      <br />
                      Seeker
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Mood, Goals, Journal ──────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 flex-shrink-0">
          {/* Mood Card */}
          <div className="bg-white rounded-xl border border-[#F48FB1] shadow-sm overflow-hidden flex flex-col">
            <div
              onClick={() => navigate("/mood")}
              className="flex items-center justify-between px-4 py-2.5 text-xs font-bold bg-[#FCE4EC] text-[#C2185B] cursor-pointer hover:bg-[#F8D7E3] transition-colors"
            >
              <span className="flex items-center gap-1">
                Record Your Mood <ChevronRight size={13} />
              </span>
            </div>
            <div className="p-3 flex flex-col flex-1">
              <p className="text-xs font-bold text-gray-500 mb-2">
                How are you feeling?
              </p>
              <div className="flex gap-1.5 mb-2">
                {EMOJIS.map((e, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedEmoji(i);
                      setMoodScore(i * 2 + 1);
                    }}
                    className={`flex-1 h-10 rounded-xl text-lg flex items-center justify-center cursor-pointer border-[1.5px] transition-all ${selectedEmoji === i ? "bg-[#F48FB1] border-[#C2185B] shadow-md scale-105" : "bg-[#FFF0F5] border-[#F48FB1] hover:bg-[#FCE4EC]"}`}
                  >
                    {e}
                  </button>
                ))}
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={moodScore}
                onChange={(e) => setMoodScore(e.target.value)}
                className="w-full accent-[#E91E63] mb-2"
              />
              <textarea
                value={moodNote}
                onChange={(e) => setMoodNote(e.target.value)}
                rows={1}
                placeholder="Describe your mood..."
                className="w-full bg-[#FFF5F8] border border-[#F48FB1] rounded-lg px-3 py-1.5 text-xs resize-none font-sans flex-1 focus:outline-none focus:ring-2 focus:ring-[#F48FB1]"
              />
              <button
                onClick={saveMood}
                className="w-full mt-2 py-2 bg-[#E91E63] text-white border-none rounded-lg text-xs font-bold cursor-pointer flex items-center justify-center gap-1.5 hover:bg-[#C2185B] transition-colors shadow-sm"
              >
                Save Mood{" "}
                <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded ml-1">
                  +10 XP
                </span>
              </button>
            </div>
          </div>

          {/* Goals Card */}
          <div className="bg-white rounded-xl border border-[#81C784] shadow-sm overflow-hidden flex flex-col">
            <div
              onClick={() => navigate("/goals")}
              className="flex items-center justify-between px-4 py-2.5 text-xs font-bold bg-[#E8F5E9] text-[#2E7D32] cursor-pointer hover:bg-[#C8E6C9] transition-colors"
            >
              <span className="flex items-center gap-1">
                Active Quests <ChevronRight size={13} />
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/goals");
                }}
                className="bg-[#4CAF50] text-white border-none rounded-md px-2.5 py-1 text-xs cursor-pointer hover:bg-[#388E3C]"
              >
                View All
              </button>
            </div>
            <div className="p-3 flex flex-col flex-1 justify-center">
              {goals.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">
                  No quests active. Add one!
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {goals.map((g, idx) => (
                    <div
                      key={g.id}
                      className="bg-white rounded-xl p-2.5 border border-gray-100 shadow-sm hover:border-indigo-200 transition-colors flex items-center gap-3 relative overflow-hidden group cursor-pointer"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-100 transition-colors">
                        {idx % 2 === 0 ? (
                          <Activity className="text-indigo-500" size={14} />
                        ) : (
                          <BookOpen className="text-indigo-500" size={14} />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="text-xs font-bold text-gray-800 truncate pr-2">
                            {g.title}
                          </h4>
                          <span className="text-xs font-extrabold text-white bg-indigo-500 px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap">
                            +50 XP
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-400 rounded-full"
                              style={{ width: `${g.progress || 0}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-indigo-500 w-6 text-right">
                            {g.progress === 100 ? (
                              <CheckCircle size={10} className="inline" />
                            ) : (
                              `${g.progress || 0}%`
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Journal Card */}
          <div className="bg-white rounded-xl border border-[#9575CD] shadow-sm overflow-hidden flex flex-col md:col-span-2 lg:col-span-1">
            <div
              onClick={() => navigate("/journal")}
              className="flex items-center justify-between px-4 py-2.5 text-xs font-bold bg-[#EDE7F6] text-[#512DA8] cursor-pointer hover:bg-[#D1C4E9] transition-colors"
            >
              <span className="flex items-center gap-1">
                Journal <ChevronRight size={13} />
              </span>
            </div>
            <div className="p-3 flex flex-col flex-1">
              <p className="text-xs font-bold text-[#7E57C2] mb-1">
                Today's Prompt
              </p>
              <div className="bg-[#F3EEF9] border border-[#B39DDB] rounded-lg p-2 mb-2">
                <p className="text-xs text-[#4527A0] italic leading-[1.4]">
                  What is one thing you are grateful for today?
                </p>
              </div>
              <textarea
                value={journalContent}
                onChange={(e) => setJournalContent(e.target.value)}
                rows={2}
                placeholder="Start writing..."
                className="w-full bg-[#FAF8FF] border border-[#B39DDB] rounded-lg px-3 py-1.5 text-xs resize-none font-sans flex-1 focus:outline-none focus:ring-2 focus:ring-[#9575CD]"
              />
              <button
                onClick={saveJournal}
                className="w-full mt-2 py-2 bg-[#7E57C2] text-white border-none rounded-lg text-xs font-bold cursor-pointer flex items-center justify-center gap-1.5 hover:bg-[#512DA8] transition-colors shadow-sm"
              >
                Save Journal{" "}
                <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded ml-1">
                  +50 XP
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Resources + Crisis Support ───────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[60fr_40fr] gap-3 flex-shrink-0">
          {/* Resources */}
          <div className="bg-white rounded-xl border border-[#64B5F6] shadow-sm overflow-hidden">
            <div
              onClick={() => navigate("/resources")}
              className="flex items-center justify-between px-4 py-2.5 text-xs font-bold bg-[#E3F2FD] text-[#1565C0] cursor-pointer hover:bg-[#BBDEFB] transition-colors"
            >
              <span className="flex items-center gap-1">
                Browse Resources <ChevronRight size={13} />
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/resources");
                }}
                className="bg-[#1976D2] text-white border-none rounded-md px-2.5 py-1 text-xs cursor-pointer hover:bg-[#1565C0]"
              >
                View All
              </button>
            </div>
            <div className="p-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {resources.slice(0, 3).map((r) => {
                const meta =
                  RESOURCE_TYPE_META[r.type] || RESOURCE_TYPE_META.article;
                const { Icon } = meta;
                return (
                  <div
                    key={r.id}
                    className="border border-gray-200 rounded-lg overflow-hidden flex sm:flex-col hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() =>
                      navigate(`/resources?type=${r.type || "article"}`)
                    }
                  >
                    <div
                      className="w-14 sm:w-auto h-auto sm:h-[46px] flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: meta.bg }}
                    >
                      <Icon size={20} style={{ color: meta.color }} />
                    </div>
                    <div className="p-2 flex flex-col flex-1 justify-center">
                      <span
                        className="text-xs font-bold text-white px-1.5 py-0.5 rounded w-max mb-1"
                        style={{ backgroundColor: meta.badgeBg }}
                      >
                        {meta.label}
                      </span>
                      <p className="text-xs font-bold mt-0.5 text-gray-800 leading-tight line-clamp-2">
                        {r.title}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Crisis Support */}
          <div className="bg-white rounded-xl border border-[#EF9A9A] shadow-sm overflow-hidden">
            <div className="px-4 py-2.5 text-xs font-bold bg-[#FFEBEE] text-[#C62828]">
              Crisis Support
            </div>
            <div className="p-3 flex flex-col gap-2">
              {[
                {
                  name: "Befrienders Malaysia",
                  number: "03-7956 8145",
                  hours: "24 hrs",
                },
                {
                  name: "MIASA Helpline",
                  number: "03-2780 6803",
                  hours: "Mon-Fri",
                },
                {
                  name: "UNIMAS Counselling",
                  number: "Ext. 082-581000",
                  hours: "Office hrs",
                },
              ].map((h) => (
                <div
                  key={h.name}
                  className="bg-[#FFF5F5] border border-[#EF9A9A] rounded-lg px-3 py-2 flex items-center gap-3 hover:bg-[#FFEBEE] transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 bg-[#FFCDD2] rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone size={13} className="text-[#C62828]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-800">{h.name}</p>
                    <p className="text-xs font-semibold text-[#C62828]">
                      {h.number}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    {h.hours}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
