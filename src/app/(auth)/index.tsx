// ─────────────────────────────────────────────────────────────────────────────
// TradeLife — Welcome / Landing Screen
// Design: 1b_welcome_dark
// ─────────────────────────────────────────────────────────────────────────────
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Svg, Path, Circle as SvgCircle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { t } from '@/i18n';
import { useAppRouter } from '@/hooks/useAppRouter';

export default function WelcomeScreen() {
  const router = useAppRouter();

  // Pulse animation for connection lines
  const pulseOpacity = useSharedValue(0.5);
  useEffect(() => {
    pulseOpacity.value = withRepeat(
      withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [pulseOpacity]);
  const pulseStyle = useAnimatedStyle(() => ({ opacity: pulseOpacity.value }));

  return (
    <View style={{ flex: 1, backgroundColor: Colors.dark.background }}>
      <StatusBar style="light" />

      {/* Status bar spacer */}
      <View style={{ height: 48 }} />

      {/* ── Center content ── */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>

        {/* Globe illustration */}
        <Animated.View
          entering={FadeIn.duration(700)}
          style={{ width: 280, height: 280, marginBottom: 32 }}
        >
          <View
            style={{
              flex: 1,
              borderRadius: 140,
              borderWidth: 1,
              borderColor: Colors.primary + '33',
              backgroundColor: Colors.primary + '0d',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {/* Radial glow */}
            <LinearGradient
              colors={[Colors.primary + '26', 'transparent']}
              style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: 140 }}
            />

            {/* Animated dashed connection lines */}
            <Animated.View
              style={[
                { position: 'absolute', width: '100%', height: '100%' },
                pulseStyle,
              ]}
            >
              <Svg width="100%" height="100%" viewBox="0 0 200 200">
                <Path
                  d="M60 100 Q 100 40 140 100"
                  stroke={Colors.primary}
                  strokeDasharray="4 4"
                  strokeWidth="2"
                  fill="none"
                />
                <SvgCircle cx="60" cy="100" r="3" fill={Colors.primary} />
                <SvgCircle cx="140" cy="100" r="3" fill={Colors.primary} />
              </Svg>
            </Animated.View>

            {/* Globe icon */}
            <Ionicons
              name="globe-outline"
              size={120}
              color={Colors.primary}
              style={{ opacity: 0.8 }}
            />
          </View>
        </Animated.View>

        {/* Title */}
        <Animated.Text
          entering={FadeInDown.duration(500).delay(200)}
          style={{
            fontSize: 30,
            fontWeight: '700',
            lineHeight: 36,
            letterSpacing: -0.5,
            color: Colors.dark.textPrimary,
            textAlign: 'center',
            marginBottom: 12,
          }}
        >
          {t('auth.welcomeTitle')}
        </Animated.Text>

        {/* Subtitle */}
        <Animated.Text
          entering={FadeInDown.duration(500).delay(300)}
          style={{
            ...Typography.body,
            color: Colors.dark.textSecondary,
            textAlign: 'center',
            lineHeight: 26,
            paddingHorizontal: 8,
          }}
        >
          {t('auth.welcomeSubtitle')}
        </Animated.Text>

        {/* Pagination dots */}
        <Animated.View
          entering={FadeIn.duration(400).delay(400)}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 40 }}
        >
          <View style={{ width: 24, height: 6, borderRadius: 3, backgroundColor: Colors.primary }} />
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.primary + '4d' }} />
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.primary + '4d' }} />
        </Animated.View>
      </View>

      {/* Bottom gradient overlay */}
      <LinearGradient
        colors={['transparent', Colors.dark.background]}
        style={{ position: 'absolute', bottom: 130, left: 0, right: 0, height: 100 }}
        pointerEvents="none"
      />

      {/* ── CTA Buttons ── */}
      <Animated.View
        entering={FadeInDown.duration(400).delay(500)}
        style={{ paddingHorizontal: 24, paddingBottom: 40, gap: 12 }}
      >
        {/* Get Started */}
        <TouchableOpacity
          onPress={router.toLanguage}
          activeOpacity={0.85}
          style={{
            height: 56,
            borderRadius: 12,
            backgroundColor: Colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ ...Typography.button, color: '#fff' }}>
            {t('auth.getStarted')}
          </Text>
        </TouchableOpacity>

        {/* Sign In (outlined) */}
        <TouchableOpacity
          onPress={router.toSignIn}
          activeOpacity={0.85}
          style={{
            height: 56,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: Colors.primary + '66',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
          }}
        >
          <Text style={{ ...Typography.button, color: Colors.primary }}>
            {t('auth.signIn')}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
