import 'dotenv/config';
import express from 'express';
import { initializeAppDataSource } from './entity/appDataSource';
import container from './bootstrap';
import initialzeAppMiddleware from './middleware';
import initializeRoutes from './routes';

const port = process.env.appPort || 3000;
initializeAppDataSource();

const app = express();
initialzeAppMiddleware(app);
initializeRoutes(container, app);

app.listen(port, () => console.log(`app listening on port ${port}`));
