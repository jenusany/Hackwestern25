// src/components/AdvisorChat.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { sendChatMessage, ChatTurn } from "@/lib/geminiClient";

const QUICK_QUESTIONS = [
  "Emergency fund vs TFSA?",
  "How to prep for mat leave?",
  "TFSA vs RRSP?",
  "How big should my emergency fund be?",
];

const AdvisorChat = () => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<ChatTurn[]>([]);
  const [loading, setLoading] = useState(false);

  const runChat = async (message: string) => {
    if (!message.trim() || loading) return;

    const userTurn: ChatTurn = { role: "user", content: message };
    const newHistory = [...history, userTurn];

    setHistory(newHistory);
    setInput("");
    setLoading(true);

    try {
      const reply = await sendChatMessage(userTurn.content, newHistory);
      const assistantTurn: ChatTurn = { role: "assistant", content: reply };
      setHistory((prev) => [...prev, assistantTurn]);
    } catch (error) {
      console.error("Chat error", error);
      setHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I had trouble reaching the AI advisor. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => runChat(input);
  const handleQuickAsk = (q: string) => runChat(q);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 flex flex-col gap-4 h-full">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-foreground">
          Chat with your money advisor
        </h3>
        <p className="text-xs text-muted-foreground">
          I can only talk about money and personal finance. Ask about timelines,
          TFSAs, FHSAs, RRSPs, emergency funds, planning for mat leave, or long-term goals.
        </p>
      </div>

      {/* 🔥 Compact horizontal preset questions */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {QUICK_QUESTIONS.map((q) => (
          <Button
            key={q}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleQuickAsk(q)}
            disabled={loading}
            className="
              whitespace-nowrap
              text-[11px] md:text-xs
              rounded-full
              px-3 py-1
              flex-shrink-0
            "
          >
            {q}
          </Button>
        ))}
      </div>

      {/* CHAT HISTORY */}
      <div className="flex-1 min-h-[220px] max-h-full overflow-y-auto space-y-3 border rounded-md p-3 bg-background/40">
        {history.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Ask me something like{" "}
            <span className="italic">“How should I prioritize TFSA vs RRSP?”</span>{" "}
            or tap a suggested question above.
          </p>
        )}

        {history.map((turn, idx) => (
          <div
            key={idx}
            className={
              turn.role === "user"
                ? "text-sm text-foreground"
                : "text-sm text-primary-foreground bg-primary/80 rounded-md px-3 py-2 whitespace-pre-line"
            }
          >
            {turn.role === "user" ? `You: ${turn.content}` : turn.content}
          </div>
        ))}
      </div>

      {/* INPUT AREA */}
      <div className="space-y-2 pt-1">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a money question…"
          className="w-full min-h-[80px] rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground resize-y focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <div className="flex justify-end">
          <Button onClick={handleSend} disabled={loading || !input.trim()}>
            {loading ? "Thinking…" : "Send"}
          </Button>
        </div>
      </div>

      {/* HIDE SCROLLBARS */}
      <style>
        {`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
    </div>
  );
};

export default AdvisorChat;
