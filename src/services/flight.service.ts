import { api } from './api';
import type { FlightSearchParams, FlightType, FlightBooking, SeatMap } from '@/types/domain.types';

export const flightService = {
  /** Search for flights based on search parameters */
  searchFlights: async (params: FlightSearchParams): Promise<FlightType[]> => {
    const response = await api.get<FlightType[]>('/flights/search', { params });
    return response.data;
  },

  /** Get detailed flight information including seat map */
  getFlightDetail: async (flightId: string): Promise<FlightType & { seatMap: SeatMap }> => {
    const response = await api.get<FlightType & { seatMap: SeatMap }>(`/flights/${flightId}`);
    return response.data;
  },

  /** Book a flight with passenger details and seat selection */
  bookFlight: async (payload: {
    flightId: string;
    seatNumber: string;
    passenger: { name: string; passportNumber: string };
  }): Promise<FlightBooking> => {
    const response = await api.post<FlightBooking>('/flights/book', payload);
    return response.data;
  },

  /** Get booking details by booking ID */
  getBooking: async (bookingId: string): Promise<FlightBooking> => {
    const response = await api.get<FlightBooking>(`/bookings/${bookingId}`);
    return response.data;
  },
};
