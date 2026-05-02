import { Injectable } from '@nestjs/common';
import { mastra } from './mastra';

type Message = {
  agent: string;
  content: string;
};

type Round = {
  round: number;
  messages: Message[];
};

// =========================
// 🎲 Shuffle
// =========================
function shuffleArray<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

// =========================
// 🧠 Memory Compression
// =========================
function compressMemory(memory: string): string {
  const lines = memory.split('\n');
  return lines.slice(-10).join('\n');
}

// =========================
// 🔒 Clean Output
// =========================
function cleanAgentOutput(text: string, maxLength: number = 500): string {
  if (!text) return '';

  let cleaned = text
    .replace(/<thinking>[\s\S]*?<\/thinking>/gi, '')
    .replace(/<\|tool[\s\S]*?>/gi, '')
    .replace(/<\/\|tool[\s\S]*?>/gi, '')
    .replace(/```[\s\S]*?```/gi, '')
    .replace(/{[\s\S]*?}/g, '')
    .replace(/\[.*?\]/g, '')
    .replace(/function.*?\)/gi, '')
    .replace(/projectRiskAssessorTool/gi, '')
    .replace(/let me .*?\./gi, '')
    .replace(/i will .*?\./gi, '')
    .replace(/i'll .*?\./gi, '')
    .replace(/\n{2,}/g, '\n')
    .trim();

  if (cleaned.length > maxLength) cleaned = cleaned.slice(0, maxLength) + '...';
  if (!cleaned || cleaned.length < 5) return '';

  return cleaned;
}

// =========================
// 🧠 SYSTEM RULES
// =========================
const SYSTEM_RULES = `
CRITICAL:
- Only plain English
- No JSON, no code, no symbols
- Max 2 sentences
- Under 25 words
- Act like a human in a meeting
`;

// =========================
// 🌍 GLOBAL DEBATE RULES - STRICT
// =========================
const GLOBAL_DEBATE_RULES = `
CRITICAL ANTI-REPETITION:
- Do NOT use the same phrases as previous rounds
- Do NOT repeat your own points
- Cite NEW data, metrics, or evidence
- Reference the LAST speaker's argument directly
- Counter with original insight

DEBATE BEHAVIOR:
- Disagree boldly when you have evidence
- Challenge assumptions with data
- Propose alternatives, don't just criticize
- Make decisions feel urgent (3 rounds max)
`;

// =========================
// ⚙️ EXECUTION RULES
// =========================
const EXECUTION_RULES = `
CRITICAL OUTPUT RULES:
- Do NOT explain
- Do NOT say "Let me"
- No intro or outro
- Output ONLY final structured answer
`;

// =========================
// 🧠 Debate Memory Tracker
// =========================
function trackDebateMemory(memory: string, round: number): string {
  const roundMarker = `\n\n[ROUND ${round}]\n`;
  return memory + roundMarker;
}

// =========================
// 🧠 Prompt Builder - Debate Aware
// =========================
function buildPrompt(role: string, memory: string, round: number = 1) {
  const roundContext = round > 1 
    ? `\nYou are in ROUND ${round}. Previous arguments are above. Bring NEW evidence or counter-arguments.`
    : '';
  
  return `
${SYSTEM_RULES}
${GLOBAL_DEBATE_RULES}

${memory}${roundContext}

${role}
`;
}

@Injectable()
export class AppService {

  async runStartupSimulation(data: any) {
    return { status: 'initialized', data };
  }

