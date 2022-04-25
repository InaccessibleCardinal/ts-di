import { Router } from 'express';
import { DependencyContainer } from 'tsyringe';
import { Routes } from '../../constants/Routes';
import { ArticleController } from './ArticleController';

export default function initializeArticleRoutes(
  container: DependencyContainer,
  router: Router
) {
  const articlesRouter = Router({ mergeParams: true });
  router.use(`/:id${Routes.articles}`, articlesRouter);
  const controller = container.resolve(ArticleController);
  articlesRouter.get(Routes.root, controller.getArticlesRoute);
  articlesRouter.post(Routes.root, controller.addArticle);
}
