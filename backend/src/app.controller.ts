import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('simulation')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('start')
  async startSimulation(@Body() formData: any) {
    return await this.appService.runStartupSimulation(formData);
  }
}