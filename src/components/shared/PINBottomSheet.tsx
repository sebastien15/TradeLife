import React, { useState, useCallback, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { View, Text, Pressable } from 'react-native';
import GorhomBottomSheet from '@gorhom/bottom-sheet';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Typography } from '@/constants/typography';
import { Spacing, Radius } from '@/constants/spacing';
import { BottomSheet } from '@/components/layout/BottomSheet';

const PIN_LENGTH = 6;
const KEYPAD = ['1','2','3','4','5','6','7','8','9','bio','0','del'] as const;

export interface PINBottomSheetHandle {
  open: () => void;
  close: () => void;
}

interface PINBottomSheetProps {
  onSuccess: (pin: string) => void;
  onClose?: () => void;
  title?: string;
  subtitle?: string;
  attemptsLeft?: number;
  enableBiometric?: boolean;
}

export const PINBottomSheet = forwardRef<PINBottomSheetHandle, PINBottomSheetProps>(
  function PINBottomSheet(
    {
      onSuccess,
      onClose,
      title = 'Enter PIN',
      subtitle = 'Enter your 6-digit security PIN',
      attemptsLeft,
      enableBiometric = true,
    },
    ref,
  ) {
    const theme = useTheme();
    const sheetRef = useRef<GorhomBottomSheet>(null);
    const [pin, setPin] = useState<string[]>([]);
    const [error, setError] = useState('');

    const shakeX = useSharedValue(0);
    const dotsScale = useSharedValue(1);

    useImperativeHandle(ref, () => ({
      open:  () => sheetRef.current?.expand(),
      close: () => sheetRef.current?.close(),
    }));

    useEffect(() => {
      if (pin.length === PIN_LENGTH) {
        setTimeout(() => {
          onSuccess(pin.join(''));
          setPin([]);
        }, 150);
      }
    }, [pin, onSuccess]);

    const shake = useCallback(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      shakeX.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10,  { duration: 50 }),
        withTiming(-8,  { duration: 50 }),
        withTiming(8,   { duration: 50 }),
        withTiming(0,   { duration: 50 }),
      );
    }, [shakeX]);

    const handleBiometric = useCallback(async () => {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to continue',
        fallbackLabel: 'Use PIN',
      });
      if (result.success) {
        onSuccess('biometric');
      }
    }, [onSuccess]);

    const handleKey = useCallback(
      (key: string) => {
        if (key === 'del') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setPin((p) => p.slice(0, -1));
          setError('');
        } else if (key === 'bio') {
          if (enableBiometric) handleBiometric();
        } else if (pin.length < PIN_LENGTH) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          dotsScale.value = withSequence(withSpring(1.1), withSpring(1));
          setPin((p) => [...p, key]);
        }
      },
      [pin.length, enableBiometric, handleBiometric, dotsScale],
    );

    const shakeStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: shakeX.value }],
    }));

    const dotsScaleStyle = useAnimatedStyle(() => ({
      transform: [{ scale: dotsScale.value }],
    }));

    const rows = [
      ['1','2','3'],
      ['4','5','6'],
      ['7','8','9'],
      ['bio','0','del'],
    ];

    return (
      <BottomSheet
        ref={sheetRef}
        snapPoints={['65%']}
        index={-1}
        onClose={onClose}
      >
        <View style={{ flex: 1, paddingHorizontal: Spacing.lg, gap: Spacing.lg }}>
          {/* Header */}
          <View style={{ alignItems: 'center', gap: Spacing.xs }}>
            <Text style={{ ...Typography.h2, color: theme.textPrimary }}>{title}</Text>
            <Text style={{ ...Typography.bodySm, color: theme.textSecondary }}>{subtitle}</Text>
            {attemptsLeft !== undefined ? (
              <Text style={{ ...Typography.caption, color: theme.error }}>
                {`${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} remaining`}
              </Text>
            ) : null}
          </View>

          {/* PIN dots */}
          <Animated.View
            style={[
              { flexDirection: 'row', justifyContent: 'center', gap: Spacing.md },
              shakeStyle,
              dotsScaleStyle,
            ]}
          >
            {Array.from({ length: PIN_LENGTH }, (_, i) => (
              <View
                key={i}
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 7,
                  backgroundColor: i < pin.length ? theme.primary : 'transparent',
                  borderWidth: 2,
                  borderColor: i < pin.length ? theme.primary : theme.border,
                }}
              />
            ))}
          </Animated.View>

          {error ? (
            <Text style={{ ...Typography.caption, color: theme.error, textAlign: 'center' }}>
              {error}
            </Text>
          ) : null}

          {/* Keypad */}
          <View style={{ gap: Spacing.sm }}>
            {rows.map((row, ri) => (
              <View key={ri} style={{ flexDirection: 'row', gap: Spacing.sm, justifyContent: 'center' }}>
                {row.map((key) => (
                  <Pressable
                    key={key}
                    onPress={() => handleKey(key)}
                    style={{
                      width: 80,
                      height: 64,
                      borderRadius: Radius.md,
                      backgroundColor: theme.surface2,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {key === 'del' ? (
                      <MaterialIcons name="backspace" size={22} color={theme.textPrimary} />
                    ) : key === 'bio' ? (
                      enableBiometric ? (
                        <MaterialIcons name="fingerprint" size={28} color={theme.primary} />
                      ) : (
                        <View />
                      )
                    ) : (
                      <Text style={{ ...Typography.h2, color: theme.textPrimary }}>{key}</Text>
                    )}
                  </Pressable>
                ))}
              </View>
            ))}
          </View>
        </View>
      </BottomSheet>
    );
  },
);
