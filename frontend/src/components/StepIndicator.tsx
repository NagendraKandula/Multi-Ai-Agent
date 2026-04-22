import styles from "../styles/StepIndicator.module.css";

type Props = {
  currentStep: number;
  totalSteps: number;
  labels: Record<number, string>;
};

const StepIndicator = ({ currentStep, totalSteps, labels }: Props) => {
  return (
    <div className={styles.container}>
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step, index) => (
        <div key={step} className={styles.stepWrapper}>
          {/* Circle + Label stacked */}
          <div className={styles.stepInner}>
            <div
              className={`${styles.circle} ${
                step <= currentStep ? styles.active : styles.inactive
              }`}
            >
              {step}
            </div>
            <p
              className={`${styles.label} ${
                step === currentStep ? styles.labelActive : styles.labelInactive
              }`}
            >
              {labels[step]}
            </p>
          </div>

          {/* Connector line (after circle, before next step) */}
          {index < totalSteps - 1 && (
            <div
              className={`${styles.line} ${
                currentStep > step ? styles.lineActive : ""
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;