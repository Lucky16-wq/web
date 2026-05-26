import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.setGlobalPrefix('api');
  app.use(helmet());
  app.use(cookieParser());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 120,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );
  app.use(csurf({ cookie: { httpOnly: true, sameSite: 'strict' } }));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(4000);
  console.log('Backend running on http://localhost:4000');
}

bootstrap();
