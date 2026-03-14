import React from 'react';
import { View, Pressable, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from 'react-i18next';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface TripTypeToggleProps {
  value: 'roundtrip' | 'oneway';
  onChange: (value: 'roundtrip' | 'oneway') => void;
}

export function TripTypeToggle({ value, onChange }: TripTypeToggleProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const scaleRound = useSharedValue(1);
  const scaleOne = useSharedValue(1);

  const animStyleRound = useAnimatedStyle(() => ({
    transform: [{ scale: scaleRound.value }],
  }));

  const animStyleOne = useAnimatedStyle(() => ({
    transform: [{ scale: scaleOne.value }],
  }));

  const handlePressRound = () => {
    scaleRound.value = withSpring(0.96);
    setTimeout(() => {
      scaleRound.value = withSpring(1);
    }, 100);
    onChange('roundtrip');
  };

  const handlePressOne = () => {
    scaleOne.value = withSpring(0.96);
    setTimeout(() => {
      scaleOne.value = withSpring(1);
    }, 100);
    onChange('oneway');
  };

  return (
    <View
      className="flex-row p-1 rounded-lg"
      style={{ backgroundColor: theme.surface2 }}
    >
      <AnimatedPressable
        onPress={handlePressRound}
        style={[
          animStyleRound,
          {
            backgroundColor: value === 'roundtrip' ? theme.surface : 'transparent',
            shadowColor: value === 'roundtrip' ? '#000' : 'transparent',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: value === 'roundtrip' ? 0.1 : 0,
            shadowRadius: 2,
            elevation: value === 'roundtrip' ? 2 : 0,
          },
        ]}
        className="flex-1 py-2.5 items-center rounded-md"
        accessibilityRole="button"
        accessibilityState={{ selected: value === 'roundtrip' }}
      >
        <Text
          className="text-sm font-semibold"
          style={{
            color: value === 'roundtrip' ? theme.textPrimary : theme.textSecondary,
          }}
        >
          {t('travel.flights.search.roundTrip')}
        </Text>
      </AnimatedPressable>

      <AnimatedPressable
        onPress={handlePressOne}
        style={[
          animStyleOne,
          {
            backgroundColor: value === 'oneway' ? theme.surface : 'transparent',
            shadowColor: value === 'oneway' ? '#000' : 'transparent',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: value === 'oneway' ? 0.1 : 0,
            shadowRadius: 2,
            elevation: value === 'oneway' ? 2 : 0,
          },
        ]}
        className="flex-1 py-2.5 items-center rounded-md"
        accessibilityRole="button"
        accessibilityState={{ selected: value === 'oneway' }}
      >
        <Text
          className="text-sm font-semibold"
          style={{
            color: value === 'oneway' ? theme.textPrimary : theme.textSecondary,
          }}
        >
          {t('travel.flights.search.oneWay')}
        </Text>
      </AnimatedPressable>
    </View>
  );
}
