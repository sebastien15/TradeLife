import { api } from './api';
import type { VPNServer } from '@/types/domain.types';

interface VpnStatusResponse {
  subscriptionActive: boolean;
  daysRemaining: number;
}

export const vpnService = {
  /** Get list of available VPN servers */
  getServers: () =>
    api.get<VPNServer[]>('/vpn/servers'),

  /** Get current subscription status */
  getStatus: () =>
    api.get<VpnStatusResponse>('/vpn/status'),
};
