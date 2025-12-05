import { test, expect } from '@playwright/test';
import { BookingAPI, AuthAPI } from '../../src/api';
import { createValidBooking, createMinimalBooking } from '../../src/fixtures';
import { 
  assertStatusCode, 
  assertValidBookingResponse, 
  assertBookingEquals 
} from '../../src/helpers';

test.describe('Booking CRUD Operations @regression', () => {
  let bookingAPI: BookingAPI;
  let createdBookingId: number;

  test.beforeEach(async ({ request }) => {
    bookingAPI = new BookingAPI(request);
  });

  test.afterEach(async () => {
    // Cleanup: Delete the booking if it was created
    if (createdBookingId) {
      try {
        await bookingAPI.deleteBooking(createdBookingId);
      } catch {
        // Ignore cleanup errors
      }
      createdBookingId = 0;
    }
  });

  test.describe('CREATE Booking', () => {
    test('should create a booking with all fields @smoke', async () => {
      const bookingData = createValidBooking();

      const { response, data } = await bookingAPI.createBooking(bookingData);
      createdBookingId = data.bookingid;

      assertStatusCode(response, 200);
      assertValidBookingResponse(data);
      assertBookingEquals(data.booking, bookingData);
    });

    test('should create a booking with minimum required fields', async () => {
      const bookingData = createMinimalBooking();

      const { response, data } = await bookingAPI.createBooking(bookingData);
      createdBookingId = data.bookingid;

      assertStatusCode(response, 200);
      expect(data.bookingid).toBeGreaterThan(0);
    });

    test('should generate unique booking IDs', async () => {
      const booking1 = createValidBooking({ firstname: 'Guest1' });
      const booking2 = createValidBooking({ firstname: 'Guest2' });

      const { data: data1 } = await bookingAPI.createBooking(booking1);
      const { data: data2 } = await bookingAPI.createBooking(booking2);

      // Cleanup
      await bookingAPI.deleteBooking(data1.bookingid);
      await bookingAPI.deleteBooking(data2.bookingid);

      expect(data1.bookingid).not.toBe(data2.bookingid);
    });
  });

  test.describe('READ Booking', () => {
    test('should get all booking IDs @smoke', async () => {
      const { response, data } = await bookingAPI.getAllBookingIds();

      assertStatusCode(response, 200);
      expect(Array.isArray(data)).toBeTruthy();
    });

    test('should get a specific booking by ID', async () => {
      // First create a booking
      const bookingData = createValidBooking();
      const { data: created } = await bookingAPI.createBooking(bookingData);
      createdBookingId = created.bookingid;

      // Then retrieve it
      const { response, data } = await bookingAPI.getBooking(createdBookingId);

      assertStatusCode(response, 200);
      assertBookingEquals(data, bookingData);
    });

    test('should return 404 for non-existent booking', async () => {
      const { response } = await bookingAPI.getBooking(999999999);

      expect(response.status()).toBe(404);
    });

    test('should filter bookings by firstname', async () => {
      const uniqueName = `TestUser${Date.now()}`;
      const bookingData = createValidBooking({ firstname: uniqueName });
      const { data: created } = await bookingAPI.createBooking(bookingData);
      createdBookingId = created.bookingid;

      const { data: filtered } = await bookingAPI.getAllBookingIds({ firstname: uniqueName });

      expect(filtered.some(b => b.bookingid === createdBookingId)).toBeTruthy();
    });

    test('should filter bookings by lastname', async () => {
      const uniqueName = `TestLast${Date.now()}`;
      const bookingData = createValidBooking({ lastname: uniqueName });
      const { data: created } = await bookingAPI.createBooking(bookingData);
      createdBookingId = created.bookingid;

      const { data: filtered } = await bookingAPI.getAllBookingIds({ lastname: uniqueName });

      expect(filtered.some(b => b.bookingid === createdBookingId)).toBeTruthy();
    });
  });

  test.describe('UPDATE Booking', () => {
    test('should update a booking with PUT', async () => {
      // Create initial booking
      const initialData = createValidBooking({ firstname: 'Initial' });
      const { data: created } = await bookingAPI.createBooking(initialData);
      createdBookingId = created.bookingid;

      // Update with new data
      const updatedData = createValidBooking({ 
        firstname: 'Updated',
        lastname: 'Customer',
        totalprice: 999,
      });

      const { response, data } = await bookingAPI.updateBooking(createdBookingId, updatedData);

      assertStatusCode(response, 200);
      expect(data.firstname).toBe('Updated');
      expect(data.lastname).toBe('Customer');
      expect(data.totalprice).toBe(999);
    });

    test('should partially update a booking with PATCH', async () => {
      // Create initial booking
      const initialData = createValidBooking({ firstname: 'Original', totalprice: 100 });
      const { data: created } = await bookingAPI.createBooking(initialData);
      createdBookingId = created.bookingid;

      // Partial update
      const { response, data } = await bookingAPI.partialUpdateBooking(createdBookingId, {
        firstname: 'Patched',
      });

      assertStatusCode(response, 200);
      expect(data.firstname).toBe('Patched');
      expect(data.totalprice).toBe(100); // Should remain unchanged
    });
  });

  test.describe('DELETE Booking', () => {
    test('should delete an existing booking', async () => {
      // Create a booking to delete
      const bookingData = createValidBooking();
      const { data: created } = await bookingAPI.createBooking(bookingData);
      const bookingId = created.bookingid;

      // Delete it
      const response = await bookingAPI.deleteBooking(bookingId);
      expect(response.status()).toBe(201);

      // Verify it's deleted
      const { response: getResponse } = await bookingAPI.getBooking(bookingId);
      expect(getResponse.status()).toBe(404);

      // Don't try to clean up in afterEach
      createdBookingId = 0;
    });
  });
});

