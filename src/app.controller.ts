import { Controller, Get, Render, Post, Res, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { format } from 'date-fns';
// const faker = require('faker');
import * as faker from 'faker';
import * as moment from 'moment-timezone';

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
  // @Render('results')
  async post(@Body() body, @Res() res) {
    if (
      !body ||
      !body.latitude ||
      isNaN(+body.latitude) ||
      !body.longitude ||
      isNaN(+body.longitude) ||
      !body.timezone ||
      moment.tz.zone(body.timezone) === null
    ) {
      res.redirect('/');
    } else {
      const { latitude, longitude, timezone } = body;
      const response = await this.appService.getPressureData([latitude, longitude], timezone);
      // return {
      //   message: `Baro-${faker.commerce.productAdjective()}`,
      //   response,
      // }
      res.render('results', {
          message: `Baro-${faker.commerce.productAdjective()}`,
          response,
        })
    }
  }

  @Get('*')
  catchAll(@Res() res){
    res.redirect('/');
  }
}