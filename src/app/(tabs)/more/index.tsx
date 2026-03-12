// ─────────────────────────────────────────────────────────────────────────────
// TradeLife — More Screen
// Design: 8a_more_screen_dark
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
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { Typography } from '@/constants/typography';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Screen } from '@/components/layout/Screen';

import { t } from '@/i18n';
import { useAppRouter } from '@/hooks/useAppRouter';

// ── MenuItem Component ───────────────────────────────────────────────────────
interface MenuItemProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  onPress: () => void;
  isLast?: boolean;
}

const MenuItem = ({ icon, title, onPress, isLast }: MenuItemProps) => {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animStyle}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={() => {
          scale.value = withSpring(0.96);
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
        activeOpacity={0.7}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: 75, // ≈ 56pt
          paddingHorizontal: Spacing.md,
          borderBottomWidth: isLast ? 0 : 1,
          borderBottomColor: theme.divider,
        }}
        className="active:bg-white/5" // NativeWind active state feedback
      >
        <MaterialIcons
          name={icon}
          size={24}
          color={Colors.primary}
          style={{ marginRight: Spacing.md }}
        />
        <Text
          style={{
            ...Typography.body,
            color: theme.textPrimary,
            flex: 1,
          }}
        >
          {title}
        </Text>
        <MaterialIcons name="chevron-right" size={24} color={theme.textMuted} />
      </TouchableOpacity>
    </Animated.View>
  );
};

