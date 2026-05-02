import React, { useState } from 'react';
import styles from '../styles/ExecutionBoard.module.css';

// ✅ Typescript Interfaces to prevent errors
interface TaskResult {
  agent: string;
  status: string;
  thoughtProcess: string;
  deliverableTitle: string;
  deliverableContent: string;
}

interface Task {
  id: number;
  description: string;
  status: 'Pending' | 'Executing' | 'Completed' | 'Failed';
  result: TaskResult | null;
}

interface ExecutionBoardProps {
  sessionData: any;
  setActive: (page: string) => void;
}

const ExecutionBoard: React.FC<ExecutionBoardProps> = ({ sessionData, setActive }) => {
  
  // Extract the action items from the summary strengths (or use default fallbacks)
  const actionItems = sessionData?.summary?.strengths?.slice(0, 4) || [
    "Draft Go-To-Market Strategy",
    "Design Tech Stack Architecture",
    "Analyze Financial Runway"
  ];

  // ✅ Properly typed state array
  const [tasks, setTasks] = useState<Task[]>(
    actionItems.map((task: string, index: number) => ({
      id: index,
      description: task,
      status: 'Pending', 
      result: null
    }))
  );

  const executeTask = async (taskId: number, taskDescription: string) => {
    // Set UI to loading state
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'Executing' } : t));

    try {
      const res = await fetch('http://localhost:4000/simulation/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          task: taskDescription, 
          startupContext: sessionData?.onboardingData 
        })
      });
      
      const result = await res.json();
      
      // Update UI with the Agent's actual work
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'Completed', result } : t));
    } catch (err) {
      console.error(err);
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'Pending' } : t));
      alert("Execution failed. Please ensure backend is running.");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Autonomous Execution Board</h1>
        <p className={styles.subtitle}>Watch your AI executive team execute the action plan in real-time.</p>
      </div>

      <div>
        {tasks.map((task) => (
          <div key={task.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.taskTitle}>{task.description}</h3>
              
              {task.status === 'Pending' && (
                <button 
                  className={styles.primaryBtn}
                  onClick={() => executeTask(task.id, task.description)}
                >
                  ▶ Deploy Agent
                </button>
              )}
              {task.status === 'Executing' && (
                <span className={styles.executingText}>⚙️ Agent is working...</span>
              )}
              {task.status === 'Completed' && (
                <span className={styles.completedText}>✔ Executed by {task.result?.agent}</span>
              )}
            </div>

            {/* EXPANDABLE RESULTS PANEL */}
            {task.result && (
              <div className={styles.resultsPanel}>
                
                {/* 1. Thought Process (Explainability) */}
                <div>
                  <span className={styles.label} style={{ color: '#8b5cf6' }}>Agent Thought Process</span>
                  <p className={styles.thoughtProcess}>"{task.result.thoughtProcess}"</p>
                </div>
                
                {/* 2. Actual Deliverable */}
                <div>
                  <span className={styles.label} style={{ color: '#f59e0b' }}>Deliverable: {task.result.deliverableTitle}</span>
                  <div className={styles.deliverableContent}>
                    {task.result.deliverableContent}
                  </div>
                </div>

              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Return to Dashboard Button */}
      <div style={{ marginTop: '30px' }}>
         <button className={styles.primaryBtn} style={{ background: '#2b2b2b' }} onClick={() => setActive('dashboard')}>
            Return to Dashboard
         </button>
      </div>
    </div>
  );
};

export default ExecutionBoard;