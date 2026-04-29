import { useEffect, useState } from "react";
import styles from "../styles/Decision.module.css";

interface ExecutionPlan {
  marketResearch: string;
  mvpPlan: string;
  gtmStrategy: string;
}

const Decision = () => {
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<ExecutionPlan | null>(null);

  const onboardingData = JSON.parse(localStorage.getItem("onboardingData") || "{}");
  const bizName = onboardingData.businessName || "Your Startup";
  const finalDecision = localStorage.getItem("finalSupervisorDecision") || "Proceed with standard launch protocol.";

  useEffect(() => {
    const fetchExecutionTasks = async () => {
      try {
        const res = await fetch("http://localhost:4000/simulation/execute-tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            onboardingData, 
            finalDecision 
          }),
        });
        const data = await res.json();
        setPlan(data);
      } catch (err) {
        console.error("Failed to generate tasks", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExecutionTasks();
  }, [finalDecision]);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>Synthesizing Execution Plan...</h1>
          <p className={styles.subtitle}>Our AI specialists are writing your Market, MVP, and GTM strategies.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Execution Summary</h1>
        <p className={styles.subtitle}>{bizName} - Strategic Alignment</p>
      </div>

      {/* Card */}
      <div className={styles.card}>

        <h2 className={styles.sectionTitle}>Board Directive</h2>
        <p className={styles.agenda}>
          <strong>Supervisor's Final Call:</strong> {finalDecision}
        </p>

        {/* Execution Tasks */}
        <div className={styles.grid} style={{ gridTemplateColumns: "1fr", gap: "2rem" }}>

          <div>
            <h3 className={styles.subHeading}>Market Research</h3>
            <div style={{ whiteSpace: "pre-wrap", color: "#334155", lineHeight: "1.6" }}>
              {plan?.marketResearch}
            </div>
          </div>

          <div>
            <h3 className={styles.subHeading}>MVP Planning</h3>
            <div style={{ whiteSpace: "pre-wrap", color: "#334155", lineHeight: "1.6" }}>
              {plan?.mvpPlan}
            </div>
          </div>

        </div>

        {/* Action Plan */}
        <div className={styles.actionSection} style={{ marginTop: "2rem" }}>
          <h3 className={styles.subHeading}>Go-To-Market (GTM) Strategy</h3>
          <div style={{ whiteSpace: "pre-wrap", color: "#334155", lineHeight: "1.6" }}>
              {plan?.gtmStrategy}
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.actions}>
            <button className={styles.primaryBtn}>Export Plan</button>
            <button className={styles.secondaryBtn}>Review Board Debate</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Decision;