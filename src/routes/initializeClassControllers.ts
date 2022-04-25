import { Application } from 'express';
import { DependencyContainer } from 'tsyringe';
import initializeArticleRoutes from './articles';

export default function initializeClassControllers(
  container: DependencyContainer,
  app: Application
) {
  initializeArticleRoutes(container, app);
  // etc...
}
