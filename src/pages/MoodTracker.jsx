// client/src/pages/MoodTracker.jsx
import { useState, useEffect, useRef } from "react";
import AppShell from "../components/AppShell";
import api from "../api/axios";
import toast from "react-hot-toast";
import { Trash2, Camera, Calendar, X, Expand } from "lucide-react";

const EMOJIS = ["😢", "🙁", "😐", "🙂", "😁"];
const LABELS = ["Awful", "Bad", "Okay", "Good", "Great"];
const ALL_TAGS = [
  "Tired",
  "Anxious",
  "Calm",
  "Happy",
  "Focused",
  "Stressed",
  "Motivated",
  "Lonely",
  "Grateful",
  "Overwhelmed",
];

// ─── Helpers ──────────────────────────────────────────────────
const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

/** Prefix relative /uploads/... paths with the server base URL */
const resolvePhotoUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  const base = import.meta.env.VITE_API_URL || "http://localhost:5000";
  return `${base}${url}`;
};

// ─── Lightbox ─────────────────────────────────────────────────
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

// ─── Component ────────────────────────────────────────────────
export default function MoodTracker() {
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [score, setScore] = useState(5);
  const [note, setNote] = useState("");
  const [activeTags, setActiveTags] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [entryDate, setEntryDate] = useState(todayStr());

  // Lightbox state
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const [lightboxAlt, setLightboxAlt] = useState("");

  const fileRef = useRef(null);

  const fetchData = async () => {
    try {
      const e = await api.get("/api/moods");
      setEntries(e.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load moods");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleTag = (tag) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const clearPhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSave = async () => {
    if (selectedEmoji === null)
      return toast.error("Please select how you feel");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("emoji", EMOJIS[selectedEmoji]);
      formData.append("score", score);
      formData.append("label", LABELS[selectedEmoji]);
      formData.append("note", note);
      formData.append("tags", JSON.stringify(activeTags));
      formData.append("entryDate", entryDate);
      if (photo) formData.append("photo", photo);

      await api.post("/api/moods", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Mood entry saved!");
      setSelectedEmoji(null);
      setScore(5);
      setNote("");
      setActiveTags([]);
      clearPhoto();
      setEntryDate(todayStr());
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save mood");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/moods/${id}`);
      toast.success("Entry deleted");
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete");
    }
  };

  return (
    <AppShell>
      {/* Lightbox overlay */}
      {lightboxSrc && (
        <Lightbox
          src={lightboxSrc}
          alt={lightboxAlt}
          onClose={() => setLightboxSrc(null)}
        />
      )}

      <div className="max-w-7xl mx-auto w-full font-sans">
        <div className="mb-6">
          <h1 className="font-heading text-[28px] sm:text-[32px] font-bold text-theme-dark">
            Mood Tracker
          </h1>
          <p className="text-[15px] text-theme-body mt-1">
            Record and review your daily emotional well-being.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* LEFT COLUMN: Input Form */}
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-[10px] border border-theme-border shadow-card overflow-hidden">
              <div className="px-6 py-4 bg-theme-light border-b border-theme-border flex justify-between items-center">
                <span className="font-heading text-[18px] font-bold text-theme-dark">
                  Record Today's Mood
                </span>
                <span className="text-[13px] text-theme-body font-medium">
                  {new Date().toLocaleDateString("en-MY", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </div>

              <div className="p-6">
                {/* Emoji Selection */}
                <p className="text-[14px] font-semibold text-theme-dark mb-3">
                  How are you feeling?
                </p>
                <div className="flex justify-between gap-2 sm:gap-4 mb-6">
                  {EMOJIS.map((e, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setSelectedEmoji(i);
                        setScore(i * 2 + 2);
                      }}
                      className={`flex flex-col items-center flex-1 py-3 rounded-[8px] border-2 transition-all duration-300 cursor-pointer bg-white
                        ${selectedEmoji === i ? "border-theme-blue scale-105 shadow-card-soft" : "border-gray-100 hover:border-gray-300 hover:bg-gray-50"}`}
                    >
                      <span className="text-[28px] sm:text-[36px]">{e}</span>
                      <span
                        className={`text-[12px] mt-2 font-bold ${selectedEmoji === i ? "text-theme-blue" : "text-gray-400"}`}
                      >
                        {LABELS[i]}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Tag Selection */}
                <p className="text-[14px] font-semibold text-theme-dark mb-3 mt-6">
                  What's making you feel this way?
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {ALL_TAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-colors border-none cursor-pointer
                        ${activeTags.includes(tag) ? "bg-theme-blue text-white" : "bg-theme-light text-theme-body hover:bg-gray-200"}`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                {/* Journal Note */}
                <p className="text-[14px] font-semibold text-theme-dark mb-3 mt-6">
                  Add a note (optional)
                </p>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Why do you feel this way today?"
                  className="w-full bg-theme-input border border-transparent rounded-[4px] p-4 text-[14px] text-theme-dark focus:bg-white focus:border-theme-blue focus:outline-none transition-colors resize-none mb-4"
                  rows="3"
                />

                {/* ── Entry Date Picker ─────────────────────────────── */}
                <div className="mb-6">
                  <p className="text-[14px] font-semibold text-theme-dark mb-2">
                    Entry date
                  </p>
                  <div className="flex items-center gap-3 bg-theme-input rounded-[4px] px-4 py-3 border border-transparent focus-within:border-theme-blue focus-within:bg-white transition-colors">
                    <Calendar
                      size={16}
                      className="text-theme-body flex-shrink-0"
                    />
                    <input
                      type="date"
                      value={entryDate}
                      max={todayStr()}
                      onChange={(e) => {
                        if (e.target.value) setEntryDate(e.target.value);
                      }}
                      className="flex-1 bg-transparent border-none text-[14px] text-theme-dark focus:outline-none cursor-pointer"
                    />
                    {entryDate !== todayStr() && (
                      <button
                        onClick={() => setEntryDate(todayStr())}
                        className="text-[12px] text-theme-blue font-semibold bg-white border border-theme-border rounded-full px-3 py-1 cursor-pointer hover:bg-theme-light transition-colors whitespace-nowrap"
                      >
                        Reset to today
                      </button>
                    )}
                  </div>
                </div>

                {/* Photo Upload */}
                <div className="mb-6">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileRef}
                    onChange={handlePhotoChange}
                  />
                  {!photoPreview ? (
                    <button
                      onClick={() => fileRef.current?.click()}
                      className="flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-gray-200 rounded-[8px] text-gray-500 hover:bg-gray-50 hover:text-theme-blue hover:border-theme-blue transition-colors bg-transparent cursor-pointer text-[14px] font-semibold"
                    >
                      <Camera size={20} /> Add a photo of your day
                    </button>
                  ) : (
                    <div className="relative w-full h-[150px] rounded-[8px] overflow-hidden border border-gray-200">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={clearPhoto}
                        className="absolute top-2 right-2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-theme-red hover:bg-white cursor-pointer border-none shadow-sm backdrop-blur-sm"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Save Button */}
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="w-full h-[55px] bg-theme-blue text-white rounded-[4px] font-heading font-semibold text-[18px] hover:bg-theme-red transition-all duration-300 disabled:opacity-70 border-none cursor-pointer shadow-card-soft"
                >
                  {loading ? "Saving..." : "Save Mood"}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: History View */}
          <div className="flex flex-col gap-6">
            {/* Overview Card */}
            <div className="bg-white rounded-[10px] border border-theme-border shadow-card p-6 flex items-center gap-4">
              <div>
                <h2 className="font-heading text-[24px] font-bold text-theme-dark leading-none mb-1">
                  Your History
                </h2>
                <p className="text-[14px] text-theme-body font-medium">
                  You've logged {entries.length} moods total.
                </p>
              </div>
            </div>

            {/* List of Entries */}
            <div className="bg-white rounded-[10px] border border-theme-border shadow-card overflow-hidden flex-1 flex flex-col max-h-[600px]">
              <div className="px-6 py-4 bg-theme-light border-b border-theme-border flex items-center gap-2">
                <Calendar size={18} className="text-theme-dark" />
                <span className="font-heading text-[16px] font-bold text-theme-dark">
                  Past Entries
                </span>
              </div>

              <div className="overflow-y-auto p-4 flex flex-col gap-4">
                {entries.length === 0 ? (
                  <div className="text-center py-10 text-gray-400 text-[14px]">
                    No moods logged yet.
                  </div>
                ) : (
                  entries.map((entry) => {
                    const fullPhotoUrl = resolvePhotoUrl(entry.photourl);
                    return (
                      <div
                        key={entry.id}
                        className="border border-gray-100 rounded-[8px] p-4 hover:shadow-card-soft transition-shadow bg-white relative group"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-[32px] leading-none">
                              {entry.emoji}
                            </span>
                            <div>
                              <p className="text-[15px] font-bold text-theme-dark">
                                {entry.label}
                              </p>
                              <p className="text-[12px] text-gray-400">
                                {new Date(entry.createdat).toLocaleString(
                                  "en-MY",
                                  {
                                    weekday: "short",
                                    day: "numeric",
                                    month: "short",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDelete(entry.id)}
                            className="text-gray-300 hover:text-theme-red p-2 bg-transparent border-none cursor-pointer opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        {entry.tags && entry.tags !== "[]" && (
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {JSON.parse(entry.tags).map((tag, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-theme-light text-theme-body text-[11px] font-bold rounded-[4px]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {entry.note && (
                          <p className="text-[13px] text-gray-600 bg-gray-50 p-3 rounded-[6px] italic border-l-2 border-theme-blue">
                            "{entry.note}"
                          </p>
                        )}

                        {/* ── Photo thumbnail + lightbox ── */}
                        {fullPhotoUrl && (
                          <div
                            className="relative mt-3 rounded-[6px] overflow-hidden cursor-pointer group/photo"
                            onClick={() => {
                              setLightboxSrc(fullPhotoUrl);
                              setLightboxAlt(`${entry.label} mood photo`);
                            }}
                          >
                            <img
                              src={fullPhotoUrl}
                              alt="Mood"
                              className="w-full h-[150px] object-cover rounded-[6px] transition-opacity group-hover/photo:opacity-80"
                              loading="lazy"
                            />
                            {/* Expand hint overlay */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-opacity">
                              <span className="bg-black/60 text-white rounded-full p-2">
                                <Expand size={18} />
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
