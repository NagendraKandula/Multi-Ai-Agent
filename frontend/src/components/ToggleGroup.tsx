import styles from "../styles/ToggleGroup.module.css";

type Props = {
  label?: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
};

const ToggleGroup = ({ label, value, options, onChange }: Props) => {
  return (
    <div className={styles.container}>
      
      {/* Label (optional) */}
      {label && <label className={styles.label}>{label}</label>}

      {/* Buttons */}
      <div className={styles.group}>
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`${styles.toggle} ${
              value === option
                ? styles.active
                : styles.inactive
            }`}
          >
            {option}
          </button>
        ))}
      </div>

    </div>
  );
};

export default ToggleGroup;