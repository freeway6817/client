// client/src/pages/Resources.jsx
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AppShell from "../components/AppShell";
import api from "../api/axios";
import toast from "react-hot-toast";
import {
  Bookmark,
  BookmarkCheck,
  FileText,
  Play,
  Mic,
  BarChart2,
  AlertTriangle,
  Phone,
  Clock,
} from "lucide-react";

const TYPE_META = {
  article: {
    label: "ARTICLE",
    color: "#2196F3",
    bg: "#E3F2FD",
    Icon: FileText,
    action: "Read",
  },
  video: {
    label: "VIDEO",
    color: "#F44336",
    bg: "#FFEBEE",
    Icon: Play,
    action: "Watch",
  },
  podcast: {
    label: "PODCAST",
    color: "#9C27B0",
    bg: "#F3E5F5",
    Icon: Mic,
    action: "Listen",
  },
  infographic: {
    label: "INFOGRAPHIC",
    color: "#4CAF50",
    bg: "#E8F5E9",
    Icon: BarChart2,
    action: "View",
  },
};

const HELPLINES = [
  {
    name: "Befrienders Malaysia",
    number: "03-7956 8145",
    hours: "Available 24 hours • Free • Confidential",
  },
  {
    name: "MIASA Helpline",
    number: "03-2780 6803",
    hours: "Monday – Friday, 9am – 5pm",
  },
  { name: "Talian Kasih", number: "15999", hours: "24 hours • Govt Helpline" },
  {
    name: "UNIMAS Counselling Centre",
    number: "082-581000 (Ext)",
    hours: "Office hours • Walk-in or appointment",
  },
];

const FILTER_TABS = [
  ["all", "All"],
  ["article", "Article"],
  ["video", "Video"],
  ["podcast", "Podcast"],
];

export default function Resources() {
  const location = useLocation();

  const [resources, setResources] = useState([]);
  const [bookmarked, setBookmarked] = useState(new Set());
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  // Read ?type= from URL on mount; fall back to "all"
  const getInitialFilter = () => {
    const param = new URLSearchParams(location.search).get("type");
    return param && FILTER_TABS.some(([key]) => key === param) ? param : "all";
  };
  const [filter, setFilter] = useState(getInitialFilter);

  useEffect(() => {
    // Fetch resources and bookmarks independently so one failure
    // doesn't block the other from loading
    const loadResources = async () => {
      setLoading(true);
      try {
        const r = await api.get("/api/resources");
        // Normalise type to lowercase so filtering is case-insensitive
        const normalised = (r.data || []).map((item) => ({
          ...item,
          type: item.type ? item.type.toLowerCase() : "article",
        }));
        setResources(normalised);
      } catch {
        toast.error("Failed to load resources");
      } finally {
        setLoading(false);
      }
    };

    const loadBookmarks = async () => {
      try {
        const b = await api.get("/api/resources/bookmarks");
        setBookmarked(new Set((b.data || []).map((item) => item.id)));
      } catch {
        // Bookmarks failing should not block the page — fail silently
      }
    };

    loadResources();
    loadBookmarks();
  }, []);

  const handleBookmark = async (resource) => {
    try {
      if (bookmarked.has(resource.id)) {
        await api.delete(`/api/resources/${resource.id}/bookmark`);
        setBookmarked((prev) => {
          const s = new Set(prev);
          s.delete(resource.id);
          return s;
        });
        toast.success("Bookmark removed");
      } else {
        await api.post(`/api/resources/${resource.id}/bookmark`);
        setBookmarked((prev) => new Set([...prev, resource.id]));
        toast.success("Bookmarked!");
      }
    } catch {
      toast.error("Failed to update bookmark");
    }
  };

  const handleView = (resource) => {
    setRecent((prev) => {
      const filtered = prev.filter((r) => r.id !== resource.id);
      return [resource, ...filtered].slice(0, 3);
    });
    if (resource.url && resource.url !== "#")
      window.open(resource.url, "_blank");
  };

  // Case-insensitive filter match after normalisation
  const filtered =
    filter === "all" ? resources : resources.filter((r) => r.type === filter);

  return (
    <AppShell>
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-navy">Resources</h1>
        <p className="text-sm text-gray-500">
          Curated articles, videos, and podcasts for your mental wellness
        </p>
      </div>

      {/* Filter tabs — scrollable on mobile */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {FILTER_TABS.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-lg text-[10px] font-bold border-none cursor-pointer transition-colors whitespace-nowrap flex-shrink-0
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

      {/* Main layout — stacks on mobile, side-by-side on lg+ */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Resource Grid */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-4 border border-gray-100 flex gap-4 animate-pulse"
                >
                  <div className="w-14 h-14 rounded-lg bg-gray-100 flex-shrink-0" />
                  <div className="flex-1 flex flex-col gap-2 justify-center">
                    <div className="h-3 bg-gray-100 rounded w-1/4" />
                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <AlertTriangle size={36} className="mb-3 text-gray-300" />
              <p className="text-sm">No resources found for this filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filtered.map((resource) => {
                const meta = TYPE_META[resource.type] || TYPE_META.article;
                const { Icon } = meta;
                return (
                  <div
                    key={resource.id}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex gap-4"
                  >
                    {/* Thumbnail — Lucide icon */}
                    <div
                      className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: meta.bg }}
                    >
                      <Icon size={24} style={{ color: meta.color }} />
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
                        {resource.title}
                      </h3>
                      <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2">
                        {resource.description}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => handleView(resource)}
                        className="px-3 py-1.5 rounded-md text-[9px] font-bold cursor-pointer border transition-colors hover:opacity-80 whitespace-nowrap"
                        style={{
                          color: meta.color,
                          borderColor: meta.color,
                          background: "transparent",
                        }}
                      >
                        {meta.action}
                      </button>
                      <button
                        onClick={() => handleBookmark(resource)}
                        className={`p-1.5 rounded-md border transition-colors cursor-pointer
                        ${
                          bookmarked.has(resource.id)
                            ? "bg-[#1976D2] text-white border-[#1976D2]"
                            : "bg-white text-gray-400 border-gray-200 hover:text-[#1976D2] hover:border-[#1976D2]"
                        }`}
                      >
                        {bookmarked.has(resource.id) ? (
                          <BookmarkCheck size={12} />
                        ) : (
                          <Bookmark size={12} />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-4">
          {/* Crisis Helplines */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <AlertTriangle size={14} className="text-red-500" />
              Crisis Helplines
            </h3>
            {HELPLINES.map((h) => (
              <div key={h.name} className="flex gap-2 mb-3 last:mb-0">
                <div className="mt-0.5 flex-shrink-0">
                  <Phone size={13} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-gray-800">
                    {h.name}
                  </p>
                  <p className="text-[11px] font-bold text-blue-600">
                    {h.number}
                  </p>
                  <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                    <Clock size={9} />
                    {h.hours}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Recently Viewed */}
          {recent.length > 0 && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-700 mb-3">
                Recently Viewed
              </h3>
              {recent.map((r) => {
                const meta = TYPE_META[r.type] || TYPE_META.article;
                const { Icon } = meta;
                return (
                  <div
                    key={r.id}
                    className="mb-2 last:mb-0 flex items-start gap-2"
                  >
                    <Icon
                      size={11}
                      style={{ color: meta.color }}
                      className="mt-0.5 flex-shrink-0"
                    />
                    <div>
                      <span
                        className="text-[9px] font-bold"
                        style={{ color: meta.color }}
                      >
                        {meta.label}
                      </span>
                      <p className="text-[11px] text-gray-700 leading-snug">
                        {r.title}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
