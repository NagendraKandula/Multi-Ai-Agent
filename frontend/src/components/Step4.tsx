import { useState } from "react";
import styles from "../styles/Step4.module.css";
import {
  Code,
  Megaphone,
  Calculator,
  Scale,
  Package,
  Settings,
  TrendingUp,
} from "lucide-react";

type Props = {
  formData: any;
  set: (data: any) => void;
  back: () => void;
  goLive: () => void; // Function to transition to the live simulation view
};

// Data for Tech-focused businesses
const techAgents = [
  { id: "CTO", icon: Code, title: "CTO", subtitle: "Tech & Product" },
  { id: "CMO", icon: Megaphone, title: "CMO", subtitle: "Marketing & Growth" },
  { id: "CFO", icon: Calculator, title: "CFO", subtitle: "Finance & Strategy" },
  { id: "CPO", icon: Package, title: "CPO", subtitle: "Chief Product Officer" },
  { id: "Legal", icon: Scale, title: "Legal & Compliance", subtitle: "Legal & Regulations" },
];

// Data for Non-Tech focused businesses
const nonTechAgents = [
  { id: "COO", icon: Settings, title: "COO", subtitle: "Chief Operating Officer" },
  { id: "CMO", icon: Megaphone, title: "CMO", subtitle: "Chief Marketing Officer" },
  { id: "CFO", icon: Calculator, title: "CFO", subtitle: "Chief Financial Officer" },
  { id: "Legal", icon: Scale, title: "Legal & Compliance", subtitle: "Legal & Regulations" },
  { id: "CSO", icon: TrendingUp, title: "CSO", subtitle: "Chief Sales Officer" },
];

const Step4 = ({ formData, set, back, goLive }: Props) => {
  const [isLaunching, setIsLaunching] = useState(false);

  // Logic to determine which agent list to show based on previous steps
  const effectiveBizType =
    formData.businessType === "Not Sure" && formData.classifiedBusinessType
      ? formData.classifiedBusinessType
      : formData.businessType;

  const agents = effectiveBizType === "Non Tech" ? nonTechAgents : techAgents;

  const toggleAgent = (id: string) => {
    const currentAgents = formData.selectedAgents || [];
    const exists = currentAgents.includes(id);
    
    set({
      selectedAgents: exists
        ? currentAgents.filter((a: string) => a !== id)
        : [...currentAgents, id],
    });
  };

  const handleStartSimulation = async () => {
    setIsLaunching(true);

    try {
      // 1. Send data to your backend
      await fetch("http://localhost:4000/simulation/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // 2. Persist to local storage for session recovery
      localStorage.setItem("onboardingData", JSON.stringify(formData));

      // 3. Trigger the app's "Live" state
      goLive(); 
    } catch (err) {
      console.error("Failed to start simulation:", err);
      // Optional: Add a toast notification or error state here
    } finally {
      setIsLaunching(false);
    }
  };

  const sliderLabel = (val: number) =>
    val >= 66 ? "High" : val >= 33 ? "Medium" : "Low";

  const sliders = [
    { label: "Speed to Launch", field: "speedToLaunch", iconBg: "#fff7ed", iconColor: "#f97316", emoji: "🚀" },
    { label: "Product Quality", field: "productQuality", iconBg: "#fefce8", iconColor: "#eab308", emoji: "⭐" },
    { label: "Cost Efficiency", field: "costEfficiency", iconBg: "#f0fdf4", iconColor: "#22c55e", emoji: "💵" },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Strategy & AI Setup</h1>
        <p className={styles.subtitle}>Set your priorities and choose your AI team.</p>
      </div>

      <div className={styles.card}>
        <div className={styles.cardContent}>
          
          {/* Priority Sliders */}
          <div className={styles.section}>
            <h3 className={styles.sectionHeader}>What Matters Most?</h3>
            <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 8px 0" }}>
              Drag the sliders to set your priority balance
            </p>

            {sliders.map(({ label, field, iconBg, iconColor, emoji }) => (
              <div key={field} className={styles.sliderRow}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    className={styles.agentIcon}
                    style={{ background: iconBg, color: iconColor, fontSize: 20, width: 40, height: 40, flexShrink: 0 }}
                  >
                    {emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className={styles.sliderHeader}>
                      <span>{label}</span>
                      <span className={styles.sliderValue}>{sliderLabel(formData[field] || 50)}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={formData[field] || 50}
                      onChange={(e) => set({ [field]: parseInt(e.target.value) })}
                      className={styles.slider}
                      style={{
                        background: `linear-gradient(to right, #2563eb 0%, #2563eb ${formData[field] || 50}%, #e5e7eb ${formData[field] || 50}%, #e5e7eb 100%)`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Constraints Toggle */}
          <div className={styles.section}>
            <label className={styles.label}>What's Your Biggest Constraint?</label>
            <div className={styles.toggleGroup}>
              {["Budget", "Time", "Team", "Market Competition"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => set({ constraint: t })}
                  className={`${styles.toggle} ${
                    formData.constraint === t ? styles.toggleActive : styles.toggleInactive
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Dropdown Grid */}
          <div className={styles.section}>
            <div className={styles.grid}>
              <div>
                <label className={styles.label}>Risk Appetite</label>
                <select
                  className={styles.select}
                  value={formData.riskAppetite || "Medium - Balanced Risk"}
                  onChange={(e) => set({ riskAppetite: e.target.value })}
                >
                  {["Low - Conservative", "Medium - Balanced Risk", "High - Aggressive"].map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={styles.label}>Founder Experience</label>
                <select
                  className={styles.select}
                  value={formData.founderExperience || "Intermediate"}
                  onChange={(e) => set({ founderExperience: e.target.value })}
                >
                  {["Beginner", "Intermediate", "Expert"].map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* AI Agents Grid */}
          <div className={styles.section}>
            <h3 className={styles.sectionHeader}>Select Your AI Agents</h3>
            <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 4px 0" }}>
              You can customize roles later
            </p>

            <div className={styles.agentGrid}>
              {agents.map((agent) => {
                const Icon = agent.icon;
                const selected = (formData.selectedAgents || []).includes(agent.id);

                return (
                  <div
                    key={agent.id}
                    onClick={() => toggleAgent(agent.id)}
                    className={`${styles.agentCard} ${selected ? styles.agentSelected : ""}`}
                  >
                    {selected && (
                      <div className={styles.checkmark}>
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                    <div
                      className={styles.agentIcon}
                      style={{
                        background: selected ? "#2563eb" : "#e5e7eb",
                        color: selected ? "#fff" : "#6b7280",
                      }}
                    >
                      <Icon size={22} />
                    </div>
                    <div className={styles.agentTitle}>{agent.title}</div>
                    <div className={styles.agentSubtitle}>{agent.subtitle}</div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      <div className={styles.footer}>
        <button className={styles.secondaryBtn} onClick={back}>
          ← Back
        </button>
        <button 
          className={styles.primaryBtn} 
          onClick={handleStartSimulation} 
          disabled={isLaunching}
        >
          {isLaunching ? "Launching..." : "Start Simulation →"}
        </button>
      </div>
    </div>
  );
};

export default Step4;