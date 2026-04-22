import styles from "../styles/Step2.module.css";

type Props = {
  formData: any;
  set: (data: any) => void;
  next: () => void;
  back: () => void;
};

const Toggle = ({ label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`${styles.toggle} ${
      active ? styles.toggleActive : styles.toggleInactive
    }`}
  >
    {label}
  </button>
);

/* ─────────────────────────────────────────
   Tech View – matches screenshot exactly
───────────────────────────────────────── */
const TechView = ({ formData, set }: any) => (
  <>
    {/* Section 1: Product Type */}
    <div className={styles.section}>
      <h3 className={styles.sectionHeader}>SECTION 1: Product Type</h3>

      <div>
        <label className={styles.label}>What type of product?</label>
        <div className={styles.toggleGroup}>
          {["SaaS", "Web App", "Mobile App", "Marketplace", "AI Product", "Not sure"].map((t) => (
            <Toggle key={t} label={t} active={formData.productType === t} onClick={() => set({ productType: t })} />
          ))}
        </div>
      </div>

      <div>
        <label className={styles.label}>Where will users access your product?</label>
        <div className={styles.toggleGroup}>
          {["Web", "Mobile", "Both"].map((t) => (
            <Toggle key={t} label={t} active={formData.userAccess === t} onClick={() => set({ userAccess: t })} />
          ))}
        </div>
      </div>
    </div>

    {/* Section 2: Core Product Thinking */}
    <div className={styles.section}>
      <h3 className={styles.sectionHeader}>SECTION 2: Core Product Thinking</h3>

      <div>
        <label className={styles.label}>List 2–3 essential features for your MVP</label>
        <textarea
          className={styles.textarea}
          placeholder="e.g., User authentication, Dashboard, Payment processing"
          value={formData.mvpFeatures}
          onChange={(e) => set({ mvpFeatures: e.target.value })}
        />
      </div>

      <div>
        <label className={styles.label}>UX Priority – What matters more?</label>
        <div className={styles.toggleGroup}>
          {["Simplicity (easy to use)", "Advanced features"].map((t) => (
            <Toggle key={t} label={t} active={formData.uxPriority === t} onClick={() => set({ uxPriority: t })} />
          ))}
        </div>
      </div>

      <div>
        <label className={styles.label}>How will users interact?</label>
        <div className={styles.toggleGroup}>
          {["Real-time (chat, live tracking)", "Standard (forms, dashboard)"].map((t) => (
            <Toggle key={t} label={t} active={formData.userInteraction === t} onClick={() => set({ userInteraction: t })} />
          ))}
        </div>
      </div>
    </div>

    {/* Section 3: Technical Direction */}
    <div className={styles.section}>
      <h3 className={styles.sectionHeader}>SECTION 3: Technical Direction</h3>

      <div>
        <label className={styles.label}>Do you have a preferred tech stack?</label>
        <div className={styles.toggleGroup}>
          {["MERN / React", "Flutter / React Native", "AI/ML-based", "No preference"].map((t) => (
            <Toggle key={t} label={t} active={formData.techStack === t} onClick={() => set({ techStack: t })} />
          ))}
        </div>
      </div>

      <div>
        <label className={styles.label}>What matters more?</label>
        <div className={styles.toggleGroup}>
          {["Fast MVP (quick launch)", "Scalable system"].map((t) => (
            <Toggle key={t} label={t} active={formData.buildPriority === t} onClick={() => set({ buildPriority: t })} />
          ))}
        </div>
      </div>

      <div>
        <label className={styles.label}>Expected users in first 6 months?</label>
        <div className={styles.toggleGroup}>
          {["<1K", "1K–10K", "10K+"].map((t) => (
            <Toggle key={t} label={t} active={formData.expectedUsers === t} onClick={() => set({ expectedUsers: t })} />
          ))}
        </div>
      </div>
    </div>

    {/* Section 4: Data & AI */}
    <div className={styles.section}>
      <h3 className={styles.sectionHeader}>SECTION 4: Data & AI</h3>

      <div>
        <label className={styles.label}>Does your product rely on data or AI?</label>
        <div className={styles.toggleGroup}>
          {["Yes (core feature)", "Somewhat", "No"].map((t) => (
            <Toggle key={t} label={t} active={formData.dataAiReliance === t} onClick={() => set({ dataAiReliance: t })} />
          ))}
        </div>
      </div>

      <div>
        <label className={styles.label}>Will you handle sensitive user data?</label>
        <div className={styles.toggleGroup}>
          {["Yes (financial / health / personal)", "No"].map((t) => (
            <Toggle key={t} label={t} active={formData.sensitiveData === t} onClick={() => set({ sensitiveData: t })} />
          ))}
        </div>
      </div>
    </div>

    {/* Section 5: Industry */}
    <div className={styles.section}>
      <h3 className={styles.sectionHeader}>SECTION 5: Industry</h3>
      <label className={styles.label}>Which industry does your product belong to?</label>
      <select
        className={styles.select}
        value={formData.industry}
        onChange={(e) => set({ industry: e.target.value })}
      >
        {["FinTech", "HealthTech", "EdTech", "E-commerce", "SaaS Tools", "Other"].map((v) => (
          <option key={v} value={v}>{v}</option>
        ))}
      </select>
    </div>
  </>
);

