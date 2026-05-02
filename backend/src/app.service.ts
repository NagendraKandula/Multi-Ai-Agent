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
// 🔒 SAFETY UTILITIES
// =========================
function cleanText(output: string): string {
  if (!output) return '';

  return output
    .replace(/```[\s\S]*?```/g, '')
    .replace(/{[\s\S]*?}/g, '')
    .replace(/<[^>]*>/g, '')
    .replace(/\n{2,}/g, '\n')
    .trim();
}

function isValid(output: string): boolean {
  return !!output && !/[{}<>`]/.test(output);
}

function safeExtract(res: any): string {
  const raw = res?.text || res || '';
  const cleaned = cleanText(raw);

  if (!isValid(cleaned)) {
    return 'Response unavailable due to formatting issue.';
  }

  return cleaned;
}

// =========================
// 🎲 Utility: shuffle
// =========================
function shuffleArray<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

// =========================
// 🧠 GLOBAL RULES
// =========================
const SYSTEM_RULES = `
STRICT RULES:
- Plain text only
- No JSON, markdown, bullets
- No code blocks or tags
- Max 2 sentences
- Under 25 words
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
        cfo.generate(`${SYSTEM_RULES}\n${memory}\nYou are CFO. Challenge with cost and ROI.`),
        cmo.generate(`${SYSTEM_RULES}\n${memory}\nYou are CMO. Push growth and suggest one tactic.`),
      ]);

      const ctoRes = safeExtract(ctoRaw);
      const cfoRes = safeExtract(cfoRaw);
      const cmoRes = safeExtract(cmoRaw);

      const round1: Message[] = [
        { agent: 'CTO', content: ctoRes },
        { agent: 'CFO', content: cfoRes },
        { agent: 'CMO', content: cmoRes },
      ];

      memory += `\nCTO says: ${ctoRes}`;
      memory += `\nCFO says: ${cfoRes}`;
      memory += `\nCMO says: ${cmoRes}`;

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

          const clean = safeExtract(raw);

          round2.push({ agent: a.label, content: clean });
          memory += `\n${a.label} says: ${clean}`;

        } catch {
          round2.push({
            agent: a.label,
            content: 'Agent failed to respond.',
          });
        }
      }

      rounds.push({ round: 2, messages: round2 });

      // =====================
      // 🧠 FINAL DECISION
      // =====================
      const finalRaw = await supervisor.generate(`
${SYSTEM_RULES}
${memory}
You are CEO.
Make final decision with budget split and clear priorities.
Max 4 sentences.
`);

      const finalDecision = safeExtract(finalRaw);

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

    const [marketRaw, mvpRaw, gtmRaw] = await Promise.all([
      marketAgent.generate(`${SYSTEM_RULES}\n${prompt}\nTarget users and demand validation.`),
      mvpAgent.generate(`${SYSTEM_RULES}\n${prompt}\nMVP features, tech stack, and timeline.`),
      gtmAgent.generate(`${SYSTEM_RULES}\n${prompt}\nLaunch plan, channels, and growth hacks.`),
    ]);

    return {
      marketResearch: safeExtract(marketRaw),
      mvpPlan: safeExtract(mvpRaw),
      gtmStrategy: safeExtract(gtmRaw),
    };
  }
}