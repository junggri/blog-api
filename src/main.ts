import {NestFactory} from '@nestjs/core';
import {NestExpressApplication} from '@nestjs/platform-express';
import {AppModule} from './app.module';
import setCorsOption from "@utils/setCorsOption";
import {Session} from "@config/session";
import session from "express-session";
import compression from "compression";
import cookieParser from "cookie-parser";
import "reflect-metadata";
import {ValidationPipe} from "@nestjs/common";
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors(setCorsOption<string>(
    [
      "https://admin.junggri.com",
      "http://localhost:3002",
      "http://localhost:3000",
      "http://localhost:3001",
      "http://admin.junggri.com",
    ]
  ));

  app.use(session(Session.create()))
    .use(compression())
    .use(cookieParser())
    .use(graphqlUploadExpress({maxFileSize: 10000000, maxFiles: 10}));

  process.on("uncaughtException", function (err) {
    console.error("uncaughtException (Node is alive)", err);
  });

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT, '0.0.0.0');

  console.log(`listen ${process.env.PORT} port`);
}

import {graphqlUploadExpress} from 'graphql-upload';

bootstrap();
