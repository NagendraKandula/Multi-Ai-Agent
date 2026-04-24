import { Injectable } from '@nestjs/common';
import { ctoAgent } from './mastra/agents/cto';
import { cmoAgent } from './mastra/agents/cmo';
import { cfoAgent } from './mastra/agents/cfo';
import { supervisorAgent } from './mastra/agents/supervisor';

type Message = {
  agent: string;
  content: string;
};

type Round = {
  round: number;
  messages: Message[];
};

@Injectable()
export class AppService {

  async runStartupSimulation(body: any) {
    const input = body?.message || "Startup idea";

    let memory = `
Startup Idea:
${input}

You are in a live boardroom debate.
CTO, CMO, CFO are discussing aggressively and reacting to each other.
Keep responses short and conversational.
`;

    const rounds: Round[] = [];

    // 🔁 MULTI-ROUND DEBATE ENGINE (THIS FIXES YOUR ISSUE)
    for (let i = 1; i <= 3; i++) {

      const roundMessages: Message[] = [];

      // ================= CTO =================
      const cto = await ctoAgent.generate(`
${memory}

You are CTO.
React to previous discussion.
Focus on technical feasibility and MVP.
Be direct and slightly defensive.
`);

      roundMessages.push({ agent: "CTO", content: cto.text });

      memory += `\nCTO: ${cto.text}`;

      // ================= CMO =================
      const cmo = await cmoAgent.generate(`
${memory}

You are CMO.
React to CTO and previous debate.
Focus on growth and user acquisition.
Challenge slow technical thinking.
`);

      roundMessages.push({ agent: "CMO", content: cmo.text });

      memory += `\nCMO: ${cmo.text}`;

      // ================= CFO =================
      const cfo = await cfoAgent.generate(`
${memory}

You are CFO.
React to CTO and CMO.
Focus on cost, ROI, and risk.
Challenge unrealistic ideas.
`);

      roundMessages.push({ agent: "CFO", content: cfo.text });

      memory += `\nCFO: ${cfo.text}`;

      // add round summary
      rounds.push({
        round: i,
        messages: roundMessages,
      });
    }

    // ================= FINAL CEO DECISION =================
    const final = await supervisorAgent.generate(`
${memory}

You are CEO.
Now close the meeting with final decision.
Be decisive, practical, and short.
`);

    rounds.push({
      round: 4,
      messages: [
        {
          agent: "CEO",
          content: final.text,
        },
      ],
    });

    return { rounds };
  }

  async handleLiveDebate(body: any) {
    return this.runStartupSimulation(body);
  }
}