import { api } from './api';
import type { ShipmentType, QuoteType, QuoteRequestPayload, BookingPayload } from '@/types/domain.types';

export const shipmentService = {
  /** Get all shipments for the current user */
  getShipments: () =>
    api.get<ShipmentType[]>('/shipments'),

  /** Get a single shipment by ID */
  getShipment: (id: string) =>
    api.get<ShipmentType>(`/shipments/${id}`),

  /** Request freight quotes for cargo dimensions */
  getQuotes: (payload: QuoteRequestPayload) =>
    api.post<QuoteType[]>('/shipments/quotes', payload),

  /** Book a shipment with a selected quote */
  bookShipment: (quoteId: string, payload: BookingPayload) =>
    api.post<ShipmentType>('/shipments/book', { quoteId, ...payload }),
};
