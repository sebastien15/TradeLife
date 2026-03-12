// ─────────────────────────────────────────────────────────────────────────────
// TradeLife — Security Settings
// Design: 8e_security_settings_dark
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@/hooks/useTheme';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { Screen } from '@/components/layout/Screen';
import { SettingsRow } from '@/components/shared/more/SettingsRow';
import { useAppRouter } from '@/hooks/useAppRouter';

// ── Score Card ────────────────────────────────────────────────────────────────
function SecurityScoreCard() {
  const { t } = useTranslation();
  const score = 85;

  return (
    <Animated.View entering={FadeInDown.duration(400).delay(60)}>
      <LinearGradient
        colors={Colors.gradientCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          marginHorizontal: Spacing.md,
          marginTop: Spacing.lg,
          borderRadius: 16,
          padding: Spacing.lg,
        }}
      >
        {/* Header row */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View>
            <Text style={{ ...Typography.caption, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 1 }}>
              {t('security.accountHealth')}
            </Text>
            <Text style={{ ...Typography.h2, color: Colors.white, marginTop: 4 }}>
              {t('security.statusStrong')}
            </Text>
          </View>
          {/* Score circle */}
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              borderWidth: 3,
              borderColor: Colors.white,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255,255,255,0.15)',
            }}
          >
            <Text style={{ ...Typography.h3, color: Colors.white }}>{score}</Text>
          </View>
        </View>

        {/* Progress bar */}
        <View
          style={{
            height: 6,
            borderRadius: 3,
            backgroundColor: 'rgba(255,255,255,0.2)',
            marginTop: Spacing.md,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              width: `${score}%`,
              height: '100%',
              borderRadius: 3,
              backgroundColor: Colors.white,
            }}
          />
        </View>

        <Text style={{ ...Typography.bodySm, color: 'rgba(255,255,255,0.8)', marginTop: Spacing.sm }}>
          {t('security.healthDesc')}
        </Text>
      </LinearGradient>
    </Animated.View>
  );
}

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
export default function SecurityScreen() {
  const theme = useTheme();
  const router = useAppRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const backScale = useSharedValue(1);

  const [biometricEnabled, setBiometricEnabled] = useState(false);

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
          {t('security.title')}
        </Text>
      </View>

      {/* ── Score Card ── */}
      <SecurityScoreCard />

      {/* ── LOGIN & AUTHENTICATION ── */}
      <Section label={t('security.sectionLogin')} delay={120}>
        <SettingsRow
          icon="lock"
          title={t('security.changePassword')}
          subtitle={t('security.changePasswordSub')}
          onPress={() => {}}
        />
        <SettingsRow
          icon="verified-user"
          title={t('security.twoFactorAuth')}
          subtitle={t('security.twoFactorSub')}
          onPress={() => {}}
        />
        <SettingsRow
          icon="fingerprint"
          title={t('security.biometricLogin')}
          subtitle={t('security.biometricSub')}
          toggleValue={biometricEnabled}
          onToggle={setBiometricEnabled}
          isLast
        />
      </Section>

      {/* ── PRIVACY ── */}
      <Section label={t('security.sectionPrivacy')} delay={200}>
        <SettingsRow
          icon="devices"
          title={t('security.activeSessions')}
          subtitle={t('security.activeSessionsSub')}
          onPress={() => {}}
        />
        <SettingsRow
          icon="history"
          title={t('security.securityLogs')}
          subtitle={t('security.securityLogsSub')}
          onPress={() => {}}
          isLast
        />
      </Section>

      <View style={{ height: Spacing.xxl }} />
    </Screen>
  );
}
