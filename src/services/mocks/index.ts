// ─────────────────────────────────────────────────────────────────────────────
// TradeLife — Mock Data
// All mock data is fully typed. Used when EXPO_PUBLIC_USE_MOCK=true.
// ─────────────────────────────────────────────────────────────────────────────
import type {
  UserType,
  TransactionRecord,
  ShipmentType,
  WarehouseItemType,
  QuoteType,
  VPNServer,
  SupplierType,
  TrackingEvent,
} from '@/types/domain.types';

// ── Mock User ─────────────────────────────────────────────────────────────────

export const mockUser: UserType = {
  id: 'u-001',
  fullName: 'Jean Baptiste Nkurunziza',
  email: 'jean@tradelife.rw',
  phone: '+250788123456',
  countryCode: 'RW',
  businessType: 'importer',
  membershipTier: 'pro',
  createdAt: '2024-01-15T08:00:00Z',
};

// ── Mock Transactions ─────────────────────────────────────────────────────────

export const mockTransactions: TransactionRecord[] = [
  {
    id: 'txn-001', type: 'send', amount: 5000, currency: 'CNY',
    recipient: 'Chen Wei', method: 'wechat',
    status: 'completed', reference: 'TL-REF-001',
    createdAt: '2024-03-15T10:30:00Z', fees: 12.5,
  },
  {
    id: 'txn-002', type: 'receive', amount: 500000, currency: 'RWF',
    recipient: 'Self', method: 'bank_transfer',
    status: 'completed', reference: 'TL-REF-002',
    createdAt: '2024-03-14T14:20:00Z', fees: 0,
  },
  {
    id: 'txn-003', type: 'exchange', amount: 3000, currency: 'CNY',
    method: 'wallet',
    status: 'completed', reference: 'TL-REF-003',
    createdAt: '2024-03-13T09:15:00Z', fees: 7.5,
  },
  {
    id: 'txn-004', type: 'send', amount: 2500, currency: 'CNY',
    recipient: 'Li Fang', method: 'alipay',
    status: 'pending', reference: 'TL-REF-004',
    createdAt: '2024-03-12T16:45:00Z', fees: 6.25,
  },
  {
    id: 'txn-005', type: 'fee', amount: 250, currency: 'RWF',
    method: 'system',
    status: 'completed', reference: 'TL-REF-005',
    createdAt: '2024-03-11T11:00:00Z', fees: 0,
  },
  {
    id: 'txn-006', type: 'send', amount: 1200, currency: 'CNY',
    recipient: 'Zhang Mei', method: 'wechat',
    status: 'failed', reference: 'TL-REF-006',
    createdAt: '2024-03-10T08:30:00Z', fees: 0,
  },
  {
    id: 'txn-007', type: 'receive', amount: 800000, currency: 'RWF',
    recipient: 'Self', method: 'mobile_money',
    status: 'completed', reference: 'TL-REF-007',
    createdAt: '2024-03-09T13:20:00Z', fees: 0,
  },
  {
    id: 'txn-008', type: 'exchange', amount: 10000, currency: 'CNY',
    method: 'wallet',
    status: 'processing', reference: 'TL-REF-008',
    createdAt: '2024-03-08T17:10:00Z', fees: 25,
  },
  {
    id: 'txn-009', type: 'refund', amount: 3000, currency: 'CNY',
    recipient: 'Self',
    status: 'completed', reference: 'TL-REF-009',
    createdAt: '2024-03-07T10:00:00Z', fees: 0,
  },
  {
    id: 'txn-010', type: 'send', amount: 7500, currency: 'CNY',
    recipient: 'Wang Hong', method: 'alipay',
    status: 'completed', reference: 'TL-REF-010',
    createdAt: '2024-03-06T15:30:00Z', fees: 18.75,
  },
];

// ── Mock Shipments ────────────────────────────────────────────────────────────

const shipmentEvents1: TrackingEvent[] = [
  { timestamp: '2024-03-01T08:00:00Z', location: 'Guangzhou, China', description: 'Shipment picked up', status: 'pending' },
  { timestamp: '2024-03-02T14:00:00Z', location: 'Guangzhou Port, China', description: 'Cleared customs export', status: 'in_transit' },
  { timestamp: '2024-03-05T10:00:00Z', location: 'Indian Ocean', description: 'In transit via sea', status: 'in_transit' },
  { timestamp: '2024-03-10T16:00:00Z', location: 'Mombasa Port, Kenya', description: 'Arrived at transit port', status: 'in_inspection' },
];

const shipmentEvents2: TrackingEvent[] = [
  { timestamp: '2024-02-20T09:00:00Z', location: 'Shenzhen, China', description: 'Shipment collected', status: 'pending' },
  { timestamp: '2024-02-22T11:00:00Z', location: 'Hong Kong Airport', description: 'Departed via air freight', status: 'in_transit' },
  { timestamp: '2024-02-23T06:00:00Z', location: 'Nairobi Airport, Kenya', description: 'Arrived at hub', status: 'in_transit' },
  { timestamp: '2024-02-24T09:00:00Z', location: 'Kigali Airport, Rwanda', description: 'Arrived at destination', status: 'ready' },
  { timestamp: '2024-02-25T14:00:00Z', location: 'Kigali, Rwanda', description: 'Delivered to customer', status: 'delivered' },
];

