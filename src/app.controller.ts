import { Controller, Get, Render, Post, Res, Body } from '@nestjs/common';
import { AppService } from './app.service';
const faker = require('faker');
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @Render('index')
  root() {
    return {
      message: `Baro-${faker.commerce.productAdjective()}`,
      geolocate: true,
      results: false
    };
  }

  @Post()
  @Render('results')
  async post(@Body() body, @Res() res) {
    const { latitude, longitude } = body;
    const response = await this.appService.getPressureData([latitude, longitude]);
    return {
      message: `Baro-${faker.commerce.productAdjective()}`,
      response
    }
  }
}