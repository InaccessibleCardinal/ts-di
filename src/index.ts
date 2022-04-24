import 'dotenv/config';
import express from 'express';
import { initializeAppDataSource } from './entity/appDataSource';
import container from './bootstrap';
import initializeClassControllers from './routes/initializeClassControllers'
import initialzeAppMiddleware from './middleware';
import initializeRoutes from './routes';

initializeAppDataSource();

const port = process.env.appPort || 3000;

const app = express();
app.use(express.json());
initialzeAppMiddleware(app);
initializeClassControllers(container, app);
initializeRoutes(app);

app.listen(port, () => console.log(`app listening on port ${port}`));
