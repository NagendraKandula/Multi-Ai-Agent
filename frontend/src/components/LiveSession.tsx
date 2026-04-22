import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "../styles/LiveSession.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  agent: string;
  content: string;
  side: "left" | "right";
}

interface Props {
  businessName?: string;
  location?: string;
  budgetRange?: string;
  targetMarket?: string;
  problemSolving?: string;
  selectedAgents?: string[];
  [key: string]: any; 
}

// ─── Agent Config (UI Only) ───────────────────────────────────────────────────

const AGENT_COLORS: Record<string, string> = {
  CTO: "#22c55e",
  CFO: "#f59e0b",
  CMO: "#3b82f6",
  COO: "#ef4444",
  CPO: "#8b5cf6",
  Legal: "#06b6d4",
  CSO: "#f97316",
  Supervisor: "#1e293b", // Updated label
  "Board Chairman": "#1e293b"
};

const AGENT_BG: Record<string, string> = {
  CTO: "#dcfce7",
  CFO: "#fef9c3",
  CMO: "#dbeafe",
  COO: "#fee2e2",
  CPO: "#ede9fe",
  Legal: "#cffafe",
  CSO: "#ffedd5",
  Supervisor: "#f3f4f6"
};

// ─── Agenda Setup Page ────────────────────────────────────────────────────────

const AgendaPage = ({
  businessName = "Startup",
  problemSolving = "",
  onStart,
}: Props & { onStart: (agenda: string) => void }) => {
  const [agenda, setAgenda] = useState(problemSolving);

  return (
    <div className={styles.agendaPage}>
      <div className={styles.agendaHeader}>
        <h1 className={styles.agendaTitle}>Interactive Meeting</h1>
        <p className={styles.agendaSubtitle}>Prepare the board for {businessName}</p>
      </div>

      <div className={styles.agendaCard}>
        <h2 className={styles.agendaCardTitle}>Set Meeting Agenda</h2>
        <textarea
          className={styles.agendaTextarea}
          placeholder="What specific problem should the board solve today?"
          value={agenda}
          onChange={(e) => setAgenda(e.target.value)}
          rows={6}
        />
        <div className={styles.agendaMeta}>
          <button className={styles.startBtn} onClick={() => onStart(agenda.trim())}>
            Start Session
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Live Session Page ────────────────────────────────────────────────────────

const LiveSessionPage = ({
  agenda,
  onEnd,
  ...onboardingData 
}: { agenda: string; onEnd: () => void } & Props) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [typingAgent, setTypingAgent] = useState<string | null>(null);
  const [initiated, setInitiated] = useState(false);
  
  const [searchParams] = useSearchParams();
  const threadId = searchParams.get("threadId");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingAgent]);

  useEffect(() => {
    if (!initiated && agenda) {
      setInitiated(true);
      handleAskBoard(agenda);
    }
  }, [agenda, initiated]);

  // ─── UPDATED: NESTJS API CALL ───
  const handleAskBoard = async (text: string) => {
    setTypingAgent("Supervisor"); // Set to Supervisor while waiting

    try {
      const response = await fetch("http://localhost:4000/simulation/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          onboardingData: onboardingData, 
        }),
      });

      if (!response.ok) throw new Error("Board connection failed");

      const data = await response.json();
      setTypingAgent(null);

      // Handle structured JSON array: [{"agent": "CTO", "content": "..."}]
      if (data.responses && Array.isArray(data.responses)) {
        const newMessages = data.responses.map((res: any, idx: number) => ({
          id: `ai-${Date.now()}-${idx}`,
          agent: res.agent || "Agent",
          content: res.content,
          side: "right" as const,
        }));

        setMessages((prev) => [...prev, ...newMessages]);
      }
    } catch (err) {
      console.error(err);
      setTypingAgent(null);
      alert("The Board meeting was interrupted. Ensure NestJS backend is running on port 4000.");
    }
  };

  const handleSend = () => {
    const text = userInput.trim();
    if (!text) return;
    setUserInput("");
    
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, agent: "You", content: text, side: "left" },
    ]);

    handleAskBoard(text);
  };

  return (
    <div className={styles.livePage}>
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <span className={styles.liveIndicator}><span className={styles.liveDot} />Live Session</span>
          <span className={styles.topBarSep}>•</span>
          <span className={styles.decisionLabel}>Business: {onboardingData.businessName}</span>
        </div>
        <div className={styles.topBarRight}>
          <button className={`${styles.topBtn} ${styles.endBtn}`} onClick={onEnd}>End</button>
        </div>
      </div>

      <div className={styles.chatScroll}>
        <div className={styles.heroSection}>
          <h2 className={styles.heroTitle}>Strategic Board Debate</h2>
        </div>

        <div className={styles.messagesFeed}>
          {messages.map((msg) => {
            const isUser = msg.agent === "You";
            const color = AGENT_COLORS[msg.agent] ?? "#6b7280";
            const bg = isUser ? "#1e293b" : (AGENT_BG[msg.agent] ?? "#f3f4f6");
            return (
              <div key={msg.id} className={`${styles.messageRow} ${msg.side === "right" ? styles.messageRowRight : styles.messageRowLeft}`}>
                {!isUser && (
                  <div className={styles.agentLabel}>
                    <span className={styles.agentDot} style={{ background: color }} />
                    <span className={styles.agentName}>{msg.agent}</span>
                  </div>
                )}
                <div className={styles.messageBubble} style={{ background: bg, color: isUser ? "#fff" : "inherit" }}>
                  {msg.content}
                </div>
              </div>
            );
          })}

          {typingAgent && (
            <div className={styles.messageRowLeft}>
               <div className={styles.agentLabel}>
                <span className={styles.agentDot} style={{ background: AGENT_COLORS[typingAgent] }} />
                <span className={styles.agentName}>{typingAgent} is coordinating...</span>
              </div>
              <div className={styles.typingBubble}>
                <span className={styles.typingDot} />
                <span className={styles.typingDot} />
                <span className={styles.typingDot} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className={styles.inputBarWrap}>
        <div className={styles.inputBar}>
          <input
            className={styles.chatInput}
            placeholder="Address your board members..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button className={styles.sendBtn} onClick={handleSend}>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
             </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Root Component ───────────────────────────────────────────────────────────

const LiveSession = (props: Props) => {
  const [view, setView] = useState<"agenda" | "live">("agenda");
  const [agenda, setAgenda] = useState("");
  
  return view === "live" ? (
    <LiveSessionPage
      agenda={agenda}
      onEnd={() => setView("agenda")}
      {...props}
    />
  ) : (
    <AgendaPage
      {...props}
      onStart={(a) => { setAgenda(a); setView("live"); }}
    />
  );
};

export default LiveSession;