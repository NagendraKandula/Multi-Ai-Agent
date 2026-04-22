import styles from "../styles/Step3.module.css";

type Props = {
  formData: any;
  set: (data: any) => void;
  next: () => void;
  back: () => void;
};

const Step3 = ({ formData, set, next, back }: Props) => {
  return (
    <div className={styles.container}>
      
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Market & Business</h1>
        <p className={styles.subtitle}>
          Help us understand your customers and business model
        </p>
      </div>

      {/* Card */}
      <div className={styles.card}>
        <div className={styles.cardContent}>

          {/* Customers */}
          <div className={styles.section}>
            <h3 className={styles.sectionHeader}>Your Customers</h3>

            <textarea
              className={styles.textarea}
              placeholder="Who is your ideal customer?"
              value={formData.idealCustomer}
              onChange={(e) => set({ idealCustomer: e.target.value })}
            />

            <div className={styles.grid}>
              <select
                className={styles.select}
                value={formData.marketScope}
                onChange={(e) => set({ marketScope: e.target.value })}
              >
                {["Local", "Regional", "National", "Global"].map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>

              <input
                className={styles.input}
                placeholder="Competitors (optional)"
                value={formData.competitors}
                onChange={(e) => set({ competitors: e.target.value })}
              />
            </div>
          </div>

          {/* Business Model */}
          <div className={styles.section}>
            <h3 className={styles.sectionHeader}>Business Model</h3>

            <div className={styles.grid}>
              <select
                className={styles.select}
                value={formData.revenueModel}
                onChange={(e) => set({ revenueModel: e.target.value })}
              >
                {[
                  "Subscription (Monthly)",
                  "Subscription (Yearly)",
                  "One-time Purchase",
                  "Freemium",
                  "Commission",
                ].map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>

              <select
                className={styles.select}
                value={formData.growthGoal}
                onChange={(e) => set({ growthGoal: e.target.value })}
              >
                {[
                  "Profitability",
                  "User Growth",
                  "Market Share",
                  "Revenue Growth",
                ].map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>

            <select
              className={styles.select}
              value={formData.roiTimeline}
              onChange={(e) => set({ roiTimeline: e.target.value })}
            >
              {[
                "3-6 Months",
                "6 Months - 1 Year",
                "1-2 Years",
                "2+ Years",
              ].map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <button className={styles.secondaryBtn} onClick={back}>
          Back
        </button>

        <button className={styles.primaryBtn} onClick={next}>
          Next
        </button>
      </div>

    </div>
  );
};

export default Step3;