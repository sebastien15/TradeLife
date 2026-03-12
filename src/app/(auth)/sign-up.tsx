// ─────────────────────────────────────────────────────────────────────────────
// TradeLife — Sign Up Screen
// Design: 1d_sign_up_light
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Pressable,
  type ViewStyle,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
import { Svg, Path } from 'react-native-svg';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/theme';
import { Typography } from '@/constants/typography';
import { Colors } from '@/constants/colors';
import { Input } from '@/components/ui/Input';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useAppRouter } from '@/hooks/useAppRouter';
import { useAuth } from '@/hooks/useAuth';
import { t } from '@/i18n';
import {
  signUpSchema,
  type SignUpFormValues,
  getPasswordStrength,
  type PasswordStrength,
} from '@/utils/validation';

// ── Colored Google icon ───────────────────────────────────────────────────────
const GoogleIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <Path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <Path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <Path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </Svg>
);

// ── Country code data ─────────────────────────────────────────────────────────
const COUNTRY_CODES = [
  { flag: '🇷🇼', code: '+250', name: 'Rwanda' },
  { flag: '🇺🇸', code: '+1',   name: 'United States' },
  { flag: '🇰🇪', code: '+254', name: 'Kenya' },
  { flag: '🇨🇳', code: '+86',  name: 'China' },
];

const STRENGTH_COLOR: Record<PasswordStrength, string> = {
  weak: Colors.error,
  fair: Colors.warning,
  good: Colors.info,
  strong: Colors.success,
};

const STRENGTH_LABEL_KEY: Record<PasswordStrength, string> = {
  weak: 'auth.strengthWeak',
  fair: 'auth.strengthFair',
  good: 'auth.strengthGood',
  strong: 'auth.strengthStrong',
};

