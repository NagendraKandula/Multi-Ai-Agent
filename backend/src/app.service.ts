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

@Injectable()
export class AppService {

  async runStartupSimulation(data: any) {
    return { status: "initialized", data };
  }

  async handleLiveDebate(message: string, data: any) {

  const cto = mastra.getAgentById('cto');
  const cfo = mastra.getAgentById('cfo');
  const cmo = mastra.getAgentById('cmo');
  const supervisor = mastra.getAgentById('supervisor');

  const context = `
Startup: ${data?.businessName || "Unknown"}
Problem: ${data?.problemSolving || "Not specified"}
Constraint: ${data?.constraint || "None"}
User Question: ${message}
`;

  const rounds: Round[] = [];
  let memory = context;

  try {
    // 🔁 REAL DEBATE LOOP
    for (let i = 1; i <= 3; i++) {

      const roundMessages: Message[] = [];

      // =====================
      // CTO
      // =====================
      const ctoRes = await cto.generate(`
${memory}

You are in a tense startup board meeting.

- Speak like a real human (not formal)
- Refer to EXACT previous statements (mention CFO/CMO points)
- Disagree when needed
- Use numbers / tradeoffs
- Max 2–3 short sentences

Do NOT say you lack context.
`);

      roundMessages.push({ agent: "CTO", content: ctoRes.text });
      memory += `\nCTO: ${ctoRes.text}`;

      // =====================
      // CFO
      // =====================
      const cfoRes = await cfo.generate(`
${memory}

You are a skeptical CFO in a heated discussion.

- Directly challenge CTO’s last statement
- Ask for numbers, ROI, risks
- Be slightly aggressive
- Use budget pressure (₹2L–₹5L constraint)
- Max 2–3 sharp sentences

No generic advice.
`);

      roundMessages.push({ agent: "CFO", content: cfoRes.text });
      memory += `\nCFO: ${cfoRes.text}`;

      // =====================
      // CMO
      // =====================
      const cmoRes = await cmo.generate(`
${memory}

You are a bold CMO pushing for growth.

- React to BOTH CTO and CFO
- Defend growth even if risky
- Suggest real tactics (campaigns, referrals, pricing)
- Be persuasive but practical
- Max 2–3 sentences

Avoid generic marketing talk.
`);

      roundMessages.push({ agent: "CMO", content: cmoRes.text });
      memory += `\nCMO: ${cmoRes.text}`;

      // 🚫 Prevent repetition explicitly
      memory += `\nKeep responses short, direct, and conversational. Avoid long explanations.`;

      rounds.push({
        round: i,
        messages: roundMessages,
      });
    }

    // =====================
    // 🧠 FINAL DECISION
    // =====================
    const final = await supervisor.generate(`
${memory}

You are the CEO closing the meeting.

- Make a FINAL decision (not summary)
- Mention:
  - What we will do
  - What we will NOT do
  - Budget allocation
- Sound decisive and realistic
- 4–5 sentences max
`);

    rounds.push({
      round: 4,
      messages: [
        {
          agent: "Supervisor",
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
              agent: "Supervisor",
              content: "Something went wrong. Please try again.",
            },
          ],
        },
      ],
    };
  }
}
}