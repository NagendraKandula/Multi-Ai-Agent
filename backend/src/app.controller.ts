import { Body, Controller, Post } from '@nestjs/common';
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
    return this.appService.handleLiveDebate(
      body.message,
      body.onboardingData
    );
  }
}