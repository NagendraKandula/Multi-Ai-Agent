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

// --- CLEAN MESSAGE FUNCTION ---
const cleanMessageContent = (content: string) => {
  if (!content) return "";

  let cleaned = content.replace(/^(CMO|CTO|CFO|Supervisor):\s*/i, '');
  cleaned = cleaned.replace(/\*\*/g, '');
  cleaned = cleaned.replace(
    /<tools>[\s\S]*?<\/tools>/gi,
    '*(🔧 Consulted live data)*\n\n'
  );

  return cleaned.trim();
};

// --- Agent Styling ---
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

// --- Save session ---
const saveSession = (agenda: string, elapsedSeconds: number) => {
  const existing: Session[] = JSON.parse(localStorage.getItem("previousSessions") || "[]");
  const minutes = Math.floor(elapsedSeconds / 60);
  const secs = elapsedSeconds % 60;

  const duration = minutes > 0 ? `${minutes}m ${secs}s` : `${secs}s`;

  const newSession: Session = {
    id: Date.now().toString(),
    agenda,
    date: new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    }),
    duration,
  };

  const updated = [newSession, ...existing].slice(0, 5);
  localStorage.setItem("previousSessions", JSON.stringify(updated));
};

// ─── Agenda Page ─────────────────────
const AgendaPage = ({ onStart }: { onStart: (agenda: string) => void }) => {
  const [agenda, setAgenda] = useState("");
  const [sessions, setSessions] = useState<Session[]>([]);

  const onboardingData = JSON.parse(localStorage.getItem("onboardingData") || "{}");
  const bizName = onboardingData.businessName || "Your Startup";

  useEffect(() => {
    const saved: Session[] = JSON.parse(localStorage.getItem("previousSessions") || "[]");
    setSessions(saved);
  }, []);

  return (
    <div className={styles.agendaPage}>
      <div className={styles.agendaHeader}>
        <h1 className={styles.agendaTitle}>Interactive Meeting</h1>
        <p className={styles.agendaSubtitle}>{bizName}</p>
      </div>

      <div className={styles.agendaCard}>
        <h3>New Session</h3>
        <textarea
          className={styles.agendaTextarea}
          placeholder="What should the board discuss?"
          value={agenda}
          onChange={(e) => setAgenda(e.target.value)}
        />
        <button onClick={() => onStart(agenda.trim())} disabled={!agenda.trim()}>
          Start Session
        </button>
      </div>

      <div className={styles.sessionsCard}>
        {sessions.map((s) => (
          <div key={s.id} onClick={() => onStart(s.agenda)}>
            {s.agenda} ({s.duration})
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Live Session Page ─────────────────────
const LiveSessionPage = ({ agenda, onEnd }: { agenda: string; onEnd: () => void }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [typingAgent, setTypingAgent] = useState<string | null>(null);

  const hasStarted = useRef(false);
  const onboardingData = JSON.parse(localStorage.getItem("onboardingData") || "{}");

  useEffect(() => {
    let timer: any;
    if (!isPaused) {
      timer = setInterval(() => setElapsed((p) => p + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isPaused]);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;
    handleAskBoard(agenda);
  }, []);

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
          await new Promise((r) => setTimeout(r, 1200));

          const leftSideAgents = ["CFO", "CTO", "Supervisor"];
          const side: "left" | "right" = leftSideAgents.includes(msg.agent) ? "left" : "right";

          setMessages((prev) => [
            ...prev,
            {
              id: Math.random().toString(),
              agent: msg.agent,
              content: cleanMessageContent(msg.content), // ✅ CLEANED
              side,
            },
          ]);

          setTypingAgent(null);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLaunching(false);
    }
  };

  const handleSend = () => {
    if (!userInput.trim()) return;

    const text = userInput;
    setUserInput("");

    setMessages((prev) => [
      ...prev,
      {
        id: "user-" + Date.now(),
        agent: "You",
        content: cleanMessageContent(text), // ✅ CLEAN USER INPUT
        side: "right",
      },
    ]);

    handleAskBoard(text);
  };

  const handleStop = () => {
    saveSession(agenda, elapsed);
    onEnd();
  };

  return (
    <div className={styles.livePage}>
      <div className={styles.chatScroll}>
        <div className={styles.messagesFeed}>
          {messages.map((msg) => {
            const isUser = msg.agent === "You";

            return (
              <div key={msg.id} className={msg.side === "left" ? styles.rowLeft : styles.rowRight}>
                {!isUser && (
                  <div className={styles.agentLabel}>
                    <span
                      className={styles.agentDot}
                      style={{ background: AGENT_COLORS[msg.agent] }}
                    />
                    {msg.agent}
                  </div>
                )}

                <div
                  className={styles.bubble}
                  style={!isUser ? { background: AGENT_BG[msg.agent] } : {}}
                >
                  {msg.content}
                </div>
              </div>
            );
          })}

          {typingAgent && <div>{typingAgent} thinking...</div>}
        </div>
      </div>

      <div className={styles.inputBar}>
        <input
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>{isLaunching ? "..." : "Send"}</button>
        <button onClick={handleStop}>Stop</button>
      </div>
    </div>
  );
};

// ─── MAIN COMPONENT ─────────────────────
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