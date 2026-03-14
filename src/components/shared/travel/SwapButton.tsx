import React from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useTheme } from '@/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface SwapButtonProps {
  onPress: () => void;
}

export function SwapButton({ onPress }: SwapButtonProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.92);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handlePress = () => {
    rotate.value = withSpring(rotate.value + 180, { damping: 12 });
    onPress();
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={animStyle}
      className="w-10 h-10 rounded-full items-center justify-center"
      accessibilityLabel="Swap origin and destination"
      accessibilityRole="button"
    >
      <View
        className="w-10 h-10 rounded-full items-center justify-center"
        style={{
          backgroundColor: theme.primary,
          borderWidth: 4,
          borderColor: theme.surface,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Ionicons name="swap-vertical" size={20} color="white" />
      </View>
    </AnimatedPressable>
  );
}
