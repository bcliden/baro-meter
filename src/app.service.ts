import { Injectable, HttpService } from '@nestjs/common';
import 'dotenv/config';
import { subHours } from 'date-fns';


@Injectable()
export class AppService {
  constructor(
    private readonly httpService: HttpService
  ){}

  baseUrl = `https://api.darksky.net`;
  key = process.env.DARKSKY_KEY;

  getHello(): object {
    return {hello: "world"};
  }

  async getBarometerData(coords): Promise<any>{
    const [lat, long] = coords;
    const url = `${this.baseUrl}/forecast/${this.key}/${lat},${long}?exclude=minutely`;
    return await this.httpService.axiosRef.get(url);
  }

  async getYesterdayBarometerData(coords): Promise<any> {
    const [lat, long] = coords;
    const yesterdayInUNIX = Math.floor(subHours(new Date(), 24).getTime() / 1000);
    const url = `${this.baseUrl}/forecast/${this.key}/${lat},${long},${yesterdayInUNIX}`;
    return await this.httpService.axiosRef.get(url);
  }
}
