import { useState, useEffect, useRef } from "react";
import styles from "../styles/LiveSession.module.css";

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

const LiveSession = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typingAgent, setTypingAgent] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onboardingData = JSON.parse(
    localStorage.getItem("onboardingData") || "{}"
  );

  const handleAskBoard = async (text: string) => {
    try {
      const res = await fetch("http://localhost:4000/simulation/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, data: onboardingData }),
      });

      const data = await res.json();

      for (const round of data.rounds as Round[]) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            agent: "SYSTEM",
            content: `Round ${round.round}`,
            side: "right",
          },
        ]);

        for (const msg of round.messages) {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              agent: msg.agent,
              content: msg.content,
              side: "right",
            },
          ]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const text = input;
    setInput("");

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        agent: "You",
        content: text,
        side: "left",
      },
    ]);

    handleAskBoard(text);
  };

  return (
    <div className={styles.livePage}>
      <div>
        {messages.map((m) => (
          <div key={m.id}>
            <b>{m.agent}</b>: {m.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask something..."
      />

      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default LiveSession;