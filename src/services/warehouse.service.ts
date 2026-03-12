import { api } from './api';
import type { WarehouseItemType, ShipmentType, DeclareItemPayload } from '@/types/domain.types';

export const warehouseService = {
  /** Get all items stored in the user's warehouse */
  getItems: () =>
    api.get<WarehouseItemType[]>('/warehouse/items'),

  /** Get a single warehouse item by ID */
  getItem: (id: string) =>
    api.get<WarehouseItemType>(`/warehouse/items/${id}`),

  /** Declare a new incoming item */
  declareItem: (payload: DeclareItemPayload) =>
    api.post<WarehouseItemType>('/warehouse/items', payload),

  /** Partially update an item (e.g. add notes, update status) */
  updateItem: (id: string, payload: Partial<WarehouseItemType>) =>
    api.patch<WarehouseItemType>(`/warehouse/items/${id}`, payload),

  /** Consolidate selected items into a single shipment */
  consolidate: (itemIds: string[]) =>
    api.post<ShipmentType>('/warehouse/consolidate', { itemIds }),
};
