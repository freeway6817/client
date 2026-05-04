// client/src/pages/Bookmarks.jsx
import { useState, useEffect } from "react";
import AppShell from "../components/AppShell";
import api from "../api/axios";
import toast from "react-hot-toast";
import { BookmarkCheck, Trash2, ExternalLink } from "lucide-react";

const TYPE_META = {
  article: {
    label: "ARTICLE",
    color: "#2196F3",
    bg: "#E3F2FD",
    icon: "📄",
    action: "Read",
  },
  video: {
    label: "VIDEO",
    color: "#F44336",
    bg: "#FFEBEE",
    icon: "▶️",
    action: "Watch",
  },
  infographic: {
    label: "INFOGRAPHIC",
    color: "#4CAF50",
    bg: "#E8F5E9",
    icon: "📊",
    action: "View",
  },
};

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [filter, setFilter] = useState("all");

  // ✅ FIX: async function defined inline inside the effect
  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const res = await api.get("/api/resources/bookmarks");
        setBookmarks(res.data);
      } catch {
        toast.error("Failed to load bookmarks");
      }
    };

    loadBookmarks();
  }, []);

  const handleRemove = async (resourceId) => {
    try {
      await api.delete(`/api/resources/${resourceId}/bookmark`);
      setBookmarks((prev) => prev.filter((bm) => bm.id !== resourceId));
      toast.success("Bookmark removed");
    } catch {
      toast.error("Failed to remove bookmark");
    }
  };

  const handleView = (bm) => {
    if (bm.url && bm.url !== "#") window.open(bm.url, "_blank");
  };

  const filtered =
    filter === "all" ? bookmarks : bookmarks.filter((bm) => bm.type === filter);

  return (
    <AppShell>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-navy">🔖 Bookmarks</h1>
        <p className="text-sm text-gray-500">
          Your saved articles, videos, and infographics
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {[
          ["all", "All"],
          ["article", "Article"],
          ["video", "Video"],
          ["infographic", "Infographic"],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-lg text-[10px] font-bold border-none cursor-pointer transition-colors
            ${
              filter === key
                ? "bg-navy text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Bookmarks list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <div className="text-4xl mb-3">🔖</div>
          <p className="text-sm font-semibold text-gray-600">
            {filter === "all" ? "No bookmarks yet" : `No ${filter}s saved`}
          </p>
          <p className="text-xs text-gray-400 mt-1 text-center max-w-xs">
            {filter === "all"
              ? "Browse Resources and click the bookmark icon to save items."
              : `Switch the filter to "All" to see your other bookmarks.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((bm) => {
            const meta = TYPE_META[bm.type] || TYPE_META.article;
            return (
              <div
                key={bm.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex gap-4"
              >
                {/* Thumbnail */}
                <div
                  className="w-14 h-14 rounded-lg flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: meta.bg }}
                >
                  {meta.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <span
                    className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                    style={{ color: meta.color, background: meta.bg }}
                  >
                    {meta.label}
                  </span>
                  <h3 className="text-sm font-semibold text-gray-800 mt-1 leading-snug">
                    {bm.title}
                  </h3>
                  {/* Description */}
                  <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2">
                    {bm.description}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => handleView(bm)}
                    className="flex items-center gap-1 py-1.5 px-3 rounded-md text-[9px] font-bold cursor-pointer border transition-colors hover:opacity-80"
                    style={{
                      color: meta.color,
                      borderColor: meta.color,
                      background: "transparent",
                    }}
                  >
                    <ExternalLink size={10} />
                    {meta.action}
                  </button>
                  <button
                    onClick={() => handleRemove(bm.id)}
                    className="p-1.5 rounded-md border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-300 transition-colors cursor-pointer"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
