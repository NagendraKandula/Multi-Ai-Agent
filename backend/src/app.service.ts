import { Injectable } from '@nestjs/common';
import { mastra } from './mastra';

@Injectable()
export class AppService {

  // ✅ Initial roadmap
  async runStartupSimulation(formData: any) {
    const supervisor = mastra.getAgentById('supervisor');

    const agentsList = (formData?.selectedAgents || []).join(', ');

    const prompt = `
      Startup: ${formData?.businessName || "Unknown"}
      Problem: ${formData?.problemSolving || "Not specified"}
      Constraint: ${formData?.constraint || "None"}
      Agents: ${agentsList || "CTO, CFO, CMO"}

      Provide a clear startup roadmap.
    `;

    const result = await supervisor.generate(prompt);

    return { plan: result.text };
  }

  // ✅ Live debate
  // backend/src/app.service.ts

  async handleLiveDebate(message: string, onboardingData: any) {
    const supervisor = mastra.getAgentById('supervisor');
    const agentsList = (onboardingData?.selectedAgents || []).join(', ');

    const prompt = `
ROLE: Boardroom Moderator (Supervisor)

CONTEXT:
Startup: "${onboardingData?.businessName}"
Problem: "${onboardingData?.problemSolving}"
Constraint: "${onboardingData?.constraint}"
Agenda: "${message}"

PARTICIPATING AGENTS (IN THIS EXACT ORDER):
${onboardingData?.selectedAgents.join(', ')}

STRICT RULES:
- Each agent must speak EXACTLY ONCE
- Follow the order EXACTLY as listed
- Do NOT repeat any agent
- Do NOT add extra agents
- Each response must be SHORT and UNIQUE
- Each agent MUST speak from their domain expertise:
  - CTO → technology & scalability
  - CFO → costs & financial risk
  - CMO → market & growth
  - COO → operations & execution
  - CSO → strategy & risk
  - Legal → compliance

DEBATE FLOW:
1. First agent → proposes a strategy
2. Second agent → critiques the first agent using the constraint
3. Third agent → adds a different perspective
4. Supervisor → final decision (ONLY once, at the end)

FORMAT:
Return ONLY a valid JSON array:
[
  {"agent": "CTO", "content": "..."},
  {"agent": "CFO", "content": "..."},
  {"agent": "CSO", "content": "..."},
  {"agent": "Supervisor", "content": "..."}
]
`;

    const result = await supervisor.generate(prompt);
    // Clean markdown before parsing
    const cleanJson = result.text.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
      return { responses: JSON.parse(cleanJson) };
    } catch (e) {
      return { responses: [{ agent: 'Supervisor', content: result.text }] };
    }
  }
}