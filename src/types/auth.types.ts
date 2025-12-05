/**
 * Authentication-related type definitions
 */

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface AuthToken {
  token: string;
}

export interface AuthError {
  reason: string;
}

