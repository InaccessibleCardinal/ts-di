import { NextFunction, Request, Response } from 'express';
import { err, ok } from 'neverthrow';
import {
  addUser,
  getUsers,
  getUser,
  updateUser,
} from '../../services/userService';
import { appDataSource } from '../../entity/appDataSource';
import { errorResponse, okResponse } from '../../util/apiResponses';
import {
  createUserFromPost,
  getUsersRoute,
  getUserRoute,
  postUserRoute,
  validateGetUser,
  validateUpdateUser,
  updateUserRoute,
} from './userController';
import { Repository } from 'typeorm';
import { User } from '../../entity/User';

jest.mock('express', () => {
  return {
    NextFunction: jest.fn(),
    Request: {},
    Response: {},
  };
});

jest.mock('../../entity/appDataSource', () => {
  return {
    appDataSource: { getRepository: jest.fn() },
  };
});

jest.mock('../../services/userService', () => {
  return {
    addUser: jest.fn(),
    getUser: jest.fn(),
    getUsers: jest.fn(),
    updateUser: jest.fn(),
  };
});

jest.mock('../../util/apiResponses', () => {
  return {
    errorResponse: jest.fn(),
    okResponse: jest.fn(),
  };
});

const mockRepo = { create: jest.fn() } as unknown as Repository<User>;

beforeEach(() => {
  jest.resetAllMocks();
  (appDataSource.getRepository as jest.Mock).mockReturnValueOnce(mockRepo);
});

describe('userController: getUsersRoute', () => {
  it('should invoke the users service: getUsers', async () => {
    (getUsers as jest.Mock).mockResolvedValueOnce(ok([]));
    const mockReq = {} as Request;
    const mockRes = {} as Response;
    await getUsersRoute(mockReq, mockRes);
    expect(getUsers).toHaveBeenCalledWith(mockRepo);
    expect(okResponse).toHaveBeenCalledWith([], {}, 200);
    expect(errorResponse).not.toHaveBeenCalled();
  });

  it('should invoke the users service: getUsers, handle error', async () => {
    const testErr = new Error('badness');
    (getUsers as jest.Mock).mockResolvedValueOnce(err(testErr));
    const mockReq = {} as Request;
    const mockRes = {} as Response;
    await getUsersRoute(mockReq, mockRes);
    expect(getUsers).toHaveBeenCalledWith(mockRepo);
    expect(okResponse).not.toHaveBeenCalled();
    expect(errorResponse).toHaveBeenCalledWith(testErr, {}, 500);
  });
});

describe('userContoller: getUserRoute', () => {
  it('should invoke users service: getUser', async () => {
    const user = { first_name: 'ken' };
    (getUser as jest.Mock).mockResolvedValueOnce(ok(user));
    const mockReq = { params: { id: '1' } } as unknown as Request;
    const mockRes = {} as Response;
    await getUserRoute(mockReq, mockRes);
    expect(getUser).toHaveBeenCalledWith(mockRepo, 1);
    expect(okResponse).toHaveBeenCalledWith(user, {}, 200);
    expect(errorResponse).not.toHaveBeenCalled();
  });

  it('should invoke users service: getUser, handle null response', async () => {
    (getUser as jest.Mock).mockResolvedValueOnce(ok(null));
    const mockReq = { params: { id: '1' } } as unknown as Request;
    const mockRes = {} as Response;
    await getUserRoute(mockReq, mockRes);
    expect(getUser).toHaveBeenCalledWith(mockRepo, 1);
    expect(okResponse).not.toHaveBeenCalled();
    expect(errorResponse).toHaveBeenCalledWith(new Error('not found'), {}, 404);
  });

  it('should invoke users service: getUser, handle service error', async () => {
    const testErr = new Error('bad user');
    (getUser as jest.Mock).mockResolvedValueOnce(err(testErr));
    const mockReq = { params: { id: '1' } } as unknown as Request;
    const mockRes = {} as Response;
    await getUserRoute(mockReq, mockRes);
    expect(getUser).toHaveBeenCalledWith(mockRepo, 1);
    expect(okResponse).not.toHaveBeenCalled();
    expect(errorResponse).toHaveBeenCalledWith(testErr, {}, 500);
  });
});

