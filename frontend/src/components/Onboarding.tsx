import React, { useState } from "react";
import "../styles/Onboarding.css";

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
    <div className="container">
      {/* LEFT SIDE */}
      <div className="left">
        <h1>Startup Simulator</h1>
        <h2>Plan Your Business Strategy</h2>
        <p>Enter your details to start a guided session with our expert agents.</p>
        <p className="example">Eg. "Milk delivery in a small town"</p>
      </div>

      {/* RIGHT SIDE */}
      <div className="right">
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
        <div className="roles">
          {["CTO", "CMO", "CFO"].map((role) => (
            <button
              key={role}
              className={form.roles.includes(role) ? "active" : ""}
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
        <button className="start">Start Meeting</button>
      </div>
    </div>
  );
};

export default Onboarding;