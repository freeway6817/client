import { useState, useRef, useEffect } from "react";
import { Send, Bot, AlertTriangle, ChevronRight } from "lucide-react";
import api from "../api/axios";

const OPENING_MESSAGE = {
  role: "assistant",
  content:
    "Hi, I'm here with you right now. This is a safe space — you don't have to go through this alone. What's on your mind?",
};

const MAX_HISTORY_TURNS = 6;

export default function CrisisCompanion({ onShowResources }) {
  const [messages, setMessages] = useState([OPENING_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userMsgCount, setUserMsgCount] = useState(0);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: "user", content: text };
    const updatedMessages = [...messages, userMsg];

    setMessages(updatedMessages);
    setInput("");
    setUserMsgCount((c) => c + 1);
    setLoading(true);

    try {
      const { data } = await api.post("/api/crisis/companion-chat", {
        messages: updatedMessages.slice(-MAX_HISTORY_TURNS),
      });

      if (data.forceResources) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.message },
        ]);
        setLoading(false);
        setTimeout(() => onShowResources(), 1500);
        return;
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm still here with you. If you'd like to speak to someone immediately, I can show you some helpful contacts.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col">
      {/* Ethical disclaimer */}
      <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-3">
        <AlertTriangle
          size={13}
          className="text-amber-600 flex-shrink-0 mt-0.5"
        />
        <p className="text-[9px] text-amber-700 leading-relaxed font-medium">
          <strong>AI Support Companion</strong>, not a substitute for
          professional help. This AI cannot call for help on your behalf.
        </p>
      </div>

      {/* Message thread */}
      <div
        className="flex flex-col gap-2.5 overflow-y-auto pr-1 mb-3"
        style={{ maxHeight: "210px" }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="w-5 h-5 rounded-full bg-[#FFCDD2] flex items-center justify-center flex-shrink-0 mr-1.5 mt-0.5">
                <Bot size={11} className="text-[#C62828]" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-3 py-2 text-[11px] leading-relaxed ${
                msg.role === "user"
                  ? "bg-[#C62828] text-white rounded-br-sm"
                  : "bg-gray-100 text-gray-800 rounded-bl-sm"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="w-5 h-5 rounded-full bg-[#FFCDD2] flex items-center justify-center flex-shrink-0 mr-1.5 mt-0.5">
              <Bot size={11} className="text-[#C62828]" />
            </div>
            <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-3 py-2">
              <div className="flex gap-1 items-center h-4">
                <span
                  className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Gentle nudge to helplines after 3 user messages */}
      {userMsgCount >= 3 && (
        <button
          onClick={onShowResources}
          className="flex items-center justify-between w-full bg-[#FFF3E0] border border-[#FFCC80] rounded-xl px-3 py-2 mb-2 cursor-pointer hover:bg-[#FFE0B2] transition-colors text-left"
        >
          <p className="text-[10px] text-[#E65100] font-semibold leading-relaxed">
            Talking to a trained listener at Befrienders can help even more.
          </p>
          <ChevronRight
            size={13}
            className="text-[#E65100] flex-shrink-0 ml-2"
          />
        </button>
      )}

      {/* Text input */}
      <div className="flex gap-2 items-end">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Share what's on your mind… (Enter to send)"
          rows={2}
          disabled={loading}
          className="flex-1 resize-none rounded-xl border border-gray-200 px-3 py-2 text-[11px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#C62828] transition-colors"
          style={{ maxHeight: "80px" }}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          aria-label="Send message"
          className="flex-shrink-0 w-8 h-8 rounded-xl bg-[#C62828] text-white flex items-center justify-center hover:bg-[#B71C1C] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={13} />
        </button>
      </div>
    </div>
  );
}
