import crypto from 'crypto';
import { createHashedPassword } from './passwords';

jest.mock('crypto', () => {
  return {
    __esModule: true,
    default: {
      randomBytes: jest.fn(),
      pbkdf2Sync: jest.fn(),
      toString: jest.fn(),
    },
  };
});

describe('createHashedPassword', () => {
  it('should hash a password', () => {
    (crypto.randomBytes as jest.Mock).mockImplementationOnce(() => {
      return { toString: jest.fn(() => 'test') };
    });
    (crypto.pbkdf2Sync as jest.Mock).mockImplementationOnce(() => 'whatever');
    const value = createHashedPassword('testpassword');
    expect(value).toBe('whatever');
  });
});
