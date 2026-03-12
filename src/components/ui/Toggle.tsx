import React, { useCallback, useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import { Typography } from '@/constants/typography';
import { Spacing } from '@/constants/spacing';

interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
}

const TRACK_W = 51;
const TRACK_H = 31;
const THUMB   = 27;
const TRAVEL  = TRACK_W - THUMB - 4;

export function Toggle({ value, onValueChange, disabled = false, label, description }: ToggleProps) {
  const theme = useTheme();
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(value ? 1 : 0, { duration: 220 });
  }, [value, progress]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [theme.border, theme.primaryLight]),
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: 2 + progress.value * TRAVEL }],
  }));

  const handlePress = useCallback(() => {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onValueChange(!value);
  }, [disabled, value, onValueChange]);

  const track = (
    <Animated.View
      style={[
        { width: TRACK_W, height: TRACK_H, borderRadius: TRACK_H / 2, justifyContent: 'center' },
        trackStyle,
      ]}
    >
      <Animated.View
        style={[
          {
            width: THUMB,
            height: THUMB,
            borderRadius: THUMB / 2,
            backgroundColor: '#ffffff',
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3,
            elevation: 3,
          },
          thumbStyle,
        ]}
      />
    </Animated.View>
  );

  if (!label) {
    return (
      <Pressable onPress={handlePress} disabled={disabled} style={{ opacity: disabled ? 0.5 : 1 }}>
        {track}
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <View style={{ flex: 1, marginRight: Spacing.md }}>
        <Text style={{ ...Typography.body, color: theme.textPrimary }}>{label}</Text>
        {description ? (
          <Text style={{ ...Typography.caption, color: theme.textSecondary, marginTop: 2 }}>
            {description}
          </Text>
        ) : null}
      </View>
      {track}
    </Pressable>
  );
}
