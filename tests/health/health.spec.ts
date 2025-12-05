import { test, expect } from '@playwright/test';
import { HealthAPI } from '../../src/api';

test.describe('Health Check API @smoke', () => {
  let healthAPI: HealthAPI;

  test.beforeEach(async ({ request }) => {
    healthAPI = new HealthAPI(request);
  });

  test('should return 201 when API is healthy', async () => {
    const { response } = await healthAPI.ping();

    expect(response.status()).toBe(201);
  });

  test('should respond within acceptable time', async () => {
    const startTime = Date.now();
    const { response } = await healthAPI.ping();
    const duration = Date.now() - startTime;

    expect(response.ok()).toBeTruthy();
    expect(duration).toBeLessThan(5000); // 5 seconds max
  });
});

