import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as moment from 'moment-timezone';

@Injectable()
export class LatLongBodyGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    let {body} = context.switchToHttp().getRequest();
    if (
      !body ||
      !body.latitude ||
      isNaN(+body.latitude) || // must be a number
      !body.longitude ||
      isNaN(+body.longitude) || // must be a number
      !body.timezone ||
      moment.tz.zone(body.timezone) === null // check if TZ exists w/ moment
    ) {
      // context.switchToHttp().getResponse().redirect('/');
      return false;
    } else {
      return true;
    }
  }
}
