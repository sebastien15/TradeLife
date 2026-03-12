import React, { useEffect } from 'react';
import { View, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/hooks/useTheme';
import { Radius } from '@/constants/spacing';

interface SkeletonProps {
  width?: number | '100%';
  height: number;
  radius?: number;
  style?: ViewStyle;
}

export function Skeleton({ width = '100%', height, radius = Radius.sm, style }: SkeletonProps) {
  const theme = useTheme();
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1500, easing: Easing.linear }),
      -1,
    );
  }, [shimmer]);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(shimmer.value, [0, 1], [-300, 300]) }],
  }));

  const base = theme.surface2;
  const highlight = theme.surface;

  return (
    <View
      style={[
        {
          width: width as ViewStyle['width'],
          height,
          borderRadius: radius,
          backgroundColor: base,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          { position: 'absolute', top: 0, bottom: 0, width: '100%' },
          shimmerStyle,
        ]}
      >
        <LinearGradient
          colors={[base + '00', highlight, base + '00']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1, width: 200 }}
        />
      </Animated.View>
    </View>
  );
}
