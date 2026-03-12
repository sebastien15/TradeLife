// ─────────────────────────────────────────────────────────────────────────────
// TradeLife — Profile View Screen
// Design: 8b_profile_view_dark
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { Typography } from '@/constants/typography';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Screen } from '@/components/layout/Screen';
import { t } from '@/i18n';
import { useAppRouter } from '@/hooks/useAppRouter';

// ── Detail Row Component ─────────────────────────────────────────────────────
interface DetailRowProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value: string;
  isLast?: boolean;
}

const DetailRow = ({ icon, label, value, isLast }: DetailRowProps) => {
  const { theme } = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.md,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: theme.divider,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          backgroundColor: 'rgba(20, 184, 166, 0.1)', // Teal tint
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: Spacing.md,
        }}
      >
        <MaterialIcons name={icon} size={20} color={Colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            ...Typography.caption,
            color: theme.textMuted,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            fontWeight: '600',
            marginBottom: 2,
          }}
        >
          {label}
        </Text>
        <Text
          style={{
            ...Typography.body,
            color: theme.textPrimary,
            fontWeight: '500',
          }}
        >
          {value}
        </Text>
      </View>
    </View>
  );
};

// ── Main Screen ──────────────────────────────────────────────────────────────
export default function ProfileViewScreen() {
  const { theme } = useTheme();
  const router = useAppRouter();
  const insets = useSafeAreaInsets();
  
  // Shared value for Edit Button
  const editScale = useSharedValue(1);
  const editAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: editScale.value }],
  }));

  // Shared value for floating bottom Edit Profile button
  const bottomEditScale = useSharedValue(1);
  const bottomEditAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bottomEditScale.value }],
  }));

  // Mock Profile Data
  const profile = {
    name: 'Alex Rivers',
    subtitle: 'Professional Trader & Consultant',
    avatarUrl: 'https://i.pravatar.cc/300?u=avatar2',
    stats: {
      trades: '284',
      success: '98%',
      rating: '4.9',
    },
    plan: 'PRO MEMBER',
    renewsOn: 'Oct 24, 2024',
    email: 'alex.rivers@tradelife.com',
    phone: '+1 (555) 902-4421',
    businessType: 'Independent Proprietorship',
    location: 'San Francisco, CA',
  };

  const handleEdit = () => {
    router.push('/(tabs)/more/profile-edit');
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
          backgroundColor: Colors.primary, // Dark teal background per design header
        }}
      >
        <TouchableOpacity
          onPress={router.back}
          activeOpacity={0.7}
          style={{
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: -8,
          }}
        >
          <MaterialIcons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        
        <Text
          style={{
            flex: 1,
            textAlign: 'center',
            ...Typography.h3,
            color: Colors.white,
          }}
        >
          {t('profile.myProfile')}
        </Text>
        
        <Animated.View style={editAnimStyle}>
          <TouchableOpacity
            onPress={handleEdit}
            onPressIn={() => (editScale.value = withSpring(0.9))}
            onPressOut={() => (editScale.value = withSpring(1))}
            activeOpacity={0.7}
            style={{ paddingHorizontal: 8, paddingVertical: 4 }}
          >
            <Text style={{ ...Typography.body, color: Colors.accent, fontWeight: '600' }}>
              {t('profile.edit')}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* ── Profile Header Block ── */}
      <View
        style={{
          backgroundColor: Colors.primary,
          paddingTop: Spacing.xl * 2.5,  // Generous top space matching design
          paddingBottom: Spacing.xl,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          alignItems: 'center',
          marginBottom: -40, // Overlap effect for stats card
          zIndex: 0,
        }}
      >
        {/* Avatar */}
        <Animated.View entering={FadeInDown.duration(400).delay(50)}>
          <View style={{ position: 'relative', marginTop: Spacing.lg }}>
            <View
              style={{
                width: 100, // ≈ 80pt mapped
                height: 100,
                borderRadius: 50,
                borderWidth: 3,
                borderColor: theme.surface,
                overflow: 'hidden',
                backgroundColor: theme.surface2,
              }}
            >
              <Image
                source={{ uri: profile.avatarUrl }}
                style={{ width: '100%', height: '100%' }}
                contentFit="cover"
                transition={200}
              />
            </View>
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: Colors.accent, // Orange icon
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2,
                borderColor: theme.surface,
              }}
            >
              <MaterialIcons name="camera-alt" size={14} color={Colors.white} />
            </View>
          </View>
        </Animated.View>

        {/* Name & Subtitle */}
        <Animated.View entering={FadeInDown.duration(400).delay(100)} style={{ alignItems: 'center', marginTop: Spacing.md, paddingBottom: 60 }}>
          <Text style={{ ...Typography.h2, color: Colors.white, marginBottom: 4 }}>
            {profile.name}
          </Text>
          <Text style={{ ...Typography.bodySm, color: 'rgba(255, 255, 255, 0.7)' }}>
            {profile.subtitle}
          </Text>
        </Animated.View>
      </View>

      <View style={{ paddingHorizontal: Spacing.md, flex: 1, zIndex: 1 }}>
        
        {/* ── Stats Card ── */}
        <Animated.View entering={FadeInDown.duration(400).delay(150)}>
          <View
            style={{
              backgroundColor: theme.surface,
              borderRadius: 16,
              paddingVertical: Spacing.lg,
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 4,
            }}
          >
            {/* Trades */}
            <View style={{ alignItems: 'center', flex: 1 }}>
              <Text style={{ ...Typography.h2, color: Colors.primary, marginBottom: 2 }}>{profile.stats.trades}</Text>
              <Text style={{ ...Typography.caption, color: theme.textMuted, fontWeight: '600', letterSpacing: 0.5 }}>{t('profile.trades')}</Text>
            </View>
            
            <View style={{ width: 1, backgroundColor: theme.divider }} />
            
            {/* Success */}
            <View style={{ alignItems: 'center', flex: 1 }}>
              <Text style={{ ...Typography.h2, color: Colors.primary, marginBottom: 2 }}>{profile.stats.success}</Text>
              <Text style={{ ...Typography.caption, color: theme.textMuted, fontWeight: '600', letterSpacing: 0.5 }}>{t('profile.success')}</Text>
            </View>
            
            <View style={{ width: 1, backgroundColor: theme.divider }} />
            
            {/* Rating */}
            <View style={{ alignItems: 'center', flex: 1 }}>
              <Text style={{ ...Typography.h2, color: Colors.primary, marginBottom: 2 }}>{profile.stats.rating}</Text>
              <Text style={{ ...Typography.caption, color: theme.textMuted, fontWeight: '600', letterSpacing: 0.5 }}>{t('profile.rating')}</Text>
            </View>
          </View>
        </Animated.View>

        {/* ── Pro Membership Card ── */}
        <Animated.View entering={FadeInDown.duration(400).delay(200)} style={{ marginTop: Spacing.lg }}>
          <View
            style={{
              backgroundColor: Colors.accent,
              borderRadius: 16,
              padding: Spacing.lg,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View>
              <Text style={{ ...Typography.caption, color: 'rgba(255,255,255,0.8)', fontWeight: '700', marginBottom: 2 }}>
                {t('profile.currentPlan')}
              </Text>
              <Text style={{ fontSize: 22, fontWeight: '800', color: Colors.white, marginBottom: 4 }}>
                {t('profile.proMember')}
              </Text>
              <Text style={{ ...Typography.bodySm, color: 'rgba(255,255,255,0.9)' }}>
                {t('profile.renewsOn', { date: profile.renewsOn })}
              </Text>
            </View>
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                backgroundColor: 'rgba(255,255,255,0.2)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MaterialIcons name="workspace-premium" size={28} color={Colors.white} />
            </View>
          </View>
        </Animated.View>

        {/* ── Details List ── */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(250)}
          style={{
            marginTop: Spacing.lg,
            backgroundColor: theme.surface,
            borderRadius: 16,
            overflow: 'hidden',
          }}
        >
          <DetailRow icon="email" label={t('profile.emailAddress')} value={profile.email} />
          <DetailRow icon="phone" label={t('profile.phoneNumber')} value={profile.phone} />
          <DetailRow icon="business-center" label={t('profile.businessType')} value={profile.businessType} />
          <DetailRow icon="location-on" label={t('profile.location')} value={profile.location} isLast />
        </Animated.View>

        {/* ── Edit Profile Button ── */}
        <Animated.View entering={FadeInDown.duration(400).delay(300)} style={{ marginTop: Spacing.xl, marginBottom: Spacing.xl }}>
          <Animated.View style={bottomEditAnimStyle}>
            <TouchableOpacity
              onPress={handleEdit}
              onPressIn={() => (bottomEditScale.value = withSpring(0.96))}
              onPressOut={() => (bottomEditScale.value = withSpring(1))}
              activeOpacity={0.8}
              style={{
                backgroundColor: Colors.primary,
                borderRadius: 12,
                height: 56,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MaterialIcons name="edit" size={20} color={Colors.white} style={{ marginRight: 8 }} />
              <Text style={{ ...Typography.button, color: Colors.white }}>
                {t('profile.editProfile')}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>

      </View>
    </Screen>
  );
}
