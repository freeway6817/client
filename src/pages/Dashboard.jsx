import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
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
} from "lucide-react";

const EMOJIS = ["😭", "😢", "😐", "🙂", "😁"];
const LABELS = ["Awful", "Bad", "Okay", "Good", "Great"];
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

  // Gamification state (mocked for now, calculates level dynamically)
  const [xp, setXp] = useState(1250);
  const xpNeeded = 2000;

  const level = 4 + Math.floor(xp / xpNeeded);
  const currentLevelXp = xp % xpNeeded;
  const xpProgress = (currentLevelXp / xpNeeded) * 100;

  useEffect(() => {
    Promise.all([
      api.get("/api/affirmations/daily"),
      api.get("/api/goals"),
      api.get("/api/resources"),
    ])
      .then(([aff, g, r]) => {
        setAffirmation(aff?.data?.content || "");
        setGoals(g?.data?.slice(0, 3) || []);
        setResources(r?.data?.slice(0, 3) || []);
      })
      .catch(() => toast.error("Failed to load dashboard data"));
  }, []);

  const saveMood = async () => {
    if (selectedEmoji === null) return toast.error("Please select an emoji");
    try {
      const formData = new FormData();
      formData.append("emoji", EMOJIS[selectedEmoji]);
      formData.append("score", moodScore);
      formData.append("label", LABELS[selectedEmoji]);
      formData.append("note", moodNote);

      await api.post("/api/moods", formData);
      toast.success("Mood saved! +25 XP");
      setXp((prev) => prev + 25);
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

      await api.post("/api/journal", formData);
      toast.success("Journal entry saved! +50 XP");
      setXp((prev) => prev + 50);
      setJournalContent("");
    } catch {
      toast.error("Failed to save journal");
    }
  };

  return (
    <AppShell>
      {/* Custom CSS for the gamification progress bar */}
      <style>{`
        .progress-bar-striped {
            background-image: linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);
            background-size: 1rem 1rem;
        }
        .animate-stripes {
            animation: progress-stripes 1s linear infinite;
        }
        @keyframes progress-stripes {
            from { background-position: 1rem 0; }
            to { background-position: 0 0; }
        }
      `}</style>

      <div className="flex flex-col gap-4 h-full overflow-y-auto pb-6">
        {/* Header - Now stacks vertically on mobile, horizontal on sm+ */}
        <div className="flex-shrink-0 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 sm:gap-0">
          <div>
            <h1 className="text-[17px] font-bold text-navy">Dashboard</h1>
            <p className="text-[10px] text-gray-500 mt-0.5">{today}</p>
          </div>

          {/* Gamification Mini-Header */}
          <div className="bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm flex items-center gap-3 w-fit">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-navy">
              <Trophy size={14} className="text-yellow-500" />
              <span>Lvl {level}</span>
            </div>
            <div className="w-px h-3 bg-gray-300"></div>
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-600">
              <span className="text-purple-600">{currentLevelXp}</span> /{" "}
              {xpNeeded} XP
            </div>
          </div>
        </div>

        {/* Top Row: Affirmation + Gamification Widget */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4 flex-shrink-0">
          {/* Affirmation Banner */}
          <div className="bg-[#FFFBEA] border-[1.5px] border-[#F5C842] rounded-2xl p-4 flex flex-col justify-center gap-4 h-full">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#F5C842] flex items-center justify-center text-2xl flex-shrink-0">
                ✨
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-bold text-[#B8860B] uppercase tracking-[0.5px] mb-1.5">
                  Today's Affirmation
                </div>
                <p className="text-[12px] text-[#5C4A00] italic">
                  "{affirmation}"
                </p>
              </div>
              <button
                onClick={() =>
                  api
                    .get("/api/affirmations/daily")
                    .then((r) => setAffirmation(r.data.content))
                }
                className="bg-[#F5C842] border-none rounded-md px-3.5 py-2 text-[10px] font-bold text-[#5C3D00] cursor-pointer flex items-center gap-1.5 hover:bg-[#E5B832] transition-colors"
              >
                <RefreshCw size={12} /> Refresh
              </button>
            </div>
          </div>

          {/* FULL Gamification Widget */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transform hover:scale-[1.01] transition-transform duration-300 flex flex-col">
            <div className="px-5 py-4 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white flex justify-between items-center relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
              <div className="absolute right-12 -bottom-6 w-16 h-16 bg-white opacity-10 rounded-full blur-lg"></div>

              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 shadow-sm">
                  <Trophy
                    className="text-yellow-300 drop-shadow-md"
                    size={20}
                  />
                </div>
                <div>
                  <h2 className="font-bold text-base leading-tight">
                    Your Journey
                  </h2>
                  <p className="text-[9px] text-indigo-100 uppercase tracking-widest font-semibold mt-0.5">
                    Mental Wellness
                  </p>
                </div>
              </div>
              <div className="text-xs font-bold text-indigo-700 bg-white shadow-md px-3 py-1.5 rounded-full relative z-10 flex items-center gap-1.5">
                <Star className="text-yellow-400 fill-yellow-400" size={14} />{" "}
                Lvl {level}
              </div>
            </div>

            <div className="p-5 flex flex-col flex-1">
              {/* Level Progress */}
              <div className="mb-5">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <span className="font-black text-gray-800 text-lg">
                      {currentLevelXp}
                    </span>
                    <span className="text-xs font-bold text-gray-400">
                      {" "}
                      / {xpNeeded} XP
                    </span>
                  </div>
                  <span className="text-indigo-500 text-[9px] font-bold bg-indigo-50 px-2 py-1 rounded-md">
                    {xpNeeded - currentLevelXp} XP to Level {level + 1}
                  </span>
                </div>
                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner relative">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full progress-bar-striped animate-stripes relative"
                    style={{ width: `${xpProgress}%` }}
                  >
                    <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/40 blur-sm"></div>
                  </div>
                </div>
              </div>

              {/* Current Badges */}
              <div className="mt-auto">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Recent Badges
                  </h3>
                  <span className="text-[9px] font-bold text-indigo-500 cursor-pointer hover:text-indigo-700">
                    View All
                  </span>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center gap-2 group cursor-pointer relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-red-100 border-2 border-white ring-2 ring-orange-200 flex items-center justify-center shadow-md transition-all duration-300 transform group-hover:-translate-y-1 group-hover:shadow-lg">
                      <Flame
                        className="text-orange-500 drop-shadow-sm"
                        size={20}
                      />
                    </div>
                    <span className="text-[9px] font-bold text-gray-700 text-center leading-tight">
                      7-Day
                      <br />
                      Streak
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-2 group cursor-pointer relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 border-2 border-white ring-2 ring-blue-200 flex items-center justify-center shadow-md transition-all duration-300 transform group-hover:-translate-y-1 group-hover:shadow-lg">
                      <Moon
                        className="text-blue-500 drop-shadow-sm"
                        size={20}
                      />
                    </div>
                    <span className="text-[9px] font-bold text-gray-700 text-center leading-tight">
                      Sleep
                      <br />
                      Master
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-2 group cursor-pointer relative opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-gray-100 border-2 border-white ring-2 ring-gray-200 flex items-center justify-center shadow-sm border-dashed">
                      <Lock className="text-gray-400" size={16} />
                    </div>
                    <span className="text-[9px] font-bold text-gray-400 text-center leading-tight">
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

        {/* Row: Mood, Goals, Journal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-shrink-0">
          {/* Mood Card */}
          <div className="bg-white rounded-xl border border-[#F48FB1] shadow-sm overflow-hidden flex flex-col">
            <div
              onClick={() => navigate("/mood")}
              className="flex items-center justify-between px-4 py-3 text-[12px] font-bold bg-[#FCE4EC] text-[#C2185B] cursor-pointer hover:bg-[#F8D7E3] transition-colors"
            >
              <span className="flex items-center gap-1">
                Record Your Mood <ChevronRight size={14} />
              </span>
            </div>
            <div className="p-4 flex flex-col flex-1">
              <p className="text-[10px] font-bold text-gray-500 mb-2">
                How are you feeling?
              </p>
              <div className="flex gap-2 mb-3">
                {EMOJIS.map((e, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedEmoji(i);
                      setMoodScore(i * 2 + 1);
                    }}
                    className={`flex-1 h-11 rounded-xl text-xl flex items-center justify-center cursor-pointer border-[1.5px] transition-all ${
                      selectedEmoji === i
                        ? "bg-[#F48FB1] border-[#C2185B] shadow-md scale-105"
                        : "bg-[#FFF0F5] border-[#F48FB1] hover:bg-[#FCE4EC]"
                    }`}
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
                className="w-full accent-[#E91E63] mb-3"
              />
              <textarea
                value={moodNote}
                onChange={(e) => setMoodNote(e.target.value)}
                rows={1}
                placeholder="Describe your mood..."
                className="w-full bg-[#FFF5F8] border border-[#F48FB1] rounded-lg px-3 py-2 text-[10px] resize-none font-sans flex-1 focus:outline-none focus:ring-2 focus:ring-[#F48FB1]"
              />
              <button
                onClick={saveMood}
                className="w-full mt-3 py-2 bg-[#E91E63] text-white border-none rounded-lg text-[11px] font-bold cursor-pointer flex items-center justify-center gap-1.5 hover:bg-[#C2185B] transition-colors shadow-sm"
              >
                Save Mood{" "}
                <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded ml-1">
                  +25 XP
                </span>
              </button>
            </div>
          </div>

          {/* Goals Card (Active Quests Design) */}
          <div className="bg-white rounded-xl border border-[#81C784] shadow-sm overflow-hidden flex flex-col">
            <div
              onClick={() => navigate("/goals")}
              className="flex items-center justify-between px-4 py-3 text-[12px] font-bold bg-[#E8F5E9] text-[#2E7D32] cursor-pointer hover:bg-[#C8E6C9] transition-colors"
            >
              <span className="flex items-center gap-1">
                Active Quests <ChevronRight size={14} />
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/goals");
                }}
                className="bg-[#4CAF50] text-white border-none rounded-md px-2.5 py-1 text-[9px] cursor-pointer hover:bg-[#388E3C]"
              >
                View All
              </button>
            </div>
            <div className="p-3 flex flex-col flex-1 justify-center">
              {goals.length === 0 ? (
                <p className="text-[11px] text-gray-400 text-center py-4">
                  No quests active. Add one!
                </p>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {goals.map((g, idx) => (
                    <div
                      key={g.id}
                      className="bg-white rounded-xl p-2.5 border border-gray-100 shadow-sm hover:border-indigo-200 transition-colors flex items-center gap-3 relative overflow-hidden group cursor-pointer"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-100 transition-colors">
                        {idx % 2 === 0 ? (
                          <Activity className="text-indigo-500" size={16} />
                        ) : (
                          <BookOpen className="text-indigo-500" size={16} />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="text-[11px] font-bold text-gray-800 truncate pr-2">
                            {g.title}
                          </h4>
                          <span className="text-[8px] font-extrabold text-white bg-indigo-500 px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap">
                            +50 XP
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-400 rounded-full"
                              style={{ width: `${g.progress || 0}%` }}
                            ></div>
                          </div>
                          <span className="text-[9px] font-bold text-indigo-500 w-6 text-right">
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
              className="flex items-center justify-between px-4 py-3 text-[12px] font-bold bg-[#EDE7F6] text-[#512DA8] cursor-pointer hover:bg-[#D1C4E9] transition-colors"
            >
              <span className="flex items-center gap-1">
                Journal <ChevronRight size={14} />
              </span>
            </div>
            <div className="p-4 flex flex-col flex-1">
              <p className="text-[10px] font-bold text-[#7E57C2] mb-1.5">
                Today's Prompt
              </p>
              <div className="bg-[#F3EEF9] border border-[#B39DDB] rounded-lg p-2.5 mb-3">
                <p className="text-[10px] text-[#4527A0] italic leading-[1.4]">
                  What is one thing you are grateful for today?
                </p>
              </div>
              <textarea
                value={journalContent}
                onChange={(e) => setJournalContent(e.target.value)}
                rows={2}
                placeholder="Start writing..."
                className="w-full bg-[#FAF8FF] border border-[#B39DDB] rounded-lg px-3 py-2 text-[10px] resize-none font-sans flex-1 focus:outline-none focus:ring-2 focus:ring-[#9575CD]"
              />
              <button
                onClick={saveJournal}
                className="w-full mt-3 py-2 bg-[#7E57C2] text-white border-none rounded-lg text-[11px] font-bold cursor-pointer flex items-center justify-center gap-1.5 hover:bg-[#512DA8] transition-colors shadow-sm"
              >
                Save Journal{" "}
                <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded ml-1">
                  +50 XP
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Row: Resources, Crisis */}
        <div className="grid grid-cols-1 lg:grid-cols-[60fr_40fr] gap-4 flex-shrink-0">
          {/* Resources */}
          <div className="bg-white rounded-xl border border-[#64B5F6] shadow-sm overflow-hidden">
            <div
              onClick={() => navigate("/resources")}
              className="flex items-center justify-between px-4 py-3 text-[12px] font-bold bg-[#E3F2FD] text-[#1565C0] cursor-pointer hover:bg-[#BBDEFB] transition-colors"
            >
              <span className="flex items-center gap-1">
                Browse Resources <ChevronRight size={14} />
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/resources");
                }}
                className="bg-[#1976D2] text-white border-none rounded-md px-2.5 py-1 text-[9px] cursor-pointer hover:bg-[#1565C0]"
              >
                View All
              </button>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {resources.map((r) => (
                <div
                  key={r.id}
                  className="border border-gray-200 rounded-lg overflow-hidden flex sm:flex-col hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate("/resources")}
                >
                  <div
                    className={`w-16 sm:w-auto h-auto sm:h-[50px] flex items-center justify-center text-2xl flex-shrink-0 ${
                      r.type === "article"
                        ? "bg-[#E3F2FD]"
                        : r.type === "video"
                          ? "bg-[#FFEBEE]"
                          : "bg-[#E8F5E9]"
                    }`}
                  >
                    {r.type === "article"
                      ? "📄"
                      : r.type === "video"
                        ? "▶️"
                        : "📊"}
                  </div>
                  <div className="p-2.5 flex flex-col flex-1 justify-center">
                    <span
                      className={`text-[8px] font-bold text-white px-1.5 py-0.5 rounded w-max mb-1.5 ${
                        r.type === "article"
                          ? "bg-[#2196F3]"
                          : r.type === "video"
                            ? "bg-[#F44336]"
                            : "bg-[#4CAF50]"
                      }`}
                    >
                      {r.type?.toUpperCase() || "ARTICLE"}
                    </span>
                    <p className="text-[9px] font-bold mt-0.5 text-gray-800 leading-tight line-clamp-2">
                      {r.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Crisis Support */}
          <div className="bg-white rounded-xl border border-[#EF9A9A] shadow-sm overflow-hidden">
            <div className="px-4 py-3 text-[12px] font-bold bg-[#FFEBEE] text-[#C62828]">
              Crisis Support
            </div>
            <div className="p-4 flex flex-col gap-2">
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
                  <div className="w-8 h-8 bg-[#FFCDD2] rounded-full flex items-center justify-center text-sm flex-shrink-0">
                    📞
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-gray-800">
                      {h.name}
                    </p>
                    <p className="text-[10px] font-semibold text-[#C62828]">
                      {h.number}
                    </p>
                  </div>
                  <span className="text-[9px] text-gray-500 font-medium">
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
