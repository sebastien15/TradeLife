import React, { useEffect } from 'react';
import { View, Pressable, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/hooks/useTheme';
import { Colors } from '@/constants/colors';
import { Elevation, Radius, Spacing } from '@/constants/spacing';

export type CardElevation = 1 | 2 | 3;
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';
export type CardRadius = 'sm' | 'md' | 'lg';

const PAD_MAP: Record<CardPadding, number> = {
  none: 0,
  sm: Spacing.sm,
  md: Spacing.md,
  lg: Spacing.lg,
};

const RADIUS_MAP: Record<CardRadius, number> = {
  sm: Radius.sm,
  md: Radius.md,
  lg: Radius.lg,
};

interface CardProps {
  children: React.ReactNode;
  elevation?: CardElevation;
  padding?: CardPadding;
  radius?: CardRadius;
  gradient?: boolean;
  /** Left accent color strip (4pt width) */
  accentColor?: string;
  onPress?: () => void;
  style?: ViewStyle;
  animated?: boolean;
}

export function Card({
  children,
  elevation = 1,
  padding = 'md',
  radius = 'md',
  gradient = false,
  accentColor,
  onPress,
  style,
  animated = true,
}: CardProps) {
  const theme = useTheme();
  const opacity = useSharedValue(animated ? 0 : 1);
  const translateY = useSharedValue(animated ? 10 : 0);
  const pressScale = useSharedValue(1);

  useEffect(() => {
    if (!animated) return;
    opacity.value = withTiming(1, { duration: 280 });
    translateY.value = withSpring(0, { damping: 18, stiffness: 200 });
  }, [animated, opacity, translateY]);

  const mountStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: pressScale.value }],
  }));

  const handlePressIn = () => {
    if (onPress) pressScale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
  };
  const handlePressOut = () => {
    if (onPress) pressScale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const baseStyle: ViewStyle = {
    borderRadius: RADIUS_MAP[radius],
    padding: PAD_MAP[padding],
    backgroundColor: theme.surface,
    overflow: 'hidden',
    ...Elevation[elevation],
  };

  const inner = (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      {accentColor ? (
        <View style={{ width: 4, backgroundColor: accentColor, borderTopLeftRadius: RADIUS_MAP[radius], borderBottomLeftRadius: RADIUS_MAP[radius] }} />
      ) : null}
      <View style={{ flex: 1, padding: PAD_MAP[padding] }}>{children}</View>
    </View>
  );

  if (gradient) {
    return (
      <Animated.View style={[mountStyle, style]}>
        <LinearGradient
          colors={Colors.gradientCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: RADIUS_MAP[radius], padding: PAD_MAP[padding] }}
        >
          {children}
        </LinearGradient>
      </Animated.View>
    );
  }

  if (onPress) {
    return (
      <Animated.View style={[baseStyle, mountStyle, style]}>
        <Pressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={{ flex: 1 }}
        >
          {accentColor ? inner : children}
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[baseStyle, mountStyle, style]}>
      {accentColor ? inner : children}
    </Animated.View>
  );
}
