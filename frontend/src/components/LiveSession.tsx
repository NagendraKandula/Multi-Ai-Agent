import { useState, useEffect, useRef } from "react";
import styles from "../styles/LiveSession.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Session {
  id: string;
  title: string;
  date: string;
  messages: number;
  duration: string;
  agents: string[];
}

interface Message {
  id: string;
  agent: string;
  content: string;
  side: "left" | "right";
}

interface Props {
  businessName?: string;
  location?: string;
  budget?: string;
  targetMarket?: string;
  problem?: string;
  selectedAgents?: string[];
}

// ─── Agent config ─────────────────────────────────────────────────────────────

const AGENT_COLORS: Record<string, string> = {
  CTO: "#22c55e",
  CFO: "#f59e0b",
  CMO: "#3b82f6",
  COO: "#ef4444",
  CPO: "#8b5cf6",
  Legal: "#06b6d4",
  CSO: "#f97316",
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

const MOCK_RESPONSES: Record<string, (topic: string) => string> = {
  CTO: (t) => `Build a flexible, scalable system with configurable components for "${t}". Enable automation and dynamic adjustments based on real-time data and demand signals.`,
  CFO: (t) => `Set targets to maintain healthy margins per unit and per customer on "${t}". Use subscription models to improve lifetime value even if initial margins are slightly lower.`,
  CMO: (t) => `For "${t}", focus on customer acquisition through targeted digital channels. Build brand trust early with transparent pricing and consistent messaging to your core demographic.`,
  COO: (t) => `Calculate per-order costs (fuel + labor + packaging) for "${t}" and price above it. Optimize routes and workflows so operational fees stay low but remain profitable.`,
  CPO: (t) => `Prioritize the user journey first for "${t}". Ensure the core experience is frictionless before layering in advanced features. Validate with real users early.`,
  Legal: (t) => `Ensure compliance with local regulations and data protection laws for "${t}". Draft clear terms of service and review liability exposure before launch.`,
  CSO: (t) => `Identify your highest-value customer segments first for "${t}". Build repeatable outreach processes and track conversion metrics from day one.`,
};

const MOCK_SESSIONS: Session[] = [
  { id: "1", title: "pricing?", date: "2026-04-20", messages: 9, duration: "01:00", agents: ["CTO", "CFO", "COO"] },
  { id: "2", title: "Discuss market entry strategy for dairy delivery service", date: "2026-04-15", messages: 24, duration: "12:45", agents: ["CTO", "CFO", "COO", "CMO"] },
  { id: "3", title: "Marketing channel prioritisation", date: "2026-04-10", messages: 16, duration: "08:22", agents: ["CMO", "CFO"] },
];

// ─── Agenda Setup Page ────────────────────────────────────────────────────────

const AgendaPage = ({
  businessName = "Milk Delivery Service",
  location = "Small Town",
  budget = "$50,000",
  targetMarket = "Families",
  problem = "People don't have time to visit stores for milk. We bring fresh milk to their doorstep.",
  onStart,
}: Props & { onStart: (agenda: string) => void }) => {
  const [agenda, setAgenda] = useState("");
  const [editingProblem, setEditingProblem] = useState(false);
  const [problemText, setProblemText] = useState(problem);

  const placeholder = `Example: Discuss strategies for launching ${businessName} in ${location} with a budget of ${budget}, targeting ${targetMarket}. Focus on:\n- Market entry strategy\n- Budget allocation\n- Technology requirements\n- Marketing approach\n- Timeline and milestones`;

  return (
    <div className={styles.agendaPage}>
      <div className={styles.agendaHeader}>
        <h1 className={styles.agendaTitle}>Interactive Meeting</h1>
        <p className={styles.agendaSubtitle}>{businessName} - {location}</p>
      </div>

      {/* Agenda Card */}
      <div className={styles.agendaCard}>
        <h2 className={styles.agendaCardTitle}>Set Meeting Agenda</h2>
        <p className={styles.agendaQuestion}>What would you like the AI agents to discuss?</p>

        <textarea
          className={styles.agendaTextarea}
          placeholder={placeholder}
          value={agenda}
          onChange={(e) => setAgenda(e.target.value)}
          rows={6}
        />

        <div className={styles.agendaMeta}>
          <div className={styles.agendaMetaLeft}>
            <span className={styles.metaItem}>
              <strong>Problem:</strong>{" "}
              {editingProblem ? (
                <input
                  className={styles.metaInlineInput}
                  value={problemText}
                  onChange={(e) => setProblemText(e.target.value)}
                  onBlur={() => setEditingProblem(false)}
                  autoFocus
                />
              ) : (
                <>
                  {problemText}{" "}
                  <button className={styles.editBtn} onClick={() => setEditingProblem(true)}>✏️</button>
                </>
              )}
            </span>
            <div className={styles.metaRow}>
              <span className={styles.metaItem}><strong>Budget:</strong> {budget}</span>
              <span className={styles.metaItem}><strong>Target:</strong> {targetMarket}</span>
            </div>
          </div>
          <button className={styles.startBtn} onClick={() => onStart(agenda.trim() || placeholder)}>
            Start Session
          </button>
        </div>
      </div>

      {/* Previous Sessions */}
      <div className={styles.previousCard}>
        <div className={styles.previousHeader}>
          <h2 className={styles.previousTitle}>Previous Sessions</h2>
          <span className={styles.sessionCount}>{MOCK_SESSIONS.length} sessions</span>
        </div>
        <div className={styles.sessionList}>
          {MOCK_SESSIONS.map((session) => (
            <div key={session.id} className={styles.sessionItem}>
              <div className={styles.sessionItemMain}>
                <div className={styles.sessionItemTitle}>{session.title}</div>
                <div className={styles.sessionItemMeta}>
                  <span>{session.date}</span>
                  <span className={styles.dot}>•</span>
                  <span>{session.messages} messages</span>
                  <span className={styles.dot}>•</span>
                  <span>{session.duration}</span>
                </div>
                <div className={styles.sessionTags}>
                  {session.agents.map((a) => (
                    <span key={a} className={styles.sessionTag}>{a}</span>
                  ))}
                </div>
              </div>
              <span className={styles.sessionItemIcon}>🕐</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Live Session Page ────────────────────────────────────────────────────────

const LiveSessionPage = ({
  agenda,
  selectedAgents = ["CTO", "CFO", "COO"],
  onEnd,
}: { agenda: string; selectedAgents: string[]; onEnd: () => void }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDebating, setIsDebating] = useState(false);
  const [decisionStatus, setDecisionStatus] = useState<"Pending" | "Decided" | "Debating">("Pending");
  const [typingAgent, setTypingAgent] = useState<string | null>(null);
  const [initiated, setInitiated] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);


  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPaused]);

  useEffect(() => {
    if (initiated) return;
    setInitiated(true);
    runAgentSequence(agenda, selectedAgents);
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const runAgentSequence = (topic: string, agents: string[]) => {
    agents.forEach((agent, idx) => {
      const delay = 900 + idx * 2400;
      setTimeout(() => {
        setTypingAgent(agent);
        setTimeout(() => {
          setTypingAgent(null);
          const side: "left" | "right" = idx % 2 === 0 ? "right" : "left";
          setMessages((prev) => [
            ...prev,
            {
              id: `${Date.now()}-${agent}-${idx}`,
              agent,
              content: MOCK_RESPONSES[agent]?.(topic) ?? `As ${agent}, I recommend carefully evaluating the core assumptions before committing resources.`,
              side,
            },
          ]);
        }, 1300 + Math.random() * 500);
      }, delay);
    });
  };

  const handleSend = () => {
    const text = userInput.trim();
    if (!text) return;
    setUserInput("");
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, agent: "You", content: text, side: "left" },
    ]);
    const subset = [...selectedAgents].sort(() => Math.random() - 0.5).slice(0, Math.min(3, selectedAgents.length));
    runAgentSequence(text, subset);
  };

  const handleDebate = () => {
    const next = !isDebating;
    setIsDebating(next);
    setDecisionStatus(next ? "Debating" : "Pending");
    if (next) {
      runAgentSequence("debate the key risks, tradeoffs, and counterarguments", selectedAgents.slice(0, 2));
    }
  };

  const handleEnd = () => {
    setDecisionStatus("Decided");
    setTimeout(onEnd, 800);
  };

  const shortAgenda = agenda.length > 80 ? agenda.slice(0, 80) + "…" : agenda;

  return (
    <div className={styles.livePage}>
      {/* ── Top Bar ── */}
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <span className={styles.liveIndicator}>
            <span className={styles.liveDot} />
            Live Session
          </span>
          <span className={styles.topBarSep}>•</span>
          <span className={styles.timer}>{formatTime(elapsed)}</span>
          <span className={styles.decisionLabel}>Decision Status</span>
          <span className={`${styles.statusBadge} ${
            decisionStatus === "Decided" ? styles.statusDecided :
            decisionStatus === "Debating" ? styles.statusDebating :
            styles.statusPending
          }`}>
            {decisionStatus}
          </span>
        </div>

        <div className={styles.topBarRight}>
          <button className={styles.topBtn} onClick={() => setIsPaused((p) => !p)}>
            <PauseIcon /> {isPaused ? "Resume" : "Pause"}
          </button>
          <button className={`${styles.topBtn} ${isDebating ? styles.topBtnActive : ""}`} onClick={handleDebate}>
            <DebateIcon /> Debate
          </button>
          <button className={`${styles.topBtn} ${styles.endBtn}`} onClick={handleEnd}>
            <EndIcon /> End
          </button>
        </div>
      </div>

      {/* ── Scrollable Chat Area ── */}
      <div className={styles.chatScroll}>
        {/* Hero */}
        <div className={`${styles.heroSection} ${messages.length > 0 ? styles.heroCompact : ""}`}>
          <div className={styles.sparkleWrap}>
            <SparkleIcon />
          </div>
          <h2 className={styles.heroTitle}>Lets solve this together</h2>
        </div>

        {/* Agenda pill */}
        <div className={styles.agendaDisplay}>
          <span className={styles.agendaDisplayLabel}>AGENDA</span>
          <div className={styles.agendaDisplayText}>{shortAgenda}</div>
        </div>

        {/* Messages */}
        <div className={styles.messagesFeed}>
          {messages.map((msg) => {
            const isUser = msg.agent === "You";
            const color = AGENT_COLORS[msg.agent] ?? "#6b7280";
            const bg = AGENT_BG[msg.agent] ?? "#f3f4f6";
            return (
              <div
                key={msg.id}
                className={`${styles.messageRow} ${
                  msg.side === "right" ? styles.messageRowRight : styles.messageRowLeft
                } ${isUser ? styles.messageRowUser : ""}`}
              >
                {!isUser && (
                  <div className={styles.agentLabel}>
                    <span className={styles.agentDot} style={{ background: color }} />
                    <span className={styles.agentName}>{msg.agent}</span>
                  </div>
                )}
                <div
                  className={styles.messageBubble}
                  style={isUser ? { background: "#1e293b", color: "#fff" } : { background: bg }}
                >
                  {msg.content}
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {typingAgent && (
            <div className={`${styles.messageRow} ${
              (selectedAgents.indexOf(typingAgent) ?? 0) % 2 === 0
                ? styles.messageRowRight
                : styles.messageRowLeft
            }`}>
              <div className={styles.agentLabel}>
                <span className={styles.agentDot} style={{ background: AGENT_COLORS[typingAgent] ?? "#6b7280" }} />
                <span className={styles.agentName}>{typingAgent}</span>
              </div>
              <div className={styles.typingBubble}>
                <span className={styles.typingDot} style={{ animationDelay: "0ms" }} />
                <span className={styles.typingDot} style={{ animationDelay: "160ms" }} />
                <span className={styles.typingDot} style={{ animationDelay: "320ms" }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ── Input Bar ── */}
      <div className={styles.inputBarWrap}>
        <div className={styles.inputBar}>
          <input
            className={styles.chatInput}
            placeholder="Ask me anything about your projects"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button className={styles.sendBtn} onClick={handleSend} aria-label="Send">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="18" fill="#2563eb" />
              <path d="M13 18h10M20 14l4 4-4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Inline SVG Icons ─────────────────────────────────────────────────────────

const SparkleIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <path d="M20 4 L22 18 L36 20 L22 22 L20 36 L18 22 L4 20 L18 18 Z" fill="#111827" />
    <path d="M32 8 L33 13 L38 14 L33 15 L32 20 L31 15 L26 14 L31 13 Z" fill="#111827" />
  </svg>
);

const PauseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="2" y="2" width="3.5" height="10" rx="1" fill="currentColor" />
    <rect x="8.5" y="2" width="3.5" height="10" rx="1" fill="currentColor" />
  </svg>
);

const DebateIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 7 C2 4 5 2 7 2 C9 2 12 4 12 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 7 C12 10 9 12 7 12 C5 12 2 10 2 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M5 5 L9 9 M9 5 L5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const EndIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="2" y="2" width="10" height="10" rx="1.5" fill="currentColor" />
  </svg>
);

// ─── Root ─────────────────────────────────────────────────────────────────────

const LiveSession = (props: Props) => {
  const [view, setView] = useState<"agenda" | "live">("agenda");
  const [agenda, setAgenda] = useState("");

  return view === "live" ? (
    <LiveSessionPage
      agenda={agenda}
      selectedAgents={props.selectedAgents ?? ["CTO", "CFO", "COO"]}
      onEnd={() => setView("agenda")}
    />
  ) : (
    <AgendaPage
      {...props}
      onStart={(a) => { setAgenda(a); setView("live"); }}
    />
  );
};

export default LiveSession;