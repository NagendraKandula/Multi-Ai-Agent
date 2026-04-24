import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('simulation')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('start')
  start(@Body() body: any) {
    return this.appService.runStartupSimulation(body);
  }

  @Post('message')
  message(@Body() body: any) {
    const { message, onboardingData } = body;

    // ✅ Validation (IMPORTANT)
    if (!message) {
      throw new BadRequestException('message is required');
    }

    if (!onboardingData) {
      throw new BadRequestException('onboardingData is required');
    }

    return this.appService.handleLiveDebate(message, onboardingData);
  }
}