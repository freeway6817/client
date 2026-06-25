import { useState } from "react";
import { Heart } from "lucide-react";
import CrisisModal from "./CrisisModal";

export default function CrisisButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Need help? Open crisis support resources"
        title="Need help now?"
        className="fixed bottom-6 right-6 z-[8000] flex items-center gap-2 px-4 py-2.5 bg-[#C62828] text-white border-none rounded-full shadow-lg cursor-pointer hover:bg-[#B71C1C] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl text-[11px] font-bold"
        style={{ boxShadow: "0 4px 20px rgba(198,40,40,0.4)" }}
      >
        <Heart size={14} className="flex-shrink-0" />
        <span className="hidden sm:inline">Need help?</span>
      </button>

      <CrisisModal
        isOpen={open}
        reason="manual"
        onDismiss={() => setOpen(false)}
      />
    </>
  );
}