/* ─────────────────────────────────────────
   Non-Tech View
───────────────────────────────────────── */
const NonTechView = ({ formData, set }: any) => (
  <>
    <div className={styles.section}>
      <h3 className={styles.sectionHeader}>SECTION 1: Business Type</h3>

      <div>
        <label className={styles.label}>What type of business are you building?</label>
        <div className={styles.toggleGroup}>
          {["Service (salon, consulting, etc.)", "Product (hardware, software, etc.)", "Not sure"].map((t) => (
            <Toggle key={t} label={t} active={formData.nonTechBusinessType === t} onClick={() => set({ nonTechBusinessType: t })} />
          ))}
        </div>
      </div>

      <div>
        <label className={styles.label}>What are you providing?</label>
        <div className={styles.toggleGroup}>
          {["Services", "Products", "Both"].map((t) => (
            <Toggle key={t} label={t} active={formData.providing === t} onClick={() => set({ providing: t })} />
          ))}
        </div>
      </div>
    </div>

    <div className={styles.section}>
      <h3 className={styles.sectionHeader}>SECTION 2: Business Operation</h3>

      {[
        { label: "How is your business operation?", field: "businessOperation", opts: ["Physical store", "Online store", "Both"] },
        { label: "How complex is your operation?", field: "operationComplexity", opts: ["Simple (few steps)", "Moderate (multiple steps)", "Complex (many steps)"] },
        { label: "Do you have supplier dependency?", field: "supplierDependency", opts: ["Yes", "No"] },
        { label: "What type of dependency?", field: "dependencyType", opts: ["Workforce", "Materials", "Technology"] },
        { label: "How time-sensitive is your business?", field: "timeSensitivity", opts: ["Low", "Medium", "High"] },
      ].map(({ label, field, opts }) => (
        <div key={field}>
          <label className={styles.label}>{label}</label>
          <div className={styles.toggleGroup}>
            {opts.map((t) => (
              <Toggle key={t} label={t} active={formData[field] === t} onClick={() => set({ [field]: t })} />
            ))}
          </div>
        </div>
      ))}
    </div>

    <div className={styles.section}>
      <h3 className={styles.sectionHeader}>SECTION 3: Industry</h3>
      <label className={styles.label}>Which industry does your business belong to?</label>
      <select className={styles.select} value={formData.nonTechIndustry} onChange={(e) => set({ nonTechIndustry: e.target.value })}>
        {["Food", "Healthcare", "Retail", "Manufacturing", "Consulting", "Other"].map((v) => (
          <option key={v} value={v}>{v}</option>
        ))}
      </select>
    </div>

    <div className={styles.section}>
      <h3 className={styles.sectionHeader}>SECTION 4: Licenses</h3>
      <label className={styles.label}>Do you need any licenses?</label>
      <select className={styles.select} value={formData.licensesRequired} onChange={(e) => set({ licensesRequired: e.target.value })}>
        {["Yes", "No", "Not sure"].map((v) => (
          <option key={v} value={v}>{v}</option>
        ))}
      </select>
    </div>
  </>
);

/* ─────────────────────────────────────────
   Both View
───────────────────────────────────────── */
const BothView = ({ formData, set }: any) => (
  <>
    {[
      { title: "SECTION 1: Business Driver", label: "What drives your business?", field: "businessDriver", opts: ["Tech", "Non-Tech", "Both equally"] },
      { title: "SECTION 2: Technology Usage", label: "How is technology used?", field: "technologyUsage", opts: ["Core platform (app/website is main product)", "Supporting tool (tech enhances non-tech operations)", "Not sure"] },
      { title: "SECTION 3: Customer Interaction", label: "How do customers interact?", field: "customerInteraction", opts: ["Online (website/app)", "In-person (physical store)", "Both"] },
      { title: "SECTION 6: Operation Complexity", label: "How complex is your operation?", field: "bothOperationComplexity", opts: ["Simple (few steps)", "Moderate (multiple steps)", "Complex (many steps)"] },
      { title: "SECTION 7: Supplier Dependency", label: "Do you have supplier dependency?", field: "bothSupplierDependency", opts: ["Yes", "No"] },
      { title: "SECTION 8: Time Sensitivity", label: "How time-sensitive is your business?", field: "bothTimeSensitivity", opts: ["Low", "Medium", "High"] },
      { title: "SECTION 9: Platform Preference", label: "Where will users access your platform?", field: "platformPreference", opts: ["Web", "Mobile", "Both"] },
      { title: "SECTION 10: Scale Expectation", label: "Expected users in first 6 months?", field: "scaleExpectation", opts: ["<1K", "1K–10K", "10K+"] },
      { title: "SECTION 11: Speed vs Scalability", label: "What matters more?", field: "speedVsScalability", opts: ["Fast MVP (quick launch)", "Scalable system"] },
      { title: "SECTION 13: Data Sensitivity", label: "Will you handle sensitive user data?", field: "dataSensitivity", opts: ["Yes (financial / health / personal)", "No"] },
    ].map(({ title, label, field, opts }) => (
      <div key={field} className={styles.section}>
        <h3 className={styles.sectionHeader}>{title}</h3>
        <label className={styles.label}>{label}</label>
        <div className={styles.toggleGroup}>
          {opts.map((t) => (
            <Toggle key={t} label={t} active={formData[field] === t} onClick={() => set({ [field]: t })} />
          ))}
        </div>
      </div>
    ))}

    <div className={styles.section}>
      <h3 className={styles.sectionHeader}>SECTION 4: Platform Features</h3>
      <label className={styles.label}>List 2–3 essential features for your MVP</label>
      <textarea
        className={styles.textarea}
        placeholder="e.g., User authentication, Dashboard, Payment processing"
        value={formData.platformFeatures}
        onChange={(e) => set({ platformFeatures: e.target.value })}
      />
    </div>

    <div className={styles.section}>
      <h3 className={styles.sectionHeader}>SECTION 5: Physical Component</h3>
      <label className={styles.label}>What is the physical component of your business?</label>
      <input
        className={styles.input}
        placeholder="e.g., Delivery, Physical store"
        value={formData.physicalComponent}
        onChange={(e) => set({ physicalComponent: e.target.value })}
      />
    </div>

    <div className={styles.section}>
      <h3 className={styles.sectionHeader}>SECTION 12: Industry</h3>
      <label className={styles.label}>Which industry does your business belong to?</label>
      <select className={styles.select} value={formData.bothIndustry} onChange={(e) => set({ bothIndustry: e.target.value })}>
        {["Food", "Healthcare", "Retail", "Manufacturing", "Consulting", "Other"].map((v) => (
          <option key={v} value={v}>{v}</option>
        ))}
      </select>
    </div>

    <div className={styles.section}>
      <h3 className={styles.sectionHeader}>SECTION 14: Licenses</h3>
      <label className={styles.label}>Do you need any licenses?</label>
      <select className={styles.select} value={formData.bothLicensesRequired} onChange={(e) => set({ bothLicensesRequired: e.target.value })}>
        {["Yes", "No", "Not sure"].map((v) => (
          <option key={v} value={v}>{v}</option>
        ))}
      </select>
    </div>
  </>
);

