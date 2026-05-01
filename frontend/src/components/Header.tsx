import React, { useRef, useEffect } from "react";
import styles from "../styles/Header.module.css";
import { Search, Bell, Moon, Sun, User, LogOut, ChevronDown } from "lucide-react";



// ─── Props ────────────────────────────────────────────────────────────────────
interface HeaderProps {
  setActive: (page: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────
const Header: React.FC<HeaderProps> = ({ setActive }) => {
  const [darkMode, setDarkMode] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef                  = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark");
  };

  const handleLogout = () => {
    setMenuOpen(false);
    setActive("landing");
  };

  return (
    <header className={styles.header}>
      {/* LEFT: Logo */}
        <a href="#" className={styles.logo}>
  <span className={styles.logoText}>CoGens</span>
</a>

      {/* CENTER: Search */}
      <div className={styles.searchContainer}>
        <Search size={15} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search agents, tasks, users..."
          className={styles.searchInput}
        />
        <span className={styles.searchShortcut}>⌘K</span>
      </div>

      {/* RIGHT: Actions */}
      <div className={styles.actions}>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={styles.iconBtn}
          title={darkMode ? "Light mode" : "Dark mode"}
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Notifications */}
        <button className={styles.iconBtn} title="Notifications">
          <Bell size={16} />
          <span className={styles.notifDot} />
        </button>

        {/* Divider */}
        <span className={styles.divider} />

        {/* Profile + Dropdown */}
        <div className={styles.profileWrap} ref={menuRef}>
          <button
            className={`${styles.profile} ${menuOpen ? styles.profileOpen : ""}`}
            onClick={() => setMenuOpen((prev) => !prev)}
            title="Account"
          >
            <span className={styles.profileAvatar}>
              <User size={15} />
            </span>
            <span className={styles.profileName}>Account</span>
            <ChevronDown
              size={13}
              className={`${styles.chevron} ${menuOpen ? styles.chevronUp : ""}`}
            />
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <div className={styles.dropdownMenu}>

              {/* User info */}
              <div className={styles.dropdownUser}>
                <span className={styles.dropdownAvatar}>
                  <User size={14} />
                </span>
                <div className={styles.dropdownUserInfo}>
                  <span className={styles.dropdownUserName}>CoGens User</span>
                  <span className={styles.dropdownUserEmail}>user@cogens.ai</span>
                </div>
              </div>

              <div className={styles.dropdownDivider} />

              <button className={styles.dropdownItem}>
                <User size={14} />
                Profile
              </button>

              <div className={styles.dropdownDivider} />

              {/* Logout */}
              <button
                className={`${styles.dropdownItem} ${styles.dropdownLogout}`}
                onClick={handleLogout}
              >
                <LogOut size={14} />
                Log out
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Header;