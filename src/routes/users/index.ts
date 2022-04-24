import { Router } from 'express';
import {
  createUserFromPost,
  getUserRoute,
  getUsersRoute,
  postUserRoute,
  validateGetUser,
  validateUpdateUser,
  updateUserRoute
} from './userController';

const usersRouter = Router();
usersRouter.get('/', getUsersRoute);
usersRouter.get('/:id', validateGetUser, getUserRoute);
usersRouter.post('/', createUserFromPost, postUserRoute);
usersRouter.put('/:id', validateUpdateUser, updateUserRoute);

export default usersRouter;
