import { NextFunction, Request, Response } from 'express';
import {
  addUser,
  getUser,
  getUsers,
  updateUser,
} from '../../services/userService';
import { Repositories } from '../../constants/Repositories';
import { appDataSource } from '../../entity/appDataSource';
import { User } from '../../entity/User';
import { errorResponse, okResponse } from '../../util/apiResponses';
import { Repository } from 'typeorm';
import { createHashedPassword } from '../../util/passwords';

export async function getUsersRoute(req: Request, res: Response) {
  const result = await getUsers(appDataSource.getRepository(Repositories.User));
  result
    .map((value) => okResponse(value, res, 200))
    .mapErr((err) => errorResponse(err as Error, res, 500));
}

export function validateGetUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const {
    params: { id },
  } = req;
  const numericId = getNumericId(id);
  if (isNaN(numericId)) {
    return errorResponse(new Error(`Bad Request. Invalid ID: ${id}`), res, 400);
  }
  next();
}

export async function getUserRoute(req: Request, res: Response) {
  const result = await getUser(
    appDataSource.getRepository(Repositories.User),
    +req.params.id
  );
  result
    .map((value) => {
      value
        ? okResponse(value, res, 200)
        : errorResponse(new Error('not found'), res, 404);
    })
    .mapErr((err) => errorResponse(err as Error, res, 500));
}

function getNumericId(id: string) {
  return +id;
}

function userDataIsValid(body: any) {
  return !(
    !body.first_name ||
    !body.last_name ||
    !body.email ||
    !body.password
  );
}

export function createUserFromPost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { body } = req;
  if (!userDataIsValid(body)) {
    return errorResponse(new Error('bad user data'), res, 400);
  }
  const usersRepo: Repository<User> = appDataSource.getRepository(
    Repositories.User
  );
  const { first_name, last_name, email, password } = body;
  const user = usersRepo.create({
    first_name,
    last_name,
    email,
    password: createHashedPassword(password),
  });
  req.body.user = user;
  next();
}

export async function postUserRoute(req: Request, res: Response) {
  const {
    body: { user },
  } = req;
  const result = await addUser(
    appDataSource.getRepository(Repositories.User),
    user
  );
  result
    .map((value) => okResponse(value, res, 201))
    .mapErr((err) => errorResponse(err as Error, res, 500));
}

export function validateUpdateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { body, params } = req;
  if (
    !params.id ||
    isNaN(+params.id) ||
    (!body.first_name && !body.last_name && !body.email)
  ) {
    return errorResponse(new Error('bad request'), res, 400);
  }
  next();
}
export async function updateUserRoute(req: Request, res: Response) {
  const { body, params } = req;
  const result = await updateUser(
    appDataSource.getRepository(Repositories.User),
    +params.id,
    body
  );
  result
    .map((value) => okResponse(value, res, 202))
    .mapErr((err) => errorResponse(err as Error, res, 500));
}
