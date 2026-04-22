import styles from "../styles/Step4.module.css";
import {
  Code, Megaphone, Calculator, Scale, Package, Settings, TrendingUp,
} from "lucide-react";

type Props = {
  formData: any;
  set: (data: any) => void;
  back: () => void;
};

const techAgents = [
  { id: "CTO", icon: Code, title: "CTO", subtitle: "Tech & Product" },
  { id: "CMO", icon: Megaphone, title: "CMO", subtitle: "Marketing & Growth" },
  { id: "CFO", icon: Calculator, title: "CFO", subtitle: "Finance & Strategy" },
  { id: "CPO", icon: Package, title: "CPO", subtitle: "Chief Product Officer" },
  { id: "Legal", icon: Scale, title: "Legal & Compliance", subtitle: "Legal & Regulations" },
  { id: "COO", icon: Settings, title: "COO", subtitle: "Operations & Efficiency" },
  { id: "CSO", icon: TrendingUp, title: "CSO", subtitle: "Sales & Partnerships" },
];

const nonTechAgents = [
  { id: "COO", icon: Settings, title: "COO", subtitle: "Chief Operating Officer" },
  { id: "CMO", icon: Megaphone, title: "CMO", subtitle: "Chief Marketing Officer" },
  { id: "CFO", icon: Calculator, title: "CFO", subtitle: "Chief Financial Officer" },
  { id: "Legal", icon: Scale, title: "Legal & Compliance", subtitle: "Legal & Regulations" },
  { id: "CSO", icon: TrendingUp, title: "CSO", subtitle: "Chief Sales Officer" },
  { id: "CTO", icon: Code, title: "CTO", subtitle: "Technical Advisor" },
];

const Step4 = ({ formData, set, back }: Props) => {
  
    const handleStartSimulation = async () => {
    try {
      const response = await fetch('http://localhost:4000/simulation/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Simulation failed');

      const data = await response.json();
     set({ initialPlan: data.plan, currentView: 'live-session' }); 
    
    // 2. The parent component should listen for 'currentView' to switch components
    console.log('AI Startup Plan Received, Redirecting...');
  } catch (error) {
    console.error('Error starting simulation:', error);
  }
};
  const effectiveBizType =
    formData.businessType === "Not Sure" && formData.classifiedBusinessType
      ? formData.classifiedBusinessType
      : formData.businessType;

  const agents = effectiveBizType === "Non Tech" ? nonTechAgents : techAgents;

  const toggleAgent = (id: string) => {
    const exists = (formData.selectedAgents || []).includes(id);
    set({
      selectedAgents: exists
        ? formData.selectedAgents.filter((a: string) => a !== id)
        : [...(formData.selectedAgents || []), id],
    });
  };

  const sliderLabel = (val: number) =>
    val >= 66 ? "High" : val >= 33 ? "Medium" : "Low";

  const sliders = [
    {
      label: "Speed to Launch",
      field: "speedToLaunch",
      iconBg: "#fff7ed",
      iconColor: "#f97316",
      emoji: "🚀",
    },
    {
      label: "Product Quality",
      field: "productQuality",
      iconBg: "#fefce8",
      iconColor: "#eab308",
      emoji: "⭐",
    },
    {
      label: "Cost Efficiency",
      field: "costEfficiency",
      iconBg: "#f0fdf4",
      iconColor: "#22c55e",
      emoji: "💵",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Strategy & AI Setup</h1>
        <p className={styles.subtitle}>Set your priorities and choose your AI team.</p>
      </div>

      <div className={styles.card}>
        <div className={styles.cardContent}>

          {/* Sliders */}
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
                      <span className={styles.sliderValue}>{sliderLabel(formData[field])}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={formData[field]}
                      onChange={(e) => set({ [field]: parseInt(e.target.value) })}
                      className={styles.slider}
                      style={{
                        background: `linear-gradient(to right, #2563eb 0%, #2563eb ${formData[field]}%, #e5e7eb ${formData[field]}%, #e5e7eb 100%)`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Constraint */}
          <div className={styles.section}>
            <label className={styles.label}>What's Your Biggest Constraint?</label>
            <div className={styles.toggleGroup}>
              {["Budget", "Time", "Team", "Market Competition"].map((t) => (
                <button
                  key={t}
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

          {/* Dropdowns */}
          <div className={styles.section}>
            <div className={styles.grid}>
              <div>
                <label className={styles.label}>Risk Appetite</label>
                <select
                  className={styles.select}
                  value={formData.riskAppetite}
                  onChange={(e) => set({ riskAppetite: e.target.value })}
                >
                  {["Low - Conservative", "Medium - Balanced Risk", "High - Aggressive"].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={styles.label}>Founder Experience</label>
                <select
                  className={styles.select}
                  value={formData.founderExperience}
                  onChange={(e) => set({ founderExperience: e.target.value })}
                >
                  {["Beginner", "Intermediate", "Expert"].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={styles.label}>Success Metric</label>
              <select
                className={styles.select}
                value={formData.successMetric}
                onChange={(e) => set({ successMetric: e.target.value })}
              >
                {["Monthly Revenue", "User Count", "Profit Margin", "Market Share"].map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>

          {/* AI Agents */}
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
        <button className={styles.secondaryBtn} onClick={back}>← Back</button>
        <button className={styles.primaryBtn} onClick={handleStartSimulation}>
          Start Simulation →
        </button>
      </div>
    </div>
  );
};

export default Step4;