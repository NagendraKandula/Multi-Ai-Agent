import React, { useState } from "react";
import styles from "../styles/Onboarding.module.css";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import StepIndicator from "./StepIndicator";
import { FormData } from "./types";

const Onboarding = ({ setActive }: { setActive: (v: string) => void }) => {
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState<FormData>({
    businessName: "",
    location: "Vizag",
    budgetRange: "",
    targetMarket: "",
    businessType: "Tech",
    problemSolving: "",
    currentSolution: "",
    betterSolution: "",
    stage: "Idea",
    helpNeeded: "Build MVP",

    speedToLaunch: 75,
    productQuality: 50,
    costEfficiency: 40,

    constraint: "Budget",
    riskAppetite: "Medium - Balanced Risk",
    founderExperience: "Intermediate",
    successMetric: "Monthly Revenue",

    selectedAgents: ["CTO", "CMO", "CFO"],
  } as FormData);

  const set = (field: Partial<FormData>) =>
    setFormData((prev) => ({ ...prev, ...field }));

  const goLive = () => setActive("live");

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <StepIndicator
          currentStep={currentStep}
          totalSteps={4}
          labels={{
            1: "Basic",
            2: "Type",
            3: "Market",
            4: "Strategy",
          }}
        />

        {currentStep === 1 && (
          <Step1 formData={formData} set={set} next={() => setCurrentStep(2)} />
        )}

        {currentStep === 2 && (
          <Step2
            formData={formData}
            set={set}
            next={() => setCurrentStep(3)}
            back={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 3 && (
          <Step3
            formData={formData}
            set={set}
            next={() => setCurrentStep(4)}
            back={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 4 && (
          <Step4
            formData={formData}
            set={set}
            back={() => setCurrentStep(3)}
            goLive={goLive}   // ✅ FIX
          />
        )}
      </div>
    </div>
  );
};

export default Onboarding;