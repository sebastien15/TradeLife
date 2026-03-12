// ─────────────────────────────────────────────────────────────────────────────
// TradeLife — Splash Screen
// Design: 1a_splash_screen_dark
// ─────────────────────────────────────────────────────────────────────────────
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  withDelay,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/colors';
import { useAppRouter } from '@/hooks/useAppRouter';
import { t } from '@/i18n';

export default function SplashScreen() {
  const router = useAppRouter();

  // Logo card springs in from scale 0.7 → 1
  const logoScale = useSharedValue(0.7);
  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  // Three loading dots wave with staggered delays
  const dot1Opacity = useSharedValue(0.3);
  const dot2Opacity = useSharedValue(0.3);
  const dot3Opacity = useSharedValue(0.3);
  const dot1Style = useAnimatedStyle(() => ({ opacity: dot1Opacity.value }));
  const dot2Style = useAnimatedStyle(() => ({ opacity: dot2Opacity.value }));
  const dot3Style = useAnimatedStyle(() => ({ opacity: dot3Opacity.value }));

  useEffect(() => {
    // Logo spring entrance
    logoScale.value = withDelay(
      80,
      withSpring(1, { damping: 14, stiffness: 180 }),
    );

    // Dots wave — start after logo is visible
    const dotsTimer = setTimeout(() => {
      const wave = withRepeat(
        withSequence(
          withTiming(1, { duration: 380, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.3, { duration: 380, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        false,
      );
      dot1Opacity.value = wave;
      dot2Opacity.value = withDelay(140, wave);
      dot3Opacity.value = withDelay(280, wave);
    }, 600);

    // Navigate to welcome after animation completes
    const navTimer = setTimeout(() => {
      router.replace('/(auth)/');
    }, 2600);

    return () => {
      clearTimeout(dotsTimer);
      clearTimeout(navTimer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.primary }}>
      <StatusBar style="light" />

      {/* ── Centered logo + wordmark ── */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

        {/* App icon card */}
        <Animated.View
          style={[
            logoStyle,
            {
              width: 160,
              height: 160,
              borderRadius: 28,
              backgroundColor: Colors.primaryLight + '55',
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}
        >
          <Ionicons name="swap-horizontal-outline" size={80} color="#ffffff" />
        </Animated.View>

        {/* App name */}
        <Animated.Text
          entering={FadeIn.duration(400).delay(280)}
          style={{
            fontSize: 36,
            fontWeight: '800',
            color: '#ffffff',
            marginTop: 28,
            letterSpacing: -0.5,
          }}
        >
          TradeLife
        </Animated.Text>

        {/* Tagline */}
        <Animated.Text
          entering={FadeIn.duration(400).delay(420)}
          style={{
            fontSize: 12,
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: '#ffffff',
            opacity: 0.65,
            marginTop: 8,
          }}
        >
          {t('auth.splashTagline')}
        </Animated.Text>

        {/* Loading dots */}
        <Animated.View
          entering={FadeIn.duration(300).delay(560)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginTop: 40,
          }}
        >
          <Animated.View
            style={[dot1Style, { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ffffff' }]}
          />
          <Animated.View
            style={[dot2Style, { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ffffff' }]}
          />
          <Animated.View
            style={[dot3Style, { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ffffff' }]}
          />
        </Animated.View>
      </View>

      {/* ── Version badge ── */}
      <Animated.Text
        entering={FadeIn.duration(400).delay(700)}
        style={{
          textAlign: 'center',
          fontSize: 12,
          color: '#ffffff',
          opacity: 0.4,
          paddingBottom: 40,
        }}
      >
        V1.0.0
      </Animated.Text>
    </View>
  );
}
