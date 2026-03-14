import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import { Typography } from '@/constants/typography';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface AirportSelectorProps {
  label: string;
  code: string;
  city: string;
  onPress: () => void;
}

export function AirportSelector({ label, code, city, onPress }: AirportSelectorProps) {
  const theme = useTheme();
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <View>
      <Text
        className="text-xs uppercase tracking-wider mb-2 px-1"
        style={{ color: theme.textSecondary, fontWeight: '500' }}
      >
        {label}
      </Text>
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          animStyle,
          {
            backgroundColor: theme.surface2,
            borderWidth: 1,
            borderColor: theme.border,
          },
        ]}
        className="p-4 rounded-xl"
        accessibilityRole="button"
        accessibilityLabel={`Select ${label} airport: ${code} ${city}`}
      >
        <Text
          className="text-3xl mb-1"
          style={{
            color: code ? theme.textPrimary : theme.textSecondary,
            fontWeight: '700',
            fontSize: 30,
            letterSpacing: -0.5,
          }}
        >
          {code || '---'}
        </Text>
        {city && (
          <Text
            className="text-sm"
            style={{ color: theme.textSecondary }}
          >
            {city}
          </Text>
        )}
      </AnimatedPressable>
    </View>
  );
}
