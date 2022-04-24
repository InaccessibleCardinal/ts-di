import { Application } from 'express';
import usersRouter from './users';
import signupRouter from './signup';
import { Routes } from '../constants/Routes';

export default function initializeRoutes(app: Application) {
  app.use(Routes.users, usersRouter);
  app.use(Routes.signup, signupRouter);
}
