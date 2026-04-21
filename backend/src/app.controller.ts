import { Controller, Post, Body } from '@nestjs/common';
import { OnboardSimulationDto } from './simulation/dto/onboard-simulation.dto';
import { mastra } from './mastra';

@Controller('simulation')
export class AppController {
  
  @Post('start')
  async startSimulation(@Body() dto: OnboardSimulationDto) {
     const threadId = `thread-${dto.businessName}-${Date.now()}`;
    
   const context = `
Startup Overview:
- Business Name: ${dto.businessName}
- Location: ${dto.location}
- Budget: ${dto.budgetRange}
- Target Market: ${dto.targetMarket}
- Business Type: ${dto.businessType}

Problem:
${dto.problemSolving}

Current Solution:
${dto.currentSolution}

Better Solution:
${dto.betterSolution}

Stage: ${dto.stage}
Help Needed: ${dto.helpNeeded}

Market:
- Ideal Customer: ${dto.idealCustomer}
- Market Scope: ${dto.marketScope}
- Competitors: ${dto.competitors}

Business Model:
- Revenue Model: ${dto.revenueModel}
- Growth Goal: ${dto.growthGoal}
- ROI Timeline: ${dto.roiTimeline}

Strategy Preferences:
- Speed: ${dto.speedToLaunch}
- Quality: ${dto.productQuality}
- Cost: ${dto.costEfficiency}

Constraints: ${dto.constraint}
Risk Appetite: ${dto.riskAppetite}
Founder Experience: ${dto.founderExperience}
Success Metric: ${dto.successMetric}

Selected Agents: ${dto.selectedAgents.join(", ")}
`;
    const result = await mastra.getAgent('supervisorAgent').generate({
    threadId,
    messages: [
      {
        role: "user",
        content: `
You are starting a board meeting.

Context:
${context}
Task:
- Decide which agent should speak first
- Explain why
`
      }
    ]
  });

  return {
    threadId,
    initialPlan: result.text,
  };
  }
   @Post('message')
async handleMessage(
  @Body() body: { problem: string; threadId: string; agents?: string[] }
) {
  const result = await mastra.getAgent('supervisorAgent').generate({
    threadId: body.threadId,
    maxSteps: 6,
    messages: [
      {
        role: "user",
        content: `
Founder Question:
${body.problem}

Selected Agents:
${body.agents?.join(", ") || "All"}

Instructions:
- Delegate to agents
- Use multiple agents
- Respond ONLY in JSON:

{
  "discussion": [
    { "agent": "CTO", "message": "..." }
  ],
  "finalDecision": "..."
}
`
      }
    ]
  });

  try {
    return JSON.parse(result.text);
  } catch {
    return {
      discussion: [],
      finalDecision: result.text,
    };
  }
}
}