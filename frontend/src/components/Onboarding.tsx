import React, { useState } from "react";
// Import styles as an object from the renamed .module.css file
import styles from "../styles/Onboarding.module.css"; 

const Onboarding = () => {
  const [form, setForm] = useState({
    idea: "",
    location: "",
    budget: "",
    target: "",
    roles: ["CTO"],
  });

  const toggleRole = (role: string) => {
    setForm((prev) => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter((r) => r !== role)
        : [...prev.roles, role],
    }));
  };

  return (
    <div className={styles.container}>
      {/* LEFT SIDE */}
      <div className={styles.left}>
        <h1>Startup Simulator</h1>
        <h2>Plan Your Business Strategy</h2>
        <p>Enter your details to start a guided session with our expert agents.</p>
        <p className={styles.example}>Eg. "Milk delivery in a small town"</p>
      </div>

      {/* RIGHT SIDE */}
      <div className={styles.right}>
        <input
          placeholder="Business Idea"
          value={form.idea}
          onChange={(e) => setForm({ ...form, idea: e.target.value })}
        />

        <input
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />

        <input
          placeholder="Budget"
          value={form.budget}
          onChange={(e) => setForm({ ...form, budget: e.target.value })}
        />

        <input
          placeholder="Target Customers"
          value={form.target}
          onChange={(e) => setForm({ ...form, target: e.target.value })}
        />

        {/* ROLE SELECTION */}
        <div className={styles.roles}>
          {["CTO", "CMO", "CFO"].map((role) => (
            <button
              key={role}
              // Dynamically apply the 'active' class from the module
              className={form.roles.includes(role) ? styles.active : ""}
              onClick={() => toggleRole(role)}
            >
              {role}
            </button>
          ))}
        </div>

        {/* SLIDERS */}
        <label>Speed</label>
        <input type="range" />

        <label>Cost</label>
        <input type="range" />

        <label>Quality</label>
        <input type="range" />

        {/* BUTTON */}
        <button className={styles.start}>Start Meeting</button>
      </div>
    </div>
  );
};

export default Onboarding;