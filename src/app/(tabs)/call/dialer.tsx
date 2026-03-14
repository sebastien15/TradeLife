import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Screen } from '@/components/layout/Screen';
import { DialerKeypad, RecentCallRow, LowBalanceAlert } from '@/components/shared/call';
import { useTheme } from '@/hooks/useTheme';
import { useAppRouter } from '@/hooks/useAppRouter';
import { useCallStore } from '@/stores/callStore';
import { useWalletStore } from '@/stores/walletStore';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { Spacing } from '@/constants/spacing';
import { t } from '@/i18n';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Mock recent calls data
const MOCK_RECENT_CALLS = [
  {
    id: '1',
    name: 'Wei Zhang',
    number: '+86 138 0013 8000',
    type: 'outgoing' as const,
    timestamp: new Date(Date.now() - 3600000),
    duration: 245,
    avatarUrl: 'https://i.pravatar.cc/150?u=wei',
  },
  {
    id: '2',
    name: 'Li Ming',
    number: '+86 139 1234 5678',
    type: 'incoming' as const,
    timestamp: new Date(Date.now() - 7200000),
    duration: 180,
    avatarUrl: 'https://i.pravatar.cc/150?u=liming',
  },
  {
    id: '3',
    name: 'Chen Wei',
    number: '+250 788 123 456',
    type: 'missed' as const,
    timestamp: new Date(Date.now() - 14400000),
    duration: 0,
  },
];

