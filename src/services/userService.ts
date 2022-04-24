import { err, ok } from 'neverthrow';
import { Repository } from 'typeorm';
import { User } from '../entity/User';

export async function getUsers(usersRepo: Repository<User>) {
  try {
    const users = await usersRepo.find();
    return ok(users);
  } catch (e) {
    return err(e);
  }
}

export async function getUser(usersRepo: Repository<User>, id: number) {
  try {
    const user = await usersRepo.findOneBy({ id });
    return ok(user);
  } catch (e) {
    return err(e);
  }
}

export async function addUser(usersRepo: Repository<User>, user: User) {
  try {
    const response = await usersRepo.save(user);
    return ok(response);
  } catch (e) {
    return err(e);
  }
}
