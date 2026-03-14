import type { Notification } from '@/types/domain.types';

// Helper to generate timestamps for the last 7 days
function getDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

// Mock notification data
export function fetchNotifications(): Notification[] {
  return [
    {
      id: 'NOT001',
      type: 'shipment_update',
      title: 'Shipment In Transit',
      body: 'Your shipment TRK123456 has left Guangzhou and is on its way to Kigali',
      timestamp: getDaysAgo(0),
      isRead: false,
      actionUrl: '/ship',
    },
    {
      id: 'NOT002',
      type: 'payment_success',
      title: 'Payment Successful',
      body: 'Your payment of RWF 50,000 to Li Wei was successful',
      timestamp: getDaysAgo(0),
      isRead: false,
      actionUrl: '/money',
    },
    {
      id: 'NOT003',
      type: 'warehouse_alert',
      title: 'Items Ready for Consolidation',
      body: 'You have 3 items ready to be consolidated and shipped',
      timestamp: getDaysAgo(1),
      isRead: false,
      actionUrl: '/ship/warehouse',
    },
    {
      id: 'NOT004',
      type: 'shipment_update',
      title: 'Shipment Delivered',
      body: 'Your shipment TRK234567 has been delivered to Kigali warehouse',
      timestamp: getDaysAgo(1),
      isRead: true,
      actionUrl: '/ship',
    },
    {
      id: 'NOT005',
      type: 'payment_failed',
      title: 'Payment Failed',
      body: 'Your payment to Zhang Ming failed due to insufficient funds',
      timestamp: getDaysAgo(2),
      isRead: false,
      actionUrl: '/money',
    },
    {
      id: 'NOT006',
      type: 'system',
      title: 'VPN Subscription Expiring Soon',
      body: 'Your VPN subscription expires in 5 days. Renew now to avoid interruption',
      timestamp: getDaysAgo(2),
      isRead: true,
      actionUrl: '/travel',
    },
    {
      id: 'NOT007',
      type: 'promotion',
      title: 'Special Offer: 10% Off Shipping',
      body: 'Get 10% off on all air freight bookings this week',
      timestamp: getDaysAgo(3),
      isRead: true,
      actionUrl: '/ship',
    },
    {
      id: 'NOT008',
      type: 'warehouse_alert',
      title: 'Sample Inspection Complete',
      body: 'Your sample "Solar Panel V3" has passed inspection',
      timestamp: getDaysAgo(3),
      isRead: true,
      actionUrl: '/ship',
    },
    {
      id: 'NOT009',
      type: 'payment_success',
      title: 'Top Up Successful',
      body: 'Your wallet has been topped up with RWF 100,000',
      timestamp: getDaysAgo(4),
      isRead: true,
      actionUrl: '/money',
    },
    {
      id: 'NOT010',
      type: 'shipment_update',
      title: 'Customs Clearance',
      body: 'Your shipment TRK345678 has cleared customs in Mombasa',
      timestamp: getDaysAgo(5),
      isRead: true,
      actionUrl: '/ship',
    },
    {
      id: 'NOT011',
      type: 'system',
      title: 'Security Alert',
      body: 'New login detected from a new device',
      timestamp: getDaysAgo(6),
      isRead: true,
      actionUrl: '/more/security',
    },
    {
      id: 'NOT012',
      type: 'promotion',
      title: 'New Feature: Live Translation',
      body: 'Chat with Chinese suppliers in real-time with our new translation feature',
      timestamp: getDaysAgo(7),
      isRead: true,
      actionUrl: '/more',
    },
  ];
}

export function markAsRead(id: string): Promise<void> {
  // Mock API call
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 100);
  });
}

export function deleteNotification(id: string): Promise<void> {
  // Mock API call
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 100);
  });
}
