import { Application, json } from 'express';
import { cors } from './cors';
import { logger } from './logger';

export const middleware = [cors, json(), logger];

export default function initialzeAppMiddleware(app: Application) {
  app.use(...middleware);
}
