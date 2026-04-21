import { Controller, Post, Body } from '@nestjs/common';
import { OnboardSimulationDto } from './simulation/dto/onboard-simulation.dto';
import { mastra } from './mastra';

@Controller('simulation')
export class AppController {
  @Post('start')
  async startSimulation(@Body() dto: OnboardSimulationDto) {
    // 1. Create a unique Thread ID for persistent storage
    const threadId = `${dto.businessName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;

    // 2. Format the mission context for the Supervisor Agent
    const mission = `Start a ${dto.businessType} startup named ${dto.businessName}. 
    Problem: ${dto.problemSolving}. 
    Budget: ${dto.budgetRange}. 
    Stage: ${dto.stage}.
    Constraints: ${dto.constraint} is the biggest hurdle.
    Selected Team: ${dto.selectedAgents.join(', ')}.`;

    // 3. Trigger the Supervisor to generate the initial plan and save to storage
    const response = await mastra.getAgent('supervisorAgent').generate(mission, {
      threadId,
    });

    return {
      message: 'Simulation Initialized Successfully',
      threadId,
      initialPlan: response.text
    };
  }
}