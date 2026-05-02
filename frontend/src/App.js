import React, { useState,useEffect } from "react";
import Onboarding from "./components/Onboarding";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import LiveSession from "./components/LiveSession";
import Decision from "./components/Decision";
import Landing from "./components/Landing";
import styles from "./styles/AppLayout.module.css";

const App = () => {
  const [active, setActive] = useState("landing");
  // ✅ ADDED: State to hold session data for the Decision page
  const [sessionData, setSessionData] = useState(null);

  useEffect(() => {
  const saved = localStorage.getItem("liveSession");
  if (saved) {
    setSessionData(JSON.parse(saved));
  }
}, []);
  if (active === "landing") {
    return <Landing setActive={setActive} />;
  }

  

  const renderPage = () => {
    switch (active) {
      case "onboarding": 
        return <Onboarding setActive={setActive} />;
      case "dashboard":  
        return <Dashboard />;
      case "live":       
        // ✅ UPDATED: Pass setActive and setSessionData to LiveSession
        return <LiveSession setActive={setActive} setSessionData={setSessionData} sessionData={sessionData} />;
      case "summary":    
        // ✅ ADDED: Pass sessionData to Decision
        return <Decision sessionData={sessionData} />;
      default:           
        return null;
    }
  };

  return (
    <div className={styles.app}>
      <Header setActive={setActive} />
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