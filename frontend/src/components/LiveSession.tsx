import { useState, useEffect, useRef } from "react";
import styles from "../styles/LiveSession.module.css";

// --- Types ---
interface Message {
  id: string;
  agent: string;
  content: string;
  side: "left" | "right";
}

interface Round {
  round: number;
  messages: { agent: string; content: string }[];
}

interface Session {
  id: string;
  agenda: string;
  date: string;
  duration: string;
}

// --- Agent Styling Config ---
const AGENT_COLORS: Record<string, string> = {
  CTO: "#22c55e", CFO: "#f59e0b", CMO: "#3b82f6",
  COO: "#ef4444", CPO: "#8b5cf6", Legal: "#06b6d4",
  CSO: "#f97316", Supervisor: "#1e293b"
};

const AGENT_BG: Record<string, string> = {
  CTO: "#dcfce7", CFO: "#fef9c3", CMO: "#dbeafe",
  COO: "#fee2e2", CPO: "#ede9fe", Legal: "#cffafe",
  CSO: "#ffedd5", Supervisor: "#f1f5f9"
};

// --- Save session helper ---
const saveSession = (agenda: string, elapsedSeconds: number) => {
  const existing: Session[] = JSON.parse(localStorage.getItem("previousSessions") || "[]");
  const minutes = Math.floor(elapsedSeconds / 60);
  const secs = elapsedSeconds % 60;
  const duration = minutes > 0 ? `${minutes}m ${secs}s` : `${secs}s`;
  const newSession: Session = {
    id: Date.now().toString(),
    agenda,
    date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    duration,
  };
  const updated = [newSession, ...existing].slice(0, 5);
  localStorage.setItem("previousSessions", JSON.stringify(updated));
};

// ─── Agenda Setup Page ────────────────────────────────────────────────────────

