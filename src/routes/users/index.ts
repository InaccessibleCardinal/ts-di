import { Router } from 'express';
import {
  createUserFromPost,
  getUserRoute,
  getUsersRoute,
  postUserRoute,
  validateGetUser,
} from './userController';

const usersRouter = Router();
usersRouter.get('/', getUsersRoute);
usersRouter.get('/:id', validateGetUser, getUserRoute);
usersRouter.post('/', createUserFromPost, postUserRoute);

export default usersRouter;
