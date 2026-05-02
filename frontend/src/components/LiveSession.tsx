import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/LiveSession.module.css";

// --- Types ---
interface Message {
  id: string;
  agent: string;
  content: string;
  side: "left" | "right";
}

interface LiveSessionProps {
  setActive: (page: string) => void;
  setSessionData: (data: any) => void;
}

interface Round {
  round: number;
  messages: { agent: string; content: string }[];
}

// ✅ 1. Added messages and transcript to the Session type
interface Session {
  id: string;
  agenda: string;
  date: string;
  duration: string;
  messages: Message[];
  transcript: string[];
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

// ✅ 2. Updated helper to actually save the chat messages and transcript
const saveSession = (agenda: string, elapsedSeconds: number, messages: Message[], transcript: string[]) => {
  const existing: Session[] = JSON.parse(localStorage.getItem("previousSessions") || "[]");
  const minutes = Math.floor(elapsedSeconds / 60);
  const secs = elapsedSeconds % 60;
  const duration = minutes > 0 ? `${minutes}m ${secs}s` : `${secs}s`;
  
  const newSession: Session = {
    id: Date.now().toString(),
    agenda,
    date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    duration,
    messages,     // Store UI messages
    transcript    // Store backend transcript
  };
  
  const updated = [newSession, ...existing].slice(0, 5); // Keep last 5 sessions
  localStorage.setItem("previousSessions", JSON.stringify(updated));
};

// ─── Agenda Setup Page ────────────────────────────────────────────────────────

const AgendaPage = ({ onStart }: { onStart: (agenda: string, savedSession?: Session) => void }) => {
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
      <div className={styles.agendaHeader}>
        <h1 className={styles.agendaTitle}>Interactive Meeting</h1>
        <p className={styles.agendaSubtitle}>{bizName}</p>
      </div>

      <div className={styles.agendaCard}>
        <h3 className={styles.agendaCardTitle}>New Session</h3>
        <p className={styles.agendaQuestion}>What should the board discuss today?</p>
        <textarea
          className={styles.agendaTextarea}
          placeholder="e.g. Discuss our market entry strategy..."
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
                onClick={() => onStart(s.agenda, s)} // ✅ Pass the full saved session back!
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

const LiveSessionPage = ({ 
  agenda, 
  savedSession, // ✅ Accept the saved session as a prop
  onEnd,
  setActive,
  setSessionData
}: { 
  agenda: string; 
  savedSession?: Session;
  onEnd: () => void;
  setActive: (page: string) => void;
  setSessionData: (data: any) => void;
}) => {
  
  // ✅ 3. Initialize state with the saved session data so the chat reappears!
  const [messages, setMessages] = useState<Message[]>(savedSession?.messages || []);
  const [transcript, setTranscript] = useState<string[]>(savedSession?.transcript || []);
  const [isDebateOver, setIsDebateOver] = useState(savedSession?.transcript ? savedSession.transcript.length > 0 : false);
  
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
      timer = setInterval(() => setElapsed((prev) => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isPaused]);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;
    
    // ✅ 4. Only auto-start the debate if it's a BRAND NEW session
    if (!savedSession || !savedSession.messages || savedSession.messages.length === 0) {
      handleAskBoard(agenda);
    }
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
        body: JSON.stringify({ message: text, onboardingData })
      });

      const data = await res.json();
      
      if (!res.ok || !data?.rounds) {
        console.error("Bad response:", data);
        return;
      }
      
      if (data.transcript) {
        setTranscript(data.transcript);
        setIsDebateOver(true);
      }

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
    // ✅ Include messages and transcript when saving!
    saveSession(agenda, elapsed, messages, transcript);
    onEnd();
  };

  return (
    <div className={styles.livePage}>
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
                  style={{ background: AGENT_COLORS[typingAgent] || "#6b7280" }}
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

      {isDebateOver && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "16px" }}>
          <button
            className={styles.topBtn}
            onClick={() => {
              // ✅ 5. Save the session automatically when they proceed to the summary!
              saveSession(agenda, elapsed, messages, transcript);
              setSessionData({ transcript, onboardingData });
              setActive("summary");
            }}
          >
            Generate Decision Summary
          </button>
        </div>
      )}

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

const LiveSession: React.FC<LiveSessionProps> = ({ setActive, setSessionData }) => {
  const [view, setView] = useState<"agenda" | "live">("agenda");
  const [agenda, setAgenda] = useState("");
  const [restoredSession, setRestoredSession] = useState<Session | undefined>();

  return view === "live" ? (
    <LiveSessionPage 
      agenda={agenda} 
      savedSession={restoredSession} // Pass the restored history down!
      onEnd={() => setView("agenda")} 
      setActive={setActive}
      setSessionData={setSessionData}
    />
  ) : (
    <AgendaPage 
      onStart={(a, session) => { 
        setAgenda(a); 
        setRestoredSession(session); // Catch the history from the click
        setView("live"); 
      }} 
    />
  );
};

export default LiveSession;