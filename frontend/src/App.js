import React, { useState } from "react";
import Onboarding from "./components/Onboarding";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import LiveSession from "./components/LiveSession";
import Decision from "./components/Decision";

import styles from "./styles/AppLayout.module.css";

const App = () => {
  const [active, setActive] = useState("dashboard");

  const renderPage = () => {
    switch (active) {
      case "onboarding":
        return <Onboarding setActive={setActive} />;
      case "dashboard":
        return <Dashboard />;
      case "live":
        return <LiveSession />;
      case "summary":
        return <Decision />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.app}>
      <Header />

      <div className={styles.body}>
        <Sidebar active={active} setActive={setActive} />

        <div className={styles.content}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
};

export default App;