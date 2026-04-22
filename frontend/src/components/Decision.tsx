import styles from "../styles/Decision.module.css";

const Decision = () => {
  return (
    <div className={styles.page}>
      
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Decision Summary</h1>
        <p className={styles.subtitle}>
          Milk Delivery Service - location
        </p>
      </div>

      {/* Card */}
      <div className={styles.card}>

        <h2 className={styles.sectionTitle}>Final Recommendation</h2>

        <p className={styles.agenda}>
          <strong>Agenda:</strong> how do we price for each delivery?
        </p>

        {/* Strength + Concerns */}
        <div className={styles.grid}>

          {/* Strength */}
          <div>
            <h3 className={styles.subHeading}>Strength</h3>
            <ul className={styles.list}>
              <li>
                <span className={styles.check}>✓</span>
                Clear pricing structure based on distance and delivery frequency
              </li>
              <li>
                <span className={styles.check}>✓</span>
                Competitive analysis shows our pricing is 15% lower than competitors
              </li>
              <li>
                <span className={styles.check}>✓</span>
                Subscription model provides predictable revenue streams
              </li>
            </ul>
          </div>

          {/* Concerns */}
          <div>
            <h3 className={styles.subHeading}>Concerns</h3>
            <ul className={styles.list}>
              <li>
                <span className={styles.warn}>○</span>
                Fuel costs may fluctuate significantly affecting profit margins
              </li>
              <li>
                <span className={styles.warn}>○</span>
                Need to test customer willingness to pay premium for same-day delivery
              </li>
              <li>
                <span className={styles.warn}>○</span>
                Minimum order requirements might deter smaller customers
              </li>
            </ul>
          </div>

        </div>

        {/* Action Plan */}
        <div className={styles.actionSection}>
          <h3 className={styles.subHeading}>Action Plan</h3>

          <ul className={styles.actionList}>
            <li>
              <span className={styles.step}>1</span>
              Launch pilot pricing program in one neighborhood to validate customer acceptance
            </li>
            <li>
              <span className={styles.step}>2</span>
              Implement dynamic pricing algorithm that adjusts based on fuel costs
            </li>
            <li>
              <span className={styles.step}>3</span>
              Create tiered subscription plans to accommodate different customer segments
            </li>
            <li>
              <span className={styles.step}>4</span>
              Set up quarterly pricing reviews to ensure competitiveness and profitability
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className={styles.footer}>

          <div className={styles.score}>
            Overall Score: <strong>8.9</strong>
          </div>

          <div className={styles.actions}>
            <button className={styles.primaryBtn}>Approve Plan</button>
            <button className={styles.secondaryBtn}>Request changes</button>
            <button className={styles.ghostBtn}>Export as PDF</button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Decision;