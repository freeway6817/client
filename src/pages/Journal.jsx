import { useState, useEffect, useRef } from "react";
import AppShell from "../components/AppShell";
import api from "../api/axios";
import toast from "react-hot-toast";
import { Trash2, Camera, X, CalendarDays, Expand } from "lucide-react";
import { resolveMediaUrl } from "../api/axios";

const TAG_COLORS = {
  Gratitude: { bg: "#FFF9C4", text: "#F57F17", border: "#FFD54F" },
  Mindfulness: { bg: "#E8F5E9", text: "#2E7D32", border: "#81C784" },
  Resilience: { bg: "#E3F2FD", text: "#1565C0", border: "#64B5F6" },
  Connection: { bg: "#FCE4EC", text: "#C2185B", border: "#F48FB1" },
  Reflection: { bg: "#F3E5F5", text: "#6A1B9A", border: "#CE93D8" },
  Motivation: { bg: "#FFF3E0", text: "#E65100", border: "#FFCC80" },
  Anxiety: { bg: "#FBE9E7", text: "#BF360C", border: "#FFAB91" },
  Growth: { bg: "#E8F5E9", text: "#1B5E20", border: "#A5D6A7" },
  Happiness: { bg: "#FFFDE7", text: "#F57F17", border: "#FFF176" },
  Stress: { bg: "#FCE4EC", text: "#880E4F", border: "#F48FB1" },
};

const DEFAULT_TAG_COLOR = { bg: "#EDE7F6", text: "#512DA8", border: "#B39DDB" };

const getTagColor = (tag) => TAG_COLORS[tag] || DEFAULT_TAG_COLOR;

const toLocalDateStr = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const todayStr = () => toLocalDateStr(new Date());
const entryDateStr = (createdat) => toLocalDateStr(new Date(createdat));

