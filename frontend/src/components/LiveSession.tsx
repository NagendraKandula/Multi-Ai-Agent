import { useState, useEffect, useRef } from "react";
import styles from "../styles/LiveSession.module.css";

// ─── Types ─────────────────────────────────────────────

interface Message {
  id: string;
  agent: string;
  content: string;
  side: "left" | "right";
}

interface RoundMessage {
  agent: string;
  content: string;
}

interface Round {
  round: number;
  messages: RoundMessage[];
}

interface ApiResponse {
  rounds: Round[];
}

interface Props {
  businessName?: string;
  location?: string;
  budgetRange?: string;
  targetMarket?: string;
  problemSolving?: string;
  selectedAgents?: string[];
}

// ─── UI CONFIG ─────────────────────────────────────────

const AGENT_COLORS: Record<string, string> = {
  CTO: "#22c55e",
  CFO: "#f59e0b",
  CMO: "#3b82f6",
  COO: "#ef4444",
  CPO: "#8b5cf6",
  Legal: "#06b6d4",
  CSO: "#f97316",
  Supervisor: "#1e293b",
};

const AGENT_BG: Record<string, string> = {
  CTO: "#dcfce7",
  CFO: "#fef9c3",
  CMO: "#dbeafe",
  COO: "#fee2e2",
  CPO: "#ede9fe",
  Legal: "#cffafe",
  CSO: "#ffedd5",
  Supervisor: "#f3f4f6",
};

// ─── MAIN COMPONENT ───────────────────────────────────

const LiveSession = (props: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typingAgent, setTypingAgent] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingAgent]);

  const onboardingData = {
    businessName: props.businessName,
    location: props.location,
    budgetRange: props.budgetRange,
    targetMarket: props.targetMarket,
    problemSolving: props.problemSolving,
    selectedAgents: props.selectedAgents ?? ["CTO", "CFO", "CMO"],
  };

  // ─── AI CALL ───────────────────────────────────────
  const handleAskBoard = async (text: string) => {
    try {
      setTypingAgent("Supervisor");

      const res = await fetch("http://localhost:4000/simulation/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          onboardingData,
        }),
      });

      const data: ApiResponse = await res.json();
      setTypingAgent(null);

      if (!data.rounds) return;

      // ─── CLEAN REAL-TIME ROUND PLAY ───────────────
      for (const round of data.rounds) {

        // round header
        setMessages((prev) => [
          ...prev,
          {
            id: `round-${round.round}`,
            agent: "SYSTEM",
            content: `━━━━ Round ${round.round} ━━━━`,
            side: "right",
          },
        ]);

        // speakers
        for (const msg of round.messages) {

          setTypingAgent(msg.agent);

          await new Promise((r) => setTimeout(r, 1200));

          setMessages((prev) => [
            ...prev,
            {
              id: `${Date.now()}-${msg.agent}`,
              agent: msg.agent,
              content: msg.content,
              side: "right",
            },
          ]);

          setTypingAgent(null);

          await new Promise((r) => setTimeout(r, 500));
        }

        await new Promise((r) => setTimeout(r, 1200));
      }
    } catch (err) {
      console.error(err);
      setTypingAgent(null);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const text = input;
    setInput("");

    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        agent: "You",
        content: text,
        side: "left",
      },
    ]);

    handleAskBoard(text);
  };

  return (
    <div className={styles.livePage}>
      <div className={styles.chatScroll}>
        <h2 className={styles.heroTitle}>Strategic Board Debate</h2>

        <div className={styles.messagesFeed}>
          {messages.map((msg: Message) => {
            const isUser = msg.agent === "You";

            const bg = isUser
              ? "#1e293b"
              : AGENT_BG[msg.agent] ?? "#f3f4f6";

            const color = AGENT_COLORS[msg.agent] ?? "#000";

            return (
              <div
                key={msg.id}
                className={
                  msg.side === "left"
                    ? styles.messageRowLeft
                    : styles.messageRowRight
                }
              >
                {!isUser && (
                  <div className={styles.agentLabel}>
                    <span
                      className={styles.agentDot}
                      style={{ background: color }}
                    />
                    <span>{msg.agent}</span>
                  </div>
                )}

                <div
                  className={styles.messageBubble}
                  style={{
                    background: bg,
                    color: isUser ? "#fff" : "#000",
                  }}
                >
                  {msg.content}
                </div>
              </div>
            );
          })}

          {typingAgent && (
            <div className={styles.messageRowLeft}>
              <div className={styles.agentLabel}>
                <span
                  className={styles.agentDot}
                  style={{ background: AGENT_COLORS[typingAgent] }}
                />
                <span>{typingAgent} is speaking...</span>
              </div>

              <div className={styles.typingBubble}>...</div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* INPUT */}
      <div className={styles.inputBarWrap}>
        <div className={styles.inputBar}>
          <input
            className={styles.chatInput}
            value={input}
            placeholder="Ask the board..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />

          <button className={styles.sendBtn} onClick={handleSend}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveSession;