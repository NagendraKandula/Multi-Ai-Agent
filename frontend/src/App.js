import React, { useState } from "react";
import Onboarding from "./components/Onboarding";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";

import styles from "./styles/AppLayout.module.css";

const App = () => {
  const [active, setActive] = useState("dashboard"); // ✅ default to dashboard for faster testing

  const renderPage = () => {
  switch (active) {
    case "onboarding":
      return <Onboarding />;
    case "dashboard":
      return <Dashboard />;
    case "live":
      return <div>Live Session</div>;
    case "summary":
      return <div>Decision Summary</div>;
    case "history":
      return <div>History</div>;
    case "settings":
      return <div>Settings</div>;
    default:
      return null;
  }
};

  return (
    <div className={styles.app}>
      
      {/* 🔝 FULL WIDTH HEADER */}
      <Header />

      {/* 🔽 BELOW HEADER */}
      <div className={styles.body}>
        
        {/* LEFT SIDEBAR */}
        <Sidebar active={active} setActive={setActive} />

        {/* RIGHT CONTENT */}
        <div className={styles.content}>
          {renderPage()}
        </div>

      </div>
    </div>
  );
};

export default App;