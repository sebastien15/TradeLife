import React, { useEffect } from 'react';
import { View, LayoutChangeEvent } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import { Radius } from '@/constants/spacing';

interface ProgressBarProps {
  progress: number;
  color?: string;
  height?: number;
  animated?: boolean;
}

export function ProgressBar({ progress, color, height = 6, animated = true }: ProgressBarProps) {
  const theme = useTheme();
  const trackWidth = useSharedValue(0);
  const fillWidth = useSharedValue(0);
  const clamped = Math.min(1, Math.max(0, progress));

  useEffect(() => {
    if (trackWidth.value === 0) return;
    const target = trackWidth.value * clamped;
    fillWidth.value = animated
      ? withSpring(target, { damping: 20, stiffness: 120 })
      : target;
  }, [clamped, animated, trackWidth, fillWidth]);

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    trackWidth.value = w;
    fillWidth.value = w * clamped;
  };

  const fillStyle = useAnimatedStyle(() => ({ width: fillWidth.value }));

  return (
    <View
      onLayout={onLayout}
      style={{
        height,
        borderRadius: Radius.full,
        backgroundColor: theme.surface2,
        overflow: 'hidden',
      }}
    >
      <Animated.View
        style={[
          { height, borderRadius: Radius.full, backgroundColor: color ?? theme.primary },
          fillStyle,
        ]}
      />
    </View>
  );
}
