import { useEffect, useState } from "react";
import html2pdf from "html2pdf.js";
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
  const finalDecision =
    localStorage.getItem("finalSupervisorDecision") ||
    "Proceed with standard launch protocol.";

  // =========================
  // FETCH EXECUTION PLAN
  // =========================
  useEffect(() => {
    const fetchExecutionTasks = async () => {
      try {
        const res = await fetch("http://localhost:4000/simulation/execute-tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            onboardingData,
            finalDecision,
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

  // =========================
  // EXPORT PDF (FIXED TYPES)
  // =========================
  const handleExportPlan = () => {
    const element = document.getElementById("pdf-content-area");
    if (!element) return;

    const opt = {
      margin: 0.5,
      filename: `${bizName.replace(/\s+/g, "_")}_Plan.pdf`,
      image: { type: "jpeg" as const, quality: 0.98 }, // ✅ FIX
      html2canvas: { scale: 2 },
      jsPDF: {
        unit: "in" as const,
        format: "letter" as const,
        orientation: "portrait" as const,
      },
    };

    html2pdf().set(opt).from(element).save();
  };

  // =========================
  // LOADING STATE
  // =========================
  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>Synthesizing Execution Plan...</h1>
          <p className={styles.subtitle}>
            Our AI specialists are writing your Market, MVP, and GTM strategies.
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // UI
  // =========================
  return (
    <div className={styles.page}>
      {/* PDF AREA */}
      <div id="pdf-content-area" className={styles.card} style={{ padding: "20px" }}>
        <div className={styles.header}>
          <h1 className={styles.title}>Execution Summary</h1>
          <p className={styles.subtitle}>{bizName} - Strategic Alignment</p>
        </div>

        <h2 className={styles.sectionTitle}>Board Directive</h2>
        <p className={styles.agenda}>
          <strong>Supervisor's Final Call:</strong> {finalDecision}
        </p>

        <div className={styles.grid}>
          <div>
            <h3 className={styles.subHeading}>Market Research</h3>
            <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}>
              {plan?.marketResearch}
            </div>
          </div>

          <div>
            <h3 className={styles.subHeading}>MVP Planning</h3>
            <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}>
              {plan?.mvpPlan}
            </div>
          </div>
        </div>

        <div className={styles.actionSection} style={{ marginTop: "2rem" }}>
          <h3 className={styles.subHeading}>Go-To-Market (GTM) Strategy</h3>
          <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}>
            {plan?.gtmStrategy}
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className={styles.footer}>
        <div className={styles.actions}>
          <button className={styles.primaryBtn} onClick={handleExportPlan}>
            Export PDF
          </button>

          <button
            className={styles.secondaryBtn}
            onClick={() => window.history.back()}
          >
            Review Board Debate
          </button>
        </div>
      </div>
    </div>
  );
};

export default Decision;