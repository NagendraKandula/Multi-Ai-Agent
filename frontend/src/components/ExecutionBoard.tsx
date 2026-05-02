import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import styles from '../styles/ExecutionBoard.module.css';

interface TaskResult {
  agent: string;
  status: string;
  thoughtProcess: string;
  deliverableTitle: string;
  deliverableContent: any; 
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
  
  const actionItems = sessionData?.summary?.actionPlan || [
    "Draft Go-To-Market Strategy",
    "Design Tech Stack Architecture",
    "Analyze Financial Runway"
  ];

  const [tasks, setTasks] = useState<Task[]>(
    actionItems.map((task: string, index: number) => ({
      id: index,
      description: task,
      status: 'Pending', 
      result: null
    }))
  );

  // Track which specific task is currently being exported to PDF
  const [exportingId, setExportingId] = useState<number | null>(null);

  const executeTask = async (taskId: number, taskDescription: string) => {
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
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'Completed', result } : t));
    } catch (err) {
      console.error(err);
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'Pending' } : t));
      alert("Execution failed. Please ensure backend is running.");
    }
  };

  // ✅ NEW: Exports a specific task's result to PDF
  const handleExportTaskPDF = async (taskId: number, taskTitle: string) => {
    const elementId = `task-result-${taskId}`;
    const element = document.getElementById(elementId);
    
    if (!element) return;

    setExportingId(taskId); // Show loading state on the specific button
    
    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      // Clean up the filename so it looks nice (e.g. "draft-go-to-market-strategy.pdf")
      const safeTitle = taskTitle.replace(/[^a-z0-9]/gi, '-').toLowerCase();
      pdf.save(`${safeTitle}-execution.pdf`);
    } catch (err) {
      console.error("Failed to export PDF", err);
      alert("Failed to export PDF. Please try again.");
    } finally {
      setExportingId(null);
    }
  };

  const formatDeliverable = (content: any): React.ReactNode => {
    if (!content) return null;
    
    if (typeof content === 'string') {
      return <div style={{ whiteSpace: 'pre-wrap' }}>{content}</div>;
    }
    
    if (Array.isArray(content)) {
      return (
        <ul style={{ listStyleType: 'disc', paddingLeft: '20px', margin: '8px 0' }}>
          {content.map((item, i) => (
            <li key={i} style={{ marginBottom: '4px' }}>{formatDeliverable(item)}</li>
          ))}
        </ul>
      );
    }
    
    if (typeof content === 'object') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {Object.entries(content).map(([key, value]) => (
            <div key={key}>
              <strong style={{ fontSize: '1.1em', color: '#111827', display: 'block', marginBottom: '4px' }}>
                {key}
              </strong>
              <div style={{ color: '#4b5563' }}>
                {formatDeliverable(value)}
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    return null;
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

            {task.result && (
              <div className={styles.resultsPanel}>
                
                {/* 🎯 Wrap the content we want to export with a dynamic ID */}
                <div id={`task-result-${task.id}`} style={{ padding: '10px', background: '#fcfcfc' }}>
                  <div style={{ marginBottom: '24px' }}>
                    <span className={styles.label} style={{ color: '#8b5cf6' }}>Agent Thought Process</span>
                    <p className={styles.thoughtProcess}>"{task.result.thoughtProcess}"</p>
                  </div>
                  
                  <div>
                    <span className={styles.label} style={{ color: '#f59e0b' }}>Deliverable: {task.result.deliverableTitle}</span>
                    <div className={styles.deliverableContent}>
                      {formatDeliverable(task.result.deliverableContent)}
                    </div>
                  </div>
                </div>

                {/* 📄 The Export Button (Outside the div so it doesn't appear IN the PDF!) */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', borderTop: '1px solid #eee', paddingTop: '16px' }}>
                  <button 
                    className={styles.ghostBtn} 
                    onClick={() => handleExportTaskPDF(task.id, task.description)}
                    disabled={exportingId === task.id}
                  >
                    {exportingId === task.id ? "Generating PDF..." : "Export to PDF"}
                  </button>
                </div>

              </div>
            )}
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '30px' }}>
         <button className={styles.primaryBtn} style={{ background: '#2b2b2b' }} onClick={() => setActive('dashboard')}>
            Return to Dashboard
         </button>
      </div>
    </div>
  );
};

export default ExecutionBoard;