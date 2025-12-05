import { test, expect } from '@playwright/test';
import { BookingAPI } from '../../src/api';
import { 
  createValidBooking, 
  createBookingWithSpecialChars,
  createBookingWithMaxValues,
  bookingScenarios,
} from '../../src/fixtures';
import { assertStatusCode, assertValidBookingResponse } from '../../src/helpers';

test.describe('Booking Validation @regression', () => {
  let bookingAPI: BookingAPI;
  const createdBookingIds: number[] = [];

  test.beforeEach(async ({ request }) => {
    bookingAPI = new BookingAPI(request);
  });

  test.afterAll(async ({ request }) => {
    // Cleanup all created bookings
    const api = new BookingAPI(request);
    for (const id of createdBookingIds) {
      try {
        await api.deleteBooking(id);
      } catch {
        // Ignore cleanup errors
      }
    }
  });

  test.describe('Data Type Validation', () => {
    test('should accept string values for names', async () => {
      const booking = createValidBooking();
      const { response, data } = await bookingAPI.createBooking(booking);
      createdBookingIds.push(data.bookingid);

      assertStatusCode(response, 200);
      expect(typeof data.booking.firstname).toBe('string');
      expect(typeof data.booking.lastname).toBe('string');
    });

    test('should accept numeric values for price', async () => {
      const booking = createValidBooking({ totalprice: 250.50 });
      const { response, data } = await bookingAPI.createBooking(booking);
      createdBookingIds.push(data.bookingid);

      assertStatusCode(response, 200);
      expect(typeof data.booking.totalprice).toBe('number');
    });

    test('should accept boolean for depositpaid', async () => {
      const booking = createValidBooking({ depositpaid: true });
      const { response, data } = await bookingAPI.createBooking(booking);
      createdBookingIds.push(data.bookingid);

      assertStatusCode(response, 200);
      expect(typeof data.booking.depositpaid).toBe('boolean');
    });
  });

  test.describe('Special Characters Handling', () => {
    test('should handle special characters in names', async () => {
      const booking = createBookingWithSpecialChars();
      const { response, data } = await bookingAPI.createBooking(booking);
      createdBookingIds.push(data.bookingid);

      assertStatusCode(response, 200);
      assertValidBookingResponse(data);
    });

    test('should handle unicode characters', async () => {
      const booking = createValidBooking({
        firstname: '田中',
        lastname: '太郎',
        additionalneeds: 'Café, Müsli, Naïve',
      });
      const { response, data } = await bookingAPI.createBooking(booking);
      createdBookingIds.push(data.bookingid);

      assertStatusCode(response, 200);
    });
  });

  test.describe('Boundary Testing', () => {
    test('should handle maximum length values', async () => {
      const booking = createBookingWithMaxValues();
      const { response, data } = await bookingAPI.createBooking(booking);
      createdBookingIds.push(data.bookingid);

      assertStatusCode(response, 200);
    });

    test('should handle zero price', async () => {
      const booking = createValidBooking({ totalprice: 0 });
      const { response, data } = await bookingAPI.createBooking(booking);
      createdBookingIds.push(data.bookingid);

      assertStatusCode(response, 200);
      expect(data.booking.totalprice).toBe(0);
    });

    test('should handle negative price', async () => {
      const booking = createValidBooking({ totalprice: -100 });
      const { response, data } = await bookingAPI.createBooking(booking);
      
      // API might accept or reject - we're testing the behavior
      if (response.ok()) {
        createdBookingIds.push(data.bookingid);
      }
    });
  });

  test.describe('Date Validation', () => {
    test('should accept valid date format', async () => {
      const booking = createValidBooking({
        bookingdates: {
          checkin: '2024-06-15',
          checkout: '2024-06-20',
        },
      });
      const { response, data } = await bookingAPI.createBooking(booking);
      createdBookingIds.push(data.bookingid);

      assertStatusCode(response, 200);
    });

    test('should handle checkout before checkin', async () => {
      const booking = createValidBooking({
        bookingdates: {
          checkin: '2024-06-20',
          checkout: '2024-06-15', // Before checkin
        },
      });
      const { response, data } = await bookingAPI.createBooking(booking);
      
      // API might accept this - testing behavior
      if (response.ok()) {
        createdBookingIds.push(data.bookingid);
      }
    });

    test('should handle same day checkin and checkout', async () => {
      const booking = createValidBooking({
        bookingdates: {
          checkin: '2024-06-15',
          checkout: '2024-06-15',
        },
      });
      const { response, data } = await bookingAPI.createBooking(booking);
      createdBookingIds.push(data.bookingid);

      assertStatusCode(response, 200);
    });
  });

  test.describe('Business Scenarios', () => {
    test('should create business trip booking', async () => {
      const { response, data } = await bookingAPI.createBooking(bookingScenarios.businessTrip);
      createdBookingIds.push(data.bookingid);

      assertStatusCode(response, 200);
      assertValidBookingResponse(data);
    });

    test('should create family vacation booking', async () => {
      const { response, data } = await bookingAPI.createBooking(bookingScenarios.familyVacation);
      createdBookingIds.push(data.bookingid);

      assertStatusCode(response, 200);
    });

    test('should create long stay booking', async () => {
      const { response, data } = await bookingAPI.createBooking(bookingScenarios.longStay);
      createdBookingIds.push(data.bookingid);

      assertStatusCode(response, 200);
    });
  });
});

