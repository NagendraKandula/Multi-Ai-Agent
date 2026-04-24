import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('simulation')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('start')
  runStartup(@Body() body: any) {
    return this.appService.runStartupSimulation(body);
  }

  @Post('message')
  liveDebate(@Body() body: any) {
    return this.appService.handleLiveDebate(body);
  }
}