// ─────────────────────────────────────────────────────────────────────────────
// TradeLife — Settings Screen
// Design: 8d_settings_screen_dark
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/useTheme';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { Screen } from '@/components/layout/Screen';
import { SettingsRow } from '@/components/shared/more/SettingsRow';
import { useAppRouter } from '@/hooks/useAppRouter';
import { useTranslation } from 'react-i18next';

// ── Section Header ────────────────────────────────────────────────────────────
interface SectionProps {
  label: string;
  delay: number;
  children: React.ReactNode;
}

function SettingsSection({ label, delay, children }: SectionProps) {
  const theme = useTheme();
  return (
    <Animated.View entering={FadeInDown.duration(400).delay(delay)} style={{ marginTop: Spacing.lg }}>
      {label ? (
        <Text
          style={{
            ...Typography.sectionLabel,
            paddingHorizontal: Spacing.md,
            paddingBottom: Spacing.xs ?? 4,
            color: Colors.primary,
            textTransform: 'uppercase',
          }}
        >
          {label}
        </Text>
      ) : null}
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

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function SettingsScreen() {
  const theme = useTheme();
  const router = useAppRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <Screen edges={['left', 'right']} backgroundColor={theme.background} scroll>

      {/* ── Custom Header ── */}
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
        <TouchableOpacity
          onPress={router.back}
          activeOpacity={0.7}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: -8,
          }}
        >
          <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>

        <Text
          style={{
            flex: 1,
            textAlign: 'center',
            ...Typography.h3,
            color: theme.textPrimary,
            paddingRight: 32,
          }}
        >
          {t('settings.title')}
        </Text>
      </View>

      {/* ── Sections ── */}
      <View style={{ paddingBottom: Spacing.xxl }}>

        {/* ACCOUNT */}
        <SettingsSection label={t('settings.sectionAccount')} delay={80}>
          <SettingsRow
            icon="person"
            title={t('settings.profileInformation')}
            onPress={() => router.push('/(tabs)/more/profile')}
          />
          <SettingsRow
            icon="security"
            title={t('settings.securityPassword')}
            onPress={() => router.push('/(tabs)/more/settings/security')}
            isLast
          />
        </SettingsSection>

        {/* TRADING */}
        <SettingsSection label={t('settings.sectionTrading')} delay={140}>
          <SettingsRow
            icon="account-balance-wallet"
            title={t('settings.linkedAccounts')}
            onPress={() => {}}
          />
          <SettingsRow
            icon="notifications"
            title={t('settings.notifications')}
            onPress={() => router.push('/(tabs)/more/settings/notifications')}
            isLast
          />
        </SettingsSection>

        {/* PREFERENCES */}
        <SettingsSection label={t('settings.sectionPreferences')} delay={200}>
          <SettingsRow
            icon="language"
            title={t('settings.language')}
            onPress={() => router.push('/(tabs)/more/settings/language')}
            valueLabel={t('settings.languageCurrent')}
            isLast
          />
        </SettingsSection>

        {/* SUPPORT */}
        <SettingsSection label={t('settings.sectionSupport')} delay={260}>
          <SettingsRow
            icon="report"
            title={t('settings.reportError')}
            onPress={() => {}}
            destructive
          />
          <SettingsRow
            icon="help"
            title={t('settings.helpCenter')}
            onPress={() => {}}
            isLast
          />
        </SettingsSection>

        {/* ABOUT */}
        <SettingsSection label="" delay={320}>
          <SettingsRow
            icon="info"
            title={t('settings.about')}
            onPress={() => {}}
            isLast
          />
        </SettingsSection>

        {/* Log Out */}
        <Animated.View entering={FadeInDown.duration(400).delay(380)} style={{ marginTop: Spacing.xl, marginHorizontal: Spacing.md }}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              height: 56,
              borderRadius: 14,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ ...Typography.button, color: Colors.error }}>
              {t('settings.logout')}
            </Text>
          </TouchableOpacity>
        </Animated.View>

      </View>
    </Screen>
  );
}
