import { Controller, Get, Render, Post, Res, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { format } from 'date-fns';
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
    if (
      !body ||
      !body.latitude ||
      isNaN(+body.latitude) ||
      !body.longitude ||
      isNaN(+body.longitude)
    ) {
      res.redirect('/');
    }
    const { latitude, longitude } = body;
    const response = await this.appService.getPressureData([latitude, longitude]);
    return {
      message: `Baro-${faker.commerce.productAdjective()}`,
      response,
    }
  }

  @Get('*')
  catchAll(@Res() res){
    res.redirect('/');
  }
}