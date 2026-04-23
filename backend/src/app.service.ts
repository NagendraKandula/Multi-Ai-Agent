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
    ROLE: 
    You are the Boardroom Moderator (Supervisor). 

    CONTEXT:
    Startup: ${onboardingData?.businessName}
    Focus: ${onboardingData?.problemSolving}
    Constraint: ${onboardingData?.constraint}

    USER INPUT:
    "${message}"

    DEBATE INSTRUCTIONS:
    1. Identify the 2-3 most relevant agents for this specific question from: ${agentsList}.
    2. Orchestrate a "Real Debate":
       - First Agent: Proposes a solution.
       - Second Agent: Critiques the first solution or adds a different perspective (e.g., CFO critiques CTO's cost).
       - Third Agent: Adds legal or operational context.
    3. Final Summary: You (Supervisor) synthesize the debate into a final decision.

    FORMAT:
    Return a JSON array where the conversation flows naturally.
    [
      { "agent": "CTO", "content": "I suggest building X..." },
      { "agent": "CFO", "content": "Wait, CTO, building X will exceed our ${onboardingData?.constraint}..." },
      { "agent": "Supervisor", "content": "CFO makes a valid point. We will pivot to Y..." }
    ]

    STRICT: NO Markdown. ONLY valid JSON.
  `;

  const result = await supervisor.generate(prompt);
  const cleanJson = result.text.replace(/```json/g, '').replace(/```/g, '').trim();

  try {
    const parsed = JSON.parse(cleanJson);
    return { responses: parsed };
  } catch (err) {
    // Fallback if JSON fails
    return { responses: [{ agent: 'Supervisor', content: result.text }] };
  }
}
}