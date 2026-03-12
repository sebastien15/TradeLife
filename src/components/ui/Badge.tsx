import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
} from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import { Typography } from '@/constants/typography';
import { Radius } from '@/constants/spacing';

export type BadgeVariant = 'success' | 'error' | 'warning' | 'info' | 'neutral' | 'primary';
export type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  variant: BadgeVariant;
  label: string;
  size?: BadgeSize;
  dot?: boolean;
}

export function Badge({ variant, label, size = 'md', dot = false }: BadgeProps) {
  const theme = useTheme();
  const mountOpacity = useSharedValue(0);
  const mountScale = useSharedValue(0.85);
  const dotOpacity = useSharedValue(1);

  useEffect(() => {
    mountOpacity.value = withTiming(1, { duration: 200 });
    mountScale.value = withSpring(1, { damping: 14, stiffness: 300 });
    if (dot) {
      dotOpacity.value = withRepeat(
        withTiming(0.2, { duration: 700 }),
        -1,
        true,
      );
    }
  }, [mountOpacity, mountScale, dotOpacity, dot]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: mountOpacity.value,
    transform: [{ scale: mountScale.value }],
  }));

  const dotAnimStyle = useAnimatedStyle(() => ({
    opacity: dotOpacity.value,
  }));

  const colorMap: Record<BadgeVariant, { bg: string; text: string; dotColor: string }> = {
    success: { bg: theme.successBg,      text: theme.successText, dotColor: theme.success },
    error:   { bg: theme.errorBg,        text: theme.errorText,   dotColor: theme.error },
    warning: { bg: theme.warningBg,      text: theme.warningText, dotColor: theme.warning },
    info:    { bg: theme.infoBg,         text: theme.infoText,    dotColor: theme.info },
    neutral: { bg: theme.neutralBg,      text: theme.neutralText, dotColor: theme.textMuted },
    primary: { bg: theme.primary + '1a', text: theme.primary,     dotColor: theme.primary },
  };

  const { bg, text, dotColor } = colorMap[variant];
  const px = size === 'sm' ? 6 : 10;
  const py = size === 'sm' ? 2 : 4;

  return (
    <Animated.View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
          backgroundColor: bg,
          borderRadius: Radius.xs,
          paddingHorizontal: px,
          paddingVertical: py,
          alignSelf: 'flex-start',
        },
        animStyle,
      ]}
    >
      {dot ? (
        <Animated.View
          style={[
            {
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: dotColor,
            },
            dotAnimStyle,
          ]}
        />
      ) : null}
      <Text
        style={{
          ...Typography.badge,
          color: text,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Text>
    </Animated.View>
  );
}
