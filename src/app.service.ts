import { Injectable, HttpService } from '@nestjs/common';
import 'dotenv/config';
import { subHours, format, isToday } from 'date-fns';


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

  private async getFutureBarometerData(coords): Promise<any> {
    const [lat, long] = coords;
    const url = `${this.baseUrl}/forecast/${this.key}/${lat},${long}?exclude=minutely`;
    return await this.httpService.axiosRef.get(url);
  };

  private async getTodayBarometerData(coords) {
    const [lat, long] = coords;
    const todayInUNIX = Math.floor(new Date().getTime() / 1000);
    const url = `${this.baseUrl}/forecast/${this.key}/${lat},${long},${todayInUNIX}?exclude=minutely,daily,currently`;
    return await this.httpService.axiosRef.get(url);
  };

  private async getYesterdayBarometerData(coords): Promise<any> {
    const [lat, long] = coords;
    const yesterdayInUNIX = Math.floor(subHours(new Date(), 24).getTime() / 1000);
    const url = `${this.baseUrl}/forecast/${this.key}/${lat},${long},${yesterdayInUNIX}?exclude=minutely,daily,currently`;
    return await this.httpService.axiosRef.get(url);
  };

  public async getPressureData([latitude, longitude], localOffset) {

    const data = await Promise.all([
      this.getYesterdayBarometerData([latitude, longitude]),
      this.getTodayBarometerData([latitude, longitude]),
      this.getFutureBarometerData([latitude, longitude])
    ]);

    let [past, today, future] = [data[0].data, data[1].data, data[2].data];

    // filter out all today hours in future
    future.hourly.data = future.hourly.data.filter(el => {
      return !isToday(el.time * 1000);
    });

    const aggregate = {
      todayForecast: {
        text: future.hourly.summary,
        icon: this.getIcon(today.hourly.icon)
      },
      hours: this.getHours(
        past.hourly.data,
        today.hourly.data,
        future.hourly.data
      ),
    }

    return aggregate;
  };

  getHours(past, today, future) {
    let pastMap = past.map((el, idx) => {
      return {
        time: format(new Date(el.time * 1000), 'ha, ddd'),
        pressure: el.pressure
      }
    });
    let todayMap = today.map((el, idx) => {
      return {
        time: format(new Date(el.time * 1000), 'ha, ddd'),
        pressure: el.pressure
      }
    });
    let futureMap = future.map((el, idx) => {
      return {
        time: format(new Date(el.time * 1000), 'ha, ddd'),
        pressure: el.pressure
      }
    });
    return pastMap.concat(todayMap).concat(futureMap);
  };

  getIcon(value) {
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
