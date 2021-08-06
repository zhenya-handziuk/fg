import * as bodyParser from 'body-parser';
import compression from 'compression';
import config from 'config';
import express from 'express';
import passport from 'passport';
import 'reflect-metadata';
import { useContainer, useExpressServer } from 'routing-controllers';
import { Container } from 'typedi';
import { PassportStrategy, TypeORMConfiguration } from './helpers';
import { LogService } from './services';

const app = express();
const logger: LogService = Container.get(LogService);

app.use(compression());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(bodyParser.json());
app.use(passport.initialize());
PassportStrategy();

TypeORMConfiguration();

useContainer(Container);
useExpressServer(app, {
  cors: {
    origin: true,
    preflightContinue: true,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  },
  validation: {
    skipMissingProperties: false,
    whitelist: true,
    forbidNonWhitelisted: true,
    validationError: { target: false },
    forbidUnknownValues: true,
  },
  defaultErrorHandler: false,
  controllers: [__dirname + '/controllers/*.*'],
  middlewares: [__dirname + '/middlewares/*.*'],
});

const port: string = config.get('port');
const host: string = config.get('host');
app.listen(port, () => {
  logger.info(`Server up and running on ${host}:${port}`);
});
