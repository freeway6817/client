// client/src/pages/Journal.jsx
import { useState, useEffect, useRef } from "react";
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
  const [loading, setLoading] = useState(false);

  const fileRef = useRef(null);

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

  // ── Photo upload ──────────────────────────────────────────
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

  // ── Save entry ────────────────────────────────────────────
  const handleSave = async () => {
    if (!content.trim()) {
      toast.error("Write something before saving");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("content", content.trim());
      if (selectedPrompt) {
        formData.append(
          "prompt",
          `Prompt #${selectedPrompt.id} • ${selectedPrompt.tag} — ${selectedPrompt.text}`,
        );
      }
      if (photo) {
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
      fetchEntries();
    } catch {
      toast.error("Failed to save entry");
    } finally {
      setLoading(false);
    }
  };

  // ── Delete entry ──────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/journal/${id}`);
      toast.success("Entry deleted");
      fetchEntries();
    } catch {
      toast.error("Failed to delete");
    }
  };

  // ── Entry type badge ──────────────────────────────────────
  const getEntryBadge = (entry) => {
    if (entry.photourl)
      return { icon: "🖼️", label: "Photo", color: "#1976D2", bg: "#E3F2FD" };
    return { icon: "✍️", label: "Text", color: "#43A047", bg: "#E8F5E9" };
  };

  // ─── Render ───────────────────────────────────────────────
  return (
    <AppShell>
      <div className="flex flex-col gap-3 h-full">
        {/* Page header */}
        <div className="flex-shrink-0">
          <h1 className="text-[17px] font-bold text-navy">Journal</h1>
          <p className="text-[10px] text-gray-500 mt-0.5">
            Reflect, write, and express your thoughts freely
          </p>
        </div>

        {/* ── Two-column layout ─────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-3 flex-1 overflow-auto min-h-0">
          {/* ── LEFT: Prompts + Write ──────────────────────────── */}
          <div className="flex flex-col gap-3 overflow-y-auto pr-1">
            {/* Today's Journal Prompts */}
            <div className="bg-white rounded-xl border border-[#B39DDB] flex-shrink-0">
              <div className="px-3.5 py-2.5 text-[12px] font-bold text-[#512DA8] bg-[#EDE7F6] rounded-t-xl">
                Today's Journal Prompts
              </div>
              <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                  Write Your Entry —{" "}
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

                {/* Textarea */}
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
                    Attach Photo{" "}
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

                {/* Save button */}
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="w-full py-2.5 bg-[#7E57C2] text-white border-none rounded-lg text-[11px] font-bold cursor-pointer disabled:opacity-50 hover:bg-[#512DA8] transition-colors"
                >
                  {loading ? "Saving..." : "Save Journal Entry"}
                </button>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Past Entries ──────────────────────────────── */}
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
                  {/* <div className="text-4xl mb-2">📭</div> */}
                  <div className="text-4xl mb-2"></div>

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
                      {entry.prompt && (
                        <p className="text-[8px] font-semibold text-[#9575CD] mb-1 truncate">
                          {entry.prompt.split("—")[0]?.trim()}
                        </p>
                      )}

                      <p className="text-[9px] text-gray-700 leading-[1.45] line-clamp-3 mb-2">
                        {entry.content}
                      </p>

                      {entry.photourl && (
                        <img
                          src={entry.photourl}
                          alt="Journal attachment"
                          className="w-full h-[60px] object-cover rounded-lg mb-2"
                          loading="lazy"
                        />
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-[8px] text-gray-400">
                          {new Date(entry.createdat).toLocaleDateString(
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
