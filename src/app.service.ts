import { Injectable, HttpService } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(
    private readonly httpService: HttpService
  ){}


  getHello(): object {
    return {hello: "world"};
  }

  getBarometerData(lat, long): object{
    console.log(lat, long);

    return 
  }
}
