import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface RecentSearchCardProps {
  route: string; // "KGL → DXB"
  dateRange: string; // "Oct 24, 2023 - One way"
  passengers: number;
  price: number;
  onPress: () => void;
}

export function RecentSearchCard({
  route,
  dateRange,
  passengers,
  price,
  onPress,
}: RecentSearchCardProps) {
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
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        animStyle,
        {
          backgroundColor: theme.surface,
          borderWidth: 1,
          borderColor: theme.border,
        },
      ]}
      className="flex-row items-center justify-between p-4 rounded-xl mb-3"
      accessibilityRole="button"
    >
      <View className="flex-row items-center gap-3 flex-1">
        <View
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: theme.primary + '1a' }}
        >
          <Ionicons name="time" size={20} color={theme.primary} />
        </View>

        <View className="flex-1">
          <Text
            className="text-base font-semibold mb-0.5"
            style={{ color: theme.textPrimary }}
          >
            {route}
          </Text>
          <Text
            className="text-sm"
            style={{ color: theme.textSecondary }}
          >
            {dateRange} • {passengers} pax
          </Text>
        </View>
      </View>

      <View className="items-end">
        <Text
          className="text-sm font-bold"
          style={{ color: theme.primary }}
        >
          ${price}
        </Text>
        <Text
          className="text-xs"
          style={{ color: theme.textSecondary }}
        >
          Avg price
        </Text>
      </View>
    </AnimatedPressable>
  );
}
