// // client/src/components/CrisisModal.jsx
// import { useEffect, useState } from "react";
// import {
//   X,
//   Phone,
//   MessageCircle,
//   Heart,
//   Users,
//   AlertTriangle,
// } from "lucide-react";
// import api from "../api/axios";

// const TYPE_META = {
//   hotline: { icon: Phone, color: "#C62828", bg: "#FFEBEE", border: "#EF9A9A" },
//   support: { icon: Users, color: "#1565C0", bg: "#E3F2FD", border: "#90CAF9" },
//   campus: { icon: Heart, color: "#2E7D32", bg: "#E8F5E9", border: "#A5D6A7" },
//   chat: {
//     icon: MessageCircle,
//     color: "#6A1B9A",
//     bg: "#F3E5F5",
//     border: "#CE93D8",
//   },
//   emergency: {
//     icon: AlertTriangle,
//     color: "#E65100",
//     bg: "#FFF3E0",
//     border: "#FFCC80",
//   },
// };

// const REASON_HEADLINE = {
//   journal_keyword:
//     "It sounds like you're carrying something really heavy right now.",
//   critical_score: "We noticed you're feeling really low right now.",
//   consecutive_lows: "We've noticed you've been having a tough few days.",
//   general: "We're here for you — you don't have to face this alone.",
// };

// export default function CrisisModal({ isOpen, reason, onDismiss }) {
//   const [resources, setResources] = useState([]);

//   useEffect(() => {
//     if (!isOpen) return;
//     api
//       .get("/api/crisis/resources")
//       .then((res) => setResources(res.data.resources || []))
//       .catch(() => {
//         // Fallback hardcoded in case API is unreachable
//         setResources([
//           {
//             id: 1,
//             name: "Befrienders Malaysia",
//             phone: "03-7956 8145",
//             hours: "24/7",
//             url: "https://www.befrienders.org.my",
//             type: "hotline",
//             description: null,
//           },
//           {
//             id: 2,
//             name: "MIASA Helpline",
//             phone: "03-2780 6803",
//             hours: "Mon–Fri",
//             url: "https://miasa.org.my",
//             type: "support",
//             description: null,
//           },
//           {
//             id: 3,
//             name: "UNIMAS Counselling",
//             phone: "Ext. 082-581000",
//             hours: "Office hours",
//             url: null,
//             type: "campus",
//             description: null,
//           },
//           {
//             id: 5,
//             name: "Malaysia Emergency",
//             phone: "999",
//             hours: "24/7",
//             url: null,
//             type: "emergency",
//             description: "For immediate life-threatening emergencies",
//           },
//         ]);
//       });
//   }, [isOpen]);

//   // Trap Escape key
//   useEffect(() => {
//     if (!isOpen) return;
//     const handler = (e) => {
//       if (e.key === "Escape") onDismiss();
//     };
//     window.addEventListener("keydown", handler);
//     return () => window.removeEventListener("keydown", handler);
//   }, [isOpen, onDismiss]);

//   if (!isOpen) return null;

//   const headline = REASON_HEADLINE[reason] || REASON_HEADLINE.general;

//   return (
//     <div
//       className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
//       role="dialog"
//       aria-modal="true"
//       aria-labelledby="crisis-modal-title"
//       onClick={onDismiss}
//       style={{ animation: "crisisFadeIn 0.2s ease" }}
//     >
//       <style>{`
//         @keyframes crisisFadeIn  { from { opacity: 0; } to { opacity: 1; } }
//         @keyframes crisisSlideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
//         .crisis-card { animation: crisisSlideUp 0.25s ease; }
//       `}</style>

//       <div
//         className="crisis-card bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Header */}
//         <div className="flex items-center gap-3 px-5 py-4 bg-[#FFEBEE] rounded-t-2xl border-b border-[#EF9A9A]">
//           <div className="w-10 h-10 rounded-full bg-[#FFCDD2] flex items-center justify-center flex-shrink-0">
//             <Heart size={20} className="text-[#C62828]" />
//           </div>
//           <div className="flex-1">
//             <h2
//               id="crisis-modal-title"
//               className="text-[15px] font-bold text-[#B71C1C]"
//             >
//               You are not alone 💙
//             </h2>
//             <p className="text-[10px] text-[#C62828] font-medium">
//               Help is available right now
//             </p>
//           </div>
//           <button
//             onClick={onDismiss}
//             className="text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-colors"
//             aria-label="Close"
//           >
//             <X size={18} />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="px-5 py-4">
//           {/* Empathetic message */}
//           <p className="text-[12px] text-gray-700 leading-relaxed mb-1">
//             {headline}
//           </p>
//           <p className="text-[11px] text-gray-500 leading-relaxed mb-4">
//             Reaching out is a sign of strength. These people are here to listen
//             — no judgement, any time.
//           </p>

