import { expect, APIResponse } from '@playwright/test';
import { Booking, BookingResponse } from '../types';

/**
 * Custom assertion helpers for API testing
 */

/**
 * Asserts that a response has a specific status code
 */
export function assertStatusCode(response: APIResponse, expectedStatus: number): void {
  expect(response.status(), `Expected status ${expectedStatus} but got ${response.status()}`).toBe(expectedStatus);
}

/**
 * Asserts that a response is successful (2xx)
 */
export function assertSuccessResponse(response: APIResponse): void {
  expect(response.ok(), `Expected success response but got ${response.status()}`).toBeTruthy();
}

/**
 * Asserts that a response indicates client error (4xx)
 */
export function assertClientError(response: APIResponse): void {
  const status = response.status();
  expect(status >= 400 && status < 500, `Expected client error (4xx) but got ${status}`).toBeTruthy();
}

/**
 * Asserts that a booking matches expected data
 */
export function assertBookingEquals(actual: Booking, expected: Booking): void {
  expect(actual.firstname).toBe(expected.firstname);
  expect(actual.lastname).toBe(expected.lastname);
  expect(actual.totalprice).toBe(expected.totalprice);
  expect(actual.depositpaid).toBe(expected.depositpaid);
  expect(actual.bookingdates.checkin).toBe(expected.bookingdates.checkin);
  expect(actual.bookingdates.checkout).toBe(expected.bookingdates.checkout);
  
  if (expected.additionalneeds) {
    expect(actual.additionalneeds).toBe(expected.additionalneeds);
  }
}

/**
 * Asserts that a booking response has valid structure
 */
export function assertValidBookingResponse(response: BookingResponse): void {
  expect(response.bookingid).toBeDefined();
  expect(typeof response.bookingid).toBe('number');
  expect(response.bookingid).toBeGreaterThan(0);
  expect(response.booking).toBeDefined();
  assertValidBookingStructure(response.booking);
}

/**
 * Asserts that a booking has valid structure
 */
export function assertValidBookingStructure(booking: Booking): void {
  expect(booking.firstname).toBeDefined();
  expect(booking.lastname).toBeDefined();
  expect(booking.totalprice).toBeDefined();
  expect(typeof booking.totalprice).toBe('number');
  expect(booking.depositpaid).toBeDefined();
  expect(typeof booking.depositpaid).toBe('boolean');
  expect(booking.bookingdates).toBeDefined();
  expect(booking.bookingdates.checkin).toBeDefined();
  expect(booking.bookingdates.checkout).toBeDefined();
}

/**
 * Asserts response time is within threshold
 */
export async function assertResponseTime(
  response: APIResponse,
  maxTimeMs: number
): Promise<void> {
  const timing = response.headers()['x-response-time'];
  if (timing) {
    const timeMs = parseInt(timing);
    expect(timeMs, `Response time ${timeMs}ms exceeded ${maxTimeMs}ms`).toBeLessThan(maxTimeMs);
  }
}

/**
 * Asserts that response headers contain expected values
 */
export function assertHeaders(
  response: APIResponse,
  expectedHeaders: Record<string, string>
): void {
  const headers = response.headers();
  for (const [key, value] of Object.entries(expectedHeaders)) {
    expect(headers[key.toLowerCase()], `Header ${key} should be ${value}`).toBe(value);
  }
}

