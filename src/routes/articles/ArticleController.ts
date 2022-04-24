import { autoInjectable, inject } from 'tsyringe';

type Service = {};

@autoInjectable()
class ArticleController {
  public constructor(private articleService: Service) {}
}