//           {/* Resource cards */}
//           <div className="flex flex-col gap-2.5 mb-4">
//             {resources.map((r) => {
//               const meta = TYPE_META[r.type] || TYPE_META.support;
//               const IconComp = meta.icon;
//               return (
//                 <div
//                   key={r.id}
//                   className="flex items-start gap-3 rounded-xl px-3 py-3 border"
//                   style={{ backgroundColor: meta.bg, borderColor: meta.border }}
//                 >
//                   <div
//                     className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
//                     style={{
//                       backgroundColor: meta.bg,
//                       border: `1.5px solid ${meta.border}`,
//                     }}
//                   >
//                     <IconComp size={15} style={{ color: meta.color }} />
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="text-[11px] font-bold text-gray-800">
//                       {r.name}
//                     </p>
//                     {r.description && (
//                       <p className="text-[9px] text-gray-500 mt-0.5">
//                         {r.description}
//                       </p>
//                     )}
//                     {r.phone && (
//                       <a
//                         href={`tel:${r.phone.replace(/\s/g, "")}`}
//                         className="block text-[12px] font-black mt-1 hover:underline"
//                         style={{ color: meta.color }}
//                       >
//                         {r.phone}
//                       </a>
//                     )}
//                     {r.url && (
//                       <a
//                         href={r.url}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="block text-[9px] font-semibold mt-0.5 hover:underline"
//                         style={{ color: meta.color }}
//                       >
//                         Visit website ↗
//                       </a>
//                     )}
//                   </div>
//                   <span className="text-[9px] font-medium text-gray-500 flex-shrink-0 mt-0.5">
//                     {r.hours}
//                   </span>
//                 </div>
//               );
//             })}
//           </div>

//           {/* Emergency banner */}
//           <div className="bg-[#FFF3E0] border border-[#FFCC80] rounded-xl px-3 py-2.5 mb-5 flex items-center gap-2">
//             <AlertTriangle size={14} className="text-[#E65100] flex-shrink-0" />
//             <p className="text-[10px] text-[#E65100] font-semibold">
//               If you're in immediate danger, call <strong>999</strong> (Malaysia
//               Emergency).
//             </p>
//           </div>

//           {/* Action buttons */}
//           <div className="flex gap-3">
//             <button
//               onClick={onDismiss}
//               className="flex-1 py-2.5 bg-[#C62828] text-white border-none rounded-xl text-[11px] font-bold cursor-pointer hover:bg-[#B71C1C] transition-colors shadow-sm"
//             >
//               I'm okay for now
//             </button>
//             <button
//               onClick={onDismiss}
//               className="px-4 py-2.5 bg-gray-100 text-gray-600 border border-gray-200 rounded-xl text-[11px] font-semibold cursor-pointer hover:bg-gray-200 transition-colors"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// client/src/components/CrisisModal.jsx
import { useEffect, useState } from "react";
import {
  X,
  Phone,
  MessageCircle,
  Heart,
  Users,
  AlertTriangle,
  Bot,
} from "lucide-react";
import api from "../api/axios";
import CrisisCompanion from "./CrisisCompanion";

const TYPE_META = {
  hotline: { icon: Phone, color: "#C62828", bg: "#FFEBEE", border: "#EF9A9A" },
  support: { icon: Users, color: "#1565C0", bg: "#E3F2FD", border: "#90CAF9" },
  campus: { icon: Heart, color: "#2E7D32", bg: "#E8F5E9", border: "#A5D6A7" },
  chat: {
    icon: MessageCircle,
    color: "#6A1B9A",
    bg: "#F3E5F5",
    border: "#CE93D8",
  },
  emergency: {
    icon: AlertTriangle,
    color: "#E65100",
    bg: "#FFF3E0",
    border: "#FFCC80",
  },
};

const REASON_HEADLINE = {
  journal_keyword:
    "It sounds like you're carrying something really heavy right now.",
  critical_score: "We noticed you're feeling really low right now.",
  consecutive_lows: "We've noticed you've been having a tough few days.",
  manual: "It takes courage to reach out — we're here for you.",
  general: "We're here for you — you don't have to face this alone.",
};

