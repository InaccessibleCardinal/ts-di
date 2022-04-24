import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { DI } from '../../constants/DI';
import { ArticleService } from '../../services/ArticleService';
import { errorResponse, okResponse } from '../../util/apiResponses';

@injectable()
export class ArticleController {
  constructor(@inject(DI.ArticleService) private articleService: ArticleService) {}

  public getArticlesRoute = async (req: Request, res: Response) => {
    const articlesResult = await this.articleService.getArticles();
    articlesResult
      .map((value) => okResponse(value, res, 200))
      .mapErr((err) => errorResponse(err as Error, res, 500));
  }

  public addArticle = async (req: Request, res: Response) => {
    const { body } = req;
    const result = await this.articleService.addArticle(body);
    result
      .map((value) => okResponse(value, res, 201))
      .mapErr((err) => errorResponse(err as Error, res, 500));
  }
}
