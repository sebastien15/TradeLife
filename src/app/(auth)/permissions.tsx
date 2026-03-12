// ─────────────────────────────────────────────────────────────────────────────
// TradeLife — Permissions Screen
// Design: 1g_permissions_dark
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Switch,
} from 'react-native';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/theme';
import { Typography } from '@/constants/typography';
import { useAppRouter } from '@/hooks/useAppRouter';
import { useAuth } from '@/hooks/useAuth';
import { t } from '@/i18n';

interface Permission {
  key: 'notifications' | 'location' | 'camera';
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  description: string;
}

const PERMISSIONS: Permission[] = [
  {
    key: 'notifications',
    icon: 'notifications-outline',
    title: 'auth.permissionNotifications',
    description: 'auth.permissionNotificationsDesc',
  },
  {
    key: 'location',
    icon: 'location-outline',
    title: 'auth.permissionLocation',
    description: 'auth.permissionLocationDesc',
  },
  {
    key: 'camera',
    icon: 'camera-outline',
    title: 'auth.permissionCamera',
    description: 'auth.permissionCameraDesc',
  },
];

export default function PermissionsScreen() {
  const { theme, isDark } = useTheme();
  const router = useAppRouter();
  const { setOnboardingComplete } = useAuth();

  const [toggles, setToggles] = useState({
    notifications: true,
    location: true,
    camera: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  const toggle = (key: keyof typeof toggles) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const requestAndContinue = async () => {
    setIsLoading(true);
    try {
      if (toggles.notifications) {
        await Notifications.requestPermissionsAsync();
      }
      if (toggles.camera) {
        await ImagePicker.requestCameraPermissionsAsync();
      }
      // Location permission handled contextually when location features are used
    } finally {
      setOnboardingComplete(true);
      router.toHome();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* ── Header: X close button ── */}
      <Animated.View
        entering={FadeIn.duration(300)}
        style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 }}
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
          }}
        >
          <Ionicons name="close" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── App logo card ── */}
        <Animated.View
          entering={ZoomIn.duration(400).delay(80)}
          style={{ alignItems: 'center', marginTop: 16, marginBottom: 24 }}
        >
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              backgroundColor: theme.surface,
              borderWidth: 1,
              borderColor: theme.border,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="swap-horizontal-outline" size={40} color={theme.primary} />
          </View>
        </Animated.View>

        {/* Title */}
        <Animated.Text
          entering={FadeInDown.duration(400).delay(160)}
          style={{
            fontSize: 28,
            fontWeight: '700',
            color: theme.textPrimary,
            textAlign: 'center',
            letterSpacing: -0.3,
            marginBottom: 10,
          }}
        >
          {t('auth.permissionsTitle')}
        </Animated.Text>

        {/* Subtitle */}
        <Animated.Text
          entering={FadeInDown.duration(400).delay(220)}
          style={{
            ...Typography.body,
            color: theme.textSecondary,
            textAlign: 'center',
            lineHeight: 24,
            marginBottom: 32,
          }}
        >
          {t('auth.permissionsSubtitle')}
        </Animated.Text>

        {/* Permission cards */}
        {PERMISSIONS.map((perm, index) => (
          <Animated.View
            key={perm.key}
            entering={FadeInDown.duration(400).delay(300 + index * 80)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 16,
              borderRadius: 16,
              borderWidth: 1.5,
              borderColor: toggles[perm.key] ? theme.primary : theme.border,
              backgroundColor: toggles[perm.key] ? theme.primary + '0d' : theme.surface,
              marginBottom: 12,
              gap: 12,
            }}
          >
            {/* Icon */}
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: theme.primary + '15',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name={perm.icon} size={22} color={theme.primary} />
            </View>

            {/* Text */}
            <View style={{ flex: 1 }}>
              <Text style={{ ...Typography.bodyMedium, color: theme.textPrimary, marginBottom: 2 }}>
                {t(perm.title as never)}
              </Text>
              <Text style={{ ...Typography.caption, color: theme.textSecondary, lineHeight: 18 }}>
                {t(perm.description as never)}
              </Text>
            </View>

            {/* Toggle switch */}
            <Switch
              value={toggles[perm.key]}
              onValueChange={() => toggle(perm.key)}
              trackColor={{ false: theme.border, true: theme.primary + '66' }}
              thumbColor={toggles[perm.key] ? theme.primary : theme.textMuted}
              ios_backgroundColor={theme.border}
            />
          </Animated.View>
        ))}

        {/* Allow All & Continue */}
        <Animated.View entering={FadeInDown.duration(400).delay(560)} style={{ marginTop: 8 }}>
          <TouchableOpacity
            onPress={requestAndContinue}
            disabled={isLoading}
            activeOpacity={0.85}
            style={{
              height: 56,
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.primary,
              opacity: isLoading ? 0.7 : 1,
              marginBottom: 12,
            }}
          >
            <Text style={{ ...Typography.button, color: '#fff' }}>
              {t('auth.allowAllContinue')}
            </Text>
          </TouchableOpacity>

          {/* Manage individually */}
          <TouchableOpacity
            onPress={() => { setOnboardingComplete(true); router.toHome(); }}
            activeOpacity={0.7}
            style={{ alignItems: 'center', paddingVertical: 8 }}
          >
            <Text style={{ ...Typography.bodySm, color: theme.textSecondary }}>
              {t('auth.manageIndividually')}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Disclaimer */}
        <Animated.Text
          entering={FadeInDown.duration(400).delay(640)}
          style={{
            ...Typography.caption,
            color: theme.textMuted,
            textAlign: 'center',
            lineHeight: 18,
            marginTop: 16,
            paddingHorizontal: 8,
          }}
        >
          {t('auth.permissionsDisclaimer')}
        </Animated.Text>
      </ScrollView>
    </SafeAreaView>
  );
}