export default function DialerScreen() {
  const theme = useTheme();
  const router = useAppRouter();
  const insets = useSafeAreaInsets();
  const callStore = useCallStore();
  const walletStore = useWalletStore();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [showRecents, setShowRecents] = useState(false);
  const [showLowBalanceModal, setShowLowBalanceModal] = useState(false);

  const callBtnScale = useSharedValue(1);
  const deleteBtnScale = useSharedValue(1);
  const numberShake = useSharedValue(0);

  // Get call balance from wallet store (in RWF, not minutes)
  // For now using mock data, but will sync with wallet store
  const callCreditRWF = 2250; // This should come from walletStore.balance or a dedicated call balance
  const callCreditMinutes = Math.floor(callCreditRWF / 50); // 50 RWF per minute

  const callBtnAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: callBtnScale.value }],
  }));

  const deleteBtnAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: deleteBtnScale.value }],
  }));

  const numberShakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: numberShake.value }],
  }));

  const handleDigitPress = useCallback((digit: string) => {
    setPhoneNumber((prev) => {
      if (prev.length >= 15) {
        // Max phone number length
        return prev;
      }
      return prev + digit;
    });
  }, []);

  const handleLongPress = useCallback((digit: string) => {
    if (digit === '0') {
      // Long press 0 to add +
      setPhoneNumber((prev) => {
        if (prev.length === 0) {
          return '+';
        }
        return prev;
      });
    }
  }, []);

  const handleDelete = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPhoneNumber((prev) => prev.slice(0, -1));
  }, []);

  const handleCall = useCallback(() => {
    if (phoneNumber.length === 0) {
      // Shake animation for empty input
      numberShake.value = withSequence(
        withSpring(-10, { damping: 2, stiffness: 500 }),
        withSpring(10, { damping: 2, stiffness: 500 }),
        withSpring(-10, { damping: 2, stiffness: 500 }),
        withSpring(0, { damping: 2, stiffness: 500 })
      );
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    // Check balance before call (threshold: 100 RWF = ~2 minutes)
    const LOW_BALANCE_THRESHOLD = 100;
    if (callCreditRWF < LOW_BALANCE_THRESHOLD) {
      setShowLowBalanceModal(true);
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    callStore.startCall(phoneNumber, callCreditRWF);
    router.push('/call/active');
  }, [phoneNumber, callStore, router, numberShake, callCreditRWF]);

  const handleRecentCallPress = useCallback((number: string) => {
    setPhoneNumber(number);
    setShowRecents(false);
  }, []);

  return (
    <Screen edges={['left', 'right']} backgroundColor={theme.background}>
      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + Spacing.sm,
          paddingBottom: Spacing.sm,
          paddingHorizontal: Spacing.md,
          flexDirection: 'row',
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: theme.divider,
        }}
      >
        <Pressable
          onPress={router.back}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: -8,
          }}
        >
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </Pressable>
        <Text
          style={{
            flex: 1,
            textAlign: 'center',
            ...Typography.h3,
            color: theme.textPrimary,
            paddingRight: 32,
          }}
        >
          {t('call.dialer')}
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.xl }}>
        {/* Balance Display */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(50)}
          style={{
            alignItems: 'center',
            paddingVertical: Spacing.lg,
            paddingHorizontal: Spacing.md,
          }}
        >
          <Text
            style={{
              ...Typography.caption,
              color: theme.textMuted,
              textTransform: 'uppercase',
              letterSpacing: 0.8,
              marginBottom: 4,
            }}
          >
            {t('call.callCredit')}
          </Text>
          <Text
            style={{
              ...Typography.h2,
              fontSize: 32,
              color: Colors.primary,
              fontWeight: '700',
            }}
          >
            {callCreditMinutes} {t('call.minutes').replace('{{count}} ', '')}
          </Text>
          <Text
            style={{
              ...Typography.caption,
              color: theme.textSecondary,
              marginTop: 2,
            }}
          >
            {callCreditRWF.toLocaleString()} RWF
          </Text>
        </Animated.View>

        {/* Number Input Display */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(100)}
          style={[
            {
              minHeight: 60,
              paddingHorizontal: Spacing.md,
              paddingVertical: Spacing.md,
              marginHorizontal: Spacing.md,
              marginBottom: Spacing.lg,
              backgroundColor: theme.surface,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: theme.border,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            },
            numberShakeStyle,
          ]}
        >
          <Text
            style={{
              ...Typography.h2,
              fontSize: 24,
              color: phoneNumber ? theme.textPrimary : theme.textMuted,
              flex: 1,
              letterSpacing: 1,
            }}
          >
            {phoneNumber || t('call.enterNumber')}
          </Text>

          {phoneNumber.length > 0 && (
            <AnimatedPressable
              onPress={handleDelete}
              onPressIn={() => {
                deleteBtnScale.value = withSpring(0.9, { damping: 15, stiffness: 400 });
              }}
              onPressOut={() => {
                deleteBtnScale.value = withSpring(1, { damping: 15, stiffness: 400 });
              }}
              style={[
                {
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: theme.errorBg,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
                deleteBtnAnimStyle,
              ]}
            >
              <Ionicons name="backspace-outline" size={20} color={theme.error} />
            </AnimatedPressable>
          )}
        </Animated.View>

        {/* Keypad */}
        <Animated.View entering={FadeInDown.duration(400).delay(150)}>
          <DialerKeypad onPress={handleDigitPress} onLongPress={handleLongPress} />
        </Animated.View>

        {/* Call Button */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(200)}
          style={{
            marginTop: Spacing.xl,
            marginHorizontal: Spacing.md,
          }}
        >
          <AnimatedPressable
            onPress={handleCall}
            onPressIn={() => {
              callBtnScale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
            }}
            onPressOut={() => {
              callBtnScale.value = withSpring(1, { damping: 15, stiffness: 400 });
            }}
            style={[
              {
                height: 56,
                borderRadius: 28,
                backgroundColor: Colors.success,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                shadowColor: Colors.success,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 6,
              },
              callBtnAnimStyle,
            ]}
          >
            <Ionicons name="call" size={24} color={Colors.white} />
            <Text
              style={{
                ...Typography.button,
                color: Colors.white,
                fontSize: 18,
              }}
            >
              {t('call.dialer')}
            </Text>
          </AnimatedPressable>
        </Animated.View>

        {/* Recent Calls Toggle */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(250)}
          style={{
            marginTop: Spacing.lg,
            alignItems: 'center',
          }}
        >
          <Pressable
            onPress={() => setShowRecents(!showRecents)}
            style={{
              paddingVertical: Spacing.sm,
              paddingHorizontal: Spacing.md,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Text
              style={{
                ...Typography.bodyMedium,
                color: Colors.primary,
                fontWeight: '600',
              }}
            >
              {showRecents ? 'Hide Recent Calls' : 'Show Recent Calls'}
            </Text>
            <Ionicons
              name={showRecents ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={Colors.primary}
            />
          </Pressable>
        </Animated.View>

        {/* Recent Calls List */}
        {showRecents && (
          <Animated.View
            entering={FadeInDown.duration(400).delay(300)}
            style={{
              marginTop: Spacing.md,
              marginHorizontal: Spacing.md,
              borderRadius: 16,
              overflow: 'hidden',
              backgroundColor: theme.surface,
            }}
          >
            {MOCK_RECENT_CALLS.map((call, index) => (
              <RecentCallRow
                key={call.id}
                call={call}
                onCallPress={handleRecentCallPress}
              />
            ))}
          </Animated.View>
        )}
      </ScrollView>

      {/* Low Balance Alert Modal */}
      <LowBalanceAlert
        visible={showLowBalanceModal}
        onClose={() => setShowLowBalanceModal(false)}
        remainingBalance={callCreditRWF}
      />
    </Screen>
  );
}
