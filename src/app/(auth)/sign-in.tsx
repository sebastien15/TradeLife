// ─────────────────────────────────────────────────────────────────────────────
// TradeLife — Sign In Screen
// Design: 1h_sign_in_dark
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Pressable,
  Alert,
} from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
import { Svg, Path } from 'react-native-svg';
import { StatusBar } from 'expo-status-bar';
import * as LocalAuthentication from 'expo-local-authentication';
import { useTheme } from '@/theme';
import { Typography } from '@/constants/typography';
import { Input } from '@/components/ui/Input';
import { useAppRouter } from '@/hooks/useAppRouter';
import { useAuth } from '@/hooks/useAuth';
import { t } from '@/i18n';
import { signInSchema, type SignInFormValues } from '@/utils/validation';

// ── Colored Google icon (exact 4-path SVG from design) ──────────────────────
const GoogleIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <Path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <Path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <Path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </Svg>
);

export default function SignInScreen() {
  const { theme, isDark } = useTheme();
  const router = useAppRouter();
  const { loginWithPassword, isLoading } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const shakeX = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shakeX.value }] }));

  const shake = useCallback(() => {
    shakeX.value = withSequence(
      withTiming(-10, { duration: 60 }),
      withTiming(10,  { duration: 60 }),
      withTiming(-8,  { duration: 60 }),
      withTiming(8,   { duration: 60 }),
      withTiming(0,   { duration: 60 }),
    );
  }, [shakeX]);

  const { control, handleSubmit, formState: { errors } } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { phoneOrEmail: '', password: '', rememberMe: false },
  });

  const onSubmit = async (data: SignInFormValues) => {
    const success = await loginWithPassword(data.phoneOrEmail, data.password);
    if (!success) shake();
  };

  const handleBiometric = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!hasHardware || !isEnrolled) {
      Alert.alert(
        t('auth.biometric'),
        'Please set up Face ID or fingerprint in your device settings.',
      );
      return;
    }
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: t('auth.biometricPrompt'),
      fallbackLabel: t('auth.pin'),
      cancelLabel: t('common.cancel'),
    });
    if (result.success) router.toHome();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 48, paddingBottom: 32 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <Animated.View entering={FadeInDown.duration(400)}>
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
              marginLeft: -8,
              marginBottom: 32,
            }}
          >
            <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
          </TouchableOpacity>

          {/* Title */}
          <Text
            style={{
              fontSize: 30,
              fontWeight: '700',
              lineHeight: 36,
              letterSpacing: -0.5,
              color: theme.textPrimary,
              marginBottom: 6,
            }}
          >
            {t('auth.signInTitle')}
          </Text>
          <Text
            style={{ ...Typography.body, color: theme.textSecondary, marginBottom: 40 }}
          >
            {t('auth.signInSubtitle')}
          </Text>
        </Animated.View>

        {/* ── Form fields ── */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(150)}
          style={[shakeStyle, { gap: 20 }]}
        >
          {/* Phone / Email — no left icon per design */}
          <Controller
            control={control}
            name="phoneOrEmail"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t('auth.phoneOrEmail')}
                placeholder={t('auth.phonePlaceholder')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.phoneOrEmail?.message}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            )}
          />

          {/* Password — eye toggle via rightIcon JSX node */}
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t('auth.password')}
                placeholder={t('auth.passwordPlaceholder')}
                rightIcon={
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={showPassword ? theme.primary : theme.textMuted}
                  />
                }
                onRightIconPress={() => setShowPassword((p) => !p)}
                secureTextEntry={!showPassword}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
                autoCapitalize="none"
              />
            )}
          />
        </Animated.View>

        {/* ── Remember me + Forgot password ── */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(250)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 8,
            marginTop: 4,
            marginBottom: 20,
          }}
        >
          {/* Checkbox + label */}
          <TouchableOpacity
            onPress={() => setRememberMe((p) => !p)}
            activeOpacity={0.7}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
          >
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                borderWidth: 2,
                alignItems: 'center',
                justifyContent: 'center',
                borderColor: rememberMe ? theme.primary : theme.border,
                backgroundColor: rememberMe ? theme.primary : 'transparent',
              }}
            >
              {rememberMe && <Ionicons name="checkmark" size={13} color="#fff" />}
            </View>
            <Text style={{ ...Typography.bodySm, color: theme.textSecondary }}>
              {t('auth.rememberMe')}
            </Text>
          </TouchableOpacity>

          {/* Forgot password link */}
          <TouchableOpacity onPress={router.toForgotPassword} activeOpacity={0.7}>
            <Text style={{ ...Typography.bodySm, fontWeight: '600', color: theme.primary }}>
              {t('auth.forgotPasswordLink')}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* ── Sign In + Biometric row ── */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(320)}
          style={{ flexDirection: 'row', gap: 12, marginBottom: 32 }}
        >
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            activeOpacity={0.85}
            style={{
              flex: 1,
              height: 56,
              borderRadius: 12,
              backgroundColor: theme.primary,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            <Text style={{ ...Typography.button, color: '#fff' }}>
              {isLoading ? t('common.processing') : t('auth.signIn')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleBiometric}
            activeOpacity={0.85}
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              borderWidth: 1.5,
              borderColor: theme.border,
              backgroundColor: theme.surface,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="finger-print" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
        </Animated.View>

        {/* ── OR divider ── */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(400)}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 }}
        >
          <View style={{ flex: 1, height: 1, backgroundColor: theme.border }} />
          <Text
            style={{
              ...Typography.caption,
              color: theme.textMuted,
              textTransform: 'uppercase',
              letterSpacing: 2,
            }}
          >
            {t('common.or')}
          </Text>
          <View style={{ flex: 1, height: 1, backgroundColor: theme.border }} />
        </Animated.View>

        {/* ── Google SSO ── */}
        <Animated.View entering={FadeInDown.duration(400).delay(460)}>
          <TouchableOpacity
            onPress={() => {}}
            activeOpacity={0.85}
            style={{
              height: 56,
              borderRadius: 12,
              borderWidth: 1.5,
              borderColor: theme.border,
              backgroundColor: theme.surface,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
            }}
          >
            <GoogleIcon />
            <Text style={{ ...Typography.button, color: theme.textPrimary }}>
              {t('auth.continueWithGoogle')}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* ── Footer — sign up link at the very bottom ── */}
        <View style={{ flex: 1, minHeight: 32 }} />
        <Animated.View
          entering={FadeInDown.duration(400).delay(520)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 16,
          }}
        >
          <Text style={{ ...Typography.bodySm, color: theme.textSecondary }}>
            {t('auth.noAccount')}{' '}
          </Text>
          <Pressable onPress={router.toSignUp} hitSlop={8}>
            <Text style={{ ...Typography.bodySm, fontWeight: '700', color: theme.primary }}>
              {t('auth.signUpLink')}
            </Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
