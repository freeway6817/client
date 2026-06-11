import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Edit2,
  Trash2,
  ShieldCheck,
  FileText,
  Quote,
  PenTool,
  ArrowLeft,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import toast from "react-hot-toast";

const emptyForms = {
  resources: {
    title: "",
    description: "",
    type: "article",
    url: "",
    thumbnail: "",
    tags: "",
    isactive: true,
  },
  affirmations: { content: "", isactive: true },
  prompts: { text: "", tag: "", isactive: true },
};

const TABS = [
  { key: "resources", label: "Resources", icon: FileText },
  { key: "affirmations", label: "Affirmations", icon: Quote },
  { key: "prompts", label: "Journal Prompts", icon: PenTool },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [tab, setTab] = useState("resources");
  const [data, setData] = useState({
    resources: [],
    affirmations: [],
    prompts: [],
  });
  const [form, setForm] = useState(emptyForms);
  const [editingId, setEditingId] = useState(null);
  const [refreshCount, setRefreshCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const endpoints = useMemo(
    () => ({
      resources: "/api/admin/resources",
      affirmations: "/api/admin/affirmations",
      prompts: "/api/admin/journal-prompts",
    }),
    [],
  );

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [resources, affirmations, prompts] = await Promise.all([
          api.get(endpoints.resources),
          api.get(endpoints.affirmations),
          api.get(endpoints.prompts),
        ]);

        setData({
          resources: resources.data,
          affirmations: affirmations.data,
          prompts: prompts.data,
        });
      } catch {
        toast.error("Failed to load admin data");
      }
    };

    fetchAll();
  }, [endpoints, refreshCount]);

  const currentForm = form[tab];
  const currentItems = data[tab];

  const updateField = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [tab]: { ...prev[tab], [key]: value },
    }));
  };

  const resetCurrent = () => {
    setForm((prev) => ({ ...prev, [tab]: emptyForms[tab] }));
    setEditingId(null);
  };

  const startEdit = (item) => {
    setEditingId(item.id);

    if (tab === "resources") {
      setForm((prev) => ({
        ...prev,
        resources: {
          title: item.title || "",
          description: item.description || "",
          type: item.type || "article",
          url: item.url || "",
          thumbnail: item.thumbnail || "",
          tags: item.tags || "",
          isactive: item.isactive !== false,
        },
      }));
    } else if (tab === "affirmations") {
      setForm((prev) => ({
        ...prev,
        affirmations: {
          content: item.content || "",
          isactive: item.isactive !== false,
        },
      }));
    } else if (tab === "prompts") {
      setForm((prev) => ({
        ...prev,
        prompts: {
          text: item.text || "",
          tag: item.tag || "",
          isactive: item.isactive !== false,
        },
      }));
    }
  };

  const saveItem = async () => {
    if (!currentForm.title && !currentForm.content && !currentForm.text) {
      return toast.error("Please fill in the required fields.");
    }

    setLoading(true);
    try {
      if (editingId) {
        await api.put(`${endpoints[tab]}/${editingId}`, currentForm);
        toast.success("Updated successfully!");
      } else {
        await api.post(endpoints[tab], currentForm);
        toast.success("Created successfully!");
      }
      resetCurrent();
      setRefreshCount((prev) => prev + 1);
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await api.delete(`${endpoints[tab]}/${id}`);
      toast.success("Deleted successfully!");
      if (editingId === id) resetCurrent();
      setRefreshCount((prev) => prev + 1);
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const inputClasses =
    "w-full bg-[#FAF8FF] border border-[#B39DDB] rounded-lg px-3 py-2 text-[10px] resize-none font-sans focus:outline-none focus:ring-2 focus:ring-[#9575CD] focus:border-transparent transition-all";

  return (
    <div className="flex flex-col h-screen w-full bg-[#F0F2F5] font-sans">
      {/* Header */}
      <header className="flex justify-between items-center bg-white p-4 px-6 border-b border-[#E0D8F0] shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <ShieldCheck size={22} className="text-[#3498DB]" />
          <div>
            <h1 className="text-[16px] font-bold text-navy leading-tight">
              Admin Dashboard
            </h1>
            <p className="text-[10px] text-gray-500">
              Welcome back, {user?.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#F0F2F5] text-gray-700 rounded-lg text-[11px] font-bold hover:bg-[#E2E8F0] transition-colors border border-[#E0D8F0]"
          >
            <ArrowLeft size={14} />
            Back to App
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#FFEBEE] text-[#C62828] border border-[#FFCDD2] rounded-lg text-[11px] font-bold hover:bg-[#FFCDD2] transition-colors"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 overflow-hidden p-4 md:p-6 max-w-6xl mx-auto w-full flex flex-col gap-4">
        {/* Tabs */}
        <div className="flex gap-2 flex-shrink-0">
          {TABS.map((tabItem) => {
            const TabIcon = tabItem.icon;
            return (
              <button
                key={tabItem.key}
                onClick={() => {
                  setTab(tabItem.key);
                  resetCurrent();
                }}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-[11px] font-bold transition-all ${
                  tab === tabItem.key
                    ? "bg-[#3498DB] text-white shadow-sm"
                    : "bg-white border border-[#E0D8F0] text-gray-600 hover:bg-[#F0F2F5]"
                }`}
              >
                <TabIcon size={14} />
                {tabItem.label}
              </button>
            );
          })}
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-4 flex-1 overflow-hidden min-h-0">
          {/* LEFT: Form */}
          <div className="bg-white rounded-xl border border-[#B39DDB] flex flex-col overflow-hidden min-h-0 shadow-sm">
            <div className="px-4 py-3 text-[12px] font-bold text-[#512DA8] bg-[#EDE7F6] flex-shrink-0 border-b border-[#B39DDB]">
              {editingId ? "Edit Item" : "Create New Item"}
            </div>

            <div className="overflow-y-auto flex-1 p-4 flex flex-col gap-3 custom-scrollbar">
              {tab === "resources" && (
                <>
                  <input
                    className={inputClasses}
                    placeholder="Resource Title *"
                    value={currentForm.title}
                    onChange={(e) => updateField("title", e.target.value)}
                  />
                  <textarea
                    className={inputClasses}
                    rows="3"
                    placeholder="Description"
                    value={currentForm.description}
                    onChange={(e) => updateField("description", e.target.value)}
                  />
                  <div className="flex gap-2">
                    <select
                      className={`${inputClasses} flex-1`}
                      value={currentForm.type}
                      onChange={(e) => updateField("type", e.target.value)}
                    >
                      <option value="article">Article</option>
                      <option value="video">Video</option>
                      <option value="infographic">Infographic</option>
                    </select>
                    <input
                      className={`${inputClasses} flex-1`}
                      placeholder="Tags (comma separated)"
                      value={currentForm.tags}
                      onChange={(e) => updateField("tags", e.target.value)}
                    />
                  </div>
                  <input
                    className={inputClasses}
                    placeholder="Target URL"
                    value={currentForm.url}
                    onChange={(e) => updateField("url", e.target.value)}
                  />
                  <input
                    className={inputClasses}
                    placeholder="Thumbnail Image URL"
                    value={currentForm.thumbnail}
                    onChange={(e) => updateField("thumbnail", e.target.value)}
                  />
                </>
              )}

              {tab === "affirmations" && (
                <textarea
                  className={inputClasses}
                  rows="6"
                  placeholder="Write an uplifting affirmation... *"
                  value={currentForm.content}
                  onChange={(e) => updateField("content", e.target.value)}
                />
              )}

              {tab === "prompts" && (
                <>
                  <textarea
                    className={inputClasses}
                    rows="4"
                    placeholder="Journal Prompt Text *"
                    value={currentForm.text}
                    onChange={(e) => updateField("text", e.target.value)}
                  />
                  <input
                    className={inputClasses}
                    placeholder="Category Tag (e.g. Gratitude)"
                    value={currentForm.tag}
                    onChange={(e) => updateField("tag", e.target.value)}
                  />
                </>
              )}

              {/* Visibility Toggle */}
              <label className="flex items-center gap-2 text-[11px] font-bold text-gray-600 mt-2 cursor-pointer bg-[#F8F9FA] p-3 border border-[#E0D8F0] rounded-lg">
                <input
                  type="checkbox"
                  checked={currentForm.isactive}
                  onChange={(e) => updateField("isactive", e.target.checked)}
                  className="w-4 h-4 rounded accent-[#7E57C2]"
                />
                Active / Visible to students
              </label>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-auto pt-4">
                <button
                  onClick={saveItem}
                  disabled={loading}
                  className="flex-1 py-3 bg-[#7E57C2] text-white rounded-lg text-[11px] font-bold hover:bg-[#512DA8] transition-colors disabled:opacity-60"
                >
                  {loading
                    ? "Saving..."
                    : editingId
                      ? "Update Item"
                      : "Create Item"}
                </button>
                {editingId && (
                  <button
                    onClick={resetCurrent}
                    className="px-5 py-3 bg-[#F0F2F5] text-gray-700 rounded-lg text-[11px] font-bold hover:bg-[#E2E8F0] transition-colors border border-[#E0D8F0]"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: List */}
          <div className="bg-white rounded-xl border border-[#B39DDB] flex flex-col overflow-hidden min-h-0 shadow-sm">
            <div className="px-4 py-3 text-[12px] font-bold text-[#512DA8] bg-[#EDE7F6] flex-shrink-0 border-b border-[#B39DDB] flex justify-between items-center">
              <span>Database Items</span>
              <span className="bg-[#512DA8] text-white px-2 py-0.5 rounded-full text-[9px]">
                {currentItems.length}
              </span>
            </div>

            <div className="overflow-y-auto flex-1 p-4 flex flex-col gap-2.5 custom-scrollbar">
              {currentItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 py-8">
                  <p className="text-[12px] font-semibold">No items found</p>
                  <p className="text-[10px] mt-1">
                    Create your first item on the left.
                  </p>
                </div>
              ) : (
                currentItems.map((item) => (
                  <div
                    key={item.id}
                    className={`bg-[#FAF8FF] border rounded-xl p-3.5 transition-colors ${
                      item.isactive === false
                        ? "border-[#E0D8F0] opacity-60"
                        : "border-[#B39DDB] hover:border-[#7E57C2]"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1 pr-3">
                        <p className="text-[12px] font-bold text-navy mb-1 leading-tight">
                          {item.title || item.content || item.text}
                        </p>

                        {"description" in item && item.description && (
                          <p className="text-[10px] text-gray-600 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        )}

                        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm ${
                              item.isactive !== false
                                ? "bg-[#E8F5E9] text-[#2E7D32]"
                                : "bg-[#FFEBEE] text-[#C62828]"
                            }`}
                          >
                            {item.isactive !== false ? "ACTIVE" : "HIDDEN"}
                          </span>

                          {"type" in item && item.type && (
                            <span className="text-[9px] bg-[#E3F2FD] text-[#1565C0] font-bold px-1.5 py-0.5 rounded-sm uppercase">
                              {item.type}
                            </span>
                          )}

                          {"tag" in item && item.tag && (
                            <span className="text-[9px] bg-[#F3E5F5] text-[#7B1FA2] font-bold px-1.5 py-0.5 rounded-sm">
                              {item.tag}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-1.5">
                        <button
                          onClick={() => startEdit(item)}
                          className="p-1.5 text-gray-500 hover:text-[#3498DB] hover:bg-[#E3F2FD] rounded transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="p-1.5 text-gray-500 hover:text-[#EF5350] hover:bg-[#FFEBEE] rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-3 text-center text-[10px] font-medium text-[#7A9AB8] border-t border-[#E0D8F0] bg-white flex-shrink-0">
        UNIMAS Mental Health & Well-Being Platform • Administrator Dashboard
      </footer>
    </div>
  );
}
