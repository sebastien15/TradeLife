import React, { forwardRef, useState, useCallback, useEffect } from 'react';
import { View, Text, TextInput, TextInputProps, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  interpolateColor,
} from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import { Typography } from '@/constants/typography';
import { Spacing, Radius } from '@/constants/spacing';

export type InputState = 'default' | 'focused' | 'error' | 'success' | 'disabled';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  hint?: string;
  success?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  containerStyle?: object;
}

export const Input = forwardRef<TextInput, InputProps>(function Input(
  {
    label,
    error,
    hint,
    success,
    leftIcon,
    rightIcon,
    onRightIconPress,
    containerStyle,
    editable = true,
    ...rest
  },
  ref,
) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  // 0=default, 0.33=focused, 0.66=success, 1=error
  const borderProgress = useSharedValue(0);
  const shakeX = useSharedValue(0);

  const state: InputState = !editable
    ? 'disabled'
    : error
    ? 'error'
    : success
    ? 'success'
    : focused
    ? 'focused'
    : 'default';

  useEffect(() => {
    const target =
      state === 'error'    ? 1 :
      state === 'success'  ? 0.66 :
      state === 'focused'  ? 0.33 :
      0;
    borderProgress.value = withTiming(target, { duration: 180 });
    if (state === 'error') {
      shakeX.value = withSequence(
        withTiming(-8, { duration: 55 }),
        withTiming(8,  { duration: 55 }),
        withTiming(-6, { duration: 55 }),
        withTiming(6,  { duration: 55 }),
        withTiming(0,  { duration: 55 }),
      );
    }
  }, [state, borderProgress, shakeX]);

  const containerAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
    borderColor: interpolateColor(
      borderProgress.value,
      [0, 0.33, 0.66, 1],
      [theme.border, theme.primary, theme.success, theme.error],
    ),
  }));

  const handleFocus = useCallback(
    (e: Parameters<NonNullable<TextInputProps['onFocus']>>[0]) => {
      setFocused(true);
      rest.onFocus?.(e);
    },
    [rest],
  );

  const handleBlur = useCallback(
    (e: Parameters<NonNullable<TextInputProps['onBlur']>>[0]) => {
      setFocused(false);
      rest.onBlur?.(e);
    },
    [rest],
  );

  return (
    <View style={[{ gap: 6 }, containerStyle]}>
      {label ? (
        <Text style={{ ...Typography.label, color: theme.textPrimary }}>{label}</Text>
      ) : null}

      <Animated.View
        style={[
          {
            minHeight: rest.multiline ? 120 : 56,
            borderRadius: Radius.md,
            borderWidth: 1.5,
            backgroundColor: theme.inputBg,
            flexDirection: 'row',
            alignItems: rest.multiline ? 'flex-start' : 'center',
            opacity: state === 'disabled' ? 0.5 : 1,
          },
          containerAnimStyle,
        ]}
      >
        {leftIcon ? (
          <View
            style={{ position: 'absolute', left: Spacing.md, top: rest.multiline ? Spacing.md : undefined, zIndex: 1 }}
            pointerEvents="none"
          >
            {leftIcon}
          </View>
        ) : null}

        <TextInput
          ref={ref}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={editable}
          placeholderTextColor={theme.textMuted}
          style={{
            flex: 1,
            minHeight: rest.multiline ? 120 : 56,
            paddingTop: rest.multiline ? Spacing.md : 0,
            paddingLeft: leftIcon ? 48 : Spacing.md,
            paddingRight: rightIcon ? 48 : Spacing.md,
            ...Typography.body,
            color: theme.textPrimary,
            textAlignVertical: rest.multiline ? 'top' : 'center',
          }}
          {...rest}
        />

        {rightIcon ? (
          onRightIconPress ? (
            <Pressable
              onPress={onRightIconPress}
              style={{ position: 'absolute', right: Spacing.md, zIndex: 1 }}
              hitSlop={8}
            >
              {rightIcon}
            </Pressable>
          ) : (
            <View
              style={{ position: 'absolute', right: Spacing.md, zIndex: 1 }}
              pointerEvents="none"
            >
              {rightIcon}
            </View>
          )
        ) : null}
      </Animated.View>

      {error ? (
        <Text style={{ ...Typography.caption, color: theme.error }}>{error}</Text>
      ) : success ? (
        <Text style={{ ...Typography.caption, color: theme.success }}>{success}</Text>
      ) : hint ? (
        <Text style={{ ...Typography.caption, color: theme.textMuted }}>{hint}</Text>
      ) : null}
    </View>
  );
});
