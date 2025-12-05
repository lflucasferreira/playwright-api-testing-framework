import { AuthCredentials } from '../types';

/**
 * Authentication test fixtures
 */

export const validCredentials: AuthCredentials = {
  username: 'admin',
  password: 'password123',
};

export const invalidCredentials: AuthCredentials = {
  username: 'invalid_user',
  password: 'wrong_password',
};

export const emptyCredentials: AuthCredentials = {
  username: '',
  password: '',
};

export const partialCredentials = {
  usernameOnly: { username: 'admin' },
  passwordOnly: { password: 'password123' },
};

export const specialCharCredentials: AuthCredentials = {
  username: "admin'--",
  password: "' OR '1'='1",
};

export const longCredentials: AuthCredentials = {
  username: 'a'.repeat(1000),
  password: 'b'.repeat(1000),
};

