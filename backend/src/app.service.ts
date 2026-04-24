import { Injectable } from '@nestjs/common';
import { mastra } from './mastra';

@Injectable()
export class AppService {

  // ✅ Startup roadmap
  async runStartupSimulation(formData: any) {
    const supervisor = mastra.getAgentById('supervisor');

    const agentsList = Array.isArray(formData?.selectedAgents)
      ? formData.selectedAgents.join(', ')
      : 'CTO, CFO, CMO';

    const prompt = `
Startup: ${formData?.businessName || "Unknown"}
Problem: ${formData?.problemSolving || "Not specified"}
Constraint: ${formData?.constraint || "None"}
Agents: ${agentsList}

Provide a clear startup roadmap.
`;

    const result = await supervisor.generate(prompt);

    return { plan: result.text };
  }

  // ✅ Live debate
  async handleLiveDebate(message: string, onboardingData: any) {
    const supervisor = mastra.getAgentById('supervisor');

    const agentsList = Array.isArray(onboardingData?.selectedAgents)
      ? onboardingData.selectedAgents.join(', ')
      : 'CTO, CFO, CMO';

    const prompt = `
ROLE: Boardroom Moderator (Supervisor)

CONTEXT:
Startup: "${onboardingData?.businessName || 'Unknown'}"
Problem: "${onboardingData?.problemSolving || 'Not specified'}"
Constraint: "${onboardingData?.constraint || 'None'}"
Agenda: "${message}"

PARTICIPATING AGENTS (IN THIS EXACT ORDER):
${agentsList}

STRICT RULES:
- Each agent must speak EXACTLY ONCE
- Follow the order EXACTLY as listed
- Do NOT repeat any agent
- Do NOT add extra agents
- Each response must be SHORT and UNIQUE

DEBATE FLOW:
1. First agent → proposes a strategy
2. Second agent → critiques
3. Third agent → adds perspective
4. Supervisor → final decision

FORMAT:
Return ONLY valid JSON:
[
  {"agent": "CTO", "content": "..."},
  {"agent": "CFO", "content": "..."},
  {"agent": "Supervisor", "content": "..."}
]
`;

    const result = await supervisor.generate(prompt);

    // ✅ Clean markdown
    const cleanJson = result.text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    try {
      return { responses: JSON.parse(cleanJson) };
    } catch (e) {
      return {
        responses: [
          { agent: 'Supervisor', content: result.text }
        ]
      };
    }
  }
}