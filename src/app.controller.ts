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

    // use Promise.all instead of this !!!
    const { data: past } = await this.appService.getYesterdayBarometerData([latitude, longitude]);
    const { data: future } = await this.appService.getBarometerData([latitude, longitude])
    // *****
    
    const aggregate = {
      todayForecast: future.hourly.summary,
      days:
        past.daily.data.map(el => (new Date(el.time * 1000)).toDateString()).concat(
         future.daily.data.map(el => (new Date(el.time * 1000)).toDateString())
        )
      ,
      hours:
        past.hourly.data.map(el => format(new Date(el.time * 1000), 'ha, dddd')).concat(
         future.hourly.data.map(el => format(new Date(el.time * 1000), 'ha, dddd'))
        )
      ,
      dayPressure:
        past.daily.data.map(el => el.pressure).concat(future.daily.data.map(el => el.pressure))
      ,
      hourPressure:
        past.hourly.data.map(el => el.pressure).concat(future.hourly.data.map(el => el.pressure))
      ,
    }

    // let response = {
    //   todayForecast: future.hourly.summary,
    //   days: future.daily.data.map(el => (new Date(el.time * 1000)).toDateString()),
    //   hours: future.hourly.data.map(el => {
    //     return format(new Date(el.time * 1000), 'ha, dddd');
    //   }),
    //   dayPressure: future.daily.data.map(el => el.pressure),
    //   hourPressure: future.hourly.data.map(el => {
    //     return el.pressure;
    //   }),
    //   future
    // }

    return {
      message: 'Baro-lazy',
      response: aggregate
    }
  }
}