/* ─────────────────────────────────────────
   Not Sure View
───────────────────────────────────────── */
const NotSureView = ({ formData, set }: any) => {
  if (formData.classifiedBusinessType) {
    return (
      <div className={styles.classifyResult}>
        <div className={styles.classifyIcon}>
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#2563eb">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className={styles.classifyLabel}>✨ We've identified your business as:</p>
        <h2 className={styles.classifyType}>{formData.classifiedBusinessType}</h2>
        <p className={styles.classifyDesc}>
          {formData.classifiedBusinessType === "Tech" && "Your business is technology-focused. We'll recommend tech-specific strategies and tools."}
          {formData.classifiedBusinessType === "Non Tech" && "Your business is operations-focused. We'll recommend strategies for physical operations."}
          {formData.classifiedBusinessType === "Both" && "Your business is a hybrid of tech and operations. We'll recommend a balanced approach."}
        </p>
      </div>
    );
  }

  return (
    <>
      {[
        { title: "SECTION 1: Customer Interaction", label: "How will customers interact with your business?", field: "notSureCustomerInteraction", opts: ["Through an app or website", "In-person (store/service)", "Both"] },
        { title: "SECTION 2: Core Offering", label: "What are you mainly providing?", field: "notSureCoreOffering", opts: ["A digital product/service", "Physical products/services", "Both"] },
        { title: "SECTION 3: Role of Technology", label: "How important is technology in your idea?", field: "notSureRoleOfTechnology", opts: ["Core (business depends on it)", "Supporting (helps operations)", "Minimal"] },
        { title: "SECTION 4: Operations Insight", label: "Will your business involve physical operations?", field: "notSurePhysicalOperations", opts: ["Yes (delivery/store/workforce)", "No", "Not sure"] },
        { title: "SECTION 5: User Experience Expectation", label: "How will users primarily use your service?", field: "notSureUserExperience", opts: ["Regularly through an app", "Occasionally in real world", "Both"] },
        { title: "SECTION 6: Scale Expectation", label: "How many users/customers do you expect initially?", field: "notSureScaleExpectation", opts: ["Small (local users)", "Medium", "Large (thousands+)"] },
        { title: "SECTION 7: Automation Preference", label: "How much do you want to automate your business?", field: "notSureAutomation", opts: ["Minimal (manual processes)", "Moderate", "High (automated systems)"] },
      ].map(({ title, label, field, opts }) => (
        <div key={field} className={styles.section}>
          <h3 className={styles.sectionHeader}>{title}</h3>
          <label className={styles.label}>{label}</label>
          <div className={styles.toggleGroup}>
            {opts.map((t) => (
              <Toggle key={t} label={t} active={formData[field] === t} onClick={() => set({ [field]: t })} />
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

/* ─────────────────────────────────────────
   Classification logic
───────────────────────────────────────── */
const classifyBusiness = (formData: any): string => {
  let tech = 0, nonTech = 0;
  if (formData.notSureCustomerInteraction === "Through an app or website") tech += 2;
  else if (formData.notSureCustomerInteraction === "In-person (store/service)") nonTech += 2;
  else tech += 1;
  if (formData.notSureCoreOffering === "A digital product/service") tech += 2;
  else if (formData.notSureCoreOffering === "Physical products/services") nonTech += 2;
  else tech += 1;
  if (formData.notSureRoleOfTechnology === "Core (business depends on it)") tech += 2;
  else if (formData.notSureRoleOfTechnology === "Minimal") nonTech += 2;
  else tech += 1;
  if (formData.notSurePhysicalOperations === "No") tech += 2;
  else if (formData.notSurePhysicalOperations === "Yes (delivery/store/workforce)") nonTech += 2;
  if (formData.notSureUserExperience === "Regularly through an app") tech += 2;
  else if (formData.notSureUserExperience === "Occasionally in real world") nonTech += 2;
  else tech += 1;
  if (formData.notSureAutomation === "High (automated systems)") tech += 2;
  else if (formData.notSureAutomation === "Minimal (manual processes)") nonTech += 2;
  else tech += 1;
  if (Math.abs(tech - nonTech) <= 2) return "Both";
  return tech > nonTech ? "Tech" : "Non Tech";
};

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
const Step2 = ({ formData, set, next, back }: Props) => {
  const isNotSure = formData.businessType === "Not Sure";
  const showClassify = isNotSure && !formData.classifiedBusinessType;

  const handleNext = () => {
    if (showClassify) {
      set({ classifiedBusinessType: classifyBusiness(formData) });
    } else {
      next();
    }
  };

  const titles: Record<string, string> = {
    Tech: "Tech Business Details",
    "Non Tech": "Non-Tech Business Details",
    Both: "Business Type Details (Both)",
    "Not Sure": formData.classifiedBusinessType ? "Your Business Type" : "Help Us Understand Your Business",
  };

  const subtitles: Record<string, string> = {
    Tech: "Tell us more about your tech product.",
    "Non Tech": "Tell us more about your non-tech business.",
    Both: "Tell us about your hybrid tech + non-tech business.",
    "Not Sure": formData.classifiedBusinessType
      ? "We've classified your business based on your answers."
      : "Answer a few questions so we can recommend the right approach.",
  };

  const renderView = () => {
    switch (formData.businessType) {
      case "Tech": return <TechView formData={formData} set={set} />;
      case "Non Tech": return <NonTechView formData={formData} set={set} />;
      case "Both": return <BothView formData={formData} set={set} />;
      case "Not Sure": return <NotSureView formData={formData} set={set} />;
      default: return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{titles[formData.businessType] || "Business Details"}</h1>
        <p className={styles.subtitle}>{subtitles[formData.businessType] || ""}</p>
      </div>

      <div className={styles.card}>
        <div className={styles.cardContent}>
          {renderView()}
        </div>
      </div>

      <div className={styles.footer}>
        <button className={styles.secondaryBtn} onClick={back}>← Back</button>
        <button className={styles.primaryBtn} onClick={handleNext}>
          {showClassify ? "Analyze & Continue →" : "Next: Market & Business →"}
        </button>
      </div>
    </div>
  );
};

export default Step2;