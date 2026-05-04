// client/src/pages/Journal.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import AppShell from "../components/AppShell";
import api from "../api/axios";
import toast from "react-hot-toast";
import { Trash2, Camera, X } from "lucide-react";

// ─── Constants ────────────────────────────────────────────────
const PROMPTS = [
  {
    id: 14,
    text: "What is one thing you are grateful for today, and why does it matter to you?",
    tag: "Gratitude",
  },
  {
    id: 22,
    text: "Describe a moment today where you felt at peace. What made it special?",
    tag: "Mindfulness",
  },
  {
    id: 7,
    text: "What challenge did you face today and how did you handle it?",
    tag: "Resilience",
  },
  {
    id: 31,
    text: "Write about someone who made you smile recently and why.",
    tag: "Connection",
  },
];

const TAG_COLORS = {
  Gratitude: { bg: "#FFF9C4", text: "#F57F17", border: "#FFD54F" },
  Mindfulness: { bg: "#E8F5E9", text: "#2E7D32", border: "#81C784" },
  Resilience: { bg: "#E3F2FD", text: "#1565C0", border: "#64B5F6" },
  Connection: { bg: "#FCE4EC", text: "#C2185B", border: "#F48FB1" },
};

// ─── Component ────────────────────────────────────────────────
export default function Journal() {
  const [entries, setEntries] = useState([]);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [content, setContent] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [mode, setMode] = useState("text"); // 'text' | 'creative'
  const [loading, setLoading] = useState(false);
  const [drawTool, setDrawTool] = useState("pen");
  const [penColor, setPenColor] = useState("#7E57C2");
  const [history, setHistory] = useState([]);

  const fileRef = useRef(null);
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  // Keep canvas alive across mode switches so drawings aren't lost
  const canvasInitialized = useRef(false);

  // ── Fetch entries ──────────────────────────────────────────
  const fetchEntries = async () => {
    try {
      const { data } = await api.get("/api/journal");
      setEntries(data);
    } catch {
      toast.error("Failed to load entries");
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  // ── Canvas: sync internal pixel size to displayed CSS size ──
  // BUG FIX #1: If the canvas HTML width/height attrs don't match the
  // rendered CSS size, every mouse position will be offset.
  const syncCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== rect.width || canvas.height !== rect.height) {
      // Save drawing before resize
      const snapshot = canvas.toDataURL();
      canvas.width = rect.width;
      canvas.height = rect.height;
      // Restore drawing + ensure white background after resize
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (snapshot && history.length > 0) {
        const img = new Image();
        img.src = snapshot;
        img.onload = () =>
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
    }
  }, [history.length]);

  // ── Canvas: initialize white background on first render ──────
  // BUG FIX #2: HTML5 canvas is transparent by default.
  // Without filling white, saved PNGs have a black/transparent background.
  useEffect(() => {
    if (mode !== "creative") return;
    // Use requestAnimationFrame so the canvas is painted & sized by browser first
    const raf = requestAnimationFrame(() => {
      const canvas = canvasRef.current;
      if (!canvas || canvasInitialized.current) return;
      syncCanvasSize();
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      canvasInitialized.current = true;
    });
    return () => cancelAnimationFrame(raf);
  }, [mode, syncCanvasSize]);

  // ── Canvas: handle window resize ─────────────────────────────
  useEffect(() => {
    if (mode !== "creative") return;
    const observer = new ResizeObserver(syncCanvasSize);
    if (canvasRef.current) observer.observe(canvasRef.current);
    return () => observer.disconnect();
  }, [mode, syncCanvasSize]);

  // ── Canvas: get mouse/touch position relative to canvas ──────
  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    // Support both mouse events and touch events
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    // Scale from CSS pixels to canvas pixels
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDraw = (e) => {
    e.preventDefault();
    isDrawing.current = true;
    lastPos.current = getPos(e);
    // Save current state to history for undo
    setHistory((prev) => [...prev, canvasRef.current.toDataURL()]);
  };

  const draw = (e) => {
    e.preventDefault();
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const pos = getPos(e);

    ctx.lineWidth = drawTool === "eraser" ? 24 : 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = drawTool === "eraser" ? "#FFFFFF" : penColor;
    ctx.globalCompositeOperation =
      drawTool === "eraser" ? "destination-out" : "source-over";

    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPos.current = pos;
  };

  const endDraw = (e) => {
    if (e) e.preventDefault();
    isDrawing.current = false;
    // Reset composite op after eraser
    if (canvasRef.current) {
      canvasRef.current.getContext("2d").globalCompositeOperation =
        "source-over";
    }
  };

  const undoDraw = () => {
    if (history.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const prev = history[history.length - 1];
    const img = new Image();
    img.src = prev;
    img.onload = () => {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    setHistory((h) => h.slice(0, -1));
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHistory([]);
  };

  // ── Photo upload ──────────────────────────────────────────────
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File must be under 10MB");
      return;
    }
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  // ── Save entry ────────────────────────────────────────────────
  // BUG FIX #3: The previous version called `afterSave` inside an async
  // callback inside `handleSave`, but `afterSave` was defined with `const`
  // AFTER `handleSave` — this is safe at call-time but confusing and
  // hard to maintain. Restructured so the flow is linear.
  const handleSave = async () => {
    if (mode === "text" && !content.trim()) {
      toast.error("Write something before saving");
      return;
    }
    if (mode === "creative" && history.length === 0 && !content.trim()) {
      toast.error("Draw or write something before saving");
      return;
    }
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("content", content.trim() || "Drawing entry");
      if (selectedPrompt) {
        formData.append(
          "prompt",
          `Prompt #${selectedPrompt.id} • ${selectedPrompt.tag} — ${selectedPrompt.text}`,
        );
      }

      if (mode === "creative") {
        // Capture canvas as a PNG blob and attach it
        await new Promise((resolve, reject) => {
          canvasRef.current.toBlob((blob) => {
            if (blob) {
              formData.append("photo", blob, "drawing.png");
              resolve();
            } else {
              reject(new Error("Failed to generate image from canvas"));
            }
          }, "image/png");
        });
      } else if (photo) {
        formData.append("photo", photo);
      }

      await api.post("/api/journal", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Journal entry saved!");
      setContent("");
      setSelectedPrompt(null);
      setPhoto(null);
      setPhotoPreview(null);
      clearCanvas();
      canvasInitialized.current = false; // allow re-init on next creative mode open
      fetchEntries();
    } catch {
      toast.error("Failed to save entry");
    } finally {
      setLoading(false);
    }
  };

  // ── Delete entry ──────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/journal/${id}`);
      toast.success("Entry deleted");
      fetchEntries();
    } catch {
      toast.error("Failed to delete");
    }
  };

  // ── Entry type badge ──────────────────────────────────────────
  const getEntryBadge = (entry) => {
    if (entry.photo_url && entry.content === "Drawing entry")
      return { icon: "🖌️", label: "Drawing", color: "#9575CD", bg: "#EDE7F6" };
    if (entry.photo_url)
      return { icon: "🖼️", label: "Photo", color: "#1976D2", bg: "#E3F2FD" };
    return { icon: "✍️", label: "Text", color: "#43A047", bg: "#E8F5E9" };
  };

  // ─── Render ───────────────────────────────────────────────────
  return (
    <AppShell>
      <div className="flex flex-col gap-3 h-full">
        {/* Page header */}
        <div className="flex-shrink-0">
          <h1 className="text-[17px] font-bold text-navy">📓 Journal</h1>
          <p className="text-[10px] text-gray-500 mt-0.5">
            Reflect, write, and express your thoughts freely
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-[1fr_320px] gap-3 flex-1 overflow-hidden min-h-0">
          {/* ── LEFT: Prompts + Write ─────────────────────────── */}
          <div className="flex flex-col gap-3 overflow-y-auto pr-1">
            {/* Today's Journal Prompts */}
            <div className="bg-white rounded-xl border border-[#B39DDB] flex-shrink-0">
              <div className="px-3.5 py-2.5 text-[12px] font-bold text-[#512DA8] bg-[#EDE7F6] rounded-t-xl">
                💬 Today's Journal Prompts
              </div>
              <div className="p-3 grid grid-cols-2 gap-2">
                {PROMPTS.map((p) => {
                  const colors = TAG_COLORS[p.tag];
                  const isActive = selectedPrompt?.id === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPrompt(isActive ? null : p)}
                      className={`text-left p-3 rounded-xl border-[1.5px] cursor-pointer transition-all
                        ${
                          isActive
                            ? "border-[#7E57C2] bg-[#F3EEF9] ring-2 ring-[#9575CD]/30"
                            : "border-gray-200 bg-white hover:border-[#B39DDB] hover:bg-[#FAF8FF]"
                        }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span
                          className="text-[8px] font-bold px-2 py-0.5 rounded-full border"
                          style={{
                            backgroundColor: colors.bg,
                            color: colors.text,
                            borderColor: colors.border,
                          }}
                        >
                          {p.tag}
                        </span>
                        <span className="text-[8px] text-gray-400">
                          Prompt #{p.id}
                        </span>
                      </div>
                      <p className="text-[9px] text-gray-700 italic leading-[1.5] line-clamp-3">
                        "{p.text}"
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Write Your Entry */}
            <div className="bg-white rounded-xl border border-[#B39DDB] flex-shrink-0">
              {/* Header */}
              <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#EDE7F6] rounded-t-xl">
                <span className="text-[12px] font-bold text-[#512DA8]">
                  ✍️ Write Your Entry —{" "}
                  {new Date().toLocaleDateString("en-MY", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <span className="text-[9px] text-gray-500 tabular-nums">
                  {wordCount} {wordCount === 1 ? "word" : "words"}
                </span>
              </div>

              {/* Mode tabs */}
              <div className="flex border-b border-gray-100">
                {[
                  ["text", "✏️ Write"],
                  ["creative", "🎨 Creative Mode"],
                ].map(([m, label]) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`flex-1 py-2 text-[10px] font-bold border-none cursor-pointer transition-colors
                      ${
                        mode === m
                          ? "bg-[#EDE7F6] text-[#512DA8]"
                          : "bg-white text-gray-400 hover:bg-gray-50"
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="p-3">
                {/* Selected prompt banner */}
                {selectedPrompt && (
                  <div className="bg-[#F3EEF9] border border-[#B39DDB] rounded-lg p-2.5 mb-3 flex items-start justify-between gap-2">
                    <div>
                      <span
                        className="text-[7px] font-bold px-1.5 py-0.5 rounded-full border mr-2"
                        style={{
                          backgroundColor: TAG_COLORS[selectedPrompt.tag].bg,
                          color: TAG_COLORS[selectedPrompt.tag].text,
                          borderColor: TAG_COLORS[selectedPrompt.tag].border,
                        }}
                      >
                        {selectedPrompt.tag}
                      </span>
                      <span className="text-[8px] text-gray-400">
                        Prompt #{selectedPrompt.id}
                      </span>
                      <p className="text-[9px] text-[#4527A0] italic leading-[1.5] mt-1">
                        "{selectedPrompt.text}"
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedPrompt(null)}
                      className="border-none bg-transparent cursor-pointer text-gray-400 hover:text-gray-600 flex-shrink-0"
                      aria-label="Remove prompt"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}

                {/* ── TEXT MODE ─────────────────────────────── */}
                {mode === "text" && (
                  <>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={7}
                      placeholder={
                        selectedPrompt
                          ? `Respond to the prompt: "${selectedPrompt.text.substring(0, 60)}..."`
                          : "Start writing your thoughts freely..."
                      }
                      className="w-full bg-[#FAF8FF] border border-[#B39DDB] rounded-lg px-3 py-2.5 text-[10px] resize-none font-sans leading-[1.7] mb-3 focus:outline-none focus:ring-2 focus:ring-[#9575CD]/30"
                    />

                    {/* Photo upload */}
                    <div className="mb-3">
                      <p className="text-[9px] font-bold text-gray-600 mb-1.5">
                        🖼️ Attach Photo{" "}
                        <span className="text-gray-400 font-normal">
                          (optional)
                        </span>
                      </p>
                      <div
                        onClick={() => fileRef.current?.click()}
                        className="border-2 border-dashed border-[#B39DDB] rounded-lg bg-[#FAF8FF] h-[64px] flex items-center justify-center cursor-pointer text-[#7E57C2] text-[10px] gap-2 hover:bg-[#EDE7F6] transition-colors overflow-hidden"
                      >
                        {photoPreview ? (
                          <div className="relative w-full h-full">
                            <img
                              src={photoPreview}
                              alt="preview"
                              className="w-full h-full object-contain"
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setPhoto(null);
                                setPhotoPreview(null);
                              }}
                              className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 border-none cursor-pointer"
                              aria-label="Remove photo"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ) : (
                          <>
                            <Camera size={14} />
                            <span>Upload Photo — JPG, PNG, GIF up to 10MB</span>
                          </>
                        )}
                      </div>
                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/jpeg,image/png,image/gif"
                        className="hidden"
                        onChange={handlePhotoChange}
                      />
                    </div>
                  </>
                )}

                {/* ── CREATIVE MODE ────────────────────────── */}
                {/* Keep the textarea mounted even in creative mode so content isn't lost on switch */}
                <div className={mode === "creative" ? "block" : "hidden"}>
                  {/* Textarea for optional caption */}
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={2}
                    placeholder="Add a caption for your drawing (optional)..."
                    className="w-full bg-[#FAF8FF] border border-[#B39DDB] rounded-lg px-3 py-2 text-[10px] resize-none font-sans mb-3 focus:outline-none focus:ring-2 focus:ring-[#9575CD]/30"
                  />

                  {/* Toolbar */}
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <div className="flex gap-1">
                      {[
                        ["pen", "✏️ Pen"],
                        ["eraser", "◻ Eraser"],
                      ].map(([t, label]) => (
                        <button
                          key={t}
                          onClick={() => setDrawTool(t)}
                          className={`text-[9px] px-3 py-1.5 rounded-md border cursor-pointer transition-colors
                            ${
                              drawTool === t
                                ? "bg-[#7E57C2] text-white border-[#7E57C2]"
                                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                            }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    {/* Pen color picker */}
                    {drawTool === "pen" && (
                      <div className="flex gap-1 items-center">
                        {[
                          "#7E57C2",
                          "#E91E63",
                          "#1976D2",
                          "#43A047",
                          "#FF5722",
                          "#000000",
                        ].map((c) => (
                          <button
                            key={c}
                            onClick={() => setPenColor(c)}
                            title={c}
                            className={`w-5 h-5 rounded-full border-2 cursor-pointer transition-transform hover:scale-110
                              ${penColor === c ? "border-gray-700 scale-110" : "border-transparent"}`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    )}
                    <div className="flex gap-1 ml-auto">
                      <button
                        onClick={undoDraw}
                        disabled={history.length === 0}
                        className="text-[9px] px-3 py-1.5 rounded-md border border-gray-200 bg-white text-gray-600 cursor-pointer hover:bg-gray-50 disabled:opacity-40"
                      >
                        ↩ Undo
                      </button>
                      <button
                        onClick={clearCanvas}
                        className="text-[9px] px-3 py-1.5 rounded-md border border-gray-200 bg-white text-gray-600 cursor-pointer hover:bg-gray-50"
                      >
                        🗑 Clear
                      </button>
                    </div>
                  </div>

                  {/* Canvas
                      IMPORTANT: Do NOT set width/height attributes here.
                      syncCanvasSize() sets them dynamically after measuring the
                      rendered CSS width — this prevents coordinate offset bugs. */}
                  <canvas
                    ref={canvasRef}
                    className="w-full rounded-lg bg-white cursor-crosshair border border-[#B39DDB] touch-none"
                    style={{ height: "200px", display: "block" }}
                    onMouseDown={startDraw}
                    onMouseMove={draw}
                    onMouseUp={endDraw}
                    onMouseLeave={endDraw}
                    onTouchStart={startDraw}
                    onTouchMove={draw}
                    onTouchEnd={endDraw}
                  />
                  <p className="text-[8px] text-gray-400 mt-1 mb-3">
                    ✏️ Draw here — your drawing is saved as an image with the
                    entry
                  </p>
                </div>

                {/* Save button */}
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="w-full py-2.5 bg-[#7E57C2] text-white border-none rounded-lg text-[11px] font-bold cursor-pointer disabled:opacity-50 hover:bg-[#512DA8] transition-colors"
                >
                  {loading ? "Saving..." : "💾 Save Journal Entry"}
                </button>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Past Entries ───────────────────────────── */}
          <div className="bg-white rounded-xl border border-[#B39DDB] flex flex-col overflow-hidden min-h-0">
            <div className="px-3.5 py-2.5 text-[12px] font-bold text-[#512DA8] bg-[#EDE7F6] rounded-t-xl flex-shrink-0">
              Past Entries
              <span className="ml-2 text-[9px] font-normal text-[#9575CD]">
                {entries.length} {entries.length === 1 ? "entry" : "entries"}
              </span>
            </div>

            <div className="overflow-y-auto flex-1 p-3 flex flex-col gap-2">
              {entries.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 py-8">
                  <div className="text-4xl mb-2">📭</div>
                  <p className="text-[11px] font-semibold">No entries yet</p>
                  <p className="text-[9px] mt-1 text-center max-w-[180px]">
                    Write your first journal entry using the prompts or free
                    write!
                  </p>
                </div>
              ) : (
                entries.map((entry) => {
                  const badge = getEntryBadge(entry);
                  return (
                    <div
                      key={entry.id}
                      className="bg-[#FAF8FF] border border-[#E0D8F0] rounded-xl p-2.5 hover:border-[#B39DDB] transition-colors"
                    >
                      {/* Prompt tag */}
                      {entry.prompt && (
                        <p className="text-[8px] font-semibold text-[#9575CD] mb-1 truncate">
                          {entry.prompt.split("—")[0]?.trim()}
                        </p>
                      )}

                      {/* Content preview */}
                      <p className="text-[9px] text-gray-700 leading-[1.45] line-clamp-3 mb-2">
                        {entry.content}
                      </p>

                      {/* Photo thumbnail if present */}
                      {entry.photo_url && (
                        <img
                          src={entry.photo_url}
                          alt="Journal attachment"
                          className="w-full h-[60px] object-cover rounded-lg mb-2"
                          loading="lazy"
                        />
                      )}

                      {/* Footer row: date + type badge + delete */}
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] text-gray-400">
                          {new Date(entry.created_at).toLocaleDateString(
                            "en-MY",
                            {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span
                            className="text-[7px] font-bold px-1.5 py-0.5 rounded-full"
                            style={{
                              backgroundColor: badge.bg,
                              color: badge.color,
                            }}
                          >
                            {badge.icon} {badge.label}
                          </span>
                          <button
                            onClick={() => handleDelete(entry.id)}
                            className="text-gray-300 hover:text-[#EF5350] transition-colors border-none bg-transparent cursor-pointer p-0.5"
                            aria-label="Delete entry"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
