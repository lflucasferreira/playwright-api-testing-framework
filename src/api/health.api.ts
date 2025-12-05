import { APIRequestContext } from '@playwright/test';
import { BaseAPI } from './base.api';

/**
 * Health Check API service
 * Used to verify API availability
 */
export class HealthAPI extends BaseAPI {
  constructor(request: APIRequestContext) {
    super(request);
  }

  /**
   * Performs a health check ping
   * @returns Response with status 201 if healthy
   */
  async ping() {
    const response = await this.request.get(`${this.baseURL}/ping`);
    return { response, data: await response.text() };
  }
}

