// ─────────────────────────────────────────────────────────────────────────────
// TradeLife — Domain Types
// ─────────────────────────────────────────────────────────────────────────────

// ── Primitive enums ──────────────────────────────────────────────────────────

export type SupportedLanguage = 'en' | 'rw' | 'fr' | 'zh';

export type ShipmentStatus =
  | 'pending'
  | 'in_transit'
  | 'in_inspection'
  | 'ready'
  | 'delivered'
  | 'cancelled';

export type WarehouseStatus =
  | 'received'
  | 'in_inspection'
  | 'ready'
  | 'shipped'
  | 'returned';

export type TransactionType = 'send' | 'receive' | 'exchange' | 'fee' | 'refund';

export type TransactionStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

export type MembershipTier = 'free' | 'pro' | 'enterprise';

export type BusinessType = 'importer' | 'exporter' | 'both';

export type ShippingMethod = 'sea' | 'air' | 'express';

export type FlightClass = 'economy' | 'business';

export type VisaDocStatus = 'pending' | 'approved' | 'rejected';

export type SearchCategory = 'all' | 'shipments' | 'samples' | 'transactions' | 'contacts';

export type NotificationType =
  | 'shipment_update'
  | 'payment_success'
  | 'payment_failed'
  | 'warehouse_alert'
  | 'system'
  | 'promotion';

// ── Core entities (used by UI components) ───────────────────────────────────

/** Minimal shipment used in list views / ShipmentCard */
export interface ShipmentSummary {
  id: string;
  trackingNumber: string;
  status: ShipmentStatus;
  origin: string;
  destination: string;
  progress: number;
  eta: Date;
  carrier: string;
  imageUrl?: string;
}

/** Minimal warehouse item used in list views / WarehouseItemCard */
export interface WarehouseItem {
  id: string;
  name: string;
  sku: string;
  status: WarehouseStatus;
  qty: number;
  volume: number;
  imageUrl?: string;
}

/** Minimal transaction used in list views / TransactionRow */
export interface Transaction {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  currency: string;
  type: TransactionType;
  status: TransactionStatus;
  date: Date;
  iconUrl?: string;
}

export interface VPNServer {
  id: string;
  country: string;
  city: string;
  flagEmoji: string;
  latencyMs: number;
  isRecommended: boolean;
}

// ── Full domain types (used by stores / API) ─────────────────────────────────

export interface UserType {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  countryCode: string;
  businessType: BusinessType;
  avatar?: string;
  membershipTier: MembershipTier;
  createdAt: string; // ISO 8601
}

/** Full transaction record returned by API */
export interface TransactionRecord {
  id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  recipient?: string;
  method?: string;
  status: TransactionStatus;
  reference: string;
  createdAt: string; // ISO 8601
  fees: number;
}

export interface TrackingEvent {
  timestamp: string; // ISO 8601
  location: string;
  description: string;
  status: ShipmentStatus;
}

/** Full shipment record returned by API */
export interface ShipmentType {
  id: string;
  status: ShipmentStatus;
  route: {
    origin: string;
    destination: string;
  };
  method: ShippingMethod;
  weight: number;
  cbm: number;
  eta: string; // ISO 8601
  progress: number; // 0–1
  trackingEvents: TrackingEvent[];
  cost: number;
  documents: string[];
}

/** Full warehouse item record returned by API */
export interface WarehouseItemType {
  id: string;
  description: string;
  category: string;
  declaredQty: number;
  actualQty: number;
  weight: number;
  cbm: number;
  status: WarehouseStatus;
  supplier: string;
  arrivedAt: string; // ISO 8601
  photos: string[];
  storageDay: number;
  notes?: string;
  discrepancy?: string;
}

export interface QuoteType {
  id: string;
  method: ShippingMethod;
  carrier: string;
  price: number;
  currency: string;
  transitDays: number;
  eta: string; // ISO 8601
}

export interface AddressType {
  street: string;
  city: string;
  country: string;
  postalCode?: string;
}

export interface SupplierType {
  id: string;
  name: string;
  phone: string;
  wechat?: string;
  email?: string;
  address: AddressType;
  rating: number;
  tradeCount: number;
  avatarUrl?: string;
}

export interface FlightType {
  id: string;
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string; // ISO 8601
  arrivalTime: string; // ISO 8601
  price: number;
  currency: string;
  seats: number;
  class: FlightClass;
}

export interface VisaDocType {
  id: string;
  type: string;
  url: string;
  status: VisaDocStatus;
}

export interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  category: SearchCategory;
  iconUrl?: string;
  metadata?: string;
  actionUrl?: string;
}

export interface RecentSearch {
  id: string;
  query: string;
  timestamp: string; // ISO 8601
  category: SearchCategory;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  timestamp: string; // ISO 8601
  isRead: boolean;
  actionUrl?: string;
}

// ── Request payload types ────────────────────────────────────────────────────

export interface RegisterPayload {
  fullName: string;
  email: string;
  phone: string;
  countryCode: string;
  businessType: BusinessType;
  language: SupportedLanguage;
  /** Password included for mock/dev auth — ignored by real API */
  password?: string;
}

export interface SendPayload {
  recipientPhone: string;
  amount: number;
  currency: string;
  reference?: string;
  method?: string;
}

export interface TopUpPayload {
  amount: number;
  currency: string;
  method: string;
}

export interface QuoteRequestPayload {
  origin: string;
  destination: string;
  weight: number;
  cbm: number;
  method?: ShippingMethod;
}

export interface BookingPayload {
  origin: string;
  destination: string;
  weight: number;
  cbm: number;
  contactName: string;
  contactPhone: string;
}

export interface DeclareItemPayload {
  description: string;
  category: string;
  declaredQty: number;
  weight: number;
  cbm: number;
  supplier: string;
  notes?: string;
}
