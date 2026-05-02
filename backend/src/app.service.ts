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
function cleanAgentOutput(text: string): string {
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

  if (cleaned.length > 200) cleaned = cleaned.slice(0, 200);
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
// 🌍 GLOBAL DEBATE RULES
// =========================
const GLOBAL_DEBATE_RULES = `
- Do NOT repeat previous statements
- Add new insights only
- Disagree when necessary
- Do NOT agree just to be polite
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
// 🧠 Prompt Builder
// =========================
function buildPrompt(role: string, memory: string) {
  return `
${SYSTEM_RULES}
${GLOBAL_DEBATE_RULES}

${memory}

${role}
`;
}

@Injectable()
export class AppService {

  async runStartupSimulation(data: any) {
    return { status: 'initialized', data };
  }

  // =========================
  // 🔥 LIVE DEBATE
  // =========================
  async handleLiveDebate(message: string, data: any) {

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
      // 🚀 ROUND 1
      // =====================
      const [ctoRaw, cfoRaw, cmoRaw] = await Promise.all([
        cto.generate(buildPrompt(`You are CTO. Give tech stance with tradeoffs.`, memory)),
        cfo.generate(buildPrompt(`You are CFO. Challenge cost and ROI.`, memory)),
        cmo.generate(buildPrompt(`You are CMO. Push growth and suggest one tactic.`, memory)),
      ]);

      const ctoText = cleanAgentOutput(ctoRaw.text) ||
        "We need scalable architecture but must stay efficient.";

      const cfoText = cleanAgentOutput(cfoRaw.text) ||
        "Costs must stay controlled until revenue is validated.";

      const cmoText = cleanAgentOutput(cmoRaw.text) ||
        "We should focus on acquiring early users quickly.";

      const round1: Message[] = [
        { agent: 'CTO', content: ctoText },
        { agent: 'CFO', content: cfoText },
        { agent: 'CMO', content: cmoText },
      ];

      memory += `\nCTO: ${ctoText}`;
      memory += `\nCFO: ${cfoText}`;
      memory += `\nCMO: ${cmoText}`;

      memory = compressMemory(memory);
      rounds.push({ round: 1, messages: round1 });

      // =====================
      // 🔁 ROUND 2
      // =====================
      const round2: Message[] = [];

      const agents = shuffleArray([
        { label: 'CTO', agent: cto, prompt: `Respond to last speaker. Defend or counter.` },
        { label: 'CFO', agent: cfo, prompt: `Push risks and cost concerns.` },
        { label: 'CMO', agent: cmo, prompt: `Defend growth and add one tactic.` },
      ]);

      for (const a of agents) {
        try {
          const raw = await a.agent.generate(
            buildPrompt(a.prompt, memory)
          );

          const cleaned = cleanAgentOutput(raw.text);
          const finalText = cleaned || `${a.label} maintains position.`;

          round2.push({ agent: a.label, content: finalText });
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

      // =====================
      // 🧠 FINAL DECISION
      // =====================
      const finalRaw = await supervisor.generate(`
${SYSTEM_RULES}
${GLOBAL_DEBATE_RULES}

${memory}

You are CEO.

FORMAT:
- What we WILL do:
- What we will NOT do:
- Budget split:

Max 3 sentences. Complete sentences.
`);

      let finalDecision = cleanAgentOutput(finalRaw.text);

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
  // ⚙️ EXECUTION ENGINE
  // =========================
  async executeTaskPlan(onboardingData: any, finalDecision: string) {

    const prompt = `
Startup Profile:
${JSON.stringify(onboardingData, null, 2)}

Final Decision:
${finalDecision}
`;

    const marketAgent = mastra.getAgentById('marketResearcher');
    const mvpAgent = mastra.getAgentById('mvpPlanner');
    const gtmAgent = mastra.getAgentById('gtmStrategist');

    const [market, mvp, gtm] = await Promise.all([

      marketAgent.generate(`
${EXECUTION_RULES}

${prompt}

FORMAT:
- Target Users:
- Competitors:
- Demand Validation:
`),

      mvpAgent.generate(`
${EXECUTION_RULES}

${prompt}

FORMAT:
- MVP Features:
- Tech Stack:
- Timeline:
`),

      gtmAgent.generate(`
${EXECUTION_RULES}

${prompt}

FORMAT:
- Launch Plan:
- Channels:
- Growth Tactics:
`)
    ]);

    return {
      marketResearch: cleanAgentOutput(market.text),
      mvpPlan: cleanAgentOutput(mvp.text),
      gtmStrategy: cleanAgentOutput(gtm.text),
    };
  }
}