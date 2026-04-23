import { Injectable } from '@nestjs/common';
import { mastra } from './mastra';

@Injectable()
export class AppService {

  // =========================
  // STARTUP SIMULATION (FIXED)
  // =========================
  async runStartupSimulation(formData: any) {
    const supervisor = mastra.getAgentById('supervisor');

    const agents = formData?.selectedAgents ?? [];
    const agentsList = agents.length ? agents.join(', ') : 'CTO, CFO, CMO';

    const prompt = `
Startup: ${formData?.businessName || "Unknown"}
Problem: ${formData?.problemSolving || "Not specified"}
Constraint: ${formData?.constraint || "None"}
Agents: ${agentsList}

Give a structured startup roadmap with:
- Problem analysis
- Strategy
- Execution plan
- Risks
- Timeline
`;

    const result = await supervisor.generate(prompt);

    return { plan: result.text };
  }

  // =========================
  // LIVE DEBATE ENGINE (FIXED)
  // =========================
  async handleLiveDebate(message: string, onboardingData: any) {
  const supervisor = mastra.getAgentById('supervisor');

  const agents = onboardingData?.selectedAgents ?? ["CTO", "CFO", "CMO"];
  const agentsList = agents.join(', ');

  const prompt = `
You are a REAL-TIME BOARDROOM SIMULATION ENGINE.

STRICT REQUIREMENTS:
- Output EXACTLY 3 rounds
- Each round MUST include ALL agents
- Round 1 = ideas
- Round 2 = conflict / disagreement
- Round 3 = final decision (Supervisor only)
- NO repetition
- NO summaries
- MUST escalate tension each round

STYLE RULES:
- CTO = technical + bold
- CFO = skeptical + cost focused
- CMO = growth + persuasion

CONTEXT:
Startup: ${onboardingData?.businessName || "Unknown"}
Problem: ${onboardingData?.problemSolving || "Not specified"}
Constraint: ${onboardingData?.constraint || "None"}
User Message: ${message}

Agents: ${agentsList}

OUTPUT ONLY VALID JSON:

{
  "rounds": [
    {
      "round": 1,
      "messages": [
        {"agent": "CTO", "content": "...initial strategy..."},
        {"agent": "CFO", "content": "...cost concern..."},
        {"agent": "CMO", "content": "...growth idea..."}
      ]
    },
    {
      "round": 2,
      "messages": [
        {"agent": "CTO", "content": "...counter argument..."},
        {"agent": "CFO", "content": "...risk escalation..."},
        {"agent": "CMO", "content": "...market pushback..."}
      ]
    },
    {
      "round": 3,
      "messages": [
        {"agent": "Supervisor", "content": "final decision with reasoning"}
      ]
    }
  ]
}
`;

  const result = await supervisor.generate(prompt);

  const clean = result.text
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();

  try {
    return JSON.parse(clean);
  } catch (e) {
    return {
      rounds: [
        {
          round: 1,
          messages: [
            { agent: "Supervisor", content: result.text }
          ]
        }
      ]
    };
  }
}
}