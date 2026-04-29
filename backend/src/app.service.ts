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

// Utility: shuffle array
function shuffleArray<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

@Injectable()
export class AppService {

  // =========================
  // INIT SIMULATION
  // =========================
  async runStartupSimulation(data: any) {
    return { status: 'initialized', data };
  }

  // =========================
  // LIVE DEBATE (MAIN FEATURE)
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
      // ROUND 1 (STRUCTURED)
      // =====================
      const round1: Message[] = [];

      const ctoRes = await cto.generate(`
${memory}
You are CTO in a real startup meeting.
- Give your stance clearly
- Mention tradeoffs / tech decisions
- 2 short sentences max
`);
      round1.push({ agent: 'CTO', content: ctoRes.text });
      memory += `\nCTO: ${ctoRes.text}`;

      const cfoRes = await cfo.generate(`
${memory}
You are CFO.
- Challenge CTO with cost / ROI concerns
- Be sharp and slightly aggressive
- 2 sentences max
`);
      round1.push({ agent: 'CFO', content: cfoRes.text });
      memory += `\nCFO: ${cfoRes.text}`;

      const cmoRes = await cmo.generate(`
${memory}
You are CMO.
- React to BOTH CTO & CFO
- Push growth strategy
- Suggest 1 real tactic
- 2 sentences max
`);
      round1.push({ agent: 'CMO', content: cmoRes.text });
      memory += `\nCMO: ${cmoRes.text}`;

      rounds.push({ round: 1, messages: round1 });

      // =====================
      // ROUND 2 (DYNAMIC)
      // =====================
      const round2: Message[] = [];

      const agents = shuffleArray([
        {
          label: 'CTO',
          agent: cto,
          prompt: (m: string) => `
${m}
Respond to last speaker.
- Defend or counter strongly
- Be practical
- 2 sentences max
`,
        },
        {
          label: 'CFO',
          agent: cfo,
          prompt: (m: string) => `
${m}
Push on risks / costs again.
- Question assumptions
- Be direct
- 2 sentences max
`,
        },
        {
          label: 'CMO',
          agent: cmo,
          prompt: (m: string) => `
${m}
Defend growth.
- Add one actionable idea
- Be persuasive
- 2 sentences max
`,
        },
      ]);

      for (const a of agents) {
        const res = await a.agent.generate(a.prompt(memory));
        round2.push({ agent: a.label, content: res.text });
        memory += `\n${a.label}: ${res.text}`;
      }

      rounds.push({ round: 2, messages: round2 });

      // =====================
      // ROUND 3 (FINAL DECISION)
      // =====================
      const final = await supervisor.generate(`
${memory}
You are CEO.

Make FINAL decision:
- What we WILL do
- What we will NOT do
- Budget split
- Keep it practical

Max 4 sentences.
`);

      const finalDecision = final.text;

      rounds.push({
        round: 3,
        messages: [{ agent: 'Supervisor', content: finalDecision }],
      });

      // =========================
      // AUTO EXECUTION (NEW 🔥)
      // =========================
      const execution = await this.executeTaskPlan(data, finalDecision);

      return {
        rounds,
        execution, // ✅ added
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
  // EXECUTION ENGINE (AGENTS)
  // =========================
  async executeTaskPlan(onboardingData: any, finalDecision: string) {

    const prompt = `
Startup Profile:
${JSON.stringify(onboardingData, null, 2)}

Final Decision:
${finalDecision}

Generate execution plan.
`;

    const marketAgent = mastra.getAgentById('marketResearcher');
    const mvpAgent = mastra.getAgentById('mvpPlanner');
    const gtmAgent = mastra.getAgentById('gtmStrategist');

    const [market, mvp, gtm] = await Promise.all([
      marketAgent.generate(`
${prompt}
Give:
- Target users
- Competitor insight
- Demand validation
Short bullets only.
`),

      mvpAgent.generate(`
${prompt}
Give:
- MVP features
- Tech stack
- Timeline
Keep it practical.
`),

      gtmAgent.generate(`
${prompt}
Give:
- Launch plan
- Channels
- Growth hacks
Keep it actionable.
`),
    ]);

    return {
      marketResearch: market.text,
      mvpPlan: mvp.text,
      gtmStrategy: gtm.text,
    };
  }
}