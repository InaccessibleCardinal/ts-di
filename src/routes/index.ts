import { Application } from 'express';
import { DependencyContainer } from 'tsyringe';
import usersRouter from './users';
import signupRouter from './signup';
import { Routes } from '../constants/Routes';
import initializeArticleRoutes from './articles';

export default function initializeRoutes(
  container: DependencyContainer,
  app: Application
) {
  app.use(Routes.users, usersRouter);
  app.use(Routes.signup, signupRouter);
  initializeArticleRoutes(container, usersRouter);
}
