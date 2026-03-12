import React, { useCallback } from 'react';
import { Pressable, Text, View, ViewStyle, PressableProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import { Typography } from '@/constants/typography';
import { Radius, PrimaryShadow } from '@/constants/spacing';
import { Spinner } from './Spinner';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

const HEIGHT: Record<ButtonSize, number> = { sm: 40, md: 48, lg: 56 };
const FONT_SIZE: Record<ButtonSize, number> = { sm: 14, md: 15, lg: 16 };
const H_PAD: Record<ButtonSize, number> = { sm: 16, md: 20, lg: 24 };

interface ButtonProps extends Omit<PressableProps, 'style'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  haptic?: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Button({
  variant = 'primary',
  size = 'lg',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  haptic = true,
  children,
  style,
  onPress,
  disabled,
  ...rest
}: ButtonProps) {
  const theme = useTheme();
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePress = useCallback(
    (e: Parameters<NonNullable<PressableProps['onPress']>>[0]) => {
      if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress?.(e);
    },
    [haptic, onPress],
  );

  const isDisabled = disabled || loading;

  // Color maps — no hardcoded hex
  type StyleMap = { bg: string; text: string; border?: string; shadow?: boolean };
  const variantMap: Record<ButtonVariant, StyleMap> = {
    primary:   { bg: theme.primary,   text: '#ffffff', shadow: true },
    secondary: { bg: 'transparent',   text: theme.primary, border: theme.primary },
    ghost:     { bg: 'transparent',   text: theme.textSecondary },
    danger:    { bg: theme.error,     text: '#ffffff' },
  };
  const { bg, text, border, shadow } = variantMap[variant];

  return (
    <Animated.View
      style={[
        {
          height: HEIGHT[size],
          borderRadius: Radius.md,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          opacity: isDisabled ? 0.5 : 1,
        },
        shadow ? PrimaryShadow : undefined,
        animStyle,
        style,
      ]}
    >
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: H_PAD[size],
          borderRadius: Radius.md,
          backgroundColor: bg,
          borderWidth: border ? 1.5 : 0,
          borderColor: border,
        }}
        {...rest}
      >
        {loading ? (
          <Spinner size={size === 'sm' ? 'sm' : 'md'} color={text} />
        ) : (
          <>
            {leftIcon ? <View style={{ marginRight: 8 }}>{leftIcon}</View> : null}
            <Text
              style={{
                fontSize: FONT_SIZE[size],
                fontWeight: '700',
                lineHeight: 20,
                color: text,
                letterSpacing: 0,
              }}
            >
              {children}
            </Text>
            {rightIcon ? <View style={{ marginLeft: 8 }}>{rightIcon}</View> : null}
          </>
        )}
      </Pressable>
    </Animated.View>
  );
}
