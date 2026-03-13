// ─────────────────────────────────────────────────────────────────────────────
// TradeLife — Profile Edit Screen
// Design: 8c_edit_profile_dark
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Modal, TextInput } from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme';
import { Typography } from '@/constants/typography';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Screen } from '@/components/layout/Screen';
import { Input } from '@/components/ui/Input';
import { t } from '@/i18n';
import { useAppRouter } from '@/hooks/useAppRouter';

// ── Validation Schema ────────────────────────────────────────────────────────
const profileEditSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  bio: z.string().max(160, 'Bio must be under 160 characters').optional(),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(5, 'Please enter a valid phone number').optional(),
});

type ProfileEditFormValues = z.infer<typeof profileEditSchema>;

// ── Main Component ───────────────────────────────────────────────────────────
export default function ProfileEditScreen() {
  const { theme, isDark } = useTheme();
  const router = useAppRouter();
  const insets = useSafeAreaInsets();

  const [avatarUri, setAvatarUri] = useState<string>('https://i.pravatar.cc/300?u=avatar2');
  const [isSaving, setIsSaving] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Form Setup
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileEditFormValues>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: {
      fullName: 'Alex Rivers',
      username: 'arivers_trade',
      bio: 'Professional day trader focused on tech equities and crypto volatility.',
      email: 'alex.rivers@tradelife.com',
      phone: '+1 (555) 902-4421',
    },
  });

  // Animations
  const saveBtnScale = useSharedValue(1);
  const saveBtnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: saveBtnScale.value }],
  }));

  const formTranslateX = useSharedValue(0);
  const formShakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: formTranslateX.value }],
  }));

  // Handlers
  const handlePickAvatar = () => {
    Alert.alert(t('profile.changePhoto'), 'Choose a photo source', [
      {
        text: 'Camera',
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission needed', 'Camera access required.');
            return;
          }
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          });
          if (!result.canceled) setAvatarUri(result.assets[0].uri);
        },
      },
      {
        text: 'Photo Library',
        onPress: async () => {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission needed', 'Photo library access required.');
            return;
          }
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          });
          if (!result.canceled) setAvatarUri(result.assets[0].uri);
        },
      },
      { text: t('profile.cancel'), style: 'cancel' },
    ]);
  };

  const triggerErrorShake = () => {
    formTranslateX.value = withSequence(
      withSpring(-10, { damping: 2, stiffness: 500 }),
      withSpring(10, { damping: 2, stiffness: 500 }),
      withSpring(-10, { damping: 2, stiffness: 500 }),
      withSpring(0, { damping: 2, stiffness: 500 })
    );
  };

  const onSubmit = async (data: ProfileEditFormValues) => {
    setIsSaving(true);
    try {
      // Mock save action - in production, call API here

      // Simulate network wait
      await new Promise(resolve => setTimeout(resolve, 800));

      router.back();
    } catch (e) {
      triggerErrorShake();
    } finally {
      setIsSaving(false);
    }
  };

  const onError = () => {
    triggerErrorShake();
  };

  return (
    <Screen edges={['left', 'right']} backgroundColor={theme.background} scroll>
      
      {/* ── Custom Header ── */}
      <View
        style={{
          paddingTop: insets.top + Spacing.sm,
          paddingBottom: Spacing.sm,
          paddingHorizontal: Spacing.md,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottomWidth: 1,
          borderBottomColor: theme.divider,
        }}
      >
        <TouchableOpacity
          onPress={router.back}
          activeOpacity={0.7}
          style={{
            paddingVertical: 8,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <MaterialIcons name="close" size={20} color={theme.textSecondary} style={{ marginRight: 4 }} />
          <Text style={{ ...Typography.body, color: theme.textSecondary }}>
            {t('profile.cancel')}
          </Text>
        </TouchableOpacity>
        
        <Text style={{ ...Typography.h3, color: theme.textPrimary }}>
          {t('profile.editProfile')}
        </Text>
        
        <Animated.View style={saveBtnStyle}>
          <TouchableOpacity
            onPress={handleSubmit(onSubmit, onError)}
            onPressIn={() => (saveBtnScale.value = withSpring(0.96))}
            onPressOut={() => (saveBtnScale.value = withSpring(1))}
            disabled={isSaving}
            activeOpacity={0.7}
            style={{ paddingVertical: 8, paddingHorizontal: 4 }}
          >
            <Text style={{ ...Typography.body, color: Colors.primary, fontWeight: '700', opacity: isSaving ? 0.5 : 1 }}>
              {t('profile.save')}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <ScrollView 
        contentContainerStyle={{ paddingBottom: Spacing.xxl }}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View style={formShakeStyle}>
          
          {/* ── Avatar Section ── */}
          <Animated.View entering={FadeInDown.duration(400).delay(50)} style={{ alignItems: 'center', marginVertical: Spacing.xl }}>
            <TouchableOpacity onPress={handlePickAvatar} activeOpacity={0.8}>
              <View style={{ position: 'relative' }}>
                <View
                  style={{
                    width: 110,
                    height: 110,
                    borderRadius: 55,
                    borderWidth: 2,
                    borderColor: theme.divider,
                    overflow: 'hidden',
                    backgroundColor: theme.surface2,
                  }}
                >
                  <Image
                    source={{ uri: avatarUri }}
                    style={{ width: '100%', height: '100%' }}
                    contentFit="cover"
                  />
                </View>
                <View
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: theme.surface,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 2,
                    borderColor: theme.background,
                    elevation: 2,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                  }}
                >
                  <MaterialIcons name="camera-alt" size={16} color={theme.textPrimary} />
                </View>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handlePickAvatar} style={{ marginTop: Spacing.md }}>
              <Text style={{ ...Typography.bodySm, color: Colors.primary, fontWeight: '600' }}>
                {t('profile.changePhoto')}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* ── Form Fields ── */}
          <View style={{ paddingHorizontal: Spacing.md, gap: Spacing.lg }}>
            
            <Animated.View entering={FadeInDown.duration(400).delay(100)}>
              <Controller
                control={control}
                name="fullName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label={t('profile.fullName')}
                    placeholder={t('profile.fullNamePlaceholder')}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.fullName?.message}
                    autoCapitalize="words"
                  />
                )}
              />
            </Animated.View>

            <Animated.View entering={FadeInDown.duration(400).delay(150)}>
              <Controller
                control={control}
                name="username"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label={t('profile.username')}
                    placeholder={t('profile.usernamePlaceholder')}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.username?.message}
                    autoCapitalize="none"
                    leftIcon={<Text style={{ color: theme.textMuted, fontSize: 16 }}>@</Text>}
                  />
                )}
              />
            </Animated.View>

            <Animated.View entering={FadeInDown.duration(400).delay(200)}>
              <Controller
                control={control}
                name="bio"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label={t('profile.bio')}
                    placeholder={t('profile.bioPlaceholder')}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.bio?.message}
                    multiline
                    numberOfLines={3}
                  />
                )}
              />
            </Animated.View>

            <Animated.View entering={FadeInDown.duration(400).delay(250)}>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label={t('profile.emailAddress')}
                    placeholder={t('profile.emailPlaceholder')}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.email?.message}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    leftIcon={<MaterialIcons name="email" size={20} color={theme.textMuted} />}
                  />
                )}
              />
            </Animated.View>

            <Animated.View entering={FadeInDown.duration(400).delay(300)}>
              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label={t('profile.phoneNumber')}
                    placeholder={t('profile.phonePlaceholder')}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.phone?.message}
                    keyboardType="phone-pad"
                    leftIcon={<MaterialIcons name="phone" size={20} color={theme.textMuted} />}
                  />
                )}
              />
            </Animated.View>

            {/* ── Save Profile Button ── */}
            <Animated.View entering={FadeInDown.duration(400).delay(350)} style={{ marginTop: Spacing.xl }}>
              <TouchableOpacity
                onPress={handleSubmit(onSubmit, onError)}
                disabled={isSaving}
                activeOpacity={0.85}
                style={{
                  height: 56,
                  borderRadius: 16,
                  backgroundColor: Colors.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: isSaving ? 0.7 : 1,
                }}
              >
                <Text style={{ ...Typography.button, color: Colors.white }}>
                  {isSaving ? '...' : t('profile.save')}
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {/* ── Deactivate Account ── */}
            <Animated.View entering={FadeInDown.duration(400).delay(400)} style={{ marginTop: Spacing.md, alignItems: 'center' }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setDeleteConfirmText('');
                  setShowDeactivateModal(true);
                }}
                style={{
                  padding: Spacing.sm,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ ...Typography.bodySm, color: Colors.error }}>
                  {t('profile.deactivateAccount')}
                </Text>
              </TouchableOpacity>
            </Animated.View>
            
          </View>
        </Animated.View>
      </ScrollView>

      {/* ── Deactivate Modal ── */}
      <Modal visible={showDeactivateModal} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: Spacing.xl }}>
          <View style={{ backgroundColor: theme.surface, padding: Spacing.xl, borderRadius: 16, width: '100%', maxWidth: 400 }}>
            <Text style={{ ...Typography.h3, color: Colors.error, marginBottom: Spacing.sm }}>
              {t('profile.deactivateAccount')}
            </Text>
            <Text style={{ ...Typography.body, color: theme.textSecondary, marginBottom: Spacing.lg }}>
              {t('profile.farewellMessage')}
            </Text>
            
            <Text style={{ ...Typography.caption, color: theme.textPrimary, marginBottom: Spacing.sm, fontWeight: '600' }}>
              {t('profile.typeDeletePrompt')}
            </Text>
            <TextInput
              value={deleteConfirmText}
              onChangeText={setDeleteConfirmText}
              placeholder="DELETE"
              placeholderTextColor={theme.textMuted}
              style={{
                borderWidth: 1,
                borderColor: theme.border,
                borderRadius: 8,
                padding: Spacing.md,
                ...Typography.body,
                color: theme.textPrimary,
                marginBottom: Spacing.xl,
              }}
              autoCapitalize="characters"
            />
            
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: Spacing.md }}>
              <TouchableOpacity onPress={() => setShowDeactivateModal(false)} style={{ paddingVertical: 10, paddingHorizontal: 16 }}>
                <Text style={{ ...Typography.button, color: theme.textSecondary }}>{t('profile.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={deleteConfirmText !== 'DELETE'}
                onPress={() => {
                  setShowDeactivateModal(false);
                  router.toSignIn();
                }}
                style={{ 
                  backgroundColor: Colors.error,
                  paddingVertical: 10, 
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  opacity: deleteConfirmText === 'DELETE' ? 1 : 0.5 
                }}
              >
                <Text style={{ ...Typography.button, color: Colors.white }}>{t('profile.confirmDeactivate')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </Screen>
  );
}
