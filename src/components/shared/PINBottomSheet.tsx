import React, { useState, useCallback, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { View, Text, Pressable, TouchableOpacity } from 'react-native';
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
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { Spacing, Radius } from '@/constants/spacing';
import { BottomSheet } from '@/components/layout/BottomSheet';

const PIN_LENGTH = 6;

export interface PINBottomSheetHandle {
  open: () => void;
  close: () => void;
  shake: () => void;
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
      title,
      subtitle,
      attemptsLeft,
      enableBiometric = true,
    },
    ref,
  ) {
    const theme = useTheme();
    const { t } = useTranslation();
    const sheetRef = useRef<GorhomBottomSheet>(null);
    const [pin, setPin] = useState<string[]>([]);
    const [hasBiometric, setHasBiometric] = useState(false);

    const shakeX = useSharedValue(0);
    const dotsScale = useSharedValue(1);

    // Check biometric hardware availability once
    useEffect(() => {
      if (enableBiometric) {
        LocalAuthentication.hasHardwareAsync().then(setHasBiometric).catch(() => {});
      }
    }, [enableBiometric]);

    const shake = useCallback(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      shakeX.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10,  { duration: 50 }),
        withTiming(-8,  { duration: 50 }),
        withTiming(8,   { duration: 50 }),
        withTiming(0,   { duration: 50 }),
      );
      setPin([]);
    }, [shakeX]);

    useImperativeHandle(ref, () => ({
      open:  () => { setPin([]); sheetRef.current?.expand(); },
      close: () => sheetRef.current?.close(),
      shake,
    }));

    // Auto-fire onSuccess when all digits entered
    useEffect(() => {
      if (pin.length === PIN_LENGTH) {
        const id = setTimeout(() => {
          onSuccess(pin.join(''));
          setPin([]);
        }, 150);
        return () => clearTimeout(id);
      }
    }, [pin, onSuccess]);

    const handleBiometric = useCallback(async () => {
      try {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: t('pin.biometricPrompt'),
          fallbackLabel: t('pin.biometricFallback'),
        });
        if (result.success) {
          onSuccess('biometric');
        }
      } catch {
        // silently ignore — user will use PIN
      }
    }, [onSuccess, t]);

    const handleKey = useCallback(
      (key: string) => {
        if (key === 'del') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setPin((p) => p.slice(0, -1));
        } else if (key === 'bio') {
          if (hasBiometric) handleBiometric();
        } else if (pin.length < PIN_LENGTH) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          dotsScale.value = withSequence(withSpring(1.08, { damping: 12 }), withSpring(1, { damping: 12 }));
          setPin((p) => [...p, key]);
        }
      },
      [pin.length, hasBiometric, handleBiometric, dotsScale],
    );

    const shakeStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: shakeX.value }],
    }));

    const dotsScaleStyle = useAnimatedStyle(() => ({
      transform: [{ scale: dotsScale.value }],
    }));

    const rows = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['bio', '0', 'del'],
    ];

    return (
      <BottomSheet
        ref={sheetRef}
        snapPoints={['68%']}
        index={-1}
        onClose={onClose}
      >
        <View style={{ flex: 1, paddingHorizontal: Spacing.lg, gap: Spacing.md, paddingBottom: Spacing.lg }}>
          {/* Header */}
          <View style={{ alignItems: 'center', gap: Spacing.xs }}>
            <Text style={{ ...Typography.sectionLabel, color: Colors.primary, textTransform: 'uppercase', letterSpacing: 1.5 }}>
              {t('pin.securityVerification')}
            </Text>
            <Text style={{ ...Typography.h2, color: theme.textPrimary }}>
              {title ?? t('pin.title')}
            </Text>
            <Text style={{ ...Typography.bodySm, color: theme.textSecondary, textAlign: 'center' }}>
              {subtitle ?? t('pin.subtitle')}
            </Text>
            {attemptsLeft !== undefined && (
              <Text style={{ ...Typography.caption, color: Colors.error }}>
                {t('pin.attemptsLeft', { count: attemptsLeft })}
              </Text>
            )}
          </View>

          {/* PIN Dots */}
          <Animated.View
            style={[
              { flexDirection: 'row', justifyContent: 'center', gap: Spacing.lg },
              shakeStyle,
              dotsScaleStyle,
            ]}
          >
            {Array.from({ length: PIN_LENGTH }, (_, i) => (
              <View
                key={i}
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: i < pin.length ? Colors.primary : 'transparent',
                  borderWidth: 2,
                  borderColor: i < pin.length ? Colors.primary : theme.border,
                  // ring effect on filled dots
                  ...(i < pin.length ? {
                    shadowColor: Colors.primary,
                    shadowOpacity: 0.35,
                    shadowRadius: 6,
                    shadowOffset: { width: 0, height: 0 },
                    elevation: 3,
                  } : {}),
                }}
              />
            ))}
          </Animated.View>

          {/* Keypad */}
          <View style={{ gap: Spacing.sm }}>
            {rows.map((row, ri) => (
              <View key={ri} style={{ flexDirection: 'row', gap: Spacing.sm, justifyContent: 'center' }}>
                {row.map((key) => (
                  <Pressable
                    key={key}
                    onPress={() => handleKey(key)}
                    style={({ pressed }) => ({
                      width: 80,
                      height: 60,
                      borderRadius: Radius.md,
                      backgroundColor: pressed ? Colors.primary + '22' : theme.surface2,
                      alignItems: 'center',
                      justifyContent: 'center',
                    })}
                  >
                    {key === 'del' ? (
                      <MaterialIcons name="backspace" size={22} color={theme.textPrimary} />
                    ) : key === 'bio' ? (
                      hasBiometric ? (
                        <MaterialIcons name="fingerprint" size={28} color={Colors.primary} />
                      ) : (
                        <View style={{ width: 80, height: 60 }} />
                      )
                    ) : (
                      <Text style={{ ...Typography.h2, color: theme.textPrimary }}>{key}</Text>
                    )}
                  </Pressable>
                ))}
              </View>
            ))}
          </View>

          {/* Cancel */}
          <TouchableOpacity
            onPress={() => { sheetRef.current?.close(); onClose?.(); }}
            activeOpacity={0.7}
            style={{ alignSelf: 'center', paddingVertical: Spacing.sm }}
          >
            <Text style={{ ...Typography.bodySm, color: theme.textSecondary }}>{t('pin.cancel')}</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    );
  },
);
