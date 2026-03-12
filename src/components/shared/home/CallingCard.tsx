import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useWalletStore } from '@/stores/walletStore';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { Spacing, Radius, Elevation } from '@/constants/spacing';
import { t } from '@/i18n';

interface CallingCardProps {
  onMakeCall: () => void;
}

export function CallingCard({ onMakeCall: _onMakeCall }: CallingCardProps) {
  const { callBalance } = useWalletStore();

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(16);
  const mountStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 300 });
    translateY.value = withSpring(0, { damping: 18 });
  }, [opacity, translateY]);

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
        <MaterialIcons
          name="phone"
          size={128}
          color={Colors.white}
          style={{ position: 'absolute', right: -16, top: -16, opacity: 0.1 }}
        />

        {/* Header row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.md }}>
          <MaterialIcons name="phone" size={20} color={Colors.white + 'cc'} />
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

        </View>
      </LinearGradient>
    </Animated.View>
  );
}
