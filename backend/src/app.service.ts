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

// Utility: shuffle an array randomly
function shuffleArray<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

@Injectable()
export class AppService {
  async runStartupSimulation(data: any) {
    return { status: 'initialized', data };
  }

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
      // 🔁 ROUND 1 — Fixed order: CTO → CFO → CMO
      // =====================
      const round1Messages: Message[] = [];

      const ctoRes1 = await cto.generate(`
${memory}
You are in a tense startup board meeting. Round 1 — open your position.
- Speak like a real human (not formal)
- State your stance on the topic clearly
- Use numbers / tradeoffs where possible
- Max 2–3 short sentences
Do NOT say you lack context.
`);
      round1Messages.push({ agent: 'CTO', content: ctoRes1.text });
      memory += `\nCTO: ${ctoRes1.text}`;

      const cfoRes1 = await cfo.generate(`
${memory}
You are a skeptical CFO in a heated discussion. Round 1 — challenge the CTO.
- Directly challenge CTO's last statement
- Ask for numbers, ROI, risks
- Be slightly aggressive
- Use budget pressure (₹2L–₹5L constraint)
- Max 2–3 sharp sentences
No generic advice.
`);
      round1Messages.push({ agent: 'CFO', content: cfoRes1.text });
      memory += `\nCFO: ${cfoRes1.text}`;

      const cmoRes1 = await cmo.generate(`
${memory}
You are a bold CMO pushing for growth. Round 1 — react to both CTO and CFO.
- React to BOTH CTO and CFO's points
- Defend growth even if risky
- Suggest real tactics (campaigns, referrals, pricing)
- Be persuasive but practical
- Max 2–3 sentences
Avoid generic marketing talk.
`);
      round1Messages.push({ agent: 'CMO', content: cmoRes1.text });
      memory += `\nCMO: ${cmoRes1.text}`;
      memory += `\nKeep responses short, direct, and conversational. Avoid long explanations.`;

      rounds.push({ round: 1, messages: round1Messages });

      // =====================
      // 🔀 ROUND 2 — Random order: all 3 agents debate freely
      // =====================
      const round2Messages: Message[] = [];

      const agentOrder = shuffleArray([
        {
          label: 'CTO',
          agent: cto,
          prompt: (mem: string) => `
${mem}
You are in Round 2 of a heated board debate.
- Directly respond to the LAST thing said
- Push back hard or double down on your position
- Reference specific numbers or risks mentioned
- Max 2–3 sentences. Be blunt.
`,
        },
        {
          label: 'CFO',
          agent: cfo,
          prompt: (mem: string) => `
${mem}
You are in Round 2 of a heated board debate.
- Challenge whoever spoke last
- Keep pressing on budget, ROI, or risk
- Be aggressive but concise
- Max 2–3 sentences. No fluff.
`,
        },
        {
          label: 'CMO',
          agent: cmo,
          prompt: (mem: string) => `
${mem}
You are in Round 2 of a heated board debate.
- Respond to the latest points from the other executives
- Defend the growth angle with a specific tactic
- Be bold and persuasive
- Max 2–3 sentences. Avoid vague claims.
`,
        },
      ]);

      for (const { agent, label, prompt } of agentOrder) {
        const res = await agent.generate(prompt(memory));
        round2Messages.push({ agent: label, content: res.text });
        memory += `\n${label}: ${res.text}`;
      }

      memory += `\nKeep responses short, direct, and conversational. Avoid long explanations.`;
      rounds.push({ round: 2, messages: round2Messages });

      // =====================
      // 🧠 ROUND 3 — Supervisor final decision only
      // =====================
      const final = await supervisor.generate(`
${memory}
You are the CEO closing the meeting.
- Make a FINAL decision (not a summary)
- Mention:
  - What we will do
  - What we will NOT do
  - Budget allocation
- Sound decisive and realistic
- 4–5 sentences max
`);

      rounds.push({
        round: 3,
        messages: [
          {
            agent: 'Supervisor',
            content: final.text,
          },
        ],
      });

      return { rounds };
    } catch (err) {
      console.error(err);
      return {
        rounds: [
          {
            round: 1,
            messages: [
              {
                agent: 'Supervisor',
                content: 'Something went wrong. Please try again.',
              },
            ],
          },
        ],
      };
    }
  }
}