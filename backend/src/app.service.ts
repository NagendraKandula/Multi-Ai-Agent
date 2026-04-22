import { Injectable } from '@nestjs/common';
import { mastra } from './mastra';

@Injectable()
export class AppService {
  // Method for initial Step 4 roadmap
  async runStartupSimulation(formData: any) {
    const supervisor = mastra.getAgentById('supervisor');
    const prompt = `
      Initial Simulation for: ${formData.businessName}
      Problem: ${formData.problemSolving}
      Constraint: ${formData.constraint}
      Onboard: ${formData.selectedAgents.join(', ')}
      Provide a comprehensive initial roadmap.
    `;
    const result = await supervisor.generate(prompt);
    return { plan: result.text };
  }

  // Method for Live Session debate
  async handleLiveDebate(message: string, onboardingData: any) {
    const supervisor = mastra.getAgentById('supervisor');
    
    const prompt = `
      CONTEXT:
      Business: ${onboardingData.businessName}
      Constraint: ${onboardingData.constraint}
      Problem: ${onboardingData.problemSolving}
      
      USER INPUT: "${message}"
      
      INSTRUCTIONS:
      1. Initiate a debate between: ${onboardingData.selectedAgents.join(', ')}.
      2. Each agent provides a critique or suggestion.
      3. Supervisor provides final summary.
      
      RETURN ONLY A JSON ARRAY:
      [{"agent": "CTO", "content": "..."}, {"agent": "supervisor", "content": "..."}]
    `;

    const result = await supervisor.generate(prompt);

    // Clean markdown formatting if present
    const cleanJson = result.text.replace(/```json|```/g, '').trim();
    
    try {
      return { responses: JSON.parse(cleanJson) };
    } catch (e) {
      // Fallback if AI fails to return valid JSON array
      return { 
        responses: [{ agent: 'Supervisor', content: result.text }] 
      };
    }
  }
}