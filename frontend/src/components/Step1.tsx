import styles from "../styles/Step1.module.css";
import ToggleGroup from "./ToggleGroup";

type Props = {
  formData: any;
  set: (data: any) => void;
  next: () => void;
};

const Step1 = ({ formData, set, next }: Props) => {
  return (
    <div className={styles.container}>
      
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Tell Us About Your Startup</h1>
        <p className={styles.subtitle}>
          Give us the basics. You can refine later.
        </p>
      </div>

      {/* Card */}
      <div className={styles.card}>
        <div className={styles.cardContent}>

          {/* Basic Info */}
          <div>
            <h3 className={styles.sectionHeader}>Basic Information</h3>

            <div className={styles.grid}>
              <input
                className={styles.input}
                placeholder="Business Name"
                value={formData.businessName}
                onChange={(e) => set({ businessName: e.target.value })}
              />

              <input
  className={styles.input}
  placeholder="Location (e.g., Visakhapatnam, India)"
  value={formData.location}
  onChange={(e) => set({ location: e.target.value })}
/>

              <input
                className={styles.input}
                placeholder="Budget Range"
                value={formData.budgetRange}
                onChange={(e) => set({ budgetRange: e.target.value })}
              />

              <input
                className={styles.input}
                placeholder="Target Market"
                value={formData.targetMarket}
                onChange={(e) => set({ targetMarket: e.target.value })}
              />
            </div>

            {/* Business Type */}
            <div className={styles.field}>
              <label className={styles.label}>
                What type of business are you building?
              </label>

              <ToggleGroup
  value={formData.businessType}
  options={["Tech", "Non Tech", "Both", "Not Sure"]}
  onChange={(val) => set({ businessType: val })}
/>
            </div>
          </div>

          {/* Problem Section */}
          <div>
            <h3 className={styles.sectionHeader}>Problem & Value</h3>

            <textarea
              className={styles.textarea}
              placeholder="What problem are you solving?"
              value={formData.problemSolving}
              onChange={(e) => set({ problemSolving: e.target.value })}
            />

            <textarea
              className={styles.textarea}
              placeholder="How do people solve it currently?"
              value={formData.currentSolution}
              onChange={(e) => set({ currentSolution: e.target.value })}
            />

            <textarea
              className={styles.textarea}
              placeholder="What makes your solution better?"
              value={formData.betterSolution}
              onChange={(e) => set({ betterSolution: e.target.value })}
            />
          </div>

          {/* Business Intent */}
          <div>
            <h3 className={styles.sectionHeader}>Business Intent</h3>

            <div className={styles.grid}>
              <select
                className={styles.select}
                value={formData.stage}
                onChange={(e) => set({ stage: e.target.value })}
              >
                {["Idea", "Validation", "Early traction"].map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>

              <select
                className={styles.select}
                value={formData.helpNeeded}
                onChange={(e) => set({ helpNeeded: e.target.value })}
              >
                {["Validate idea", "Build MVP", "Growth strategy", "Full plan"].map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <button className={styles.secondaryBtn}>Save Draft</button>

        <button className={styles.primaryBtn} onClick={next}>
          Next
        </button>
      </div>

    </div>
  );
};

export default Step1;