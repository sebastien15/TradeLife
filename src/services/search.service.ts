import type { SearchResult } from '@/types/domain.types';

// Mock data for search
const MOCK_SHIPMENTS = [
  { id: 'SHP001', trackingNumber: 'TRK123456', origin: 'Guangzhou', destination: 'Kigali', status: 'in_transit' },
  { id: 'SHP002', trackingNumber: 'TRK234567', origin: 'Shanghai', destination: 'Kigali', status: 'delivered' },
  { id: 'SHP003', trackingNumber: 'TRK345678', origin: 'Shenzhen', destination: 'Kigali', status: 'pending' },
];

const MOCK_SAMPLES = [
  { id: 'SMP001', name: 'Solar Panel V3', status: 'pending' },
  { id: 'SMP002', name: 'LED High Bay', status: 'approved' },
  { id: 'SMP003', name: 'Smart Meter X', status: 'pending' },
];

const MOCK_TRANSACTIONS = [
  { id: 'TXN001', title: 'Payment to Supplier', reference: 'REF123', amount: 50000, currency: 'RWF' },
  { id: 'TXN002', title: 'Top Up', reference: 'REF234', amount: 100000, currency: 'RWF' },
  { id: 'TXN003', title: 'Wire Transfer', reference: 'REF345', amount: 75000, currency: 'RWF' },
];

const MOCK_CONTACTS = [
  { id: 'CNT001', name: 'Li Wei', phone: '+86 138 1234 5678', type: 'Supplier' },
  { id: 'CNT002', name: 'Zhang Ming', phone: '+86 139 2345 6789', type: 'Agent' },
  { id: 'CNT003', name: 'Wang Fang', phone: '+86 137 3456 7890', type: 'Supplier' },
];

export function searchAll(query: string): SearchResult[] {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const lowerQuery = query.toLowerCase();
  const results: SearchResult[] = [];

  // Search shipments
  MOCK_SHIPMENTS.forEach((shipment) => {
    if (
      shipment.trackingNumber.toLowerCase().includes(lowerQuery) ||
      shipment.origin.toLowerCase().includes(lowerQuery) ||
      shipment.destination.toLowerCase().includes(lowerQuery)
    ) {
      results.push({
        id: shipment.id,
        title: shipment.trackingNumber,
        subtitle: `${shipment.origin} → ${shipment.destination}`,
        category: 'shipments',
        metadata: shipment.status,
      });
    }
  });

  // Search samples
  MOCK_SAMPLES.forEach((sample) => {
    if (sample.name.toLowerCase().includes(lowerQuery)) {
      results.push({
        id: sample.id,
        title: sample.name,
        subtitle: 'Sample',
        category: 'samples',
        metadata: sample.status,
      });
    }
  });

  // Search transactions
  MOCK_TRANSACTIONS.forEach((txn) => {
    if (
      txn.title.toLowerCase().includes(lowerQuery) ||
      txn.reference.toLowerCase().includes(lowerQuery)
    ) {
      results.push({
        id: txn.id,
        title: txn.title,
        subtitle: txn.reference,
        category: 'transactions',
        metadata: `${txn.currency} ${txn.amount.toLocaleString()}`,
      });
    }
  });

  // Search contacts
  MOCK_CONTACTS.forEach((contact) => {
    if (
      contact.name.toLowerCase().includes(lowerQuery) ||
      contact.phone.includes(query)
    ) {
      results.push({
        id: contact.id,
        title: contact.name,
        subtitle: contact.phone,
        category: 'contacts',
        metadata: contact.type,
      });
    }
  });

  return results;
}