function Lightbox({ src, alt, onClose }) {
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-w-[90vw] max-h-[90vh] rounded-xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={src}
          alt={alt}
          className="block max-w-[90vw] max-h-[85vh] object-contain"
        />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 border-none cursor-pointer transition-colors"
          aria-label="Close photo"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

function PromptSkeleton() {
  return (
    <div className="p-3 rounded-xl border-[1.5px] border-gray-100 bg-white animate-pulse">
      <div className="flex items-center gap-1.5 mb-2">
        <div className="h-4 w-16 bg-gray-100 rounded-full" />
        <div className="h-3 w-12 bg-gray-100 rounded-full" />
      </div>
      <div className="h-3 w-full bg-gray-100 rounded mb-1" />
      <div className="h-3 w-4/5 bg-gray-100 rounded" />
    </div>
  );
}

export default function Journal() {
  const [entries, setEntries] = useState([]);
  const [prompts, setPrompts] = useState([]);
  const [promptsLoading, setPromptsLoading] = useState(true);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [content, setContent] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [entryDate, setEntryDate] = useState(todayStr());
  const [filterDate, setFilterDate] = useState(todayStr());
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const [lightboxAlt, setLightboxAlt] = useState("");

  const fileRef = useRef(null);

  const fetchPrompts = async () => {
    try {
      setPromptsLoading(true);
      const { data } = await api.get("/api/journal/prompts");
      setPrompts(data);
    } catch {
      toast.error("Failed to load prompts");
    } finally {
      setPromptsLoading(false);
    }
  };

  // ── Fetch entries ─────────────────────────────────────────
  const fetchEntries = async () => {
    try {
      const { data } = await api.get("/api/journal");
      setEntries(data);
    } catch {
      toast.error("Failed to load entries");
    }
  };

  useEffect(() => {
    fetchPrompts();
    fetchEntries();
  }, []);

  const filteredEntries = entries.filter(
    (e) => entryDateStr(e.createdat) === filterDate,
  );

  const filterDateLabel = new Date(filterDate + "T00:00:00").toLocaleDateString(
    "en-MY",
    { weekday: "short", day: "numeric", month: "short", year: "numeric" },
  );

  const entryDates = [
    ...new Set(entries.map((e) => entryDateStr(e.createdat))),
  ];
  const earliestDate = entryDates.length
    ? entryDates.reduce((a, b) => (a < b ? a : b))
    : todayStr();

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

  const handleSave = async () => {
    if (!content.trim()) {
      toast.error("Write something before saving");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("content", content.trim());
      formData.append("entryDate", entryDate);
      if (selectedPrompt) {
        formData.append(
          "prompt",
          `Prompt #${selectedPrompt.id} • ${selectedPrompt.tag} — ${selectedPrompt.prompt}`,
        );
      }
      if (photo) formData.append("photo", photo);

      await api.post("/api/journal", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Journal entry saved!");
      setContent("");
      setSelectedPrompt(null);
      setPhoto(null);
      setPhotoPreview(null);
      setFilterDate(entryDate); // jump filter to the saved date
      setEntryDate(todayStr());
      fetchEntries();
    } catch {
      toast.error("Failed to save entry");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/journal/${id}`);
      toast.success("Entry deleted");
      fetchEntries();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const getEntryBadge = (entry) => {
    if (entry.photourl)
      return { icon: "🖼️", label: "Photo", color: "#1976D2", bg: "#E3F2FD" };
    return { icon: "✍️", label: "Text", color: "#43A047", bg: "#E8F5E9" };
  };

  return (
    <AppShell>
      {lightboxSrc && (
        <Lightbox
          src={lightboxSrc}
          alt={lightboxAlt}
          onClose={() => setLightboxSrc(null)}
        />
      )}

      <div className="flex flex-col gap-3 h-full">
        {/* Page header */}
        <div className="flex-shrink-0">
          <h1 className="text-[17px] font-bold text-navy">Journal</h1>
          <p className="text-[10px] text-gray-500 mt-0.5">
            Reflect, write, and express your thoughts freely
          </p>
        </div>

        {/* ── Two-column layout ────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-3 flex-1 overflow-auto min-h-0">
          {/* ── LEFT: Prompts + Write ─────────────────────────── */}
          <div className="flex flex-col gap-3 overflow-y-auto pr-1">
            {/* Journal Prompts — fetched from API */}
            <div className="bg-white rounded-xl border border-[#B39DDB] flex-shrink-0">
              <div className="px-3.5 py-2.5 text-[12px] font-bold text-[#512DA8] bg-[#EDE7F6] rounded-t-xl flex items-center justify-between">
                <span>Today's Journal Prompts</span>
                {!promptsLoading && prompts.length > 0 && (
                  <span className="text-[9px] font-normal text-[#9575CD]">
                    {prompts.length} available
                  </span>
                )}
              </div>

              <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {promptsLoading ? (
                  // Skeleton placeholders while loading
                  [0, 1, 2, 3].map((i) => <PromptSkeleton key={i} />)
                ) : prompts.length === 0 ? (
                  <div className="col-span-2 text-center py-6 text-gray-400">
                    <p className="text-[11px] font-semibold">No prompts yet</p>
                    <p className="text-[9px] mt-1">
                      An admin can add prompts from the Admin Dashboard.
                    </p>
                  </div>
                ) : (
                  prompts.map((p) => {
                    const colors = getTagColor(p.tag);
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
                          "{p.prompt}"
                        </p>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Write Your Entry */}
            <div className="bg-white rounded-xl border border-[#B39DDB] flex-shrink-0">
              <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#EDE7F6] rounded-t-xl">
                <span className="text-[12px] font-bold text-[#512DA8]">
                  Write Your Entry
                </span>
                <span className="text-[9px] text-gray-500 tabular-nums">
                  {wordCount} {wordCount === 1 ? "word" : "words"}
                </span>
              </div>

              <div className="p-3">
                {/* Entry date picker */}
                <div className="flex items-center gap-2 mb-3 bg-[#FAF8FF] border border-[#B39DDB] rounded-lg px-3 py-2">
                  <label
                    htmlFor="entry-date"
                    className="text-[9px] font-bold text-[#512DA8] whitespace-nowrap"
                  >
                    Entry date:
                  </label>
                  <input
                    id="entry-date"
                    type="date"
                    value={entryDate}
                    max={todayStr()}
                    onChange={(e) => {
                      if (e.target.value) setEntryDate(e.target.value);
                    }}
                    className="flex-1 min-w-0 bg-transparent border-none text-[9px] text-[#512DA8] font-medium focus:outline-none cursor-pointer"
                  />
                  {entryDate !== todayStr() && (
                    <button
                      onClick={() => setEntryDate(todayStr())}
                      className="text-[8px] text-[#7E57C2] font-semibold bg-white border border-[#B39DDB] rounded-full px-2 py-0.5 cursor-pointer hover:bg-[#EDE7F6] transition-colors whitespace-nowrap"
                    >
                      Reset to today
                    </button>
                  )}
                </div>

                {/* Selected prompt banner */}
                {selectedPrompt && (
                  <div className="bg-[#F3EEF9] border border-[#B39DDB] rounded-lg p-2.5 mb-3 flex items-start justify-between gap-2">
                    <div>
                      <span
                        className="text-[7px] font-bold px-1.5 py-0.5 rounded-full border mr-2"
                        style={{
                          backgroundColor: getTagColor(selectedPrompt.tag).bg,
                          color: getTagColor(selectedPrompt.tag).text,
                          borderColor: getTagColor(selectedPrompt.tag).border,
                        }}
                      >
                        {selectedPrompt.tag}
                      </span>
                      <span className="text-[8px] text-gray-400">
                        Prompt #{selectedPrompt.id}
                      </span>
                      <p className="text-[9px] text-[#4527A0] italic leading-[1.5] mt-1">
                        "{selectedPrompt.prompt}"
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
                      ? `Respond to the prompt: "${selectedPrompt.prompt.substring(0, 60)}..."`
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

          {/* ── RIGHT: Past Entries ───────────────────────────── */}
          <div className="bg-white rounded-xl border border-[#B39DDB] flex flex-col overflow-hidden min-h-0">
            <div className="px-3.5 py-2.5 bg-[#EDE7F6] rounded-t-xl flex-shrink-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] font-bold text-[#512DA8]">
                  Past Entries
                  <span className="ml-2 text-[9px] font-normal text-[#9575CD]">
                    {filteredEntries.length}{" "}
                    {filteredEntries.length === 1 ? "entry" : "entries"}
                  </span>
                </span>
                {filterDate !== todayStr() && (
                  <button
                    onClick={() => setFilterDate(todayStr())}
                    className="text-[8px] font-semibold text-[#7E57C2] bg-white border border-[#B39DDB] rounded-full px-2 py-0.5 cursor-pointer hover:bg-[#F3EEF9] transition-colors"
                  >
                    Back to Today
                  </button>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <CalendarDays
                  size={11}
                  className="text-[#9575CD] flex-shrink-0"
                />
                <label
                  htmlFor="journal-date-filter"
                  className="text-[9px] text-[#9575CD] font-semibold whitespace-nowrap"
                >
                  Browse date:
                </label>
                <input
                  id="journal-date-filter"
                  type="date"
                  value={filterDate}
                  max={todayStr()}
                  min={earliestDate}
                  onChange={(e) => {
                    if (e.target.value) setFilterDate(e.target.value);
                  }}
                  className="flex-1 min-w-0 bg-white border border-[#B39DDB] rounded-lg px-2 py-1 text-[9px] text-[#512DA8] font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#9575CD]/30"
                />
              </div>
            </div>

            <div className="overflow-y-auto flex-1 p-3 flex flex-col gap-2">
              {filteredEntries.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 py-8">
                  <div className="text-4xl mb-2">
                    {filterDate === todayStr() ? "" : "📅"}
                  </div>
                  <p className="text-[11px] font-semibold">
                    {filterDate === todayStr()
                      ? "No entries yet"
                      : "No entries on this date"}
                  </p>
                  <p className="text-[9px] mt-1 text-center max-w-[180px]">
                    {filterDate === todayStr()
                      ? "Write your first journal entry using the prompts or free write!"
                      : `Nothing was written on ${filterDateLabel}.`}
                  </p>
                </div>
              ) : (
                filteredEntries.map((entry) => {
                  const badge = getEntryBadge(entry);
                  const fullPhotoUrl = resolveMediaUrl(entry.photourl);
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

                      {fullPhotoUrl && (
                        <div
                          className="relative mb-2 rounded-lg overflow-hidden group cursor-pointer"
                          onClick={() => {
                            setLightboxSrc(fullPhotoUrl);
                            setLightboxAlt("Journal attachment");
                          }}
                        >
                          <img
                            src={fullPhotoUrl}
                            alt="Journal attachment"
                            className="w-full h-[80px] object-cover rounded-lg transition-opacity group-hover:opacity-80"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="bg-black/60 text-white rounded-full p-1.5">
                              <Expand size={14} />
                            </span>
                          </div>
                        </div>
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
