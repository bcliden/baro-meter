import { Controller, Get, Render, Post, Res, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { format } from 'date-fns';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @Render('index')
  root() {
    return {
      message: 'Baro-Meter',
      geolocate: true,
      results: false
    };
  }

  @Post()
  @Render('results')
  async post(@Body() body, @Res() res) {
    const { latitude, longitude } = body;



    const response = await this.appService.getPressureData([latitude, longitude]);
    // console.log(response);
    return {
      message: 'Baro-lazy',
      response
    }
  }
}