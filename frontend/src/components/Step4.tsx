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
import { useState } from "react";

type Props = {
  formData: any;
  set: (data: any) => void;
  back: () => void;
  goLive: () => void; // ✅ required
};

const techAgents = [
  { id: "CTO", icon: Code, title: "CTO" },
  { id: "CMO", icon: Megaphone, title: "CMO" },
  { id: "CFO", icon: Calculator, title: "CFO" },
  { id: "CPO", icon: Package, title: "CPO" },
  { id: "Legal", icon: Scale, title: "Legal" },
  { id: "COO", icon: Settings, title: "COO" },
  { id: "CSO", icon: TrendingUp, title: "CSO" },
];

const Step4 = ({ formData, set, back, goLive }: Props) => {
  const [isLaunching, setIsLaunching] = useState(false);

  const handleStartSimulation = async () => {
    setIsLaunching(true);

    try {
      await fetch("http://localhost:4000/simulation/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      localStorage.setItem("onboardingData", JSON.stringify(formData));

      goLive(); // ✅ FIXED
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Strategy & AI Setup</h2>

      <div>
        {techAgents.map((agent) => {
          const selected = formData.selectedAgents?.includes(agent.id);

          return (
            <button
              key={agent.id}
              onClick={() =>
                set({
                  selectedAgents: selected
                    ? formData.selectedAgents.filter((a: string) => a !== agent.id)
                    : [...formData.selectedAgents, agent.id],
                })
              }
            >
              {agent.title} {selected ? "✅" : ""}
            </button>
          );
        })}
      </div>

      <div>
        <button onClick={back}>Back</button>

        <button onClick={handleStartSimulation} disabled={isLaunching}>
          {isLaunching ? "Starting..." : "Start Simulation"}
        </button>
      </div>
    </div>
  );
};

export default Step4;