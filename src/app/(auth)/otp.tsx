// ─────────────────────────────────────────────────────────────────────────────
// TradeLife — OTP Verification Screen
// Design: 1e_otp_verification_dark
// ─────────────────────────────────────────────────────────────────────────────
import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Keyboard,
  Platform,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import * as Clipboard from 'expo-clipboard';
import { useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/theme';
import { Typography } from '@/constants/typography';
import { useAppRouter } from '@/hooks/useAppRouter';
import { useAuth } from '@/hooks/useAuth';
import { t } from '@/i18n';

const CODE_LENGTH = 6;
const RESEND_SECONDS = 30;

export default function OtpScreen() {
  const { theme, isDark } = useTheme();
  const router = useAppRouter();
  const { phone } = useLocalSearchParams<{ phone?: string }>();
  const { login, requestOtp, isLoading } = useAuth();

  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [resendCountdown, setResendCountdown] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Shake animation on wrong code
  const shakeX = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const shake = useCallback(() => {
    shakeX.value = withSequence(
      withTiming(-8, { duration: 60 }),
      withTiming(8,  { duration: 60 }),
      withTiming(-6, { duration: 60 }),
      withTiming(6,  { duration: 60 }),
      withTiming(0,  { duration: 60 }),
    );
  }, [shakeX]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) { clearInterval(timer); setCanResend(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-submit when all digits filled
  useEffect(() => {
    const code = digits.join('');
    if (code.length === CODE_LENGTH && !digits.includes('')) {
      void handleVerify(code);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [digits]);

  const handleDigitChange = (text: string, index: number) => {
    if (text.length > 1) {
      const cleaned = text.replace(/\D/g, '').slice(0, CODE_LENGTH);
      if (cleaned.length === CODE_LENGTH) {
        setDigits(cleaned.split(''));
        inputRefs.current[CODE_LENGTH - 1]?.focus();
        return;
      }
    }
    const char = text.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);
    if (char && index < CODE_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace') {
      if (!digits[index] && index > 0) {
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        setDigits(newDigits);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newDigits = [...digits];
        newDigits[index] = '';
        setDigits(newDigits);
      }
    }
  };

  const handleVerify = async (code?: string) => {
    const finalCode = code ?? digits.join('');
    if (finalCode.length < CODE_LENGTH) return;
    Keyboard.dismiss();
    const success = await login(phone ?? '', finalCode);
    if (!success) {
      shake();
      setDigits(Array(CODE_LENGTH).fill(''));
      setTimeout(() => {
        requestAnimationFrame(() => {
          inputRefs.current[0]?.focus();
        });
      }, 150);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setCanResend(false);
    setResendCountdown(RESEND_SECONDS);
    setDigits(Array(CODE_LENGTH).fill(''));
    requestAnimationFrame(() => {
      inputRefs.current[0]?.focus();
    });
    await requestOtp(phone ?? '');
    const timer = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) { clearInterval(timer); setCanResend(true); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handlePasteFromClipboard = async () => {
    const text = await Clipboard.getStringAsync();
    const cleaned = text.replace(/\D/g, '').slice(0, CODE_LENGTH);
    if (cleaned.length > 0) {
      const newDigits = cleaned.split('');
      while (newDigits.length < CODE_LENGTH) newDigits.push('');
      setDigits(newDigits);
      inputRefs.current[Math.min(cleaned.length - 1, CODE_LENGTH - 1)]?.focus();
    }
  };

  const maskedPhone = phone
    ? phone.replace(/(\+?\d{3})\d+(\d{3})/, '$1****$2')
    : 'your number';

  const allFilled = digits.join('').length === CODE_LENGTH && !digits.includes('');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* ── Header: back + centered title ── */}
      <Animated.View
        entering={FadeIn.duration(300)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 4,
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
          }}
        >
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text
          style={{
            flex: 1,
            textAlign: 'center',
            fontSize: 18,
            fontWeight: '700',
            color: theme.textPrimary,
            marginRight: 40, // compensate back button to keep title truly centered
          }}
        >
          {t('auth.verifyPhone')}
        </Text>
      </Animated.View>

      {/* ── Content ── */}
      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 32, alignItems: 'center' }}>

        {/* Icon */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(80)}
          style={{
            width: 88,
            height: 88,
            borderRadius: 44,
            backgroundColor: theme.primary + '18',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
          }}
        >
          <Ionicons name="chatbubble-ellipses-outline" size={40} color={theme.primary} />
        </Animated.View>

        {/* Title */}
        <Animated.Text
          entering={FadeInDown.duration(400).delay(160)}
          style={{ ...Typography.h1, color: theme.textPrimary, textAlign: 'center', marginBottom: 8 }}
        >
          {t('auth.verificationCode')}
        </Animated.Text>

        {/* Subtitle */}
        <Animated.Text
          entering={FadeInDown.duration(400).delay(240)}
          style={{
            ...Typography.body,
            color: theme.textSecondary,
            textAlign: 'center',
            lineHeight: 24,
            marginBottom: 32,
          }}
        >
          {t('auth.enterCodeSentTo')}{'\n'}
          <Text style={{ color: theme.textPrimary, fontWeight: '600' }}>{maskedPhone}</Text>
        </Animated.Text>

        {/* OTP Input boxes */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(320)}
          style={[shakeStyle, { flexDirection: 'row', gap: 8, marginBottom: 12 }]}
        >
          {digits.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => { inputRefs.current[index] = ref; }}
              style={{
                width: 48,
                height: 56,
                borderRadius: 12,
                borderWidth: 2,
                fontSize: 22,
                fontWeight: '700',
                textAlign: 'center',
                borderColor:
                  focusedIndex === index
                    ? theme.primary
                    : digit
                    ? theme.primary
                    : theme.inputBorder,
                backgroundColor: digit ? theme.primary + '10' : theme.inputBg,
                color: theme.textPrimary,
              }}
              value={digit}
              onChangeText={(text) => handleDigitChange(text, index)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(-1)}
              keyboardType="number-pad"
              maxLength={Platform.OS === 'ios' ? 1 : 2}
              textAlign="center"
              selectTextOnFocus
            />
          ))}
        </Animated.View>

        {/* Paste button */}
        <Animated.View entering={FadeInDown.duration(400).delay(380)}>
          <TouchableOpacity
            onPress={handlePasteFromClipboard}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 4, padding: 8 }}
          >
            <Ionicons name="clipboard-outline" size={14} color={theme.primary} />
            <Text style={{ ...Typography.caption, fontWeight: '600', color: theme.primary }}>
              {t('auth.pasteCode')}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Resend row */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(440)}
          style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16, marginBottom: 24 }}
        >
          <Text style={{ ...Typography.bodySm, color: theme.textSecondary }}>
            {t('auth.didntReceiveCode')}{' '}
          </Text>
          {canResend ? (
            <TouchableOpacity onPress={handleResend}>
              <Text style={{ ...Typography.bodySm, fontWeight: '600', color: theme.primary }}>
                {t('auth.resendCode')}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={{ ...Typography.bodySm, color: theme.textMuted }}>
              {t('auth.resendIn', { seconds: resendCountdown })}
            </Text>
          )}
        </Animated.View>

        {/* Verify button */}
        <Animated.View entering={FadeInDown.duration(400).delay(500)} style={{ width: '100%', marginBottom: 16 }}>
          <TouchableOpacity
            onPress={() => handleVerify()}
            disabled={isLoading || !allFilled}
            activeOpacity={0.85}
            style={{
              height: 56,
              borderRadius: 16,
              backgroundColor: theme.primary,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              opacity: (isLoading || !allFilled) ? 0.5 : 1,
            }}
          >
            {!isLoading && (
              <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
            )}
            <Text style={{ ...Typography.button, color: '#fff' }}>
              {isLoading ? t('auth.verifying') : t('auth.verify')}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Change phone number */}
        <Animated.View entering={FadeInDown.duration(400).delay(560)}>
          <TouchableOpacity onPress={router.back} style={{ padding: 8 }}>
            <Text
              style={{
                ...Typography.bodySm,
                color: theme.textSecondary,
                textDecorationLine: 'underline',
              }}
            >
              {t('auth.changePhoneNumber')}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* ── SECURE VERIFICATION badge ── */}
      <Animated.View
        entering={FadeIn.duration(400).delay(640)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          paddingBottom: 28,
        }}
      >
        <Ionicons name="lock-closed-outline" size={12} color={theme.textMuted} />
        <Text
          style={{
            fontSize: 11,
            fontWeight: '700',
            letterSpacing: 2,
            color: theme.textMuted,
          }}
        >
          {t('auth.secureVerification')}
        </Text>
      </Animated.View>
    </SafeAreaView>
  );
}
