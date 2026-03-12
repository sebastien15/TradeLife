// ─────────────────────────────────────────────────────────────────────────────
// TradeLife — Profile Setup Screen (Step 3 of 4)
// Design: 1f_profile_setup_dark
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/theme';
import { Typography } from '@/constants/typography';
import { Input } from '@/components/ui/Input';
import { Dropdown } from '@/components/forms/Dropdown';
import { useAppRouter } from '@/hooks/useAppRouter';
import { useAuth } from '@/hooks/useAuth';
import { profileSetupSchema, type ProfileSetupFormValues } from '@/utils/validation';
import { t } from '@/i18n';

const STEPS = ['Account', 'Verify', 'Profile', 'Done'];
const CURRENT_STEP = 2;

const BUSINESS_TYPES = [
  { label: 'Importer', value: 'importer', icon: 'download-outline' as const },
  { label: 'Exporter', value: 'exporter', icon: 'upload-outline' as const },
  { label: 'Both', value: 'both', icon: 'swap-horizontal-outline' as const },
];

const COUNTRIES = [
  { label: 'Rwanda', value: 'RW', icon: 'flag-outline' as const },
  { label: 'China', value: 'CN', icon: 'flag-outline' as const },
  { label: 'Kenya', value: 'KE', icon: 'flag-outline' as const },
  { label: 'Uganda', value: 'UG', icon: 'flag-outline' as const },
  { label: 'United States', value: 'US', icon: 'flag-outline' as const },
  { label: 'Other', value: 'OTHER', icon: 'globe-outline' as const },
];

export default function ProfileSetupScreen() {
  const { theme, isDark } = useTheme();
  const router = useAppRouter();
  const { setOnboardingComplete } = useAuth();

  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileSetupFormValues>({
    resolver: zodResolver(profileSetupSchema),
    defaultValues: { fullName: '', businessType: undefined, country: undefined },
  });

  const pickAvatar = () => {
    Alert.alert(t('auth.profilePhoto'), t('auth.chooseSource' as never) ?? 'Choose a photo source', [
      {
        text: 'Camera',
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') { Alert.alert('Permission needed', 'Camera access required.'); return; }
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true, aspect: [1, 1], quality: 0.8,
          });
          if (!result.canceled) setAvatarUri(result.assets[0].uri);
        },
      },
      {
        text: 'Photo Library',
        onPress: async () => {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') { Alert.alert('Permission needed', 'Photo library access required.'); return; }
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true, aspect: [1, 1], quality: 0.8,
          });
          if (!result.canceled) setAvatarUri(result.assets[0].uri);
        },
      },
      { text: t('common.cancel'), style: 'cancel' },
    ]);
  };

  const onSubmit = async (_data: ProfileSetupFormValues) => {
    setIsSubmitting(true);
    try {
      // Navigate to permissions; onboarding is marked complete there
      router.toPermissions();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    setOnboardingComplete(true);
    router.toHome();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* ── Header: back + step indicator ── */}
      <Animated.View
        entering={FadeIn.duration(300)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 24,
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

        {/* Step label + dots */}
        <View style={{ flex: 1, alignItems: 'center', gap: 6 }}>
          <Text
            style={{
              fontSize: 11,
              fontWeight: '700',
              letterSpacing: 2,
              textTransform: 'uppercase',
              color: theme.primary,
            }}
          >
            {`Step ${CURRENT_STEP + 1} of ${STEPS.length}`}
          </Text>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {STEPS.map((_, i) => (
              <View
                key={i}
                style={{
                  width: i === CURRENT_STEP ? 20 : 8,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: i <= CURRENT_STEP ? theme.primary : theme.border,
                }}
              />
            ))}
          </View>
        </View>

        {/* Spacer to balance back button */}
        <View style={{ width: 40 }} />
      </Animated.View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40, gap: 20 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Title + subtitle */}
        <Animated.View entering={FadeInDown.duration(400).delay(80)}>
          <Text style={{ ...Typography.h1, color: theme.textPrimary, marginBottom: 4 }}>
            {t('auth.profileSetup')}
          </Text>
          <Text style={{ ...Typography.body, color: theme.textSecondary }}>
            {t('auth.profileSetupSubtitle')}
          </Text>
        </Animated.View>

        {/* ── Avatar upload ── */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(160)}
          style={{ alignItems: 'center' }}
        >
          <TouchableOpacity onPress={pickAvatar} activeOpacity={0.8} style={{ position: 'relative' }}>
            {avatarUri ? (
              <Image
                source={{ uri: avatarUri }}
                style={{ width: 120, height: 120, borderRadius: 60 }}
                contentFit="cover"
              />
            ) : (
              <View
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 16,
                  borderWidth: 2,
                  borderStyle: 'dashed',
                  borderColor: theme.primary,
                  backgroundColor: theme.primary + '0d',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <Ionicons name="camera-outline" size={32} color={theme.primary} />
                <Text style={{ ...Typography.caption, color: theme.primary, textAlign: 'center' }}>
                  {t('auth.uploadPhoto')}
                </Text>
              </View>
            )}

            {/* Floating edit FAB */}
            <Animated.View
              entering={ZoomIn.duration(300).delay(400)}
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: theme.primary,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2,
                borderColor: theme.background,
              }}
            >
              <Ionicons name="camera" size={13} color="#fff" />
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>

        {/* Full Name */}
        <Animated.View entering={FadeInDown.duration(400).delay(240)}>
          <Controller
            control={control}
            name="fullName"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t('auth.fullName')}
                placeholder="Jean Baptiste Nkurunziza"
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

        {/* Business Type */}
        <Animated.View entering={FadeInDown.duration(400).delay(300)}>
          <Controller
            control={control}
            name="businessType"
            render={({ field: { onChange, value } }) => (
              <Dropdown
                label={t('auth.businessType')}
                placeholder="Select your industry"
                items={BUSINESS_TYPES}
                value={value}
                onValueChange={onChange}
                error={errors.businessType?.message}
              />
            )}
          />
        </Animated.View>

        {/* Country */}
        <Animated.View entering={FadeInDown.duration(400).delay(360)}>
          <Controller
            control={control}
            name="country"
            render={({ field: { onChange, value } }) => (
              <Dropdown
                label={t('common.selectCountry')}
                placeholder="Select country"
                items={COUNTRIES}
                value={value}
                onValueChange={onChange}
                error={errors.country?.message}
              />
            )}
          />
        </Animated.View>

        {/* Complete Setup button */}
        <Animated.View entering={FadeInDown.duration(400).delay(440)}>
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            activeOpacity={0.85}
            style={{
              height: 56,
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.primary,
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            <Text style={{ ...Typography.button, color: '#fff' }}>
              {isSubmitting ? t('auth.completingSetup') : t('auth.completeSetup')}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Skip for now */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(500)}
          style={{ alignItems: 'center' }}
        >
          <TouchableOpacity onPress={handleSkip} style={{ padding: 8 }}>
            <Text
              style={{
                ...Typography.bodySm,
                color: theme.textSecondary,
                textDecorationLine: 'underline',
              }}
            >
              {t('auth.skipForNow')}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
