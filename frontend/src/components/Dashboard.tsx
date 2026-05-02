import { ReactNode } from "react";
import { useEffect, useState } from "react";
import styles from "../styles/Dashboard.module.css";
import {
  Bot,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  Users,
} from "lucide-react";


import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

/* ---------- TYPES ---------- */

type CardProps = {
  title: string;
  value: string;
  change: string;
  icon: ReactNode;
  color: string;
  negative?: boolean;
};

type ChatProps = {
  text: string;
  agent: string;
  time: string;
};

/* ---------- DATA ---------- */


// Raw values (NOT percentages)
const agentDataRaw = [
  { name: "CTO", value: 60 },
  { name: "CMO", value: 63 },
  { name: "CPO", value: 42 },
  { name: "CFO", value: 50 },
  { name: "COO", value: 42 },
  { name: "CSO", value: 31 },
  { name: "Legal", value: 34 },
];

// Normalize to percentage (important for pie chart)
const total = agentDataRaw.reduce((sum, item) => sum + item.value, 0);

const agentData = agentDataRaw.map((item) => ({
  name: item.name,
  value: (item.value / total) * 100,
}));

const COLORS = [
  "#f7931e",
  "#7cb9e8",
  "#86c9a3",
  "#b8a3d9",
  "#7fc8c4",
  "#f4a261",
  "#64748b",
];

/* ---------- MAIN COMPONENT ---------- */

const Dashboard = () => {


const [taskData, setTaskData] = useState([
  { day: "Mon", completed: 12, failed: 2 },
  { day: "Tue", completed: 18, failed: 3 },
  { day: "Wed", completed: 15, failed: 4 },
  { day: "Thu", completed: 22, failed: 2 },
  { day: "Fri", completed: 19, failed: 3 },
  { day: "Sat", completed: 25, failed: 5 },
  { day: "Sun", completed: 17, failed: 2 },
]);

// Simulate real-time updates
useEffect(() => {
  const interval = setInterval(() => {
    setTaskData((prev) =>
      prev.map((item) => ({
        ...item,
        completed: Math.max(10, item.completed + Math.floor(Math.random() * 5 - 2)),
        failed: Math.max(1, item.failed + Math.floor(Math.random() * 3 - 1)),
      }))
    );
  }, 3000);

  return () => clearInterval(interval);
}, []);

  return (
    <div className={styles.dashboard}>
      {/* HEADER */}
      <div className={styles.top}>
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back! Here's an overview of your AI agents.</p>
        </div>
      </div>

      {/* STATS */}
      <div className={styles.cards}>
        <Card title="Total AI Agents" value="7" change="+12% this week" icon={<Bot />} color="blue" />
        <Card title="Active Tasks" value="4" change="+8% this week" icon={<Clock />} color="yellow" />
        <Card title="Completed Jobs" value="12" change="+23% this week" icon={<CheckCircle />} color="green" />
        <Card title="Failed Jobs" value="2" change="-5% this week" icon={<XCircle />} color="red" negative />
        <Card title="Revenue" value="50,000" change="+5% this week" icon={<DollarSign />} color="green" />
        <Card title="Total Users" value="3" change="+1% this week" icon={<Users />} color="purple" />
      </div>

      {/* CHARTS */}
      <div className={styles.charts}>
        
        {/* BAR CHART */}
        {/* BAR CHART */}
<div className={styles.chartBox}>
  <h3>Task Performance</h3>
  <p>Completed vs Failed tasks this week</p>

  <div style={{ width: "100%", height: 260 }}>
    <ResponsiveContainer>
      <BarChart data={taskData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        {/* Custom Tooltip */}
        <Tooltip
          contentStyle={{
            background: "#ffffff",
            border: "1px solid #eaeaea",
            borderRadius: "10px",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.05)",
            fontSize: "13px",
            color: "#2d2d2d",
          }}
          cursor={{ fill: "rgba(247, 147, 30, 0.06)" }}
        />
        
        {/* Axes - subtle styling */}
        <XAxis 
          dataKey="day" 
          axisLine={{ stroke: "#eaeaea" }}
          tickLine={{ stroke: "#eaeaea" }}
          tick={{ fontSize: 12, color: "#7a7a7a", fill: "#7a7a7a" }}
          dy={10}
        />
        <YAxis 
          axisLine={{ stroke: "#eaeaea" }}
          tickLine={{ stroke: "#eaeaea" }}
          tick={{ fontSize: 12, color: "#7a7a7a", fill: "#7a7a7a" }}
          dx={-10}
        />
        
        {/* Bars - Theme Colors */}
        <Bar 
          dataKey="completed" 
          fill="#86c9a3"  /* Soft green - calm success */
          radius={[6, 6, 0, 0]}
          name="Completed"
        />
        <Bar 
          dataKey="failed" 
          fill="#f87171"  /* Soft red - clear but not alarming */
          radius={[6, 6, 0, 0]}
          name="Failed"
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>

        {/* PIE / DONUT CHART */}
        <div className={styles.chartBox}>
          <h3>Agent Usage Distribution</h3>
          <p>Usage by agent type</p>

          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={agentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}   // makes it donut
                  outerRadius={90}
                  dataKey="value"
                  label={(props: any) => {
  const percent = props.percent ?? 0;
  return `${props.name} ${(percent * 100).toFixed(0)}%`;
}}
                >
                  {agentData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
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
  negative = false,
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