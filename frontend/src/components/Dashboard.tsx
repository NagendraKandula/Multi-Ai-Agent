import { ReactNode } from "react";
import styles from "../styles/Dashboard.module.css";
import {
  Bot,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  Users,
  Download
} from "lucide-react";

type CardProps = {
  title: string;
  value: string;
  change: string;
  icon: ReactNode;
  color: string;
  negative?: boolean; // ✅ optional
};

type ChatProps = {
  text: string;
  agent: string;
  time: string;
};

const Dashboard = () => {
  return (
    <div className={styles.dashboard}>
      
      {/* HEADER */}
      <div className={styles.top}>
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back! Here's an overview of your AI agents.</p>
        </div>

        <button className={styles.exportBtn}>
          <Download size={16} />
          Export Data
        </button>
      </div>

      {/* STATS */}
      <div className={styles.cards}>
        <Card title="Total AI Agents" value="4" change="+12% from last week" icon={<Bot />} color="blue" />
        <Card title="Active Tasks" value="156" change="+8% from last week" icon={<Clock />} color="yellow" />
        <Card title="Completed Jobs" value="1,234" change="+23% from last week" icon={<CheckCircle />} color="green" />
        <Card title="Failed Jobs" value="12" change="-5% from last week" icon={<XCircle />} color="red" negative />
        <Card title="Revenue" value="24,567/-" change="+15% from last week" icon={<DollarSign />} color="green" />
        <Card title="Total Users" value="3" change="+1% from last week" icon={<Users />} color="purple" />
      </div>

      {/* CHARTS */}
      <div className={styles.charts}>
        
        <div className={styles.chartBox}>
          <h3>Task Performance</h3>
          <p>Completed vs Failed tasks this week</p>

          {/* simple bar mock */}
          <div className={styles.barChart}>
            {[45, 52, 48, 61, 55, 38, 42].map((h, i) => (
              <div key={i} style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>

        <div className={styles.chartBox}>
          <h3>Agent Usage Distribution</h3>
          <p>Usage by Agents type</p>

          {/* simple pie mock */}
          <div className={styles.pie}></div>
        </div>

      </div>

      {/* RECENT CHATS */}
      <div className={styles.recent}>
        <h3>Recent Chats</h3>
        <p>Latest updates from your AI agents</p>

        <Chat text="Build simple app. Easy to deploy" agent="CTO" time="2 mins ago" />
        <Chat text="Can we effort this in 3 months" agent="CFO" time="5 mins ago" />
        <Chat text="Local Marketing and Partners with stores" agent="CMO" time="8 mins ago" />
      </div>
    </div>
  );
};

/* ---------- COMPONENTS ---------- */

const Card: React.FC<CardProps> = ({
  title,
  value,
  change,
  icon,
  color,
  negative = false, // ✅ default value
}) => {
  return (
    <div className={styles.card}>
      <div>
        <p className={styles.title}>{title}</p>
        <h2>{value}</h2>
        <span className={negative ? styles.negative : styles.positive}>
          {change}
        </span>
      </div>

      <div className={`${styles.icon} ${styles[color]}`}>
        {icon}
      </div>
    </div>
  );
};

const Chat: React.FC<ChatProps> = ({ text, agent, time }) => {
  return (
    <div className={styles.chat}>
      <div className={styles.dot}></div>
      <div className={styles.chatContent}>
        <p>{text}</p>
        <span>Agent: {agent}</span>
      </div>
      <span className={styles.time}>{time}</span>
    </div>
  );
};

export default Dashboard;