  // =========================
  // 🔥 LIVE DEBATE - MAX 3 ROUNDS
  // =========================
  async handleLiveDebate(message: string, data: any) {
    const MAX_DEBATE_ROUNDS = 3;
    
    const cto = mastra.getAgentById('cto');
    const cfo = mastra.getAgentById('cfo');
    const cmo = mastra.getAgentById('cmo');
    const supervisor = mastra.getAgentById('supervisor');

    const context = `
Startup: ${data?.businessName || 'Unknown'}
Problem: ${data?.problemSolving || 'Not specified'}
Constraint: ${data?.constraint || 'None'}
User Question: ${message}
`;

    let memory = context;
    const rounds: Round[] = [];

    try {

      // =====================
      // 🚀 ROUND 1 - OPENING POSITIONS
      // =====================
      const [ctoRaw, cfoRaw, cmoRaw] = await Promise.all([
        cto.generate(buildPrompt(`You are CTO. Give tech stance with tradeoffs. Be specific.`, memory, 1)),
        cfo.generate(buildPrompt(`You are CFO. Challenge cost and ROI with numbers. Ask hard questions.`, memory, 1)),
        cmo.generate(buildPrompt(`You are CMO. Push growth with one specific tactic. Quantify the impact.`, memory, 1)),
      ]);

      const ctoText = cleanAgentOutput(ctoRaw.text, 600) ||
        "We need scalable architecture but must stay efficient.";

      const cfoText = cleanAgentOutput(cfoRaw.text, 600) ||
        "Costs must stay controlled until revenue is validated.";

      const cmoText = cleanAgentOutput(cmoRaw.text, 600) ||
        "We should focus on acquiring early users quickly.";

      const round1: Message[] = [
        { agent: 'CTO', content: ctoText },
        { agent: 'CFO', content: cfoText },
        { agent: 'CMO', content: cmoText },
      ];

      memory = trackDebateMemory(memory, 1);
      memory += `\nCTO: ${ctoText}`;
      memory += `\nCFO: ${cfoText}`;
      memory += `\nCMO: ${cmoText}`;

      memory = compressMemory(memory);
      rounds.push({ round: 1, messages: round1 });

      // =====================
      // 🔁 ROUND 2 - COUNTER ARGUMENTS (Only if < 3 rounds)
      // =====================
      let round2: Message[] = [];
      
      if (rounds.length < MAX_DEBATE_ROUNDS) {
        const agents = shuffleArray([
          { label: 'CTO', agent: cto, prompt: `Counter the CMO's growth plan. What technical risk are they missing?` },
          { label: 'CFO', agent: cfo, prompt: `Challenge the CTO's infrastructure cost. What's the actual ROI timeline?` },
          { label: 'CMO', agent: cmo, prompt: `Defend your growth plan. Address CFO's financial concerns with data.` },
        ]);

        for (const a of agents) {
          try {
            const raw = await a.agent.generate(
              buildPrompt(a.prompt, memory, 2)
            );

            const cleaned = cleanAgentOutput(raw.text, 600);
            const finalText = cleaned || `${a.label} maintains position.`;

            round2.push({ agent: a.label, content: finalText });
            memory = trackDebateMemory(memory, 2);
            memory += `\n${a.label}: ${finalText}`;

          } catch {
            round2.push({
              agent: a.label,
              content: `${a.label} failed to respond.`,
            });
          }
        }

        memory = compressMemory(memory);
        rounds.push({ round: 2, messages: round2 });
      }

      // =====================
      // 🧠 FINAL DECISION - STRATEGIC
      // =====================
      const finalRaw = await supervisor.generate(`
${SYSTEM_RULES}

${memory}

You are the CEO making a FINAL STRATEGIC CALL based on this debate.

Your decision must:
1. Balance CTO's tech concerns, CFO's financial risks, CMO's growth goals
2. Choose ONE primary strategy (tech-first OR growth-first OR balanced)
3. Set specific budget allocation
4. Define what NOT to do (constraints)

FORMAT:
- PRIMARY STRATEGY: [Tech-first | Growth-first | Balanced]
- What we WILL do: [Specific actions]
- What we will NOT do: [Specific constraints]
- Budget split: [%engineering, %marketing, %ops]

Max 4 sentences. Be decisive.
`);

      let finalDecision = cleanAgentOutput(finalRaw.text, 800);  // Allow longer supervisor decision

      if (
        !finalDecision ||
        /tool|function|risk/i.test(finalDecision)
      ) {
        finalDecision =
          "We will build a lean MVP first and validate demand. We will avoid aggressive scaling early. Budget split 60 percent development, 30 percent marketing, 10 percent reserve.";
      }

      rounds.push({
        round: 3,
        messages: [{ agent: 'Supervisor', content: finalDecision }],
      });

      // =====================
      // ⚙️ EXECUTION ENGINE
      // =====================
      const execution = await this.executeTaskPlan(data, finalDecision);

      return {
        rounds,
        execution,
      };

    } catch (err) {
      console.error(err);

      return {
        rounds: [
          {
            round: 1,
            messages: [
              {
                agent: 'System',
                content: 'Something went wrong. Try again.',
              },
            ],
          },
        ],
      };
    }
  }

