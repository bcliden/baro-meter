import { Controller, Get, Render, Post, Req, Res, Body } from '@nestjs/common';
import { Redirect } from '@nestjs/common/decorators/http/redirect.decorator';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  root() {
    return { message: 'Baro-Meter'};
  }

  @Post()
  post(@Body() body, @Res() res  ){
    console.log(body);
    // return setTimeout(() => res.redirect('/'),5000);
    return res.redirect('/');
  }
}