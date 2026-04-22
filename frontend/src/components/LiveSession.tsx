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
  // Allow any other fields from the 4-step wizard
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
  ...onboardingData // Capture all Step 1-4 data
}: { agenda: string; onEnd: () => void } & Props) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [typingAgent, setTypingAgent] = useState<string | null>(null);
  const [initiated, setInitiated] = useState(false);
  
  const [searchParams] = useSearchParams();
  const threadId = searchParams.get("threadId");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ─── Auto Scroll ───
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingAgent]);

  // ─── Initial Meeting Call ───
  useEffect(() => {
    if (!initiated && agenda) {
      setInitiated(true);
      handleAskBoard(agenda);
    }
  }, [agenda, initiated]);

  // ─── REAL AI DEBATE API CALL ───
  const handleAskBoard = async (text: string) => {
    setTypingAgent("Board Chairman");

    try {
      const response = await fetch("http://localhost:8000/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problem: text,
          threadId: threadId,
          onboarding_data: onboardingData, // Send all wizard context
        }),
      });

      if (!response.ok) throw new Error("Board connection failed");

      const data = await response.json();
      setTypingAgent(null);

      // Backend returns "responses": ["CTO: text", "CFO: text"]
      if (data.responses && Array.isArray(data.responses)) {
        data.responses.forEach((content: string, idx: number) => {
          // Parse "Role: Message" format
          const [agentName, ...rest] = content.split(": ");
          const messageBody = rest.join(": ");

          setMessages((prev) => [
            ...prev,
            {
              id: `ai-${Date.now()}-${idx}`,
              agent: agentName || "Board Member",
              content: messageBody || content,
              side: "right", 
            },
          ]);
        });
      }
    } catch (err) {
      console.error(err);
      setTypingAgent(null);
      alert("The Board meeting was interrupted. Check if Python backend is running.");
    }
  };

  const handleSend = () => {
    const text = userInput.trim();
    if (!text) return;
    setUserInput("");
    
    // Add user bubble
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, agent: "You", content: text, side: "left" },
    ]);

    // Trigger AI debate
    handleAskBoard(text);
  };

  return (
    <div className={styles.livePage}>
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <span className={styles.liveIndicator}><span className={styles.liveDot} />Live Session</span>
          <span className={styles.topBarSep}>•</span>
          <span className={styles.decisionLabel}>Persisting Board: {threadId || 'New Session'}</span>
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
                <span className={styles.agentName}>{typingAgent}</span>
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
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    if (searchParams.get("threadId")) {
      setAgenda(props.problemSolving || "Let's begin the review.");
      setView("live");
    }
  }, [searchParams, props.problemSolving]);

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