import React, { useState } from "react";
import styles from "../styles/Onboarding.module.css";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import StepIndicator from "./StepIndicator";
import { FormData } from "./types";

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState<FormData>({
    businessName: "", location: "Vizag", budgetRange: "", targetMarket: "",
    businessType: "Tech", problemSolving: "", currentSolution: "", betterSolution: "",
    stage: "Idea", helpNeeded: "Build MVP",
    productType: "SaaS", userAccess: "Web", mvpFeatures: "",
    uxPriority: "Simplicity (easy to use)", userInteraction: "Standard (forms, dashboard)",
    techStack: "No preference", buildPriority: "Fast MVP (quick launch)",
    expectedUsers: "1K–10K", dataAiReliance: "No", sensitiveData: "No", industry: "SaaS Tools",
    nonTechBusinessType: "Service (salon, consulting, etc.)", providing: "Services",
    businessOperation: "Physical store", operationComplexity: "Simple (few steps)",
    supplierDependency: "No", dependencyType: "Workforce", timeSensitivity: "Medium",
    nonTechIndustry: "Food", licensesRequired: "Not sure",
    businessDriver: "Both equally", technologyUsage: "Core platform (app/website is main product)",
    customerInteraction: "Both", platformFeatures: "", physicalComponent: "",
    bothOperationComplexity: "Simple (few steps)", bothSupplierDependency: "No",
    bothTimeSensitivity: "Medium", platformPreference: "Both", scaleExpectation: "1K–10K",
    speedVsScalability: "Fast MVP (quick launch)", bothIndustry: "Food",
    dataSensitivity: "No", bothLicensesRequired: "Not sure",
    notSureCustomerInteraction: "Both", notSureCoreOffering: "Both",
    notSureRoleOfTechnology: "Core (business depends on it)",
    notSurePhysicalOperations: "Yes (delivery/store/workforce)",
    notSureUserExperience: "Both", notSureScaleExpectation: "Medium",
    notSureAutomation: "Moderate", classifiedBusinessType: "",
    idealCustomer: "", marketScope: "Local", competitors: "",
    revenueModel: "Subscription (Monthly)", growthGoal: "Profitability",
    roiTimeline: "6 Months - 1 Year",
    speedToLaunch: 75, productQuality: 50, costEfficiency: 40,
    constraint: "Budget", riskAppetite: "Medium - Balanced Risk",
    founderExperience: "Intermediate", successMetric: "Monthly Revenue",
    selectedAgents: ["CTO", "CMO", "CFO"],
  });

  const set = (field: Partial<FormData>) =>
    setFormData((prev) => ({ ...prev, ...field }));

  const hasStep2 = ["Tech", "Non Tech", "Both", "Not Sure"].includes(formData.businessType);
  const totalSteps = hasStep2 ? 4 : 3;
  const marketStep = hasStep2 ? 3 : 2;
  const strategyStep = hasStep2 ? 4 : 3;

  const stepLabels: Record<number, string> = {
    1: "Basic & Problem",
    2: hasStep2
      ? formData.businessType === "Not Sure" ? "Business Discovery" : "Business Type"
      : "Market & Business",
    3: hasStep2 ? "Market & Business" : "Strategy & AI Setup",
    4: "Strategy & AI Setup",
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <StepIndicator currentStep={currentStep} totalSteps={totalSteps} labels={stepLabels} />

        {currentStep === 1 && (
          <Step1 formData={formData} set={set} next={() => setCurrentStep(hasStep2 ? 2 : marketStep)} />
        )}
        {currentStep === 2 && hasStep2 && (
          <Step2 formData={formData} set={set} next={() => setCurrentStep(marketStep)} back={() => setCurrentStep(1)} />
        )}
        {currentStep === marketStep && (
          <Step3 formData={formData} set={set} next={() => setCurrentStep(strategyStep)} back={() => setCurrentStep(hasStep2 ? 2 : 1)} />
        )}
        {currentStep === strategyStep && (
          <Step4 formData={formData} set={set} back={() => setCurrentStep(marketStep)} />
        )}
      </div>
    </div>
  );
};

export default Onboarding;