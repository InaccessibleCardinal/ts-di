import crypto from 'crypto';

export function createHashedPassword(plaintextPassword: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  return crypto
    .pbkdf2Sync(plaintextPassword, salt, 1000, 64, 'sha512')
    .toString('hex');
}
