// ─────────────────────────────────────────────────────────────────────────────
// TradeLife — Notification Settings
// Design: 8f_notification_settings_dark
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@/hooks/useTheme';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { Screen } from '@/components/layout/Screen';
import { SettingsRow } from '@/components/shared/more/SettingsRow';
import { useAppRouter } from '@/hooks/useAppRouter';

// ── Section Wrapper ────────────────────────────────────────────────────────────
interface SectionProps {
  label: string;
  delay: number;
  children: React.ReactNode;
}

function Section({ label, delay, children }: SectionProps) {
  const theme = useTheme();
  return (
    <Animated.View entering={FadeInDown.duration(400).delay(delay)} style={{ marginTop: Spacing.lg }}>
      <Text
        style={{
          ...Typography.sectionLabel,
          paddingHorizontal: Spacing.md,
          paddingBottom: Spacing.xs,
          color: Colors.primary,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Text>
      <View
        style={{
          backgroundColor: theme.surface,
          borderRadius: 14,
          overflow: 'hidden',
          marginHorizontal: Spacing.md,
        }}
      >
        {children}
      </View>
    </Animated.View>
  );
}

// ── Main Screen ────────────────────────────────────────────────────────────────
export default function NotificationsScreen() {
  const theme = useTheme();
  const router = useAppRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const backScale = useSharedValue(1);

  const [toggles, setToggles] = useState({
    paymentSent: true,
    paymentReceived: true,
    lowBalance: true,
    shipmentUpdate: true,
    deliveryArrival: true,
    warehouseAlerts: false,
    promos: false,
    newsletter: false,
    appUpdates: true,
    securityAlerts: true,
  });

  const set = (key: keyof typeof toggles) => (val: boolean) =>
    setToggles(prev => ({ ...prev, [key]: val }));

  const backAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: backScale.value }],
  }));

  return (
    <Screen edges={['left', 'right']} backgroundColor={theme.background} scroll>

      {/* ── Header ── */}
      <View
        style={{
          paddingTop: insets.top + Spacing.sm,
          paddingBottom: Spacing.sm,
          paddingHorizontal: Spacing.md,
          flexDirection: 'row',
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: theme.divider,
          backgroundColor: theme.background,
        }}
      >
        <Animated.View style={backAnimStyle}>
          <TouchableOpacity
            onPress={router.back}
            onPressIn={() => { backScale.value = withSpring(0.9); }}
            onPressOut={() => { backScale.value = withSpring(1); }}
            activeOpacity={0.7}
            style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginLeft: -8 }}
          >
            <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
        </Animated.View>
        <Text style={{ flex: 1, textAlign: 'center', ...Typography.h3, color: theme.textPrimary, paddingRight: 32 }}>
          {t('notifications.title')}
        </Text>
      </View>

      {/* ── PAYMENTS ── */}
      <Section label={t('notifications.sectionPayments')} delay={80}>
        <SettingsRow
          icon="send"
          title={t('notifications.paymentSent')}
          subtitle={t('notifications.paymentSentSub')}
          toggleValue={toggles.paymentSent}
          onToggle={set('paymentSent')}
        />
        <SettingsRow
          icon="call-received"
          title={t('notifications.paymentReceived')}
          subtitle={t('notifications.paymentReceivedSub')}
          toggleValue={toggles.paymentReceived}
          onToggle={set('paymentReceived')}
        />
        <SettingsRow
          icon="account-balance-wallet"
          title={t('notifications.lowBalance')}
          subtitle={t('notifications.lowBalanceSub')}
          toggleValue={toggles.lowBalance}
          onToggle={set('lowBalance')}
          isLast
        />
      </Section>

      {/* ── SHIPMENTS ── */}
      <Section label={t('notifications.sectionShipments')} delay={140}>
        <SettingsRow
          icon="local-shipping"
          title={t('notifications.shipmentUpdate')}
          subtitle={t('notifications.shipmentUpdateSub')}
          toggleValue={toggles.shipmentUpdate}
          onToggle={set('shipmentUpdate')}
        />
        <SettingsRow
          icon="done-all"
          title={t('notifications.deliveryArrival')}
          subtitle={t('notifications.deliveryArrivalSub')}
          toggleValue={toggles.deliveryArrival}
          onToggle={set('deliveryArrival')}
        />
        <SettingsRow
          icon="warehouse"
          title={t('notifications.warehouseAlerts')}
          subtitle={t('notifications.warehouseAlertsSub')}
          toggleValue={toggles.warehouseAlerts}
          onToggle={set('warehouseAlerts')}
          isLast
        />
      </Section>

      {/* ── PROMOTIONS ── */}
      <Section label={t('notifications.sectionPromotions')} delay={200}>
        <SettingsRow
          icon="local-offer"
          title={t('notifications.promos')}
          subtitle={t('notifications.promosSub')}
          toggleValue={toggles.promos}
          onToggle={set('promos')}
        />
        <SettingsRow
          icon="newspaper"
          title={t('notifications.newsletter')}
          subtitle={t('notifications.newsletterSub')}
          toggleValue={toggles.newsletter}
          onToggle={set('newsletter')}
          isLast
        />
      </Section>

      {/* ── SYSTEM ── */}
      <Section label={t('notifications.sectionSystem')} delay={260}>
        <SettingsRow
          icon="system-update"
          title={t('notifications.appUpdates')}
          subtitle={t('notifications.appUpdatesSub')}
          toggleValue={toggles.appUpdates}
          onToggle={set('appUpdates')}
        />
        <SettingsRow
          icon="gpp-maybe"
          title={t('notifications.securityAlerts')}
          subtitle={t('notifications.securityAlertsSub')}
          toggleValue={toggles.securityAlerts}
          onToggle={set('securityAlerts')}
          isLast
        />
      </Section>

      <View style={{ height: Spacing.xxl }} />
    </Screen>
  );
}
