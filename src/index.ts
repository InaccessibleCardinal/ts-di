import 'dotenv/config';
import express from 'express';
import { initializeAppDataSource } from './entity/appDataSource';
import initialzeAppMiddleware from './middleware';
import initializeRoutes from './routes';

initializeAppDataSource();

const port = process.env.appPort || 3000;

const app = express();
app.use(express.json());
initialzeAppMiddleware(app);
initializeRoutes(app);

app.listen(port, () => console.log(`app listening on port ${port}`));
