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
  return lines.slice(-10).join('\n'); // keep last 10 lines
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
    .replace(/\n{2,}/g, '\n')
    .trim();

  // limit length
  if (cleaned.length > 200) {
    cleaned = cleaned.slice(0, 200);
  }

  if (!cleaned || cleaned.length < 5) return '';

  return cleaned;
}

// =========================
// 🧠 System Rules
// =========================
const SYSTEM_RULES = `
CRITICAL:
- Only plain English sentences
- No JSON, no code, no formatting
- No symbols like { } < > or backticks
- Max 2 sentences
- Under 25 words
- Act like a human in a meeting
`;

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
      // 🚀 ROUND 1 (PARALLEL)
      // =====================
      const [ctoRaw, cfoRaw, cmoRaw] = await Promise.all([
        cto.generate(`${SYSTEM_RULES}\n${memory}\nYou are CTO. Give tech stance with tradeoffs.`),
        cfo.generate(`${SYSTEM_RULES}\n${memory}\nYou are CFO. Challenge cost and ROI.`),
        cmo.generate(`${SYSTEM_RULES}\n${memory}\nYou are CMO. Push growth and suggest one tactic.`),
      ]);

      const ctoText = cleanAgentOutput(ctoRaw.text) ||
        "We need scalable architecture but must stay efficient initially.";

      const cfoText = cleanAgentOutput(cfoRaw.text) ||
        "Costs must stay controlled until we validate revenue.";

      const cmoText = cleanAgentOutput(cmoRaw.text) ||
        "We should focus on acquiring early users through targeted campaigns.";

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
      // 🔁 ROUND 2 (DYNAMIC)
      // =====================
      const round2: Message[] = [];

      const agents = shuffleArray([
        {
          label: 'CTO',
          agent: cto,
          prompt: `Respond to last speaker. Defend or counter with practical reasoning.`,
        },
        {
          label: 'CFO',
          agent: cfo,
          prompt: `Push risks and cost concerns. Question assumptions.`,
        },
        {
          label: 'CMO',
          agent: cmo,
          prompt: `Defend growth strategy. Add one actionable idea.`,
        },
      ]);

      for (const a of agents) {
        try {
          const raw = await a.agent.generate(
            `${SYSTEM_RULES}\n${memory}\n${a.prompt}`
          );

          const cleaned = cleanAgentOutput(raw.text);

          const finalText =
            cleaned ||
            `${a.label} maintains their stance but response was unclear.`;

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
${memory}
You are CEO.

Make final decision:
- What we WILL do
- What we will NOT do
- Budget split
Max 4 sentences.
`);

      const finalDecision =
        cleanAgentOutput(finalRaw.text) ||
        "We will build a lean MVP and validate demand first. We will avoid heavy spending early. Budget: 60% dev, 30% marketing, 10% reserve.";

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
      marketAgent.generate(`${SYSTEM_RULES}\n${prompt}\nTarget users, competitors, demand.`),
      mvpAgent.generate(`${SYSTEM_RULES}\n${prompt}\nMVP features, tech stack, timeline.`),
      gtmAgent.generate(`${SYSTEM_RULES}\n${prompt}\nLaunch plan, channels, growth.`),
    ]);

    return {
      marketResearch: cleanAgentOutput(market.text),
      mvpPlan: cleanAgentOutput(mvp.text),
      gtmStrategy: cleanAgentOutput(gtm.text),
    };
  }
}