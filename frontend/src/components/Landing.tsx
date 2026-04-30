import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/Landing.module.css";

// ─── SVG Icons (unchanged) ──────────────────────────────────────────────────────
const ChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.631L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
  </svg>
);


// ─── Header (Personalized) ──────────────────────────────────────────────────────
interface HeaderProps {
  onLogin: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogin }) => {
  const [scrolled, setScrolled] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ""}`}>
      <div className={styles.headerInner}>
        {/* Logo */}
        {/* Logo - Text Only */}
<a href="#" className={styles.logo}>
  <span className={styles.logoText}>CoGens</span>
</a>

        {/* Nav - adapted to your app structure */}
        <nav className={styles.nav}>
          <a href="#how-it-works" className={styles.navLink}>How It Works</a>
          <a href="#agents" className={styles.navLink}>Agents</a>

          <div
            className={styles.navDropdown}
            onMouseEnter={() => setResourcesOpen(true)}
            onMouseLeave={() => setResourcesOpen(false)}
          >
            <button className={styles.navLink}>
              Features <ChevronDown />
            </button>
            {resourcesOpen && (
              <div className={styles.dropdownMenu}>
                <a href="#" className={styles.dropdownItem}>Live Agent Debates</a>
                <a href="#" className={styles.dropdownItem}>Decision Summary</a>
                <a href="#" className={styles.dropdownItem}>MVP Planner</a>
                <a href="#" className={styles.dropdownItem}>GTM Strategy Generator</a>
              </div>
            )}
          </div>

          <a href="https://github.com/your-repo" target="_blank" rel="noreferrer" className={styles.navLink}>
            GitHub
          </a>
        </nav>

        {/* CTA Group */}
        <div className={styles.headerActions}>
          <button onClick={onLogin} className={styles.navLink}>Sign in</button>
          <button onClick={onLogin} className={styles.btnPrimary}>
            Start Building <ArrowRight />
          </button>
        </div>
      </div>
    </header>
  );
};

// ─── Hero Section (Fully Personalized) ──────────────────────────────────────────
interface HeroSectionProps {
  onLogin: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onLogin }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <section className={styles.hero}>
      {/* Background: subtle gradient + grid (replace video if needed for hackathon demo) */}
      <div className={styles.heroVideoWrap}>
        <div className={styles.heroGradientBg} />
        <div className={styles.heroGrid} aria-hidden="true" />
      </div>

      {/* Content */}
      <div className={styles.heroContent}>
        <div className={styles.heroBadge}>
          <span className={styles.heroBadgeDot} />
          🏆 HackAP Hackathon 2026 — Agentic AI 
        </div>

        <h1 className={styles.heroHeadline}>
          Build your startup with
          <br />
          <span className={styles.heroAccent}>AI co-founders</span>
          <br />
          that discuss & decide
        </h1>

        <p className={styles.heroSub}>
          CoGens brings together AI agents acting as <strong>CTO, CMO, and CFO... </strong> 
          to collaborate, discuss, debate, and execute your startup strategy, 
          while you stay in control as the visionary founder.
        </p>

        <div className={styles.heroCtas}>
          <button onClick={onLogin} className={styles.btnPrimary}>
            Launch Your Idea <ArrowRight />
          </button>
        </div>

        {/* Trust / Credibility strip - hackathon context */}
        <p className={styles.heroTrust}>Built by Team GibberLink • M.Tech CST, Andhra University</p>
        <div className={styles.trustLogos}>
          <span className={styles.trustLogo}>🤖 Agentic AI</span>
          <span className={styles.trustLogo}>⚡ Real-time Collaboration</span>
          <span className={styles.trustLogo}>🎯 Startup-Focused</span>
        </div>
      </div>
    </section>
  );
};

// ─── How It Works / Agent Demo Section (Personalized) ───────────────────────────
interface AgentSectionProps {
  onLogin: () => void;
}

const AgentSection: React.FC<AgentSectionProps> = ({ onLogin }) => {
  const [activeAgent, setActiveAgent] = useState<"cto" | "cmo" | "cfo">("cto");

  const agentInfo = {
    cto: {
      title: "CTO Agent",
      desc: "Architects your tech stack, plans MVP scope, evaluates technical risks, and suggests scalable solutions.",
      tasks: ["Tech Stack Recommendation", "MVP Roadmap", "Sprint Planning", "Code Review Guidance"]
    },
    cmo: {
      title: "CMO Agent",
      desc: "Researches your market, defines ICP, crafts positioning, and builds your go-to-market strategy.",
      tasks: ["Market Analysis", "Competitor Mapping", "User Personas", "GTM Playbook"]
    },
    cfo: {
      title: "CFO Agent",
      desc: "Models unit economics, forecasts burn rate, advises on funding strategy, and tracks financial KPIs.",
      tasks: ["Financial Modeling", "Pricing Strategy", "Runway Analysis", "Investor Deck Input"]
    }
  };

  return (
    <section id="agents" className= {styles.videoSection}>
      <div className={styles.container}>
        <div className={styles.videoSectionHeader}>
          <h2 className={styles.sectionTitle}>Your AI Co-Founders, Ready to Work</h2>
          <p className={styles.sectionSub}>
            Each agent specializes in a critical domain. They debate trade-offs, align on decisions, 
            and deliver actionable outputs — so you can focus on vision and validation.
          </p>

          {/* Agent Toggle Tabs */}
          <div className={styles.tabGroup}>
            {(["cto", "cmo", "cfo"] as const).map((role) => (
              <button
                key={role}
                className={`${styles.tab} ${activeAgent === role ? styles.tabActive : ""}`}
                onClick={() => setActiveAgent(role)}
              >
                {role.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Agent Detail Card */}
        <div className={styles.videoCard}>
          <div className={styles.videoCardGlow} />
          <div className={styles.agentDemoWrap}>
            <div className={styles.agentHeader}>
              <h3>{agentInfo[activeAgent].title}</h3>
              <span className={styles.agentBadge}>Active</span>
            </div>
            <p className={styles.agentDesc}>{agentInfo[activeAgent].desc}</p>
            
            <div className={styles.agentTasks}>
              {agentInfo[activeAgent].tasks.map((task) => (
                <span key={task} className={styles.pill}>{task}</span>
              ))}
            </div>

            {/* Placeholder for agent visualization / debate log */}
            <div className={styles.agentVisual}>
              <div className={styles.agentChatPlaceholder}>
                <div className={`${styles.chatBubble} ${styles.agent}`}>
                  💡 {activeAgent === "cto" ? "Let's start with a lean MVP using Next.js + Supabase." : 
                       activeAgent === "cmo" ? "Our ICP is early-stage B2B SaaS founders in India." :
                       "Based on current burn, you have ~8 months runway at this pace."}
                </div>
                <div className={`${styles.chatBubble} ${styles.human}`}>
                  👤 What should I prioritize first?
                </div>
              </div>
            </div>
          </div>

          {/* Collaboration hint */}
          <div className={styles.videoPills}>
            <span className={styles.pill}>🗣️ Live Debates</span>
            <span className={styles.pill}>📝 Decision Logs</span>
            <span className={styles.pill}>✅ Action Items</span>
          </div>
        </div>

        <div className={styles.videoSectionCta}>
          <button onClick={onLogin} className={styles.btnPrimary}>
            Start Your First Session <ArrowRight />
          </button>
        </div>
      </div>
    </section>
  );
};

// ─── Footer (Personalized with Team Info) ───────────────────────────────────────
const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        {/* Top row */}
        <div className={styles.footerTop}>
          {/* Brand column */}
          <div className={styles.footerBrand}>
            {/* Logo - Text Only */}
<a href="#" className={styles.logo}>
  <span className={styles.logoText}>CoGens</span>
</a>
            <p className={styles.footerTagline}>
              Democratizing entrepreneurship through agentic AI collaboration.
            </p>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialLink} aria-label="GitHub"><GitHubIcon /></a>
              <a href="#" className={styles.socialLink} aria-label="LinkedIn"><LinkedInIcon /></a>
              <a href="#" className={styles.socialLink} aria-label="X / Twitter"><XIcon /></a>
            </div>
          </div>

          {/* Nav columns */}
          <div className={styles.footerColumns}>
            
            <div className={styles.footerCol}>
              <h4 className={styles.footerColTitle}>Features</h4>
              <a href="#" className={styles.footerLink}>Agents Sessions</a>
              <a href="#" className={styles.footerLink}>Debates</a>
              <a href="#" className={styles.footerLink}>Decision Summary</a>
              <a href="#" className={styles.footerLink}>Strategy Execution</a>
              <a href="#" className={styles.footerLink}>Chat History</a>

            </div>
            <div className={styles.footerCol}>
              <h4 className={styles.footerColTitle}>Team</h4>
              <a href="#" className={styles.footerLink}>Nagendra</a>
              <a href="#" className={styles.footerLink}>Hemanth</a>
              <a href="#" className={styles.footerLink}>Meghana</a>
            </div>

            {/* Newsletter / Hackathon CTA */}
            <div className={styles.footerCol}>
              <h4 className={styles.footerColTitle}>HackAP 2026</h4>
              <p className={styles.footerNewsletterText}>Follow our journey in the Agentic AI track.</p>
              {submitted ? (
                <p className={styles.footerSuccess}>Thanks! We'll keep you posted. 🚀</p>
              ) : (
                <form className={styles.newsletterForm} onSubmit={handleSubmit}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className={styles.newsletterInput}
                    required
                  />
                  <button type="submit" className={styles.newsletterBtn}>
                    Notify Me
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className={styles.footerDivider} />

        {/* Bottom row */}
        <div className={styles.footerBottom}>
          <span className={styles.footerCopy}>
            GibberLink © 2026 • Built for HackAP Hackathon - Agentic AI • M.Tech CST, Andhra University
          </span>
          <div className={styles.footerBottomLinks}>
            <a href="#" className={styles.footerBottomLink}>Privacy</a>
            <a href="#" className={styles.footerBottomLink}>Terms</a>
            <a href="#" className={styles.footerBottomLink}>GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ─── Page (Wiring it all together) ──────────────────────────────────────────────
interface LandingProps {
  setActive: (page: string) => void;
}

const Landing: React.FC<LandingProps> = ({ setActive }) => {
  const handleLogin = () => setActive("dashboard");

  return (
    <div className={styles.page}>
      <Header onLogin={handleLogin} />
      <main>
        <HeroSection onLogin={handleLogin} />
        <AgentSection onLogin={handleLogin} />
        {/* Optional: Add a "How It Works" or "Impact" section here later */}
      </main>
      <Footer />
    </div>
  );
};

export default Landing;