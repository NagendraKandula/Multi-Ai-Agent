import styles from "../styles/Sidebar.module.css";
import {
  LayoutDashboard,
  Lightbulb,
  Radio,
  FileText,
  History,
  Settings,
} from "lucide-react";

type Props = {
  active: string;
  setActive: (val: string) => void;
};

// Main nav items
const mainItems = [
  { id: "dashboard",  label: "Dashboard",        icon: LayoutDashboard },
  { id: "onboarding", label: "Start New Idea",   icon: Lightbulb       },
  { id: "live",       label: "Live Session",      icon: Radio           },
  { id: "summary",    label: "Decision Summary",  icon: FileText        },
  { id: "history",    label: "History",           icon: History         },
];

// Pinned to bottom
const bottomItems = [
  { id: "settings", label: "Settings", icon: Settings },
];

const Sidebar = ({ active, setActive }: Props) => {
  const renderItem = (item: typeof mainItems[0]) => {
    const Icon = item.icon;
    const isActive = active === item.id;
    return (
      <div
        key={item.id}
        onClick={() => setActive(item.id)}
        className={`${styles.item} ${isActive ? styles.active : ""}`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setActive(item.id)}
        aria-current={isActive ? "page" : undefined}
      >
        <Icon size={18} />
        <span>{item.label}</span>
      </div>
    );
  };

  return (
    <div className={styles.sidebar}>
      {/* Section label */}
      <div className={styles.sectionLabel}>Navigation</div>

      <nav className={styles.menu}>
        {/* Main items */}
        {mainItems.map(renderItem)}

        {/* Push settings to bottom */}
        <div className={styles.spacer} />
        <div className={styles.divider} />

        {/* Bottom items — wrapped for spacing control */}
<div className={styles.bottomNav}>
  {bottomItems.map(renderItem)}
</div>
      </nav>
    </div>
  );
};

export default Sidebar;