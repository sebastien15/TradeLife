import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { Screen } from '@/components/layout/Screen';
import { useVpnStore } from '@/stores/vpnStore';
import { VPNServerSheet } from '@/components/shared/VPNServerSheet';
import {
  HomeNavBar,
  VPNCard,
  CallingCard,
  SampleTracking,
  ContainerETA,
  QuickActions,
  FABWidget,
  VPNDashboardSheet,
  RenewalSheet,
  TravelSheet,
} from '@/components/shared/home';
import type { VPNServer } from '@/types/domain.types';

// Mock servers data
const MOCK_SERVERS: VPNServer[] = [
  { id: '1', country: 'China', city: 'Shanghai', flagEmoji: '🇨🇳', latencyMs: 45, isRecommended: true },
  { id: '2', country: 'China', city: 'Guangzhou', flagEmoji: '🇨🇳', latencyMs: 52, isRecommended: false },
  { id: '3', country: 'China', city: 'Shenzhen', flagEmoji: '🇨🇳', latencyMs: 58, isRecommended: false },
  { id: '4', country: 'Singapore', city: 'Singapore', flagEmoji: '🇸🇬', latencyMs: 120, isRecommended: false },
  { id: '5', country: 'United Arab Emirates', city: 'Dubai', flagEmoji: '🇦🇪', latencyMs: 180, isRecommended: false },
  { id: '6', country: 'United States', city: 'Los Angeles', flagEmoji: '🇺🇸', latencyMs: 250, isRecommended: false },
];

export default function HomeScreen() {
  const vpn = useVpnStore();
  const [showVpnServerSheet, setShowVpnServerSheet] = useState(false);
  const [showVpnDashboard, setShowVpnDashboard] = useState(false);
  const [showRenewalSheet, setShowRenewalSheet] = useState(false);
  const [showFABSheet, setShowFABSheet] = useState(false);
  const [showTravelSheet, setShowTravelSheet] = useState(false);
  const [unreadNotifications] = useState(3);

  const handleVpnToggle = useCallback(async () => {
    if (!vpn.isConnected && !vpn.isConnecting) {
      if (!vpn.server) {
        setShowVpnServerSheet(true);
      } else {
        await vpn.connect(vpn.server);
      }
    }
  }, [vpn]);

  const handleServerSelect = useCallback(
    async (server: VPNServer) => {
      vpn.setServer(server);
      setShowVpnServerSheet(false);
      await vpn.connect(server);
    },
    [vpn]
  );

  const handleDisconnect = useCallback(() => {
    vpn.disconnect();
    setShowVpnDashboard(false);
  }, [vpn]);

  return (
    <View style={{ flex: 1 }}>
      <Screen scroll>
        <HomeNavBar
          onSearchPress={() => {}}
          onNotificationPress={() => {}}
          unreadCount={unreadNotifications}
        />

        <VPNCard
          onCardPress={() => setShowVpnDashboard(true)}
          onToggle={handleVpnToggle}
          onRenewPress={() => setShowRenewalSheet(true)}
        />

        <CallingCard onMakeCall={() => {}} />

        <SampleTracking />

        <ContainerETA />

        <QuickActions onTravelPress={() => setShowTravelSheet(true)} />

        <FABWidget
          onFABPress={() => setShowFABSheet(true)}
          fabSheetVisible={showFABSheet}
          onFABSheetClose={() => setShowFABSheet(false)}
        />
      </Screen>

      {/* Bottom sheets rendered outside ScrollView — required for gorhom v5 */}
      <VPNServerSheet
        visible={showVpnServerSheet}
        onClose={() => setShowVpnServerSheet(false)}
        onSelect={handleServerSelect}
        servers={MOCK_SERVERS}
      />

      <VPNDashboardSheet
        visible={showVpnDashboard}
        onClose={() => setShowVpnDashboard(false)}
        onDisconnect={handleDisconnect}
      />

      <RenewalSheet
        visible={showRenewalSheet}
        onClose={() => setShowRenewalSheet(false)}
      />

      <TravelSheet
        visible={showTravelSheet}
        onClose={() => setShowTravelSheet(false)}
      />
    </View>
  );
}