export const mockShipments: ShipmentType[] = [
  {
    id: 'sh-001',
    status: 'in_transit',
    route: { origin: 'Guangzhou, China', destination: 'Kigali, Rwanda' },
    method: 'sea',
    weight: 1250,
    cbm: 8.5,
    eta: '2024-04-15T00:00:00Z',
    progress: 0.65,
    trackingEvents: shipmentEvents1,
    cost: 2850000,
    documents: ['bill_of_lading.pdf', 'packing_list.pdf'],
  },
  {
    id: 'sh-002',
    status: 'delivered',
    route: { origin: 'Shenzhen, China', destination: 'Kigali, Rwanda' },
    method: 'air',
    weight: 85,
    cbm: 0.6,
    eta: '2024-02-25T00:00:00Z',
    progress: 1,
    trackingEvents: shipmentEvents2,
    cost: 480000,
    documents: ['airway_bill.pdf', 'commercial_invoice.pdf', 'packing_list.pdf'],
  },
  {
    id: 'sh-003',
    status: 'pending',
    route: { origin: 'Yiwu, China', destination: 'Kigali, Rwanda' },
    method: 'express',
    weight: 45,
    cbm: 0.3,
    eta: '2024-04-05T00:00:00Z',
    progress: 0.1,
    trackingEvents: [
      { timestamp: '2024-03-28T09:00:00Z', location: 'Yiwu, China', description: 'Order confirmed', status: 'pending' },
    ],
    cost: 220000,
    documents: [],
  },
];

// ── Mock Warehouse Items ──────────────────────────────────────────────────────

export const mockWarehouseItems: WarehouseItemType[] = [
  {
    id: 'wi-001',
    description: 'Cotton T-Shirts (XL)',
    category: 'Clothing',
    declaredQty: 200,
    actualQty: 198,
    weight: 45,
    cbm: 0.8,
    status: 'received',
    supplier: 'Guangzhou Fashion Co.',
    arrivedAt: '2024-03-10T08:00:00Z',
    photos: ['photo_001.jpg', 'photo_002.jpg'],
    storageDay: 12,
    discrepancy: '2 units missing from declared quantity',
  },
  {
    id: 'wi-002',
    description: 'Electronic Components',
    category: 'Electronics',
    declaredQty: 500,
    actualQty: 500,
    weight: 120,
    cbm: 1.2,
    status: 'in_inspection',
    supplier: 'Shenzhen Tech Parts Ltd.',
    arrivedAt: '2024-03-08T14:00:00Z',
    photos: ['photo_003.jpg'],
    storageDay: 14,
  },
  {
    id: 'wi-003',
    description: 'Ceramic Tiles (60x60)',
    category: 'Construction',
    declaredQty: 1000,
    actualQty: 1000,
    weight: 2400,
    cbm: 2.4,
    status: 'ready',
    supplier: 'Foshan Ceramics Factory',
    arrivedAt: '2024-03-05T10:00:00Z',
    photos: ['photo_004.jpg', 'photo_005.jpg', 'photo_006.jpg'],
    storageDay: 17,
  },
  {
    id: 'wi-004',
    description: 'Phone Accessories Bundle',
    category: 'Electronics',
    declaredQty: 300,
    actualQty: 300,
    weight: 30,
    cbm: 0.5,
    status: 'shipped',
    supplier: 'Dongguan Accessories Co.',
    arrivedAt: '2024-02-20T09:00:00Z',
    photos: ['photo_007.jpg'],
    storageDay: 30,
    notes: 'Express shipping requested',
  },
  {
    id: 'wi-005',
    description: 'Solar Panels (250W)',
    category: 'Energy',
    declaredQty: 20,
    actualQty: 20,
    weight: 400,
    cbm: 3.5,
    status: 'received',
    supplier: 'Yingli Solar Technologies',
    arrivedAt: '2024-03-12T11:00:00Z',
    photos: ['photo_008.jpg', 'photo_009.jpg'],
    storageDay: 10,
  },
];

// ── Mock Quotes ───────────────────────────────────────────────────────────────

export const mockQuotes: QuoteType[] = [
  {
    id: 'q-001',
    method: 'sea',
    carrier: 'COSCO Shipping',
    price: 2850000,
    currency: 'RWF',
    transitDays: 35,
    eta: '2024-05-15T00:00:00Z',
  },
  {
    id: 'q-002',
    method: 'air',
    carrier: 'Ethiopian Airlines Cargo',
    price: 5200000,
    currency: 'RWF',
    transitDays: 5,
    eta: '2024-04-10T00:00:00Z',
  },
  {
    id: 'q-003',
    method: 'express',
    carrier: 'DHL Express',
    price: 8900000,
    currency: 'RWF',
    transitDays: 3,
    eta: '2024-04-08T00:00:00Z',
  },
];

