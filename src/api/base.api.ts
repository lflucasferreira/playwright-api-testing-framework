import { APIRequestContext, APIResponse } from '@playwright/test';

/**
 * Base API class providing common HTTP methods and utilities
 */
export abstract class BaseAPI {
  protected request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  /**
   * Performs a GET request
   */
  protected async get<T>(
    endpoint: string,
    options?: { headers?: Record<string, string>; params?: Record<string, string> }
  ): Promise<{ response: APIResponse; data: T }> {
    const response = await this.request.get(endpoint, {
      headers: options?.headers,
      params: options?.params,
    });
    const data = await this.parseResponse<T>(response);
    return { response, data };
  }

  /**
   * Performs a POST request
   */
  protected async post<T>(
    endpoint: string,
    body: unknown,
    options?: { headers?: Record<string, string> }
  ): Promise<{ response: APIResponse; data: T }> {
    const response = await this.request.post(endpoint, {
      data: body,
      headers: options?.headers,
    });
    const data = await this.parseResponse<T>(response);
    return { response, data };
  }

  /**
   * Performs a PUT request
   */
  protected async put<T>(
    endpoint: string,
    body: unknown,
    options?: { headers?: Record<string, string> }
  ): Promise<{ response: APIResponse; data: T }> {
    const response = await this.request.put(endpoint, {
      data: body,
      headers: options?.headers,
    });
    const data = await this.parseResponse<T>(response);
    return { response, data };
  }

  /**
   * Performs a PATCH request
   */
  protected async patch<T>(
    endpoint: string,
    body: unknown,
    options?: { headers?: Record<string, string> }
  ): Promise<{ response: APIResponse; data: T }> {
    const response = await this.request.patch(endpoint, {
      data: body,
      headers: options?.headers,
    });
    const data = await this.parseResponse<T>(response);
    return { response, data };
  }

  /**
   * Performs a DELETE request
   */
  protected async delete(
    endpoint: string,
    options?: { headers?: Record<string, string> }
  ): Promise<APIResponse> {
    return await this.request.delete(endpoint, {
      headers: options?.headers,
    });
  }

  /**
   * Parses response body as JSON
   */
  private async parseResponse<T>(response: APIResponse): Promise<T> {
    try {
      return await response.json() as T;
    } catch {
      return {} as T;
    }
  }
}

