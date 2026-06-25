// client/src/pages/Mindfulness.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import AppShell from "../components/AppShell";
import api from "../api/axios";
import toast from "react-hot-toast";
import { Wind, Clock, ChevronRight, RotateCcw } from "lucide-react";

const EXERCISES = [
  {
    id: "box",
    label: "Box Breathing",
    description: "4-4-4-4 — calm the nervous system",
    color: "#5C6BC0",
    bg: "#E8EAF6",
    phases: [
      { name: "Inhale", duration: 4, scale: 1.45 },
      { name: "Hold", duration: 4, scale: 1.45 },
      { name: "Exhale", duration: 4, scale: 1.0 },
      { name: "Hold", duration: 4, scale: 1.0 },
    ],
    tip: "Used by Navy SEALs to reduce stress before high-pressure situations.",
  },
  {
    id: "478",
    label: "4-7-8 Breathing",
    description: "Inhale 4s · Hold 7s · Exhale 8s",
    color: "#26A69A",
    bg: "#E0F2F1",
    phases: [
      { name: "Inhale", duration: 4, scale: 1.45 },
      { name: "Hold", duration: 7, scale: 1.45 },
      { name: "Exhale", duration: 8, scale: 1.0 },
    ],
    tip: "Developed by Dr. Andrew Weil. Particularly effective for anxiety and falling asleep.",
  },
  {
    id: "diaphragmatic",
    label: "Diaphragmatic",
    description: "5-2-5 — deep belly breathing",
    color: "#EF6C00",
    bg: "#FFF3E0",
    phases: [
      { name: "Inhale", duration: 5, scale: 1.45 },
      { name: "Hold", duration: 2, scale: 1.45 },
      { name: "Exhale", duration: 5, scale: 1.0 },
    ],
    tip: "Activates the parasympathetic nervous system. Best done lying down or seated.",
  },
];

const GROUNDING_STEPS = [
  { sense: "See", count: 5, prompt: "Name 5 things you can SEE right now." },
  {
    sense: "Touch",
    count: 4,
    prompt: "Name 4 things you can TOUCH around you.",
  },
  { sense: "Hear", count: 3, prompt: "Name 3 things you can HEAR right now." },
  {
    sense: "Smell",
    count: 2,
    prompt: "Name 2 things you can SMELL (or like to smell).",
  },
  { sense: "Taste", count: 1, prompt: "Name 1 thing you can TASTE right now." },
];

function BreathingCircle({ phase, scale, color, bg, countdown }) {
  return (
    <div className="flex flex-col items-center justify-center py-6">
      <div
        className="rounded-full flex items-center justify-center transition-all duration-1000 ease-in-out"
        style={{
          width: 120,
          height: 120,
          transform: `scale(${scale})`,
          backgroundColor: bg,
          border: `3px solid ${color}`,
          boxShadow: `0 0 ${scale > 1.2 ? 32 : 8}px ${color}55`,
        }}
      >
        <div className="text-center">
          <div className="text-[13px] font-bold" style={{ color }}>
            {phase}
          </div>
          <div className="text-[22px] font-bold text-gray-700">{countdown}</div>
        </div>
      </div>
    </div>
  );
}

