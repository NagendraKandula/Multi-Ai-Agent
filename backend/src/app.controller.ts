import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { AppService } from './app.service';
class MessageDto {
  message!: string;
  onboardingData: any; // you can type this better later
} 
@Controller('simulation')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('start')
  start(@Body() body: any) {
    return this.appService.runStartupSimulation(body);
  }

  @Post('message')
  message(@Body() body: MessageDto) {
    const { message, onboardingData } = body;

    // ✅ Validation (IMPORTANT)
   if (!message || !onboardingData) {
  console.log("Missing data", { message, onboardingData });
  return;
}

    return this.appService.handleLiveDebate(message, onboardingData);
  }
  @Post('summary')
  async getSummary(@Body() body: { transcript: string | string[], onboardingData: any }) {
    return this.appService.generateDecisionSummary(body);
  }
  @Post('execute')
  async executeTask(@Body() body: { task: string, startupContext: any }) {
    return this.appService.executeTask(body);
  }
}