import { Injectable, HttpService } from '@nestjs/common';
import 'dotenv/config';
// import { subHours, format, isToday, getTime, isSameDay } from 'date-fns';
import * as moment from 'moment-timezone';


@Injectable()
export class AppService {
  constructor(
    private readonly httpService: HttpService
  ) { }

  baseUrl = `https://api.darksky.net`;
  key = process.env.DARKSKY_KEY;

  getHello(): object {
    return { hello: "world" };
  };

  public async getPressureData([latitude, longitude], timezone) {

    const data = await Promise.all([
      this.getYesterdayData([latitude, longitude], timezone),
      this.getTodayData([latitude, longitude], timezone),
      this.getForecastData([latitude, longitude])
    ]);

    let [yesterday, today, forecast] = [data[0].data, data[1].data, data[2].data];

    // filter out all of today's hours from the forecast
    forecast.hourly.data = forecast.hourly.data.filter(el => {
      let elTime = moment.tz(el.time * 1000, timezone); // seconds to milliseconds (UNIX to JS)
      let nowTime = moment.tz(timezone);
      return !nowTime.isSame(elTime, 'day');
    });

    const aggregate = {
      todayForecast: {
        text: forecast.hourly.summary,
        icon: this.getIcon(today.hourly.icon)
      },
      hours: this.getHours(
        yesterday.hourly.data,
        today.hourly.data,
        forecast.hourly.data,
        timezone
      ),
      now: moment.tz(timezone).format('ha ddd')
    }

    return aggregate;
  };

  private async getForecastData(coords): Promise<any> {
    const [lat, long] = coords;
    const url = `${this.baseUrl}/forecast/${this.key}/${lat},${long}?exclude=minutely,daily`;
    return await this.httpService.axiosRef.get(url);
  };

  private async getTodayData(coords, timezone): Promise<any> {
    const [lat, long] = coords;
    // const todayInUNIX = Math.floor(new Date().getTime() / 1000);
    const todayInUNIX = moment.tz(timezone).format('X');
    const url = `${this.baseUrl}/forecast/${this.key}/${lat},${long},${todayInUNIX}?exclude=minutely,daily,currently`;
    return await this.httpService.axiosRef.get(url);
  };

  private async getYesterdayData(coords, timezone): Promise<any> {
    const [lat, long] = coords;
    // const yesterdayInUNIX = Math.floor(subHours(new Date(), 24).getTime() / 1000);
    const yesterdayInUNIX = moment.tz(timezone).subtract(24, 'hours').format('X');
    const url = `${this.baseUrl}/forecast/${this.key}/${lat},${long},${yesterdayInUNIX}?exclude=minutely,daily,currently`;
    return await this.httpService.axiosRef.get(url);
  };

  // parsing dates here is giving them the offset of the server... UTC
  private getHours(past, today, future, timezone) {
    let pastMap = past.map(el => {
      return {
        time: moment.tz(el.time * 1000, timezone).format('ha ddd'),
        pressure: el.pressure
      }
    });
    let todayMap = today.map(el => {
      return {
        time: moment.tz(el.time * 1000, timezone).format('ha ddd'),
        pressure: el.pressure
      }
    });
    let futureMap = future.map(el => {
      return {
        time: moment.tz(el.time * 1000, timezone).format('ha ddd'),
        pressure: el.pressure
      }
    });
    return pastMap.concat(todayMap).concat(futureMap);
  };

  private getIcon(value) {
    switch (value) {
      case "clear-day":
        return "sun";
      case "clear-night":
        return "moon";
      case "rain":
        return "cloud-rain";
      case "snow":
        return "snowflake";
      case "sleet":
        return "cloud-rain";
      case "wind":
        return "wind";
      case "fog":
        return "smog";
      case "cloudy":
        return "cloud";
      case "partly-cloudy-day":
        return "cloud-sun";
      case "partly-cloudy-night":
        return "cloud-moon";
      default:
        return "cloud";
    }
  };

}