function BreathingExercise({ exercise, onComplete }) {
  const [state, setState] = useState({
    running: false,
    phaseIdx: 0,
    countdown: exercise.phases[0].duration,
    cycleCount: 0,
    elapsed: 0,
  });

  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  const clearTicker = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const reset = useCallback(() => {
    clearTicker();
    startTimeRef.current = null;
    setState({
      running: false,
      phaseIdx: 0,
      countdown: exercise.phases[0].duration,
      cycleCount: 0,
      elapsed: 0,
    });
  }, [exercise.phases]);

  const stop = useCallback(() => {
    clearTicker();
    const totalSeconds = startTimeRef.current
      ? Math.floor((Date.now() - startTimeRef.current) / 1000)
      : 0;
    if (totalSeconds >= 30) {
      setState((prev) => {
        onComplete(exercise.id, totalSeconds, prev.cycleCount);
        return {
          running: false,
          phaseIdx: 0,
          countdown: exercise.phases[0].duration,
          cycleCount: 0,
          elapsed: 0,
        };
      });
    } else {
      toast("Session too short — complete at least 30 seconds to log.", {
        icon: "⏱",
      });
      reset();
    }
    startTimeRef.current = null;
  }, [exercise, onComplete, reset]);

  useEffect(() => {
    if (!state.running) return;

    if (!startTimeRef.current) {
      startTimeRef.current = Date.now();
    }

    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setState((prev) => {
        if (!prev.running) return prev;
        if (prev.countdown > 1) {
          return { ...prev, countdown: prev.countdown - 1, elapsed };
        }
        const nextPhaseIdx = (prev.phaseIdx + 1) % exercise.phases.length;
        const nextCycleCount =
          nextPhaseIdx === 0 ? prev.cycleCount + 1 : prev.cycleCount;
        return {
          ...prev,
          phaseIdx: nextPhaseIdx,
          countdown: exercise.phases[nextPhaseIdx].duration,
          cycleCount: nextCycleCount,
          elapsed,
        };
      });
    }, 1000);

    return clearTicker;
  }, [state.running, exercise.phases]);

  useEffect(() => () => clearTicker(), []);

  const formatTime = (s) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const currentPhase = exercise.phases[state.phaseIdx];

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-[10px] text-gray-500 text-center max-w-xs">
        {exercise.tip}
      </p>

      <BreathingCircle
        phase={currentPhase.name}
        scale={state.running ? currentPhase.scale : 1.0}
        color={exercise.color}
        bg={exercise.bg}
        countdown={state.countdown}
      />

      <div className="flex gap-6 text-center">
        <div>
          <div className="text-[9px] text-gray-400">Cycle</div>
          <div className="text-[16px] font-bold text-gray-700">
            {state.cycleCount}
          </div>
        </div>
        <div>
          <div className="text-[9px] text-gray-400">Elapsed</div>
          <div className="text-[16px] font-bold text-gray-700">
            {formatTime(state.elapsed)}
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-1">
        {!state.running ? (
          <button
            onClick={() => setState((prev) => ({ ...prev, running: true }))}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-[11px] font-bold border-none cursor-pointer hover:opacity-80 transition-opacity"
            style={{ backgroundColor: exercise.color }}
          >
            <Wind size={13} /> Start
          </button>
        ) : (
          <button
            onClick={stop}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-700 text-white rounded-xl text-[11px] font-bold border-none cursor-pointer hover:bg-gray-800 transition-colors"
          >
            Stop & Save
          </button>
        )}
        <button
          onClick={reset}
          className="flex items-center gap-1.5 px-3 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-[11px] font-bold border-none cursor-pointer hover:bg-gray-200 transition-colors"
        >
          <RotateCcw size={12} /> Reset
        </button>
      </div>
    </div>
  );
}