// ── Mock VPN Servers ──────────────────────────────────────────────────────────

export const mockVPNServers: VPNServer[] = [
  { id: 'vpn-rw', country: 'Rwanda', city: 'Kigali', flagEmoji: '🇷🇼', latencyMs: 12, isRecommended: true },
  { id: 'vpn-cn-1', country: 'China', city: 'Beijing', flagEmoji: '🇨🇳', latencyMs: 85, isRecommended: false },
  { id: 'vpn-cn-2', country: 'China', city: 'Shanghai', flagEmoji: '🇨🇳', latencyMs: 78, isRecommended: false },
  { id: 'vpn-ke', country: 'Kenya', city: 'Nairobi', flagEmoji: '🇰🇪', latencyMs: 35, isRecommended: false },
  { id: 'vpn-ae', country: 'UAE', city: 'Dubai', flagEmoji: '🇦🇪', latencyMs: 110, isRecommended: false },
];

// ── Mock Exchange Rates ───────────────────────────────────────────────────────

export const mockExchangeRates: Record<string, number> = {
  CNY_RWF: 198.45,
  USD_RWF: 1312.5,
  CNY_USD: 0.151,
  RWF_CNY: 0.00504,
  USD_CNY: 6.62,
  RWF_USD: 0.000762,
};

// ── Mock Suppliers ────────────────────────────────────────────────────────────

export const mockSuppliers: SupplierType[] = [
  {
    id: 'sup-001',
    name: 'Guangzhou Fashion Co.',
    phone: '+8613800138001',
    wechat: 'gzfashion_co',
    email: 'trade@gzfashion.cn',
    address: { street: '88 Textile Road', city: 'Guangzhou', country: 'China' },
    rating: 4.8,
    tradeCount: 24,
  },
  {
    id: 'sup-002',
    name: 'Shenzhen Tech Parts Ltd.',
    phone: '+8613800138002',
    wechat: 'sztech_parts',
    email: 'export@sztechparts.com',
    address: { street: '12 Innovation Ave', city: 'Shenzhen', country: 'China' },
    rating: 4.6,
    tradeCount: 18,
  },
  {
    id: 'sup-003',
    name: 'Foshan Ceramics Factory',
    phone: '+8613800138003',
    email: 'sales@foshanCeramics.cn',
    address: { street: '5 Industrial Zone', city: 'Foshan', country: 'China' },
    rating: 4.4,
    tradeCount: 9,
  },
  {
    id: 'sup-004',
    name: 'Yingli Solar Technologies',
    phone: '+8613800138004',
    wechat: 'yingli_solar',
    email: 'export@yinglisolar.com',
    address: { street: '99 Solar Blvd', city: 'Yingli', country: 'China' },
    rating: 4.9,
    tradeCount: 5,
  },
];

// ── Mock response router ──────────────────────────────────────────────────────

type MockEntry = [pattern: RegExp, response: unknown];

const MOCK_ROUTES: MockEntry[] = [
  [/\/auth\/login/,              { user: mockUser, token: 'mock-token-abc123' }],
  [/\/auth\/register/,           { user: mockUser, token: 'mock-token-abc123' }],
  [/\/auth\/otp/,                { expiresIn: 300 }],
  [/\/auth\/refresh/,            { token: 'mock-token-refreshed' }],
  [/\/wallet\/balance/,          { balance: 1250000, callBalance: 45 }],
  [/\/wallet\/transactions/,     mockTransactions],
  [/\/wallet\/send/,             mockTransactions[0]],
  [/\/wallet\/topup/,            mockTransactions[1]],
  [/\/wallet\/rate/,             { rate: 198.45, expiresAt: new Date(Date.now() + 30000).toISOString() }],
  [/\/exchange\/rates/,          mockExchangeRates],
  [/\/exchange\/rate/,           { rate: 198.45, expiresAt: new Date(Date.now() + 30000).toISOString() }],
  [/\/shipments\/quotes/,        mockQuotes],
  [/\/shipments\/book/,          mockShipments[0]],
  [/\/shipments\/[^/]+$/,        mockShipments[0]],
  [/\/shipments/,                mockShipments],
  [/\/warehouse\/consolidate/,   mockShipments[2]],
  [/\/warehouse\/items\/[^/]+$/, mockWarehouseItems[0]],
  [/\/warehouse\/items/,         mockWarehouseItems],
  [/\/vpn\/status/,              { subscriptionActive: true, daysRemaining: 28 }],
  [/\/vpn\/servers/,             mockVPNServers],
  [/\/call\/balance/,            { minutes: 45 }],
  [/\/call\/initiate/,           { sessionId: 'mock-session-xyz' }],
  [/\/call\/end/,                { success: true }],
];

export function getMockResponse(url: string, _method: string): unknown {
  for (const [pattern, response] of MOCK_ROUTES) {
    if (pattern.test(url)) return response;
  }
  return { message: 'Not found' };
}
