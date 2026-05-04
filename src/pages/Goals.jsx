// client/src/pages/Goals.jsx
import { useState, useEffect } from "react";
import AppShell from "../components/AppShell";
import api from "../api/axios";
import toast from "react-hot-toast";
import { Plus, Trash2, X } from "lucide-react";

const CATEGORY_META = {
  exercise: {
    icon: "🏃",
    color: "#FF6B6B",
    bg: "#FFD6D6",
    border: "#FF6B6B",
    label: "Exercise Goal",
  },
  sleep: {
    icon: "😴",
    color: "#42A5F5",
    bg: "#D6EAFF",
    border: "#42A5F5",
    label: "Sleep Goal",
  },
  mental_health: {
    icon: "🧠",
    color: "#AB47BC",
    bg: "#EDD6FF",
    border: "#AB47BC",
    label: "Mental Health Goal",
  },
};

const CATEGORY_DESCRIPTIONS = {
  exercise: "Steps, workouts, duration",
  sleep: "Sleep quality and duration",
  mental_health: "Mindfulness and self-care",
};

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selCategory, setSelCategory] = useState("exercise");
  const [form, setForm] = useState({
    title: "",
    target: "",
    category: "exercise",
  });
  const [loading, setLoading] = useState(false);

  const fetchGoals = async () => {
    try {
      const { data } = await api.get("/api/goals");
      setGoals(data);
    } catch {
      toast.error("Failed to load goals");
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleCreate = async () => {
    if (!form.title.trim()) return toast.error("Title is required");
    setLoading(true);
    try {
      await api.post("/api/goals", { ...form, category: selCategory });
      toast.success("Goal created!");
      setShowModal(false);
      setForm({ title: "", target: "", category: "exercise" });
      fetchGoals();
    } catch {
      toast.error("Failed to create goal");
    } finally {
      setLoading(false);
    }
  };

  const handleProgressChange = async (id, progress) => {
    try {
      await api.patch(`/api/goals/${id}`, { progress });
      setGoals((prev) =>
        prev.map((g) => (g.id === id ? { ...g, progress } : g)),
      );
    } catch {
      toast.error("Failed to update");
    }
  };

  const handleStreakIncrement = async (id, streak) => {
    const newStreak = streak + 1;
    try {
      await api.patch(`/api/goals/${id}`, { streak: newStreak });
      setGoals((prev) =>
        prev.map((g) => (g.id === id ? { ...g, streak: newStreak } : g)),
      );
      toast.success("Streak updated! 🔥");
    } catch {
      toast.error("Failed to update streak");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/goals/${id}`);
      toast.success("Goal deleted");
      fetchGoals();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const maxStreak = goals.length ? Math.max(...goals.map((g) => g.streak)) : 0;

  return (
    <AppShell>
      <div className="flex flex-col gap-3 h-full">
        {/* Header */}
        <div className="flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-[17px] font-bold text-navy">🎯 My Goals</h1>
            <p className="text-[10px] text-gray-500 mt-0.5">
              Set targets, track progress, and maintain streaks
            </p>
          </div>
          {maxStreak > 0 && (
            <div className="bg-[#FF9800] text-white rounded-xl px-4 py-2 text-center">
              <div className="text-[8px] font-bold uppercase tracking-wider opacity-80">
                Current Streak
              </div>
              <div className="text-[20px] font-bold leading-tight">
                🔥 {maxStreak} Days
              </div>
            </div>
          )}
        </div>

        {/* Category Cards + Add Button */}
        <div className="flex gap-3 flex-shrink-0">
          {Object.entries(CATEGORY_META).map(([key, meta]) => (
            <button
              key={key}
              onClick={() => {
                setSelCategory(key);
                setShowModal(true);
              }}
              className={`flex-1 bg-white border-[1.5px] rounded-xl p-3 text-left cursor-pointer transition-all hover:shadow-md
                ${selCategory === key ? `border-[${meta.border}] shadow-md` : "border-gray-200"}`}
              style={{
                borderColor: selCategory === key ? meta.border : "#E0E0E0",
              }}
            >
              <div className="text-2xl mb-1">{meta.icon}</div>
              <div className="text-[11px] font-bold text-gray-800">
                {key.charAt(0).toUpperCase() + key.slice(1).replace("_", " ")}
              </div>
              <div className="text-[9px] text-gray-500">
                {CATEGORY_DESCRIPTIONS[key]}
              </div>
            </button>
          ))}
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-navy text-white border-none rounded-xl px-5 py-3 text-[11px] font-bold cursor-pointer hover:bg-[#0c2e4e] transition-colors"
          >
            <Plus size={14} /> Set New Goal
          </button>
        </div>

        {/* Active Goals List */}
        <div className="flex-1 overflow-y-auto">
          <h2 className="text-[12px] font-bold text-gray-600 mb-2">
            Active Goals
          </h2>

          {goals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <div className="text-5xl mb-3">🎯</div>
              <p className="text-[13px] font-semibold">No goals yet</p>
              <p className="text-[11px] mt-1">
                Click a category above to set your first goal.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {goals.map((goal) => {
                const meta =
                  CATEGORY_META[goal.category] || CATEGORY_META.exercise;
                return (
                  <div
                    key={goal.id}
                    className="bg-white rounded-xl border-[1.5px] overflow-hidden"
                    style={{ borderColor: meta.border }}
                  >
                    {/* Progress bar header */}
                    <div
                      className="px-4 py-1.5"
                      style={{ backgroundColor: meta.bg }}
                    >
                      <div className="flex justify-between items-center text-[9px] font-bold mb-1">
                        <span>{goal.title}</span>
                        <span style={{ color: meta.color }}>
                          {goal.progress}% completed
                        </span>
                      </div>
                      <div className="h-2.5 bg-white/50 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${goal.progress}%`,
                            backgroundColor: meta.color,
                          }}
                        />
                      </div>
                    </div>

                    <div className="p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{meta.icon}</span>
                        <span className="text-[11px] font-bold text-gray-700">
                          {meta.label}
                        </span>
                        {goal.target && (
                          <span className="text-[9px] text-gray-400">
                            • {goal.target}
                          </span>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        {[
                          { label: "Progress", value: `${goal.progress}%` },
                          { label: "Streak", value: `${goal.streak} days` },
                          {
                            label: "Status",
                            value:
                              goal.progress >= 100 ? "✅ Done" : "🟡 Active",
                          },
                        ].map((s) => (
                          <div
                            key={s.label}
                            className="bg-[#F8F9FA] rounded-lg p-2 text-center"
                          >
                            <div className="text-[8px] text-gray-400">
                              {s.label}
                            </div>
                            <div
                              className="text-[13px] font-bold"
                              style={{ color: meta.color }}
                            >
                              {s.value}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-2">
                        <label className="text-[9px] text-gray-500 flex-shrink-0">
                          Progress:
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={goal.progress}
                          onChange={(e) =>
                            handleProgressChange(
                              goal.id,
                              Number(e.target.value),
                            )
                          }
                          className="flex-1"
                          style={{ accentColor: meta.color }}
                        />
                        <span
                          className="text-[9px] font-bold w-8 text-right"
                          style={{ color: meta.color }}
                        >
                          {goal.progress}%
                        </span>
                        <button
                          onClick={() =>
                            handleStreakIncrement(goal.id, goal.streak)
                          }
                          className="text-[9px] font-bold text-white border-none rounded-md px-2.5 py-1.5 cursor-pointer hover:opacity-80 transition-opacity"
                          style={{ backgroundColor: meta.color }}
                        >
                          🔥 +Streak
                        </button>
                        <button
                          onClick={() => handleDelete(goal.id)}
                          className="text-gray-300 hover:text-[#EF5350] transition-colors border-none bg-transparent cursor-pointer p-1"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Create Goal Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-[420px] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 bg-navy text-white">
              <h3 className="text-[14px] font-bold">Set New Goal</h3>
              <button
                onClick={() => setShowModal(false)}
                className="border-none bg-transparent text-white cursor-pointer hover:opacity-70"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              {/* Category selector */}
              <div>
                <label className="text-[10px] font-bold text-gray-600 block mb-2">
                  Goal Category
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(CATEGORY_META).map(([key, meta]) => (
                    <button
                      key={key}
                      onClick={() => setSelCategory(key)}
                      className={`p-2.5 rounded-lg border-[1.5px] text-center cursor-pointer transition-all
                        ${selCategory === key ? "border-current text-white" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"}`}
                      style={
                        selCategory === key
                          ? {
                              backgroundColor: meta.color,
                              borderColor: meta.color,
                            }
                          : {}
                      }
                    >
                      <div className="text-xl mb-0.5">{meta.icon}</div>
                      <div className="text-[9px] font-bold">
                        {key.replace("_", " ")}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="text-[10px] font-bold text-gray-600 block mb-1">
                  Goal Title *
                </label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder={
                    selCategory === "exercise"
                      ? "e.g. Run 5km three times a week"
                      : selCategory === "sleep"
                        ? "e.g. Sleep 7–8 hours every night"
                        : "e.g. Meditate 10 minutes daily"
                  }
                  className="w-full bg-[#F8F9FA] border border-gray-300 rounded-lg px-3 py-2.5 text-[11px] text-gray-800"
                />
              </div>

              {/* Target */}
              <div>
                <label className="text-[10px] font-bold text-gray-600 block mb-1">
                  Target Details
                </label>
                <input
                  value={form.target}
                  onChange={(e) => setForm({ ...form, target: e.target.value })}
                  placeholder="e.g. 30 days duration, 3x per week"
                  className="w-full bg-[#F8F9FA] border border-gray-300 rounded-lg px-3 py-2.5 text-[11px] text-gray-800"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-600 border-none rounded-lg text-[11px] cursor-pointer hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={loading}
                  className="flex-1 py-2.5 bg-navy text-white border-none rounded-lg text-[11px] font-bold cursor-pointer disabled:opacity-50 hover:bg-[#0c2e4e] transition-colors"
                >
                  {loading ? "Creating..." : "+ Create Goal"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
