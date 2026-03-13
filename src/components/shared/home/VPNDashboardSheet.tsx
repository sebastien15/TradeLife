import React, { useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import GorhomBottomSheet from '@gorhom/bottom-sheet';
import { BottomSheet } from '@/components/layout/BottomSheet';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';
import { useVpnStore } from '@/stores/vpnStore';
import { Typography } from '@/constants/typography';
import { Spacing } from '@/constants/spacing';
import { t } from '@/i18n';

interface VPNDashboardSheetProps {
  visible: boolean;
  onClose: () => void;
  onDisconnect: () => void;
}

export function VPNDashboardSheet({ visible, onClose, onDisconnect }: VPNDashboardSheetProps) {
  const theme = useTheme();
  const vpn = useVpnStore();
  const sheetRef = useRef<GorhomBottomSheet>(null);

  console.log('🔷 VPNDashboardSheet render - visible:', visible);

  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + vpn.daysRemaining);
  const formattedExpiry = expiryDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const stats = [
    { label: t('home.dataUsed'), value: '2.4 GB' },
    { label: t('home.timeConnected'), value: '4h 32m' },
    { label: t('home.speed'), value: '45 Mbps' },
  ];

  if (!visible) return null;

  return (
    <BottomSheet
      ref={sheetRef}
      snapPoints={['75%']}
      index={0}
      onClose={onClose}
      enablePanDownToClose={true}
      enableDynamicSizing={false}
    >
      <View style={{ flex: 1, paddingHorizontal: Spacing.md, gap: Spacing.lg }}>
        <Text style={{ ...Typography.h3, color: theme.textPrimary, textAlign: 'center' }}>
          {t('home.vpnDashboard')}
        </Text>

        {/* Stats Grid */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.sm }}>
          {stats.map((stat) => (
            <Card key={stat.label} radius="md" padding="md" style={{ flex: 1 }}>
              <Text style={{ ...Typography.caption, color: theme.textSecondary, textAlign: 'center' }}>
                {stat.label}
              </Text>
              <Text
                style={{
                  ...Typography.h3,
                  color: theme.textPrimary,
                  textAlign: 'center',
                  marginTop: Spacing.xs,
                }}
              >
                {stat.value}
              </Text>
            </Card>
          ))}
        </View>

        {/* Server Info */}
        <Card radius="lg" padding="lg">
          <Text style={{ ...Typography.label, color: theme.textSecondary, marginBottom: Spacing.sm }}>
            {t('home.serverInfo')}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
            <Text style={{ fontSize: 32 }}>{vpn.server?.flagEmoji || '🌍'}</Text>
            <View>
              <Text style={{ ...Typography.bodyMedium, color: theme.textPrimary }}>
                {vpn.server?.country || 'Unknown'}
              </Text>
              <Text style={{ ...Typography.caption, color: theme.textSecondary }}>
                {vpn.server?.city || ''} • {vpn.server?.latencyMs || 0}ms
              </Text>
            </View>
          </View>
        </Card>

        {/* Subscription Info */}
        <Card radius="lg" padding="lg">
          <Text style={{ ...Typography.label, color: theme.textSecondary, marginBottom: Spacing.sm }}>
            Subscription Status
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ ...Typography.bodyMedium, color: theme.textPrimary }}>
                {vpn.daysRemaining} days remaining
              </Text>
              <Text style={{ ...Typography.caption, color: theme.textSecondary }}>
                Expires on {formattedExpiry}
              </Text>
            </View>
            <View style={{
              paddingHorizontal: Spacing.md,
              paddingVertical: Spacing.xs,
              backgroundColor: vpn.daysRemaining > 7 ? theme.successBg : theme.warningBg,
              borderRadius: 12
            }}>
              <Text style={{
                ...Typography.caption,
                color: vpn.daysRemaining > 7 ? theme.success : theme.warning,
                fontWeight: '600'
              }}>
                {vpn.subscriptionActive ? 'Active' : 'Expired'}
              </Text>
            </View>
          </View>
        </Card>

        {/* Disconnect Button */}
        <Button
          variant="danger"
          size="lg"
          fullWidth
          onPress={() => {
            onDisconnect();
            onClose();
          }}
        >
          {t('travel.disconnect')}
        </Button>
      </View>
    </BottomSheet>
  );
}