function GroundingExercise({ onComplete }) {
  const [step, setStep] = useState(0);
  const [inputs, setInputs] = useState(Array(GROUNDING_STEPS.length).fill(""));
  const [done, setDone] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const startRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    startRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleNext = () => {
    if (!inputs[step].trim()) {
      toast.error("Please write something first.");
      return;
    }
    if (step < GROUNDING_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setDone(true);
      onComplete("grounding", elapsed, 1);
    }
  };

  const current = GROUNDING_STEPS[step];

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 py-8">
        <div className="text-4xl">✅</div>
        <p className="text-[13px] font-bold text-gray-700">
          Grounding complete!
        </p>
        <p className="text-[11px] text-gray-500 text-center max-w-xs">
          You've reconnected with the present moment. Take a breath and notice
          how you feel.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-1">
        {GROUNDING_STEPS.map((_, i) => (
          <div
            key={i}
            className="h-1.5 flex-1 rounded-full transition-all"
            style={{ backgroundColor: i <= step ? "#5C6BC0" : "#E0E0E0" }}
          />
        ))}
      </div>

      <div className="bg-[#E8EAF6] rounded-xl p-4 text-center">
        <div className="text-[22px] font-bold text-[#5C6BC0]">
          {current.count}
        </div>
        <div className="text-[12px] font-bold text-gray-700 mt-1">
          {current.prompt}
        </div>
      </div>

      <textarea
        value={inputs[step]}
        onChange={(e) =>
          setInputs((prev) => {
            const copy = [...prev];
            copy[step] = e.target.value;
            return copy;
          })
        }
        placeholder={`Write ${current.count} ${current.sense.toLowerCase()} thing${
          current.count > 1 ? "s" : ""
        }...`}
        rows={3}
        className="w-full bg-[#F8F9FA] border border-gray-300 rounded-lg px-3 py-2.5 text-[11px] text-gray-800 resize-none"
      />

      <button
        onClick={handleNext}
        className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#5C6BC0] text-white rounded-xl text-[11px] font-bold border-none cursor-pointer hover:bg-[#4a5aa8] transition-colors"
      >
        {step < GROUNDING_STEPS.length - 1 ? (
          <>
            {" "}
            Next <ChevronRight size={13} />{" "}
          </>
        ) : (
          "Finish ✓"
        )}
      </button>
    </div>
  );
}

const TYPE_META = {
  box: { label: "Box Breathing", color: "#5C6BC0" },
  478: { label: "4-7-8 Breathing", color: "#26A69A" },
  diaphragmatic: { label: "Diaphragmatic", color: "#EF6C00" },
  grounding: { label: "5-4-3-2-1 Grounding", color: "#8E24AA" },
};