  // =========================
  // ⚙️ EXECUTION ENGINE - STRATEGY-ALIGNED
  // =========================
  async executeTaskPlan(onboardingData: any, finalDecision: string) {
    // Extract strategy from CEO decision
    const isGrowthFirst = finalDecision.toLowerCase().includes('growth-first') || 
                          finalDecision.toLowerCase().includes('viral') ||
                          finalDecision.toLowerCase().includes('acquisition');
    
    const isTechFirst = finalDecision.toLowerCase().includes('tech-first') || 
                        finalDecision.toLowerCase().includes('infrastructure') ||
                        finalDecision.toLowerCase().includes('architecture');
    
    const strategy = isGrowthFirst ? 'GROWTH-FIRST' : isTechFirst ? 'TECH-FIRST' : 'BALANCED';

    const executionContext = `
STARTUP PROFILE:
${JSON.stringify(onboardingData, null, 2)}

CEO'S STRATEGIC DECISION:
${finalDecision}

EXECUTION STRATEGY: ${strategy}
CONSTRAINT: Implement this CEO decision exactly. Do NOT deviate. Follow budget splits and constraints.
`;

    const marketAgent = mastra.getAgentById('marketResearcher');
    const mvpAgent = mastra.getAgentById('mvpPlanner');
    const gtmAgent = mastra.getAgentById('gtmStrategist');

    const [market, mvp, gtm] = await Promise.all([

      marketAgent.generate(`
${EXECUTION_RULES}

${executionContext}

MARKET ANALYSIS (Align with ${strategy} strategy):
If GROWTH-FIRST: Identify high-TAM segments and viral entry points
If TECH-FIRST: Identify competitive gaps and differentiation opportunities  
If BALANCED: Identify sustainable segments with tech moats

FORMAT:
- Target Users:
- Competitors:
- Demand Validation:
`),

      mvpAgent.generate(`
${EXECUTION_RULES}

${executionContext}

MVP PLANNING (Align with ${strategy} strategy):
If GROWTH-FIRST: Minimize features, maximize virality hooks and referral mechanics
If TECH-FIRST: Build robust infrastructure, scalable architecture upfront
If BALANCED: Core features only, but with scalability in mind

FORMAT:
- MVP Features:
- Tech Stack:
- Timeline:
`),

      gtmAgent.generate(`
${EXECUTION_RULES}

${executionContext}

GTM STRATEGY (Align with ${strategy} strategy):
If GROWTH-FIRST: Aggressive paid + organic. Focus on CAC efficiency.
If TECH-FIRST: Product-led growth. Demo/free tier emphasis.
If BALANCED: Phased rollout. Beta then controlled launch.

FORMAT:
- Launch Plan:
- Channels:
- Growth Tactics:
`)
    ]);

    return {
      marketResearch: cleanAgentOutput(market.text, 1200),
      mvpPlan: cleanAgentOutput(mvp.text, 1200),
      gtmStrategy: cleanAgentOutput(gtm.text, 1200),
    };
  }
}