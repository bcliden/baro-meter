import { Injectable, HttpService } from '@nestjs/common';
import 'dotenv/config';
import { subHours, format } from 'date-fns';
import { PassThrough } from 'stream';


@Injectable()
export class AppService {
  constructor(
    private readonly httpService: HttpService
  ) { }

  baseUrl = `https://api.darksky.net`;
  key = process.env.DARKSKY_KEY;

  getHello(): object {
    return { hello: "world" };
  }

  private async getFutureBarometerData(coords): Promise<any> {
    const [lat, long] = coords;
    const url = `${this.baseUrl}/forecast/${this.key}/${lat},${long}?exclude=minutely`;
    return await this.httpService.axiosRef.get(url);
  }

  private async getTodayBarometerData(coords) {
    const [lat, long] = coords;
    const todayInUNIX = Math.floor(Date.now() / 1000);
    const url = `${this.baseUrl}/forecast/${this.key}/${lat},${long},${todayInUNIX}?exclude=minutely,daily,currently`;
    return await this.httpService.axiosRef.get(url);
  }

  private async getYesterdayBarometerData(coords): Promise<any> {
    const [lat, long] = coords;
    const yesterdayInUNIX = Math.floor(subHours(new Date(), 24).getTime() / 1000);
    const url = `${this.baseUrl}/forecast/${this.key}/${lat},${long},${yesterdayInUNIX}?exclude=minutely,daily,currently`;
    return await this.httpService.axiosRef.get(url);
  }

  public async getPressureData([latitude, longitude]) {
    // use Promise.all instead of this !!!
    // const { data: past } = await this.getYesterdayBarometerData([latitude, longitude]);
    // const { data: future } = await this.getBarometerData([latitude, longitude])
    // *****

    const data = await Promise.all([
      this.getYesterdayBarometerData([latitude, longitude]),
      this.getTodayBarometerData([latitude, longitude]),
      this.getFutureBarometerData([latitude, longitude])
    ]);

    let [past, today, future] = [data[0].data, data[1].data, data[2].data];

    // let responseObject = {};
    // for(let i = 0; i < past.length; i++) {
    //   let newDate = (new Date())
    //   responseObject[] = {
    //     hour: past.hourly.data[i],
    //     pressure: past.hourly.data[i].pressure
    //   }
    // }

    let aggregateHours = this.getHours(
      past.hourly.data,
      today.hourly.data,
      future.hourly.data
    );

    const aggregate = {
      todayForecast: future.hourly.summary,
      hours: aggregateHours
      // days:
      //   past.daily.data.map(el => (new Date(el.time * 1000)).toDateString()).concat(
      //    future.daily.data.map(el => (new Date(el.time * 1000)).toDateString())
      //   )
      // ,
      // hours:
      //   past.hourly.data.map(el => format(new Date(el.time * 1000), 'ha, dddd')).concat(
      //     future.hourly.data.map(el => format(new Date(el.time * 1000), 'ha, dddd'))
      //   )
      // ,
      // dayPressure:
      //   past.daily.data.map(el => el.pressure).concat(future.daily.data.map(el => el.pressure))
      // ,
      // hourPressure:
      //   past.hourly.data.map(el => el.pressure).concat(future.hourly.data.map(el => el.pressure))
      // ,
    }

    return aggregate;
  }

  getHours(past, today, future){
    let pastMap = past.map((el, idx) => {
      return {
        time: format(new Date(el.time * 1000), 'ha, dddd'),
        pressure: el.pressure
      }
    });
    let todayMap = today.map((el, idx) => {
      return {
        time: format(new Date(el.time * 1000), 'ha, dddd'),
        pressure: el.pressure
      }
    });
    let futureMap = future.map((el, idx) => {
      return {
        time: format(new Date(el.time * 1000), 'ha, dddd'),
        pressure: el.pressure
      }
    });
    return pastMap.concat(todayMap).concat(futureMap);
  }
}
