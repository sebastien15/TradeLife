import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';

interface CallTimerProps {
  duration: number; // seconds
  showDot?: boolean;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function CallTimer({ duration, showDot = true, color, size = 'lg' }: CallTimerProps) {
  const theme = useTheme();
  const dotScale = useSharedValue(1);
  const dotOpacity = useSharedValue(1);

  const textColor = color || Colors.white;

  const fontSize = {
    sm: 18,
    md: 24,
    lg: 32,
  }[size];

  const dotSize = {
    sm: 6,
    md: 8,
    lg: 10,
  }[size];

  useEffect(() => {
    if (showDot) {
      dotScale.value = withRepeat(
        withSequence(
          withTiming(1.4, { duration: 800, easing: Easing.ease }),
          withTiming(1, { duration: 800, easing: Easing.ease })
        ),
        -1,
        false
      );
      dotOpacity.value = withRepeat(
        withSequence(
          withTiming(0.4, { duration: 800, easing: Easing.ease }),
          withTiming(1, { duration: 800, easing: Easing.ease })
        ),
        -1,
        false
      );
    }
  }, [showDot, dotScale, dotOpacity]);

  const dotAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dotScale.value }],
    opacity: dotOpacity.value,
  }));

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      }}
    >
      {showDot && (
        <Animated.View
          style={[
            {
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              backgroundColor: Colors.error,
            },
            dotAnimatedStyle,
          ]}
        />
      )}
      <Text
        style={{
          ...Typography.h2,
          fontSize,
          color: textColor,
          fontWeight: '400',
          fontVariant: ['tabular-nums'],
          letterSpacing: 1,
        }}
      >
        {formatDuration(duration)}
      </Text>
    </View>
  );
}
