import React from "react";
import styles from "../styles/Header.module.css";
import { Search, Bell, Moon, Sun, User } from "lucide-react";

const Header = () => {
  const [darkMode, setDarkMode] = React.useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark");
  };

  return (
    <header className={styles.header}>
      
      {/* LEFT: Logo */}
      <div className={styles.logo}>
        Multi Agent Builder
      </div>

      {/* CENTER: Search */}
      <div className={styles.searchContainer}>
        <Search size={18} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search agents, tasks, users..."
          className={styles.searchInput}
        />
      </div>

      {/* RIGHT: Actions */}
      <div className={styles.actions}>
        
        {/* Theme Toggle */}
        <button onClick={toggleTheme} className={styles.iconBtn}>
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <button className={styles.iconBtn}>
          <Bell size={18} />
        </button>

        {/* Profile */}
        <div className={styles.profile}>
          <User size={18} />
        </div>
      </div>
    </header>
  );
};

export default Header;