function SessionHistory({ sessions }) {
  const formatTime = (s) =>
    s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`;

  if (!sessions.length) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-gray-400">
        <div className="text-4xl mb-2">🧘</div>
        <p className="text-[12px] font-semibold">No sessions yet</p>
        <p className="text-[10px] mt-1">
          Complete an exercise to see history here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {sessions.map((s) => {
        const meta = TYPE_META[s.exercisetype] ?? {
          label: s.exercisetype,
          color: "#607D8B",
        };
        return (
          <div
            key={s.id}
            className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-2 h-10 rounded-full flex-shrink-0"
                style={{ backgroundColor: meta.color }}
              />
              <div>
                <div
                  className="text-[11px] font-bold"
                  style={{ color: meta.color }}
                >
                  {meta.label}
                </div>
                <div className="text-[9px] text-gray-400 mt-0.5">
                  {new Date(s.createdat).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[13px] font-bold text-gray-700">
                {formatTime(s.durationseconds)}
              </div>
              {s.cycles > 0 && (
                <div className="text-[9px] text-gray-400">
                  {s.cycles} {s.cycles === 1 ? "cycle" : "cycles"}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const TABS = ["Breathing", "Grounding", "History"];

export default function Mindfulness() {
  const [activeTab, setActiveTab] = useState("Breathing");
  const [activeExercise, setActiveExercise] = useState(EXERCISES[0]);
  const [sessions, setSessions] = useState([]);
  const [totalXp, setTotalXp] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get("/api/sessions");
        if (!cancelled) {
          setSessions(data.sessions ?? []);
          setTotalXp(data.totalXp ?? 0);
        }
      } catch {
        if (!cancelled) toast.error("Failed to load session history");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const handleComplete = useCallback(
    async (exerciseType, durationSeconds, cycles) => {
      try {
        await api.post("/api/sessions", {
          exercisetype: exerciseType,
          durationseconds: durationSeconds,
          cycles,
        });
        toast.success(
          `Session saved! +${durationSeconds >= 120 ? 30 : 15} XP 🧘`,
        );
        setRefreshKey((k) => k + 1);
      } catch {
        toast.error("Failed to save session");
      }
    },
    [],
  );

  return (
    <AppShell>
      <div className="flex flex-col gap-3 h-full">
        {/* Header */}
        <div className="flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-[17px] font-bold text-navy">Mindfulness</h1>
            <p className="text-[10px] text-gray-500 mt-0.5">
              Breathing exercises & grounding techniques
            </p>
          </div>
          {totalXp > 0 && (
            <div className="bg-[#5C6BC0] text-white rounded-xl px-4 py-2 text-center">
              <div className="text-[8px] font-bold uppercase tracking-wider opacity-80">
                Mindfulness XP
              </div>
              <div className="text-[18px] font-bold leading-tight">
                ✨ {totalXp}
              </div>
            </div>
          )}
        </div>

        {/* Tab Bar */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 flex-shrink-0">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg text-[11px] font-bold border-none cursor-pointer transition-all
                ${
                  activeTab === tab
                    ? "bg-white text-navy shadow-sm"
                    : "bg-transparent text-gray-500 hover:text-gray-700"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "Breathing" && (
            <div className="flex flex-col gap-3">
              {/* Exercise selector */}
              <div className="grid grid-cols-3 gap-2">
                {EXERCISES.map((ex) => (
                  <button
                    key={ex.id}
                    onClick={() => setActiveExercise(ex)}
                    className="p-3 rounded-xl border-[1.5px] text-left cursor-pointer transition-all hover:shadow-md"
                    style={{
                      borderColor:
                        activeExercise.id === ex.id ? ex.color : "#E0E0E0",
                      backgroundColor:
                        activeExercise.id === ex.id ? ex.bg : "white",
                    }}
                  >
                    <div
                      className="text-[10px] font-bold leading-tight"
                      style={{
                        color: activeExercise.id === ex.id ? ex.color : "#555",
                      }}
                    >
                      {ex.label}
                    </div>
                    <div className="text-[8px] text-gray-400 mt-0.5">
                      {ex.description}
                    </div>
                  </button>
                ))}
              </div>

              {/* Active exercise card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                <div className="text-center mb-2">
                  <span
                    className="text-[13px] font-bold"
                    style={{ color: activeExercise.color }}
                  >
                    {activeExercise.label}
                  </span>
                </div>
                <BreathingExercise
                  key={activeExercise.id}
                  exercise={activeExercise}
                  onComplete={handleComplete}
                />
              </div>

              {/* Phase legend */}
              <div className="bg-white rounded-xl border border-gray-200 px-4 py-3">
                <div className="text-[9px] font-bold text-gray-500 mb-2 uppercase tracking-wider">
                  Phase Guide
                </div>
                <div className="flex gap-3">
                  {activeExercise.phases.map((p, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: activeExercise.color }}
                      />
                      <span className="text-[9px] text-gray-600">
                        {p.name}{" "}
                        <span className="text-gray-400">{p.duration}s</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "Grounding" && (
            <div className="flex flex-col gap-3">
              <div className="bg-[#F3E5F5] rounded-xl px-4 py-3">
                <div className="text-[11px] font-bold text-[#8E24AA]">
                  5-4-3-2-1 Grounding Technique
                </div>
                <div className="text-[9px] text-[#8E24AA]/80 mt-0.5">
                  Anchors you to the present moment. Effective for anxiety and
                  panic.
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                <GroundingExercise
                  key={activeTab}
                  onComplete={handleComplete}
                />
              </div>
            </div>
          )}

          {activeTab === "History" && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Clock size={13} className="text-gray-400" />
                <span className="text-[11px] text-gray-500">
                  {sessions.length} session{sessions.length !== 1 ? "s" : ""}{" "}
                  logged
                </span>
              </div>
              <SessionHistory sessions={sessions} />
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
