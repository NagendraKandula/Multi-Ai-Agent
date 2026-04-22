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

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "onboarding", label: "Start New Idea", icon: Lightbulb },
  { id: "live", label: "Live Session", icon: Radio },
  { id: "summary", label: "Decision Summary", icon: FileText },
  { id: "history", label: "History", icon: History },
  { id: "settings", label: "Settings", icon: Settings },
];

const Sidebar = ({ active, setActive }: Props) => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.menu}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;

          return (
            <div
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`${styles.item} ${isActive ? styles.active : ""}`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;