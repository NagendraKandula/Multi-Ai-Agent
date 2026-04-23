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
  async handleLiveDebate(message: string, onboardingData: any) {
    const supervisor = mastra.getAgentById('supervisor');

    const agentsList = (onboardingData?.selectedAgents || []).join(', ');

    const prompt = `
CONTEXT:
Business: ${onboardingData?.businessName || "Unknown"}
Constraint: ${onboardingData?.constraint || "None"}
Problem: ${onboardingData?.problemSolving || "Not specified"}

USER MESSAGE:
"${message}"

TASK:
Simulate a board discussion between: ${agentsList || "CTO, CFO, CMO"}.

RULES:
- Each agent gives 1 short response
- Supervisor gives final summary
- Keep responses concise

STRICT OUTPUT:
Return ONLY valid JSON array.
NO markdown. NO explanation.

FORMAT:
[
  { "agent": "CTO", "content": "..." },
  { "agent": "CFO", "content": "..." },
  { "agent": "CMO", "content": "..." },
  { "agent": "Supervisor", "content": "..." }
]
`;

    const result = await supervisor.generate(prompt);

    console.log("RAW LLM OUTPUT:", result.text);

    // ✅ Clean response
    const cleanJson = result.text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    try {
      const parsed = JSON.parse(cleanJson);

      if (Array.isArray(parsed)) {
        return { responses: parsed };
      }

      throw new Error("Not an array");
    } catch (err) {
      console.error("JSON PARSE FAILED:", cleanJson);

      return {
        responses: [
          {
            agent: 'Supervisor',
            content: result.text,
          },
        ],
      };
    }
  }
}