describe('userController: validateGetUser', () => {
  it('should invoke next', () => {
    const mockReq = { params: { id: '1' } } as unknown as Request;
    const mockRes = {} as Response;
    const mockNext = jest.fn();
    validateGetUser(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });

  it('should invoke errorResponse', () => {
    const mockReq = { params: { id: 'abc' } } as unknown as Request;
    const mockRes = {} as Response;
    const mockNext = jest.fn();
    validateGetUser(mockReq, mockRes, mockNext);
    expect(mockNext).not.toHaveBeenCalled();
    expect(errorResponse).toHaveBeenCalledWith(
      new Error(`Bad Request. Invalid ID: abc`),
      mockRes,
      400
    );
  });
});

describe('userController: createUserFromPost', () => {
  it('should create a user and invoke next', () => {
    (mockRepo.create as jest.Mock).mockImplementationOnce((o: any) => o);
    const mockReq = {
      body: {
        first_name: 'ken',
        last_name: 'lee',
        email: 'email@site.com',
        password: 'testpass',
      },
    } as unknown as Request;
    const mockRes = {} as Response;
    const mockNext = jest.fn();
    createUserFromPost(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalled();
    expect(mockReq.body.user).toEqual(
      expect.objectContaining({
        first_name: 'ken',
        last_name: 'lee',
        email: 'email@site.com',
      })
    );
  });

  it('should invoke errorResponse', () => {
    (mockRepo.create as jest.Mock).mockImplementationOnce((o: any) => o);
    const mockReq = {
      body: {
        first_name: 'ken',
        email: 'email@site.com',
        password: 'testpass',
      },
    } as unknown as Request;
    const mockRes = {} as Response;
    const mockNext = jest.fn();
    createUserFromPost(mockReq, mockRes, mockNext);
    expect(mockNext).not.toHaveBeenCalled();
    expect(errorResponse).toHaveBeenCalled();
  });
});

describe('userController: postUserRoute', () => {
  it('should invoke addUser, okResponse', async () => {
    (addUser as jest.Mock).mockResolvedValueOnce(ok({}));
    const mockReq = { body: { user: {} } } as Request;
    const mockRes = {} as Response;
    await postUserRoute(mockReq, mockRes);
    expect(okResponse).toHaveBeenCalled();
    expect(errorResponse).not.toHaveBeenCalled();
  });

  it('should invoke addUser, errorResponse', async () => {
    (addUser as jest.Mock).mockResolvedValueOnce(err(new Error()));
    const mockReq = { body: { user: {} } } as Request;
    const mockRes = {} as Response;
    await postUserRoute(mockReq, mockRes);
    expect(okResponse).not.toHaveBeenCalled();
    expect(errorResponse).toHaveBeenCalled();
  });
});

describe('userController: validateUpdateUser', () => {
  it('should invoke next', async () => {
    const mockReq = {
      params: { id: 1 },
      body: { first_name: 'ken' },
    } as unknown as Request;
    const mockRes = {} as Response;
    const mockNext = jest.fn();
    await validateUpdateUser(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });

  it('should invoke errorResponse, bad id path param', async () => {
    const mockReq = {
      params: { id: 'x' },
      body: { first_name: 'ken' },
    } as unknown as Request;
    const mockRes = {} as Response;
    const mockNext = jest.fn();
    await validateUpdateUser(mockReq, mockRes, mockNext);
    expect(mockNext).not.toHaveBeenCalled();
    expect(errorResponse).toHaveBeenCalled();
  });

  it('should invoke errorResponse, no id path param', async () => {
    const mockReq = {
      params: {},
      body: { first_name: 'ken' },
    } as unknown as Request;
    const mockRes = {} as Response;
    const mockNext = jest.fn();
    await validateUpdateUser(mockReq, mockRes, mockNext);
    expect(mockNext).not.toHaveBeenCalled();
    expect(errorResponse).toHaveBeenCalled();
  });

  it('should invoke next', async () => {
    const mockReq = {
      params: { id: 1 },
      body: { irrelevant: 'ken' },
    } as unknown as Request;
    const mockRes = {} as Response;
    const mockNext = jest.fn();
    await validateUpdateUser(mockReq, mockRes, mockNext);
    expect(mockNext).not.toHaveBeenCalled();
    expect(errorResponse).toHaveBeenCalled();
  });
});

describe('userController: updateUserRoute', () => {
  it('should invoke updateUser, handle success result', async () => {
    (updateUser as jest.Mock).mockResolvedValueOnce(ok({}));
    const mockReq = {
      params: { id: '1' },
      body: { first_name: 'ken' },
    } as unknown as Request;
    const mockRes = {} as Response;
    await updateUserRoute(mockReq, mockRes);
    expect(okResponse).toHaveBeenCalled();
    expect(errorResponse).not.toHaveBeenCalled();
    expect(updateUser).toHaveBeenCalledWith(mockRepo, 1, { first_name: 'ken' });
  });

  it('should invoke updateUser, handle error result', async () => {
    const testErr = new Error('all bad');
    (updateUser as jest.Mock).mockResolvedValueOnce(err(testErr));
    const mockReq = {
      params: { id: '1' },
      body: { first_name: 'ken' },
    } as unknown as Request;
    const mockRes = {} as Response;
    await updateUserRoute(mockReq, mockRes);
    expect(okResponse).not.toHaveBeenCalled();
    expect(errorResponse).toHaveBeenCalled();
  });
});
