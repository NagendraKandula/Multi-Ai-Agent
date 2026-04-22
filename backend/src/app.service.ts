import { Injectable } from '@nestjs/common';
import { mastra } from './mastra';

@Injectable()
export class AppService {
  async runStartupSimulation(formData: any) {
    const supervisor = mastra.getAgentById('supervisor');
    
    // The prompt instructs the supervisor to use the specific agents selected by the user
    const prompt = `
      Simulation Request:
      Business: ${formData.businessName}
      Problem: ${formData.problemSolving}
      Constraint: ${formData.constraint}
      
      ONBOARD THE FOLLOWING AGENTS: ${formData.selectedAgents.join(', ')}.
      
      Instructions: 
      1. Consult only the agents listed above.
      2. Ask each for their domain-specific roadmap.
      3. Create a unified execution plan.
    `;

    const result = await supervisor.generate(prompt);
    return { plan: result.text };
  }
}