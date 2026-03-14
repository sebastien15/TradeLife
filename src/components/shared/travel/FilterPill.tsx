import React from 'react';
import { Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface FilterPillProps {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  isActive: boolean;
  onPress: () => void;
}

export function FilterPill({ label, icon, isActive, onPress }: FilterPillProps) {
  const theme = useTheme();
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        animStyle,
        {
          backgroundColor: isActive ? theme.primary : theme.surface2,
          borderWidth: 1,
          borderColor: isActive ? theme.primary : theme.border,
        },
      ]}
      className="flex-row items-center gap-1.5 px-4 py-2.5 rounded-lg"
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={16}
          color={isActive ? 'white' : theme.textSecondary}
        />
      )}
      <Text
        className="text-sm font-semibold"
        style={{ color: isActive ? 'white' : theme.textPrimary }}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
}
