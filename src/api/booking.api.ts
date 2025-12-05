import { APIRequestContext } from '@playwright/test';
import { BaseAPI } from './base.api';
import { AuthAPI } from './auth.api';
import { Booking, BookingResponse, BookingId, PartialBookingUpdate } from '../types';

/**
 * Booking API service
 * Handles all booking-related CRUD operations
 */
export class BookingAPI extends BaseAPI {
  private authAPI: AuthAPI;

  constructor(request: APIRequestContext) {
    super(request);
    this.authAPI = new AuthAPI(request);
  }

  /**
   * Gets all booking IDs
   * @param filters - Optional filters (firstname, lastname, checkin, checkout)
   */
  async getAllBookingIds(filters?: {
    firstname?: string;
    lastname?: string;
    checkin?: string;
    checkout?: string;
  }) {
    return await this.get<BookingId[]>('/booking', { params: filters as Record<string, string> });
  }

  /**
   * Gets a specific booking by ID
   * @param bookingId - The booking ID
   */
  async getBooking(bookingId: number) {
    return await this.get<Booking>(`/booking/${bookingId}`);
  }

  /**
   * Creates a new booking
   * @param booking - The booking data
   */
  async createBooking(booking: Booking) {
    return await this.post<BookingResponse>('/booking', booking);
  }

  /**
   * Updates an existing booking (full update)
   * Requires authentication
   * @param bookingId - The booking ID
   * @param booking - The complete booking data
   */
  async updateBooking(bookingId: number, booking: Booking) {
    const authHeaders = await this.authAPI.getAuthHeaders();
    return await this.put<Booking>(`/booking/${bookingId}`, booking, {
      headers: authHeaders,
    });
  }

  /**
   * Partially updates a booking
   * Requires authentication
   * @param bookingId - The booking ID
   * @param partialBooking - The partial booking data
   */
  async partialUpdateBooking(bookingId: number, partialBooking: PartialBookingUpdate) {
    const authHeaders = await this.authAPI.getAuthHeaders();
    return await this.patch<Booking>(`/booking/${bookingId}`, partialBooking, {
      headers: authHeaders,
    });
  }

  /**
   * Deletes a booking
   * Requires authentication
   * @param bookingId - The booking ID
   */
  async deleteBooking(bookingId: number) {
    const authHeaders = await this.authAPI.getAuthHeaders();
    return await this.delete(`/booking/${bookingId}`, {
      headers: authHeaders,
    });
  }
}

