import { useState, useEffect } from "react";
import styles from "../styles/Step1.module.css";
import ToggleGroup from "./ToggleGroup";

type Props = {
  formData: any;
  set: (data: any) => void;
  next: () => void;
};

const Step1 = ({ formData, set, next }: Props) => {
  const [query, setQuery] = useState(formData.location || "");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // 🔁 Debounce logic
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      fetchLocations(query);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // 🌍 Fetch from OpenStreetMap (Nominatim)
  const fetchLocations = async (search: string) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${search}`,
        {
          headers: {
            "User-Agent": "startup-form-app",
          },
        }
      );
      const data = await res.json();
      setSuggestions(data.slice(0, 5));
      setShowDropdown(true);
    } catch (err) {
      console.error("Location fetch error:", err);
    }
  };

  return (
    <div className={styles.container}>
      
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Tell Us About Your Startup</h1>
        <p className={styles.subtitle}>
          Give us the basics. You can refine later.
        </p>
      </div>

      {/* Card */}
      <div className={styles.card}>
        <div className={styles.cardContent}>

          {/* Basic Info */}
          <div>
            <h3 className={styles.sectionHeader}>Basic Information</h3>

            <div className={styles.grid}>
              {/* Business Name */}
              <input
                className={styles.input}
                placeholder="Business Name"
                value={formData.businessName}
                onChange={(e) => set({ businessName: e.target.value })}
              />

              {/* Location */}
              <div style={{ position: "relative" }}>
                <input
                  className={styles.input}
                  placeholder="Location"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    set({ location: e.target.value });
                  }}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                />

                {showDropdown && suggestions.length > 0 && (
                  <div className={styles.dropdown}>
                    {suggestions.map((item, index) => (
                      <div
                        key={index}
                        className={styles.option}
                        onClick={() => {
                          setQuery(item.display_name);
                          set({ location: item.display_name });
                          setShowDropdown(false);
                        }}
                      >
                        {item.display_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Founder Name ✅ NEW */}
              <input
                className={styles.input}
                placeholder="Founder / Co-founders"
                value={formData.founderName || ""}
                onChange={(e) => set({ founderName: e.target.value })}
              />

              {/* Budget */}
              <input
                className={styles.input}
                placeholder="Budget Range"
                value={formData.budgetRange}
                onChange={(e) => set({ budgetRange: e.target.value })}
              />

              {/* Target Market */}
              <input
                className={styles.input}
                placeholder="Target Market"
                value={formData.targetMarket}
                onChange={(e) => set({ targetMarket: e.target.value })}
              />

              {/* Team Size ✅ NEW */}
              <select
                className={styles.select}
                value={formData.teamSize || ""}
                onChange={(e) => set({ teamSize: e.target.value })}
              >
                <option value="" disabled>
                  Team Size
                </option>
                {["Solo", "2-5", "6-10", "10+"].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            {/* Business Type */}
            <div className={styles.field}>
              <label className={styles.label}>
                What type of business are you building?
              </label>

              <ToggleGroup
                value={formData.businessType}
                options={["Tech", "Non Tech", "Both", "Not Sure"]}
                onChange={(val) => set({ businessType: val })}
              />
            </div>
          </div>

          {/* Problem Section */}
          <div>
            <h3 className={styles.sectionHeader}>Problem & Value</h3>

            <textarea
              className={styles.textarea}
              placeholder="What problem are you solving?"
              value={formData.problemSolving}
              onChange={(e) => set({ problemSolving: e.target.value })}
            />

            <textarea
              className={styles.textarea}
              placeholder="How do people solve it currently?"
              value={formData.currentSolution}
              onChange={(e) => set({ currentSolution: e.target.value })}
            />

            <textarea
              className={styles.textarea}
              placeholder="What makes your solution better?"
              value={formData.betterSolution}
              onChange={(e) => set({ betterSolution: e.target.value })}
            />
          </div>

          {/* Business Intent */}
          <div>
            <h3 className={styles.sectionHeader}>Business Intent</h3>

            <div className={styles.grid}>
              <select
                className={styles.select}
                value={formData.stage}
                onChange={(e) => set({ stage: e.target.value })}
              >
                {["Idea", "Validation", "Early traction"].map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>

              <select
                className={styles.select}
                value={formData.helpNeeded}
                onChange={(e) => set({ helpNeeded: e.target.value })}
              >
                {["Validate idea", "Build MVP", "Growth strategy", "Full plan"].map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <button className={styles.secondaryBtn}>Save Draft</button>

        <button className={styles.primaryBtn} onClick={next}>
          Next
        </button>
      </div>

    </div>
  );
};

export default Step1;