// ── Main Screen ──────────────────────────────────────────────────────────────
export default function MoreScreen() {
  const { theme } = useTheme();
  const router = useAppRouter();
  const insets = useSafeAreaInsets();
  
  // In a real implementation this would come from useAuth
  // Setting a mock for the avatar view
  const user = {
    name: 'John Mukwano',
    email: 'john.mukwano@example.com',
    avatarUrl: 'https://i.pravatar.cc/300?u=123',
    isPro: true
  };

  const handleLogout = () => {
    // router.signOut() or authStore.signOut() in real usage
    console.log('logout out');
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
          borderBottomWidth: 1,
          borderBottomColor: theme.divider,
          backgroundColor: theme.background,
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
              marginLeft: -8,
            }}
          >
            <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
        <Text
          style={{
            flex: 1,
            textAlign: 'center',
            ...Typography.h3,
            color: theme.textPrimary,
            paddingRight: 32, // Offset for back button
          }}
        >
          {t('more.title')}
        </Text>
      </View>

      {/* ── Profile Header ── */}
      <LinearGradient
        colors={Colors.gradientProfile}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: Spacing.xl,
        }}
      >
        <View
          style={{
            width: 106, // ≈ 80pt
            height: 106,
            borderRadius: 53,
            borderWidth: 4,
            borderColor: Colors.white,
            backgroundColor: theme.surface2,
            overflow: 'hidden',
          }}
        >
          <Image
            source={{ uri: user.avatarUrl }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            transition={200}
          />
        </View>
        <View style={{ marginTop: Spacing.md, alignItems: 'center' }}>
          <Text
            style={{
              ...Typography.h2,
              color: Colors.white,
              marginBottom: 4,
            }}
          >
            {user.name}
          </Text>
          <Text
            style={{
              ...Typography.bodySm,
              color: 'rgba(255,255,255,0.8)',
            }}
          >
            {user.email}
          </Text>
          {user.isPro && (
            <View
              style={{
                marginTop: Spacing.sm,
                paddingHorizontal: 12,
                paddingVertical: 2,
                borderRadius: 9999,
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.3)',
              }}
            >
              <Text
                style={{
                  ...Typography.caption,
                  fontWeight: '600',
                  color: Colors.white,
                  letterSpacing: 0.5,
                  textTransform: 'uppercase',
                }}
              >
                {t('more.proMember')}
              </Text>
            </View>
          )}
        </View>
      </LinearGradient>

      {/* ── Menu List ── */}
      <View style={{ flex: 1, paddingBottom: Spacing.xl * 2 }}>
        
        {/* TOOLS */}
        <Animated.View entering={FadeInDown.duration(400).delay(100)} style={{ marginTop: Spacing.lg }}>
          <Text
            style={{
              ...Typography.sectionLabel,
              paddingHorizontal: Spacing.md,
              paddingVertical: Spacing.sm,
              color: Colors.primary,
              textTransform: 'uppercase',
            }}
          >
            {t('more.tools')}
          </Text>
          <View style={{ backgroundColor: theme.surface }}>
            <MenuItem icon="analytics" title={t('more.marketInsights')} onPress={() => {}} />
            <MenuItem icon="notifications" title={t('more.priceAlerts')} onPress={() => {}} />
            <MenuItem icon="calculate" title={t('more.tradeCalculator')} onPress={() => {}} isLast />
          </View>
        </Animated.View>

        {/* RESOURCES */}
        <Animated.View entering={FadeInDown.duration(400).delay(150)} style={{ marginTop: Spacing.lg }}>
          <Text
            style={{
              ...Typography.sectionLabel,
              paddingHorizontal: Spacing.md,
              paddingVertical: Spacing.sm,
              color: Colors.primary,
              textTransform: 'uppercase',
            }}
          >
            {t('more.resources')}
          </Text>
          <View style={{ backgroundColor: theme.surface }}>
            <MenuItem icon="school" title={t('more.learningHub')} onPress={() => {}} />
            <MenuItem icon="newspaper" title={t('more.economicCalendar')} onPress={() => {}} isLast />
          </View>
        </Animated.View>

        {/* ACCOUNT */}
        <Animated.View entering={FadeInDown.duration(400).delay(200)} style={{ marginTop: Spacing.lg }}>
          <Text
            style={{
              ...Typography.sectionLabel,
              paddingHorizontal: Spacing.md,
              paddingVertical: Spacing.sm,
              color: Colors.primary,
              textTransform: 'uppercase',
            }}
          >
            {t('more.account')}
          </Text>
          <View style={{ backgroundColor: theme.surface }}>
            <MenuItem icon="person" title={t('more.personalDetails')} onPress={() => router.push('/(tabs)/more/profile')} />
            <MenuItem icon="security" title={t('more.securityPrivacy')} onPress={() => router.push('/(tabs)/more/settings')} isLast />
          </View>
        </Animated.View>

        {/* SUPPORT */}
        <Animated.View entering={FadeInDown.duration(400).delay(250)} style={{ marginTop: Spacing.lg }}>
          <Text
            style={{
              ...Typography.sectionLabel,
              paddingHorizontal: Spacing.md,
              paddingVertical: Spacing.sm,
              color: Colors.primary,
              textTransform: 'uppercase',
            }}
          >
            {t('more.supportSection')}
          </Text>
          <View style={{ backgroundColor: theme.surface }}>
            <MenuItem icon="help" title={t('more.helpCenter')} onPress={() => {}} />
            <MenuItem icon="chat" title={t('more.liveChat')} onPress={() => {}} isLast />
          </View>
        </Animated.View>

        {/* Logout Button */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(350)}
          style={{
            marginTop: Spacing.xl,
            paddingHorizontal: Spacing.md,
            paddingBottom: Spacing.xl,
          }}
        >
          <TouchableOpacity
            onPress={handleLogout}
            activeOpacity={0.8}
            style={{
              height: 75, // ≈ 56pt
              borderRadius: 12,
              borderWidth: 1,
              borderColor: Colors.error + '4D', // ~30% opacity red
              backgroundColor: theme.surface,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MaterialIcons name="logout" size={24} color={Colors.error} style={{ marginRight: 8 }} />
            <Text style={{ ...Typography.button, color: Colors.error }}>
              {t('more.logout')}
            </Text>
          </TouchableOpacity>
        </Animated.View>

      </View>
    </Screen>
  );
}
