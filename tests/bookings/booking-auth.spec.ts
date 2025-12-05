import { test, expect } from '@playwright/test';
import { BookingAPI, AuthAPI } from '../../src/api';
import { createValidBooking } from '../../src/fixtures';

test.describe('Booking Authorization @security @regression', () => {
  let bookingAPI: BookingAPI;
  let createdBookingId: number;

  test.beforeEach(async ({ request }) => {
    bookingAPI = new BookingAPI(request);
    AuthAPI.clearCache();

    // Create a booking to test with
    const { data } = await bookingAPI.createBooking(createValidBooking());
    createdBookingId = data.bookingid;
  });

  test.afterEach(async () => {
    if (createdBookingId) {
      try {
        await bookingAPI.deleteBooking(createdBookingId);
      } catch {
        // Ignore
      }
    }
  });

  test.describe('Public Endpoints (No Auth Required)', () => {
    test('should get all bookings without auth', async ({ request }) => {
      const response = await request.get('/booking');
      expect(response.status()).toBe(200);
    });

    test('should get specific booking without auth', async ({ request }) => {
      const response = await request.get(`/booking/${createdBookingId}`);
      expect(response.status()).toBe(200);
    });

    test('should create booking without auth', async ({ request }) => {
      const response = await request.post('/booking', {
        data: createValidBooking(),
      });
      expect(response.status()).toBe(200);
      
      // Cleanup
      const data = await response.json();
      await bookingAPI.deleteBooking(data.bookingid);
    });
  });

  test.describe('Protected Endpoints (Auth Required)', () => {
    test('should reject PUT without auth token', async ({ request }) => {
      const response = await request.put(`/booking/${createdBookingId}`, {
        data: createValidBooking(),
      });
      
      expect(response.status()).toBe(403);
    });

    test('should reject PATCH without auth token', async ({ request }) => {
      const response = await request.patch(`/booking/${createdBookingId}`, {
        data: { firstname: 'Unauthorized' },
      });
      
      expect(response.status()).toBe(403);
    });

    test('should reject DELETE without auth token', async ({ request }) => {
      const response = await request.delete(`/booking/${createdBookingId}`);
      
      expect(response.status()).toBe(403);
    });

    test('should accept PUT with valid auth token', async () => {
      const { response } = await bookingAPI.updateBooking(
        createdBookingId,
        createValidBooking({ firstname: 'Authorized' })
      );

      expect(response.status()).toBe(200);
    });

    test('should accept PATCH with valid auth token', async () => {
      const { response } = await bookingAPI.partialUpdateBooking(
        createdBookingId,
        { firstname: 'PartialAuth' }
      );

      expect(response.status()).toBe(200);
    });

    test('should accept DELETE with valid auth token', async () => {
      const response = await bookingAPI.deleteBooking(createdBookingId);
      
      expect(response.status()).toBe(201);
      createdBookingId = 0; // Prevent afterEach cleanup
    });
  });

  test.describe('Invalid Token Handling', () => {
    test('should reject PUT with invalid token', async ({ request }) => {
      const response = await request.put(`/booking/${createdBookingId}`, {
        data: createValidBooking(),
        headers: {
          'Cookie': 'token=invalid_token_12345',
        },
      });
      
      expect(response.status()).toBe(403);
    });

    test('should reject with malformed cookie', async ({ request }) => {
      const response = await request.put(`/booking/${createdBookingId}`, {
        data: createValidBooking(),
        headers: {
          'Cookie': 'malformed_cookie_without_token',
        },
      });
      
      expect(response.status()).toBe(403);
    });
  });
});