export default function CrisisModal({ isOpen, reason, onDismiss }) {
  const [phase, setPhase] = useState("companion"); // "companion" | "resources"
  const [resources, setResources] = useState([]);

  // Pre-fetch resources in the background so Phase 2 is instant
  useEffect(() => {
    if (!isOpen) return;
    api
      .get("/api/crisis/resources")
      .then((res) => setResources(res.data.resources || []))
      .catch(() => {
        setResources([
          {
            id: 1,
            name: "Befrienders Malaysia",
            phone: "03-7956 8145",
            hours: "24/7",
            url: "https://www.befrienders.org.my",
            type: "hotline",
            description: null,
          },
          {
            id: 2,
            name: "MIASA Helpline",
            phone: "03-2780 6803",
            hours: "Mon–Fri",
            url: "https://miasa.org.my",
            type: "support",
            description: null,
          },
          {
            id: 3,
            name: "UNIMAS Counselling",
            phone: "Ext. 082-581000",
            hours: "Office hours",
            url: null,
            type: "campus",
            description: null,
          },
          {
            id: 5,
            name: "Malaysia Emergency",
            phone: "999",
            hours: "24/7",
            url: null,
            type: "emergency",
            description: "For immediate life-threatening emergencies",
          },
        ]);
      });
  }, [isOpen]);

  // Escape key closes modal
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === "Escape") onDismiss();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onDismiss]);

  if (!isOpen) return null;

  const headline = REASON_HEADLINE[reason] || REASON_HEADLINE.general;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="crisis-modal-title"
      onClick={onDismiss}
      style={{ animation: "crisisFadeIn 0.2s ease" }}
    >
      <style>{`
        @keyframes crisisFadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes crisisSlideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .crisis-card { animation: crisisSlideUp 0.25s ease; }
      `}</style>

      {/*
        key={String(isOpen)} — when the modal reopens, React remounts this div
        entirely, which resets `phase` to "companion" and clears the chat
        history in CrisisCompanion automatically. No useEffect needed.
      */}
      <div
        key={String(isOpen)}
        className="crisis-card bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 px-5 py-4 bg-[#FFEBEE] rounded-t-2xl border-b border-[#EF9A9A]">
          <div className="w-10 h-10 rounded-full bg-[#FFCDD2] flex items-center justify-center flex-shrink-0">
            <Heart size={20} className="text-[#C62828]" />
          </div>
          <div className="flex-1">
            <h2
              id="crisis-modal-title"
              className="text-[15px] font-bold text-[#B71C1C]"
            >
              You are not alone 💙
            </h2>
            <p className="text-[10px] text-[#C62828] font-medium">
              Help is available right now
            </p>
          </div>
          <button
            onClick={onDismiss}
            className="text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Phase tab switcher ─────────────────────────────────────────── */}
        <div className="flex border-b border-gray-100 px-5 pt-3 gap-1">
          <button
            onClick={() => setPhase("companion")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg text-[10px] font-bold transition-colors border-b-2 ${
              phase === "companion"
                ? "border-[#C62828] text-[#C62828] bg-[#FFF5F5]"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            <Bot size={11} />
            AI Companion
          </button>
          <button
            onClick={() => setPhase("resources")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg text-[10px] font-bold transition-colors border-b-2 ${
              phase === "resources"
                ? "border-[#C62828] text-[#C62828] bg-[#FFF5F5]"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            <Phone size={11} />
            Helplines
          </button>
        </div>

        {/* ── Body ──────────────────────────────────────────────────────── */}
        <div className="px-5 py-4">
          <p className="text-[12px] text-gray-700 leading-relaxed mb-3">
            {headline}
          </p>

          {/* ── Phase 1: AI Companion ──────────────────────────────────── */}
          {phase === "companion" && (
            <CrisisCompanion onShowResources={() => setPhase("resources")} />
          )}

          {/* ── Phase 2: Helplines ────────────────────────────────────── */}
          {phase === "resources" && (
            <>
              <p className="text-[11px] text-gray-500 leading-relaxed mb-4">
                Reaching out is a sign of strength. These people are here to
                listen — no judgement, any time.
              </p>

              <div className="flex flex-col gap-2.5 mb-4">
                {resources.map((r) => {
                  const meta = TYPE_META[r.type] || TYPE_META.support;
                  const IconComp = meta.icon;
                  return (
                    <div
                      key={r.id}
                      className="flex items-start gap-3 rounded-xl px-3 py-3 border"
                      style={{
                        backgroundColor: meta.bg,
                        borderColor: meta.border,
                      }}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{
                          backgroundColor: meta.bg,
                          border: `1.5px solid ${meta.border}`,
                        }}
                      >
                        <IconComp size={15} style={{ color: meta.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-gray-800">
                          {r.name}
                        </p>
                        {r.description && (
                          <p className="text-[9px] text-gray-500 mt-0.5">
                            {r.description}
                          </p>
                        )}
                        {r.phone && (
                          <a
                            href={`tel:${r.phone.replace(/\s/g, "")}`}
                            className="block text-[12px] font-black mt-1 hover:underline"
                            style={{ color: meta.color }}
                          >
                            {r.phone}
                          </a>
                        )}
                        {r.url && (
                          <a
                            href={r.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-[9px] font-semibold mt-0.5 hover:underline"
                            style={{ color: meta.color }}
                          >
                            Visit website ↗
                          </a>
                        )}
                      </div>
                      <span className="text-[9px] font-medium text-gray-500 flex-shrink-0 mt-0.5">
                        {r.hours}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Emergency banner */}
              <div className="bg-[#FFF3E0] border border-[#FFCC80] rounded-xl px-3 py-2.5 mb-5 flex items-center gap-2">
                <AlertTriangle
                  size={14}
                  className="text-[#E65100] flex-shrink-0"
                />
                <p className="text-[10px] text-[#E65100] font-semibold">
                  If you're in immediate danger, call <strong>999</strong>{" "}
                  (Malaysia Emergency).
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onDismiss}
                  className="flex-1 py-2.5 bg-[#C62828] text-white border-none rounded-xl text-[11px] font-bold cursor-pointer hover:bg-[#B71C1C] transition-colors shadow-sm"
                >
                  I'm okay for now
                </button>
                <button
                  onClick={onDismiss}
                  className="px-4 py-2.5 bg-gray-100 text-gray-600 border border-gray-200 rounded-xl text-[11px] font-semibold cursor-pointer hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