export default function SignUpScreen() {
  const { theme, isDark } = useTheme();
  const router = useAppRouter();
  const { register, isLoading } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [countryCode, setCountryCode] = useState('+250');
  const [countryFlag, setCountryFlag] = useState('🇷🇼');
  const [showCodePicker, setShowCodePicker] = useState(false);
  const [pickerTop, setPickerTop] = useState(0);
  const countryBtnRef = useRef<View>(null);

  const handleCountryPress = () => {
    if (showCodePicker) {
      setShowCodePicker(false);
      return;
    }
    countryBtnRef.current?.measure((_x, _y, _w, height, _pageX, pageY) => {
      setPickerTop(pageY + height + 4);
      setShowCodePicker(true);
    });
  };

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: '',
      phoneOrEmail: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: undefined,
      referralCode: '',
    },
  });

  const password = watch('password');
  const { strength, score } = getPasswordStrength(password ?? '');

  const onSubmit = async (data: SignUpFormValues) => {
    const isPhone = /^\+?[\d\s\-()]{7,}$/.test(data.phoneOrEmail);
    await register({
      fullName: data.fullName,
      email: isPhone ? '' : data.phoneOrEmail,
      phone: isPhone ? data.phoneOrEmail : '',
      countryCode: 'RW',
      businessType: 'importer',
      language: 'en',
      password: data.password,
    });
  };

  const handleTermsToggle = () => {
    const next = !termsChecked;
    setTermsChecked(next);
    setValue('agreeToTerms', next ? true : (undefined as never), {
      shouldValidate: true,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* ── TopAppBar: back button + title inline ── */}
      <Animated.View
        entering={FadeInDown.duration(400)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 24,
          paddingTop: 48,
          paddingBottom: 16,
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
            fontSize: 20,
            fontWeight: '700',
            letterSpacing: -0.3,
            marginLeft: 16,
            color: theme.textPrimary,
          }}
        >
          {t('auth.signUpTitle')}
        </Text>
      </Animated.View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32, gap: 16 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Section label ── */}
        <Animated.Text
          entering={FadeInDown.duration(400).delay(80)}
          style={{
            fontSize: 12,
            fontWeight: '700',
            letterSpacing: 2.5,
            textTransform: 'uppercase',
            color: theme.primary,
            opacity: 0.8,
            marginBottom: 4,
          }}
        >
          {t('auth.accountDetails')}
        </Animated.Text>

        {/* ── Full Name ── */}
        <Animated.View entering={FadeInDown.duration(400).delay(140)}>
          <Controller
            control={control}
            name="fullName"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t('auth.fullName')}
                placeholder={t('auth.fullNamePlaceholder')}
                leftIcon={
                  <Ionicons name="person-outline" size={20} color={theme.textMuted} />
                }
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.fullName?.message}
                autoCapitalize="words"
                autoComplete="name"
              />
            )}
          />
        </Animated.View>

        {/* ── Phone / Email with country code selector ── */}
        <Animated.View entering={FadeInDown.duration(400).delay(200)}>
          <Text
            style={{
              ...Typography.label,
              color: theme.textSecondary,
              marginBottom: 6,
              marginLeft: 4,
            }}
          >
            {t('auth.phoneOrEmail')}
          </Text>
          <Controller
            control={control}
            name="phoneOrEmail"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {/* Country code picker button — ref for position measurement */}
                <View ref={countryBtnRef} collapsable={false}>
                  <TouchableOpacity
                    onPress={handleCountryPress}
                    activeOpacity={0.7}
                    style={{
                      width: 92,
                      height: 56,
                      borderRadius: 16,
                      borderWidth: 1,
                      borderColor: showCodePicker ? theme.primary : theme.border,
                      backgroundColor: theme.surface,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 4,
                    }}
                  >
                    <Text style={{ fontSize: 15 }}>{countryFlag}</Text>
                    <Text style={{ fontSize: 13, fontWeight: '500', color: theme.textPrimary }}>
                      {countryCode}
                    </Text>
                    <Ionicons
                      name={showCodePicker ? 'chevron-up' : 'chevron-down'}
                      size={13}
                      color={theme.textMuted}
                    />
                  </TouchableOpacity>
                </View>

                {/* Phone / email text input */}
                <TextInput
                  placeholder={t('auth.phoneEmailShort')}
                  placeholderTextColor={theme.textMuted}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  style={{
                    flex: 1,
                    height: 56,
                    paddingHorizontal: 16,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: errors.phoneOrEmail ? theme.error : theme.border,
                    backgroundColor: theme.surface,
                    fontSize: 16,
                    color: theme.textPrimary,
                  }}
                />
              </View>
            )}
          />
          {errors.phoneOrEmail && (
            <Text
              style={{
                ...Typography.caption,
                color: theme.error,
                marginTop: 4,
                marginLeft: 4,
              }}
            >
              {errors.phoneOrEmail.message}
            </Text>
          )}

        </Animated.View>

        {/* ── Password ── */}
        <Animated.View entering={FadeInDown.duration(400).delay(260)}>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t('auth.password')}
                placeholder={t('auth.createPasswordPlaceholder')}
                leftIcon={
                  <Ionicons name="lock-closed-outline" size={20} color={theme.textMuted} />
                }
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
          {/* Password strength indicator */}
          {(password?.length ?? 0) > 0 && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                marginTop: 6,
              }}
            >
              <ProgressBar progress={score} color={STRENGTH_COLOR[strength]} height={4} />
              <Text
                style={{
                  ...Typography.caption,
                  minWidth: 48,
                  textAlign: 'right',
                  color: STRENGTH_COLOR[strength],
                }}
              >
                {t(STRENGTH_LABEL_KEY[strength])}
              </Text>
            </View>
          )}
        </Animated.View>

        {/* ── Confirm Password ── */}
        <Animated.View entering={FadeInDown.duration(400).delay(310)}>
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t('auth.confirmPassword')}
                placeholder={t('auth.confirmPasswordPlaceholder')}
                leftIcon={
                  <Ionicons name="lock-closed-outline" size={20} color={theme.textMuted} />
                }
                rightIcon={
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={showConfirmPassword ? theme.primary : theme.textMuted}
                  />
                }
                onRightIconPress={() => setShowConfirmPassword((p) => !p)}
                secureTextEntry={!showConfirmPassword}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.confirmPassword?.message}
                autoCapitalize="none"
              />
            )}
          />
        </Animated.View>

        {/* ── Terms & Conditions checkbox ── */}
        <Animated.View entering={FadeInDown.duration(400).delay(370)}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: 12,
              paddingVertical: 8,
              paddingHorizontal: 4,
            }}
            onPress={handleTermsToggle}
            activeOpacity={0.7}
          >
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                borderWidth: 2,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 1,
                borderColor: errors.agreeToTerms ? theme.error : theme.border,
                backgroundColor: termsChecked ? theme.primary : 'transparent',
              }}
            >
              {termsChecked && (
                <Ionicons name="checkmark" size={12} color="#fff" />
              )}
            </View>
            <Text
              style={{
                ...Typography.bodySm,
                flex: 1,
                lineHeight: 22,
                color: theme.textSecondary,
              }}
            >
              {t('auth.agreeToTermsPrefix')}{' '}
              <Text style={{ color: theme.primary, fontWeight: '600' }}>
                {t('auth.termsOfService')}
              </Text>
              {' & '}
              <Text style={{ color: theme.primary, fontWeight: '600' }}>
                {t('auth.privacyPolicy')}
              </Text>
            </Text>
          </TouchableOpacity>
          {errors.agreeToTerms && (
            <Text
              style={{
                ...Typography.caption,
                marginTop: 2,
                marginLeft: 36,
                color: theme.error,
              }}
            >
              {errors.agreeToTerms.message}
            </Text>
          )}
        </Animated.View>

        {/* ── Create Account button ── */}
        <Animated.View entering={FadeInDown.duration(400).delay(430)}>
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            activeOpacity={0.85}
            style={{
              height: 56,
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.primary,
              opacity: isLoading ? 0.7 : 1,
              shadowColor: theme.primary,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.25,
              shadowRadius: 16,
              elevation: 8,
            }}
          >
            <Text style={{ ...Typography.button, color: '#fff' }}>
              {isLoading ? t('auth.creatingAccount') : t('auth.signUp')}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* ── OR divider ── */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(490)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            paddingVertical: 4,
          }}
        >
          <View style={{ flex: 1, height: 1, backgroundColor: theme.border }} />
          <Text
            style={{
              fontSize: 12,
              fontWeight: '700',
              color: theme.textMuted,
              textTransform: 'uppercase',
              letterSpacing: 2.5,
            }}
          >
            {t('common.or')}
          </Text>
          <View style={{ flex: 1, height: 1, backgroundColor: theme.border }} />
        </Animated.View>

        {/* ── Google SSO ── */}
        <Animated.View entering={FadeInDown.duration(400).delay(550)}>
          <TouchableOpacity
            onPress={() => {}}
            activeOpacity={0.85}
            style={{
              height: 56,
              borderRadius: 16,
              borderWidth: 2,
              borderColor: theme.border,
              backgroundColor: 'transparent',
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

        {/* ── Footer — already have account ── */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(600)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 32,
            paddingBottom: 8,
          }}
        >
          <Text style={{ ...Typography.bodySm, color: theme.textSecondary }}>
            {t('auth.alreadyHaveAccount')}{' '}
          </Text>
          <Pressable onPress={router.toSignIn} hitSlop={8}>
            <Text style={{ ...Typography.bodySm, fontWeight: '700', color: theme.primary }}>
              {t('auth.signIn')}
            </Text>
          </Pressable>
        </Animated.View>
      </ScrollView>

      {/* ── Floating country picker — absolutely positioned over everything ── */}
      {showCodePicker && (
        <>
          {/* Transparent backdrop: tap outside to dismiss */}
          <Pressable
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 99,
            } as ViewStyle}
            onPress={() => setShowCodePicker(false)}
          />
          {/* Floating dropdown card */}
          <Animated.View
            entering={FadeIn.duration(120)}
            style={{
              position: 'absolute',
              top: pickerTop,
              left: 24,
              width: 200,
              zIndex: 100,
              elevation: 100,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: theme.border,
              backgroundColor: theme.surface,
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.12,
              shadowRadius: 16,
            } as ViewStyle}
          >
            {COUNTRY_CODES.map((c, idx) => (
              <TouchableOpacity
                key={c.code}
                activeOpacity={0.7}
                onPress={() => {
                  setCountryCode(c.code);
                  setCountryFlag(c.flag);
                  setShowCodePicker(false);
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  paddingVertical: 13,
                  paddingHorizontal: 16,
                  borderTopWidth: idx === 0 ? 0 : 1,
                  borderTopColor: theme.border,
                  backgroundColor: countryCode === c.code ? theme.primary + '12' : 'transparent',
                }}
              >
                <Text style={{ fontSize: 20 }}>{c.flag}</Text>
                <Text style={{ flex: 1, fontSize: 14, fontWeight: '500', color: theme.textPrimary }}>
                  {c.name}
                </Text>
                <Text style={{ fontSize: 12, color: theme.textMuted }}>{c.code}</Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        </>
      )}
    </SafeAreaView>
  );
}
