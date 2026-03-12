// ─────────────────────────────────────────────────────────────────────────────
// TradeLife — Forgot Password Screen
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import Animated, { FadeInDown, FadeIn, FadeOutUp, Layout } from 'react-native-reanimated';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/theme';
import { Typography } from '@/constants/typography';
import { Input } from '@/components/ui/Input';
import { useAppRouter } from '@/hooks/useAppRouter';
import { t } from '@/i18n';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/utils/validation';

export default function ForgotPasswordScreen() {
  const { theme, isDark } = useTheme();
  const router = useAppRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [identifier, setIdentifier] = useState('');

  const { control, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { identifier: '' },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    try {
      await new Promise<void>((resolve) => setTimeout(resolve, 1200));
      setIdentifier(data.identifier);
      setSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Back button */}
      <TouchableOpacity
        onPress={router.back}
        activeOpacity={0.7}
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 8,
          marginLeft: 16,
        }}
      >
        <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
      </TouchableOpacity>

      <Animated.View
        layout={Layout.springify()}
        style={{ flex: 1, paddingHorizontal: 24, justifyContent: 'center' }}
      >
        {!submitted ? (
          <Animated.View
            key="form"
            entering={FadeIn.duration(300)}
            exiting={FadeOutUp.duration(200)}
            style={{ alignItems: 'center', gap: 16 }}
          >
            {/* Icon */}
            <Animated.View
              entering={FadeInDown.duration(400).delay(100)}
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 8,
                backgroundColor: theme.primary + '15',
              }}
            >
              <Ionicons name="lock-open-outline" size={48} color={theme.primary} />
            </Animated.View>

            <Animated.Text
              entering={FadeInDown.duration(400).delay(200)}
              style={{ ...Typography.h1, textAlign: 'center', color: theme.textPrimary }}
            >
              {t('auth.recoverAccount')}
            </Animated.Text>

            <Animated.Text
              entering={FadeInDown.duration(400).delay(280)}
              style={{
                ...Typography.body,
                textAlign: 'center',
                lineHeight: 24,
                paddingHorizontal: 8,
                color: theme.textSecondary,
              }}
            >
              {t('auth.recoverSubtitle')}
            </Animated.Text>

            {/* Input */}
            <Animated.View
              entering={FadeInDown.duration(400).delay(360)}
              style={{ width: '100%' }}
            >
              <Controller
                control={control}
                name="identifier"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label={t('auth.phoneOrEmail')}
                    placeholder={t('auth.phoneSignUpPlaceholder')}
                    rightIcon={
                      <Ionicons name="mail-outline" size={20} color={theme.textMuted} />
                    }
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.identifier?.message}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                )}
              />
            </Animated.View>

            {/* Submit button */}
            <Animated.View
              entering={FadeInDown.duration(400).delay(440)}
              style={{ width: '100%' }}
            >
              <TouchableOpacity
                onPress={handleSubmit(onSubmit)}
                disabled={isLoading}
                activeOpacity={0.85}
                style={{
                  height: 56,
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: theme.primary,
                  opacity: isLoading ? 0.7 : 1,
                }}
              >
                <Text style={{ ...Typography.button, color: '#fff' }}>
                  {isLoading ? t('auth.sending') : t('auth.sendResetLink')}
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Links row */}
            <Animated.View
              entering={FadeInDown.duration(400).delay(500)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8 }}
            >
              <TouchableOpacity style={{ padding: 4 }}>
                <Text style={{ ...Typography.bodySm, color: theme.textSecondary }}>
                  {t('auth.tryAnotherWay')}
                </Text>
              </TouchableOpacity>
              <View style={{ width: 1, height: 16, backgroundColor: theme.border }} />
              <TouchableOpacity style={{ padding: 4 }} onPress={router.toSignIn}>
                <Text style={{ ...Typography.bodySm, color: theme.primary }}>
                  {t('auth.backToLogin')}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        ) : (
          <Animated.View
            key="success"
            entering={FadeInDown.duration(500).springify()}
            style={{ alignItems: 'center', gap: 16 }}
          >
            {/* Success icon */}
            <Animated.View
              entering={FadeInDown.duration(400).delay(100)}
              style={{
                width: 110,
                height: 110,
                borderRadius: 55,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 8,
                backgroundColor: theme.success + '15',
              }}
            >
              <Ionicons name="mail-unread-outline" size={56} color={theme.success} />
            </Animated.View>

            <Animated.Text
              entering={FadeInDown.duration(400).delay(200)}
              style={{ ...Typography.h1, textAlign: 'center', color: theme.textPrimary }}
            >
              {t('auth.checkInbox')}
            </Animated.Text>

            <Animated.Text
              entering={FadeInDown.duration(400).delay(280)}
              style={{
                ...Typography.body,
                textAlign: 'center',
                lineHeight: 24,
                paddingHorizontal: 8,
                color: theme.textSecondary,
              }}
            >
              {`We sent a reset link to\n`}
              <Text style={{ color: theme.textPrimary, fontWeight: '600' }}>{identifier}</Text>
              {`\n\nCheck your email or SMS and follow the instructions to reset your password.`}
            </Animated.Text>

            {/* Back to login button */}
            <Animated.View
              entering={FadeInDown.duration(400).delay(360)}
              style={{ width: '100%' }}
            >
              <TouchableOpacity
                onPress={router.toSignIn}
                activeOpacity={0.85}
                style={{
                  height: 56,
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: theme.primary,
                }}
              >
                <Text style={{ ...Typography.button, color: '#fff' }}>
                  {t('auth.backToLogin')}
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Resend link */}
            <Animated.View entering={FadeInDown.duration(400).delay(440)}>
              <TouchableOpacity style={{ padding: 4 }} onPress={() => setSubmitted(false)}>
                <Text style={{ ...Typography.bodySm, color: theme.textSecondary }}>
                  {t('auth.didntReceive')}{' '}
                  <Text style={{ color: theme.primary, fontWeight: '600' }}>
                    {t('auth.resend')}
                  </Text>
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        )}
      </Animated.View>
    </SafeAreaView>
  );
}
