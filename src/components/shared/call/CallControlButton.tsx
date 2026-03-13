import React, { useCallback } from 'react';
import { Pressable, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';

type IconName = keyof typeof Ionicons.glyphMap;

interface CallControlButtonProps {
  icon: IconName;
  label: string;
  onPress: () => void;
  active?: boolean;
  variant?: 'default' | 'danger';
  disabled?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function CallControlButton({
  icon,
  label,
  onPress,
  active = false,
  variant = 'default',
  disabled = false,
}: CallControlButtonProps) {
  const theme = useTheme();
  const scale = useSharedValue(1);

  const isDanger = variant === 'danger';

  const buttonBg = isDanger
    ? Colors.error
    : active
    ? Colors.primary
    : 'rgba(255, 255, 255, 0.15)';

  const iconColor = Colors.white;
  const labelColor = Colors.white;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.92, { damping: 15, stiffness: 400 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePress = useCallback(() => {
    if (!disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress();
    }
  }, [disabled, onPress]);

  const buttonSize = isDanger ? 80 : 64;
  const iconSize = isDanger ? 32 : 28;

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[
        {
          alignItems: 'center',
          gap: 8,
          opacity: disabled ? 0.4 : 1,
        },
        animatedStyle,
      ]}
    >
      <Animated.View
        style={{
          width: buttonSize,
          height: buttonSize,
          borderRadius: buttonSize / 2,
          backgroundColor: buttonBg,
          alignItems: 'center',
          justifyContent: 'center',
          ...(isDanger && {
            shadowColor: Colors.error,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 12,
            elevation: 8,
          }),
          ...(!isDanger && {
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
          }),
        }}
      >
        <Ionicons name={icon} size={iconSize} color={iconColor} />
      </Animated.View>
      <Text
        style={{
          ...Typography.caption,
          fontSize: 12,
          color: labelColor,
          fontWeight: '500',
        }}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
}
