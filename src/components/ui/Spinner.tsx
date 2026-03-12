import React, { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';

export type SpinnerSize = 'sm' | 'md' | 'lg';

const SIZE_MAP: Record<SpinnerSize, number> = { sm: 20, md: 32, lg: 52 };
const BORDER_MAP: Record<SpinnerSize, number> = { sm: 2, md: 3, lg: 4 };

interface SpinnerProps {
  size?: SpinnerSize;
  color?: string;
}

export function Spinner({ size = 'md', color }: SpinnerProps) {
  const theme = useTheme();
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 900, easing: Easing.linear }),
      -1,
    );
  }, [rotation]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const dim = SIZE_MAP[size];
  const border = BORDER_MAP[size];
  const activeColor = color ?? theme.primary;
  const trackColor = activeColor + '33';

  return (
    <Animated.View
      style={[
        {
          width: dim,
          height: dim,
          borderRadius: dim / 2,
          borderWidth: border,
          borderColor: trackColor,
          borderTopColor: activeColor,
        },
        animStyle,
      ]}
    />
  );
}
