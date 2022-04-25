import { Application, Router } from 'express';
import { DependencyContainer } from 'tsyringe';
import { Routes } from '../../constants/Routes';
import { ArticleController } from './ArticleController';

export default function initializeArticleRoutes(
  container: DependencyContainer,
  app: Application
) {
  const articlesRouter = Router();
  const controller = container.resolve(ArticleController);
  articlesRouter.get(Routes.articles, controller.getArticlesRoute);
  articlesRouter.post(Routes.articles, controller.addArticle);
  app.use(articlesRouter);
}
