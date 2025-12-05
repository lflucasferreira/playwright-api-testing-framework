import { APIRequestContext } from '@playwright/test';
import { BaseAPI } from './base.api';
import { AuthCredentials, AuthToken } from '../types';

/**
 * Authentication API service
 * Handles token generation and authentication flows
 */
export class AuthAPI extends BaseAPI {
  private static cachedToken: string | null = null;

  constructor(request: APIRequestContext) {
    super(request);
  }

  /**
   * Creates an authentication token
   * @param credentials - Username and password
   * @returns Authentication token response
   */
  async createToken(credentials: AuthCredentials) {
    const result = await this.post<AuthToken>('/auth', credentials);
    
    if (result.data.token) {
      AuthAPI.cachedToken = result.data.token;
    }
    
    return result;
  }

  /**
   * Creates token with default admin credentials
   * Uses cached token if available with retry logic
   */
  async getAdminToken(retries = 3): Promise<string> {
    if (AuthAPI.cachedToken) {
      return AuthAPI.cachedToken;
    }

    const credentials: AuthCredentials = {
      username: process.env.API_USERNAME || 'admin',
      password: process.env.API_PASSWORD || 'password123',
    };

    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const { data } = await this.createToken(credentials);
        
        // Check if token was cached by createToken or present in response
        if (AuthAPI.cachedToken) {
          return AuthAPI.cachedToken;
        }
        
        if (data.token) {
          AuthAPI.cachedToken = data.token;
          return data.token;
        }
        
        // If no token, wait before retrying
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, 500 * attempt));
        }
      } catch (error) {
        lastError = error as Error;
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, 500 * attempt));
        }
      }
    }

    throw lastError || new Error('Failed to obtain authentication token after retries');
  }

  /**
   * Returns headers with authentication cookie
   */
  async getAuthHeaders(): Promise<Record<string, string>> {
    const token = await this.getAdminToken();
    return {
      'Cookie': `token=${token}`,
    };
  }

  /**
   * Clears the cached token
   */
  static clearCache(): void {
    AuthAPI.cachedToken = null;
  }
}

