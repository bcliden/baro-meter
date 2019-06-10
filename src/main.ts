import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as hbs from 'hbs';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';

import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger("Application");
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  hbs.registerPartials(join(__dirname, '..', 'views/partials'));
  hbs.registerHelper('json', function (ctx) {
    return JSON.stringify(ctx);
  })

  logger.log(`App listening on Port ${process.env.PORT || 3000}`);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
