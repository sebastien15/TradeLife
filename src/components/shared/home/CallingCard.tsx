import React, { useEffect, useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useWalletStore } from '@/stores/walletStore';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { Spacing, Radius, Elevation } from '@/constants/spacing';
import { t } from '@/i18n';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CallingCardProps {
  onMakeCall: () => void;
}

export function CallingCard({ onMakeCall }: CallingCardProps) {
  const { callBalance } = useWalletStore();

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(16);
  const btnScale = useSharedValue(1);

  const mountStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const btnAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: btnScale.value }],
  }));

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 300 });
    translateY.value = withSpring(0, { damping: 18 });
  }, [opacity, translateY]);

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onMakeCall();
  }, [onMakeCall]);

  return (
    <Animated.View
      style={[
        {
          marginHorizontal: Spacing.md,
          marginTop: Spacing.md,
          borderRadius: Radius.md,
          overflow: 'hidden',
          ...Elevation[2],
        },
        mountStyle,
      ]}
    >
      <LinearGradient
        colors={[Colors.primary, Colors.primaryLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ padding: 20 }}
      >
        {/* Ghost watermark icon */}
        <Ionicons
          name="call"
          size={128}
          color={Colors.white}
          style={{ position: 'absolute', right: -16, top: -16, opacity: 0.1 }}
        />

        {/* Header row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.md }}>
          <Ionicons name="call" size={20} color={Colors.white + 'cc'} />
          <Text style={{ ...Typography.body, color: Colors.white, fontWeight: '700' }}>
            {t('home.callRwanda')}
          </Text>
        </View>

        {/* Bottom row: left=rate+balance, right=button */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <View style={{ gap: 4 }}>
            {/* Rate chip */}
            <View
              style={{
                backgroundColor: Colors.overlayCard,
                paddingHorizontal: Spacing.sm,
                paddingVertical: 2,
                borderRadius: Radius.xs,
                alignSelf: 'flex-start',
              }}
            >
              <Text style={{ ...Typography.caption, color: Colors.white }}>
                {t('home.ratePerMin', { rate: 120 })}
              </Text>
            </View>
            <Text
              style={{
                ...Typography.caption,
                color: Colors.white,
                opacity: 0.8,
                textTransform: 'uppercase',
                letterSpacing: 0.8,
                marginTop: Spacing.sm,
              }}
            >
              {t('home.balance')}
            </Text>
            <Text style={{ ...Typography.h2, color: Colors.white }}>
              {Math.floor(callBalance).toLocaleString()} RWF
            </Text>
          </View>

          {/* Call Button */}
          <AnimatedPressable
            onPress={handlePress}
            onPressIn={() => {
              btnScale.value = withSpring(0.92, { damping: 15, stiffness: 400 });
            }}
            onPressOut={() => {
              btnScale.value = withSpring(1, { damping: 15, stiffness: 400 });
            }}
            style={[
              {
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: Colors.white,
                alignItems: 'center',
                justifyContent: 'center',
                ...Elevation[2],
              },
              btnAnimStyle,
            ]}
          >
            <Ionicons name="call" size={28} color={Colors.primary} />
          </AnimatedPressable>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}
