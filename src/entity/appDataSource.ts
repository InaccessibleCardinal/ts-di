import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './User';
import { Article } from './Article';
import { Comment } from './Comment';

const { db, dbHost, dbPassword, dbPort, dbUser } = process.env;

export const appDataSource = new DataSource({
  type: 'mysql',
  host: dbHost,
  port: Number(dbPort),
  username: dbUser,
  password: dbPassword,
  database: db,
  synchronize: true,
  logging: true,
  entities: [User, Article, Comment],
  subscribers: [],
  migrations: [],
});

export function initializeAppDataSource() {
  appDataSource
    .initialize()
    .then(() => console.log('database connection successful'))
    .catch((error) => console.error(error));
}
