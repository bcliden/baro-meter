import { Controller, Get, Render, Post, Res, Body, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import * as faker from 'faker';
import * as moment from 'moment-timezone';
import { LatLongBodyGuard } from './lat-long-body.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @Render('index')
  root() {
    return {
      message: `Baro-${faker.commerce.productAdjective()}`,
    };
  }

  @Post()
  @Render('results')
  @UseGuards(LatLongBodyGuard)
  async post(@Body() body, @Res() res) {
      const { latitude, longitude, timezone } = body;
      const response = await this.appService.getPressureData([latitude, longitude], timezone);
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