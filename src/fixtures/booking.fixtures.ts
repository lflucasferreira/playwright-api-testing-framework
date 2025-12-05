import { Booking } from '../types';

/**
 * Factory functions for creating test booking data
 */

/**
 * Creates a valid booking with optional overrides
 */
export function createValidBooking(overrides?: Partial<Booking>): Booking {
  const today = new Date();
  const checkIn = new Date(today);
  checkIn.setDate(today.getDate() + 7);
  const checkOut = new Date(checkIn);
  checkOut.setDate(checkIn.getDate() + 3);

  return {
    firstname: 'John',
    lastname: 'Doe',
    totalprice: 150,
    depositpaid: true,
    bookingdates: {
      checkin: formatDate(checkIn),
      checkout: formatDate(checkOut),
    },
    additionalneeds: 'Breakfast',
    ...overrides,
  };
}

/**
 * Creates a booking with minimum required fields
 */
export function createMinimalBooking(): Booking {
  return {
    firstname: 'Jane',
    lastname: 'Smith',
    totalprice: 100,
    depositpaid: false,
    bookingdates: {
      checkin: '2024-01-01',
      checkout: '2024-01-05',
    },
  };
}

/**
 * Creates a booking with special characters in names
 */
export function createBookingWithSpecialChars(): Booking {
  return createValidBooking({
    firstname: "María José",
    lastname: "O'Connor-Smith",
    additionalneeds: "Café & Croissant",
  });
}

/**
 * Creates a booking with maximum values
 */
export function createBookingWithMaxValues(): Booking {
  return createValidBooking({
    firstname: 'A'.repeat(50),
    lastname: 'B'.repeat(50),
    totalprice: 999999,
    additionalneeds: 'Special request: '.repeat(20),
  });
}

/**
 * Creates multiple bookings for batch testing
 */
export function createMultipleBookings(count: number): Booking[] {
  return Array.from({ length: count }, (_, index) =>
    createValidBooking({
      firstname: `Guest${index + 1}`,
      lastname: `Test${index + 1}`,
      totalprice: 100 + index * 50,
    })
  );
}

/**
 * Creates booking data for different scenarios
 */
export const bookingScenarios = {
  businessTrip: createValidBooking({
    additionalneeds: 'Late checkout, WiFi, Parking',
    totalprice: 350,
  }),
  familyVacation: createValidBooking({
    additionalneeds: 'Extra bed, Crib, Breakfast for 4',
    totalprice: 500,
    depositpaid: true,
  }),
  lastMinute: createValidBooking({
    bookingdates: {
      checkin: formatDate(new Date()),
      checkout: formatDate(addDays(new Date(), 1)),
    },
    totalprice: 200,
  }),
  longStay: createValidBooking({
    bookingdates: {
      checkin: formatDate(addDays(new Date(), 7)),
      checkout: formatDate(addDays(new Date(), 37)),
    },
    totalprice: 3000,
    additionalneeds: 'Monthly cleaning, Kitchen access',
  }),
};

// Helper functions
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

