import { err, ok } from 'neverthrow';
import { injectable, inject } from 'tsyringe';
import { Repository } from 'typeorm';
import { DI } from '../constants/DI';
import { Article } from '../entity/Article';

@injectable()
export class ArticleService {
  constructor(@inject(DI.ArticleRepository) private articleRepo: Repository<Article>) {}

  public async getArticles() {
    try {
      const articles = await this.articleRepo.find();
      return ok(articles);
    } catch (e) {
      return err(e);
    }
  }

  public async addArticle(article: Article) {
    try {
      const response = await this.articleRepo.save(article);
      return ok(response);
    } catch (e) {
      return err(e);
    }
  }
}