import React, { useEffect, useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import styles from '../styles/Decision.module.css';

interface DecisionProps {
  sessionData: {
    transcript: string[];
    onboardingData: any;
    summary?: SummaryData;
  } | null;
  setActive: (page: string) => void;
  setSessionData: (data: any) => void;
}

interface SummaryData {
  score: string;
  finalSummary: string;
  strengths: string[];
  concerns: string[];
}

const Decision: React.FC<DecisionProps> = ({ sessionData, setActive, setSessionData }) => {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false); // Track loading state for PDF button

  // 1. Create a reference for the content we want to capture
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sessionData || !sessionData.transcript || sessionData.transcript.length === 0) {
       setError("No debate data found. Please run a live session first.");
       setLoading(false);
       return;
    }

    const fetchSummary = async () => {
      try {
        const res = await fetch('http://localhost:4000/simulation/summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            transcript: sessionData.transcript, 
            onboardingData: sessionData.onboardingData 
          })
        });

        if (!res.ok) throw new Error(`Server returned ${res.status}`);

        const data = await res.json();
        setSummary(data);
      } catch (err) {
        console.error("Failed to load summary", err);
        setError("Failed to generate summary. Please check your backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [sessionData]);

  // 2. The PDF Export Function
  const handleExportPDF = async () => {

    if (!contentRef.current) return;
    
    setIsExporting(true); // Show loading state on button
    
    try {
      // Take a high-resolution snapshot of the div
      const canvas = await html2canvas(contentRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      
      // Create a PDF document (A4 size, portrait)
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Calculate dimensions to fit the image on the PDF page perfectly
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // Add the image to the PDF and trigger download
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Decision_Summary_${sessionData?.onboardingData?.businessName || 'Startup'}.pdf`);
    } catch (err) {
      console.error("Failed to export PDF", err);
      alert("Failed to export PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };
const handleExecutePlan = () => {
    if (summary) {
      // Save the generated summary into sessionData so the Execution Board can use the action items!
      setSessionData({ ...sessionData, summary });
      setActive("execution"); // Switch to the execution board
    }
  };
  if (loading) {
    return (
      <div className={styles.page} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
         <h2 style={{ color: '#6b6b6b' }}>Supervisor is drafting the final decision...</h2>
      </div>
    );
  }


  if (error) {
    return (
      <div className={styles.page}>
        <div style={{ color: 'red', background: '#fff0f0', padding: '20px', borderRadius: '8px' }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      
      {/* 3. Wrap the content you want in the PDF with the ref */}
      <div ref={contentRef} style={{ padding: '20px', background: '#f7f7f5' }}>
        
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Decision Summary</h1>
          <p className={styles.subtitle}>
            {sessionData?.onboardingData?.idea || "Session Summary"}
          </p>
        </div>

        <div className={styles.card}>

          {/* FINAL RECOMMENDATION */}
          <h2 className={styles.sectionTitle}>Final Recommendation</h2>
          <p className={styles.agenda}>
            <strong>Agenda:</strong> {sessionData?.onboardingData?.agenda || "N/A"}
          </p>

          {/* STRENGTH + CONCERNS GRID (Side-by-Side) */}
          <div className={styles.grid}>
            
            {/* Strength */}
            <div>
              <h3 className={styles.subHeading}>Strength</h3>
              <ul className={styles.list}>
                {summary?.strengths?.map((str, i) => (
                  <li key={i}>
                    <span className={styles.check}>✔</span>
                    {str}
                  </li>
                ))}
              </ul>
            </div>

            {/* Concerns */}
            <div>
              <h3 className={styles.subHeading}>Concerns</h3>
              <ul className={styles.list}>
                {summary?.concerns?.map((con, i) => (
                  <li key={i}>
                    <span className={styles.warn}>○</span>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ACTION PLAN */}
          <div className={styles.actionSection}>
            <h3 className={styles.subHeading}>Action Plan</h3>
            <ul className={styles.actionList}>
              {summary?.strengths?.slice(0, 4).map((item, i) => (
                <li key={i}>
                  <span className={styles.step}>{i + 1}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
        </div>
      </div>

      {/* FOOTER (Score Left, Buttons Right) - OUTSIDE the PDF ref! */}
      <div className={styles.card} style={{ marginTop: '20px', paddingTop: '20px', paddingBottom: '20px' }}>
        <div className={styles.footer} style={{ borderTop: 'none', marginTop: 0, paddingTop: 0 }}>
          
          <p className={styles.score}>
            Overall Score: <span>{summary?.score || "N/A"}</span>
          </p>

          <div className={styles.actions}>
            <button 
      className={styles.primaryBtn} 
      onClick={handleExecutePlan} // ✅ Triggers the Execution Board
    >
              
              Execute Plan
            </button>
            <button className={styles.ghostBtn}>
              Request changes
            </button>
            
            {/* 4. Attach the export function to the button */}
            <button 
              className={styles.ghostBtn} 
              onClick={handleExportPDF}
              disabled={isExporting}
            >
              {isExporting ? "Generating PDF..." : "Export as PDF"}
            </button>
          </div>

        </div>
      </div>
      
    </div>
  );
};

export default Decision;