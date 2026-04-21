import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "../styles/LiveSession.module.css";

// ─── TYPES ─────────────────────────────────────────────

interface Message {
  id: string;
  agent: string;
  content: string;
  side: "left" | "right";
}

interface Props {
  selectedAgents?: string[];
}

// ─── AGENDA PAGE ───────────────────────────────────────

const AgendaPage = ({
  onStart,
}: { onStart: (agenda: string) => void }) => {
  const [agenda, setAgenda] = useState("");

  return (
    <div className={styles.agendaPage}>
      <h1>AI Board Meeting</h1>

      <textarea
        className={styles.agendaTextarea}
        placeholder="Enter your business problem..."
        value={agenda}
        onChange={(e) => setAgenda(e.target.value)}
      />

      <button
        className={styles.startBtn}
        onClick={() => onStart(agenda.trim())}
      >
        Start Session
      </button>
    </div>
  );
};

// ─── LIVE SESSION PAGE ─────────────────────────────────

const LiveSessionPage = ({
  agenda,
  selectedAgents = ["CTO", "CFO", "COO"],
  onEnd,
}: {
  agenda: string;
  selectedAgents: string[];
  onEnd: () => void;
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [typingAgent, setTypingAgent] = useState<string | null>(null);

  const [searchParams] = useSearchParams();
  const threadId = searchParams.get("threadId");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ─── AUTO SCROLL ─────────────────────────────

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ─── INITIAL CALL ────────────────────────────

  useEffect(() => {
    if (agenda && threadId) {
      // show user message first
      setMessages([
        {
          id: `init-${Date.now()}`,
          agent: "You",
          content: agenda,
          side: "left",
        },
      ]);

      handleAskTeam(agenda);
    }
  }, []);

  // ─── API CALL ───────────────────────────────

  const handleAskTeam = async (text: string) => {
    if (!threadId) {
      alert("Session not initialized.");
      return;
    }

    try {
      setTypingAgent("Board Chairman coordinating agents...");

      const response = await fetch("http://localhost:4000/simulation/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          problem: text,
          threadId,
          agents: selectedAgents,
        }),
      });

      if (!response.ok) throw new Error("Backend error");

      const data = await response.json();
      setTypingAgent(null);

      // ─── MULTI AGENT HANDLING ─────────────────

      if (data.discussion && Array.isArray(data.discussion)) {
        // Show agents one by one (with delay for realism)
        for (let i = 0; i < data.discussion.length; i++) {
          const msg = data.discussion[i];

          await new Promise((res) => setTimeout(res, 700));

          setMessages((prev) => [
            ...prev,
            {
              id: `${Date.now()}-${i}`,
              agent: msg.agent || "Agent",
              content: msg.message,
              side: "right",
            },
          ]);
        }

        // Final Chairman decision
        setMessages((prev) => [
          ...prev,
          {
            id: `final-${Date.now()}`,
            agent: "Board Chairman",
            content: data.finalDecision || "No final decision",
            side: "right",
          },
        ]);
      } else {
        // fallback (if backend fails JSON)
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            agent: "Board Chairman",
            content: data.response || "No response",
            side: "right",
          },
        ]);
      }
    } catch (err) {
      console.error(err);
      setTypingAgent(null);
      alert("Failed to connect to AI board.");
    }
  };

  // ─── SEND USER MESSAGE ──────────────────────

  const handleSend = async () => {
    const text = userInput.trim();
    if (!text) return;

    setUserInput("");

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        agent: "You",
        content: text,
        side: "left",
      },
    ]);

    await handleAskTeam(text);
  };

  // ─── UI ─────────────────────────────────────

  return (
    <div className={styles.livePage}>
      <h2>Live AI Board Session</h2>

      {/* Messages */}
      <div className={styles.messagesFeed}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={
              msg.side === "right"
                ? styles.messageRowRight
                : styles.messageRowLeft
            }
          >
            <strong>{msg.agent}: </strong>
            {msg.content}
          </div>
        ))}

        {typingAgent && (
          <div className={styles.typing}>
            {typingAgent}...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className={styles.inputBar}>
        <input
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask your board..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>

      <button className={styles.endBtn} onClick={onEnd}>
        End Session
      </button>
    </div>
  );
};

// ─── ROOT COMPONENT ───────────────────────────

const LiveSession = (props: Props) => {
  const [view, setView] = useState<"agenda" | "live">("agenda");
  const [agenda, setAgenda] = useState("");

  const [searchParams] = useSearchParams();
  const threadId = searchParams.get("threadId");

  useEffect(() => {
    if (threadId) {
      setView("live");
    }
  }, [threadId]);

  return view === "live" ? (
    <LiveSessionPage
      agenda={agenda}
      selectedAgents={props.selectedAgents ?? ["CTO", "CFO", "COO"]}
      onEnd={() => setView("agenda")}
    />
  ) : (
    <AgendaPage
      onStart={(a) => {
        setAgenda(a);
        setView("live");
      }}
    />
  );
};

export default LiveSession;