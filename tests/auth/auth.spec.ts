import { test, expect } from '@playwright/test';
import { AuthAPI } from '../../src/api';
import {
  validCredentials,
  invalidCredentials,
  emptyCredentials,
  specialCharCredentials,
} from '../../src/fixtures';

test.describe('Authentication API @smoke @regression', () => {
  let authAPI: AuthAPI;

  test.beforeEach(async ({ request }) => {
    authAPI = new AuthAPI(request);
    AuthAPI.clearCache();
  });

  test.describe('Successful Authentication', () => {
    test('should return token with valid credentials', async () => {
      const { response, data } = await authAPI.createToken(validCredentials);

      expect(response.status()).toBe(200);
      expect(data.token).toBeDefined();
      expect(typeof data.token).toBe('string');
      expect(data.token.length).toBeGreaterThan(0);
    });

    test('should return consistent token format', async () => {
      const { data } = await authAPI.createToken(validCredentials);

      // Token should be alphanumeric
      expect(data.token).toMatch(/^[a-zA-Z0-9]+$/);
    });
  });

  test.describe('Failed Authentication', () => {
    test('should reject invalid credentials', async () => {
      const { response, data } = await authAPI.createToken(invalidCredentials);

      expect(response.status()).toBe(200); // API returns 200 with reason
      expect(data).not.toHaveProperty('token');
    });

    test('should reject empty credentials', async () => {
      const { response, data } = await authAPI.createToken(emptyCredentials);

      expect(response.status()).toBe(200);
      expect(data).not.toHaveProperty('token');
    });

    test('should handle SQL injection attempts safely', async () => {
      const { response, data } = await authAPI.createToken(specialCharCredentials);

      expect(response.status()).toBe(200);
      expect(data).not.toHaveProperty('token');
    });
  });

  test.describe('Token Caching', () => {
    test('should cache token after first request', async () => {
      const token1 = await authAPI.getAdminToken();
      const token2 = await authAPI.getAdminToken();

      expect(token1).toBe(token2);
    });

    test('should clear cache when requested', async () => {
      await authAPI.getAdminToken();
      AuthAPI.clearCache();
      
      // After clearing, should get a new token (may or may not be the same)
      const newToken = await authAPI.getAdminToken();
      expect(newToken).toBeDefined();
    });
  });

  test.describe('Auth Headers', () => {
    test('should return properly formatted auth headers', async () => {
      const headers = await authAPI.getAuthHeaders();

      expect(headers).toHaveProperty('Cookie');
      expect(headers.Cookie).toMatch(/^token=[a-zA-Z0-9]+$/);
    });
  });
});

