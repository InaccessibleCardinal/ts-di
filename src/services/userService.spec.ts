import { Repository } from 'typeorm';
import { User } from '../entity/User';
import { addUser, getUser, getUsers, updateUser } from './userService';

const mockUsers = [
  {
    id: 1,
    first_name: 'test',
    last_name: 'last',
    email: 'test@gmail.com',
    password: 'testpass',
  },
  {
    id: 2,
    first_name: 'tst',
    last_name: 'last2',
    email: 'tst@gmail.com',
    password: 'testpass2',
  },
];

const usersRepo = {
  find: jest.fn(),
  findOneBy: jest.fn(),
  save: jest.fn(),
  update: jest.fn()
} as unknown as Repository<User>;

afterEach(jest.resetAllMocks);

describe('users service: getUsers', () => {
  it('should return users', async () => {
    (usersRepo.find as jest.Mock).mockResolvedValueOnce(mockUsers);
    const usersResult = await getUsers(usersRepo);
    expect(usersRepo.find).toHaveBeenCalled();
    expect(usersResult.isOk()).toBe(true);
    usersResult.map((value) => expect(value).toEqual(mockUsers));
    expect(usersRepo.find).toHaveBeenCalled();
  });

  it('should return an error result', async () => {
    const testErr = new Error('no users');
    (usersRepo.find as jest.Mock).mockRejectedValueOnce(testErr);
    const usersResult = await getUsers(usersRepo);
    expect(usersResult.isOk()).toBe(false);
    usersResult.mapErr((err) => expect(err).toEqual(testErr));
  });
});

describe('users service: getUser', () => {
  it('should get a user', async () => {
    (usersRepo.findOneBy as jest.Mock).mockResolvedValueOnce(mockUsers[0]);
    const userResult = await getUser(usersRepo, 1);
    expect(userResult.isOk()).toBe(true);
    userResult.map((value) => expect(value).toEqual(mockUsers[0]));
    expect(usersRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it('should return an error result', async () => {
    const testErr = new Error('you mad');
    (usersRepo.findOneBy as jest.Mock).mockRejectedValueOnce(testErr);
    const userResult = await getUser(usersRepo, 1);
    expect(userResult.isOk()).toBe(false);
    userResult.mapErr((err) => expect(err).toEqual(testErr));
    expect(usersRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });
});

describe('users service: addUser', () => {
  it('should invoke repo.save', async () => {
    (usersRepo.save as jest.Mock).mockResolvedValueOnce({});
    const addResult = await addUser(usersRepo, mockUsers[1]);
    expect(addResult.isOk()).toBe(true);
    addResult.map((value) => expect(value).toEqual({}));
    expect(usersRepo.save).toHaveBeenCalledWith(mockUsers[1]);
  });

  it('should invoke repo.save, return an error result', async () => {
    const testErr = new Error('badness');
    (usersRepo.save as jest.Mock).mockRejectedValueOnce(testErr);
    const addResult = await addUser(usersRepo, mockUsers[1]);
    expect(addResult.isOk()).toBe(false);
    addResult.mapErr((err) => expect(err).toEqual(testErr));
    expect(usersRepo.save).toHaveBeenCalledWith(mockUsers[1]);
  });
});

describe('users service: updateUser', () => {
  it('should invoke repo.upate', async () => {
    (usersRepo.update as jest.Mock).mockResolvedValueOnce({});
    const updateResult = await updateUser(usersRepo, 1, {first_name: 'jim'});
    expect(updateResult.isOk()).toBe(true);
    updateResult.map((value) => expect(value).toEqual({}));
    expect(usersRepo.update).toHaveBeenCalledWith(1, {first_name: 'jim'});
  });

  it('should invoke repo.update', async () => {
    const testErr = new Error('badness');
    (usersRepo.update as jest.Mock).mockRejectedValueOnce(testErr);
    const updateResult = await updateUser(usersRepo, 1, {first_name: 'jim'});
    expect(updateResult.isOk()).toBe(false);
    updateResult.mapErr((err) => expect(err).toEqual(testErr));
  });
});