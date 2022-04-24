import 'reflect-metadata';
import {container} from 'tsyringe';
import {DI} from './constants/DI';
import { Repositories } from './constants/Repositories';
import { appDataSource } from './entity/appDataSource';
import { ArticleController } from './routes/articles/ArticleController';
import { ArticleService } from './services/ArticleService';

container.register(DI.ArticleController, ArticleController);
container.register(DI.ArticleService, ArticleService);
container.register(DI.ArticleRepository, {useValue: appDataSource.getRepository(Repositories.Article)});

export default container;