const AgendaPage = ({ onStart }: { onStart: (agenda: string) => void }) => {
  const [agenda, setAgenda] = useState("");
  const [sessions, setSessions] = useState<Session[]>([]);

  const onboardingData = JSON.parse(localStorage.getItem("onboardingData") || "{}");
  const bizName = onboardingData.businessName || "Your Startup";

  useEffect(() => {
    const saved: Session[] = JSON.parse(localStorage.getItem("previousSessions") || "[]");
    setSessions(saved);
  }, []);

  const handleClearSessions = () => {
    localStorage.removeItem("previousSessions");
    setSessions([]);
  };

  return (
    <div className={styles.agendaPage}>

      {/* Header */}
      <div className={styles.agendaHeader}>
        <h1 className={styles.agendaTitle}>Interactive Meeting</h1>
        <p className={styles.agendaSubtitle}>{bizName}</p>
      </div>

      {/* New Session Card */}
      <div className={styles.agendaCard}>
        <h3 className={styles.agendaCardTitle}>New Session</h3>
        <p className={styles.agendaQuestion}>What should the board discuss today?</p>
        <textarea
          className={styles.agendaTextarea}
          placeholder="e.g. Discuss our market entry strategy and how to allocate the initial budget..."
          value={agenda}
          onChange={(e) => setAgenda(e.target.value)}
          rows={4}
        />
        <button
          className={styles.startBtn}
          onClick={() => onStart(agenda.trim())}
          disabled={!agenda.trim()}
        >
          Start Session
        </button>
      </div>

      {/* Previous Sessions Card */}
      <div className={styles.sessionsCard}>
        <div className={styles.sessionsHeader}>
          <h3 className={styles.sessionsTitle}>Previous Sessions</h3>
          {sessions.length > 0 && (
            <button className={styles.clearBtn} onClick={handleClearSessions}>
              Clear all
            </button>
          )}
        </div>

        {sessions.length === 0 ? (
          <p className={styles.emptyState}>No previous sessions yet.</p>
        ) : (
          <div className={styles.sessionList}>
            {sessions.map((s) => (
              <div
                key={s.id}
                className={styles.sessionItem}
                onClick={() => onStart(s.agenda)}
              >
                <div className={styles.sessionInfo}>
                  <span className={styles.sessionAgenda}>{s.agenda}</span>
                  <span className={styles.sessionMeta}>{s.date} · {s.duration}</span>
                </div>
                <span className={styles.sessionResume}>Resume →</span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

// ─── Live Session Page ────────────────────────────────────────────────────────

const LiveSessionPage = ({ agenda, onEnd }: { agenda: string; onEnd: () => void }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [typingAgent, setTypingAgent] = useState<string | null>(null);

  const hasStarted = useRef(false);

  const onboardingData = JSON.parse(localStorage.getItem("onboardingData") || "{}");

  // Timer
  useEffect(() => {
    let timer: any;
    if (!isPaused) {
      timer = setInterval(() => setElapsed((prev) => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isPaused]);

  // Initial prompt — fires only once
  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;
    handleAskBoard(agenda);
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const handleAskBoard = async (text: string) => {
    if (isPaused) return;
    setIsLaunching(true);
    try {
      const res = await fetch("http://localhost:4000/simulation/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, data: onboardingData }),
      });

      const data = await res.json();

      for (const round of data.rounds as Round[]) {
        for (const msg of round.messages) {
          setTypingAgent(msg.agent);
          await new Promise(r => setTimeout(r, 1200));

          const leftSideAgents = ["CFO", "CTO", "Supervisor"];
          const side: "left" | "right" = leftSideAgents.includes(msg.agent) ? "left" : "right";

          setMessages((prev) => [
            ...prev,
            { id: Math.random().toString(), agent: msg.agent, content: msg.content, side },
          ]);
          setTypingAgent(null);
        }
      }
    } catch (err) {
      console.error("API Error:", err);
    } finally {
      setIsLaunching(false);
    }
  };

  const handleSend = () => {
    if (!userInput.trim() || isLaunching || isPaused) return;
    const text = userInput;
    setUserInput("");
    setMessages((prev) => [
      ...prev,
      { id: "user-" + Date.now(), agent: "You", content: text, side: "right" },
    ]);
    handleAskBoard(text);
  };

  const handleDebate = () => {
    handleAskBoard("The board should now debate the risks and counter-arguments of the current plan.");
  };

  const handleStop = () => {
    saveSession(agenda, elapsed);
    onEnd();
  };

  return (
    <div className={styles.livePage}>

      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <span className={styles.liveIndicator}>
            <span className={styles.liveDot} />
            Live
          </span>
          <span className={styles.timer}>{formatTime(elapsed)}</span>
        </div>
        <div className={styles.topBarRight}>
          <button className={styles.topBtn} onClick={() => setIsPaused(!isPaused)}>
            {isPaused ? "Resume" : "Pause"}
          </button>
          <button className={styles.topBtn} onClick={handleDebate} disabled={isLaunching}>
            Debate
          </button>
          <button className={`${styles.topBtn} ${styles.endBtn}`} onClick={handleStop}>
            Stop
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className={styles.chatScroll}>
        <div className={styles.messagesFeed}>
          {messages.map((msg) => {
            const isUser = msg.agent === "You";
            return (
              <div
                key={msg.id}
                className={`${styles.messageRow} ${msg.side === "left" ? styles.rowLeft : styles.rowRight}`}
              >
                {!isUser && (
                  <div className={styles.agentLabel}>
                    <span
                      className={styles.agentDot}
                      style={{ background: AGENT_COLORS[msg.agent] || "#6b7280" }}
                    />
                    <span className={styles.agentName}>{msg.agent}</span>
                  </div>
                )}
                <div
                  className={`${styles.bubble} ${isUser ? styles.userBubble : styles.agentBubble}`}
                  style={!isUser ? { background: AGENT_BG[msg.agent] } : {}}
                >
                  {msg.content}
                </div>
              </div>
            );
          })}

          {typingAgent && (
            <div
              className={`${styles.messageRow} ${
                ["CFO", "CTO", "Supervisor"].includes(typingAgent) ? styles.rowLeft : styles.rowRight
              }`}
            >
              <div className={styles.agentLabel}>
                <span
                  className={styles.agentDot}
                  style={{ background: AGENT_COLORS[typingAgent] }}
                />
                <span className={styles.agentName}>{typingAgent} is thinking...</span>
              </div>
              <div className={styles.typingBubble}>
                <span className={styles.dot} />
                <span className={styles.dot} />
                <span className={styles.dot} />
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Input Bar */}
      <div className={styles.inputBarWrap}>
        <div className={styles.inputBar}>
          <input
            className={styles.chatInput}
            placeholder={isPaused ? "Session is paused" : "Message the board..."}
            value={userInput}
            disabled={isPaused}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            className={styles.sendBtn}
            onClick={handleSend}
            disabled={isLaunching || isPaused}
          >
            {isLaunching ? "..." : "Send"}
          </button>
        </div>
      </div>

    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────

const LiveSession = () => {
  const [view, setView] = useState<"agenda" | "live">("agenda");
  const [agenda, setAgenda] = useState("");

  return view === "live" ? (
    <LiveSessionPage agenda={agenda} onEnd={() => setView("agenda")} />
  ) : (
    <AgendaPage onStart={(a) => { setAgenda(a); setView("live"); }} />
  );
};

export default LiveSession;