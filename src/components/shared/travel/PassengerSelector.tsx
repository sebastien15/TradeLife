import React from 'react';
import { View, Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from 'react-i18next';
import type { FlightClass } from '@/types/domain.types';

interface PassengerSelectorProps {
  passengers: number;
  class: FlightClass;
  onIncrement: () => void;
  onDecrement: () => void;
  onClassPress: () => void;
}

export function PassengerSelector({
  passengers,
  class: flightClass,
  onIncrement,
  onDecrement,
  onClassPress,
}: PassengerSelectorProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View
      className="flex-row items-center justify-between p-4 rounded-xl"
      style={{
        backgroundColor: theme.surface2,
        borderWidth: 1,
        borderColor: theme.border,
      }}
    >
      <View className="flex-row items-center gap-3">
        <View
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: theme.primary + '1a' }}
        >
          <Ionicons name="person-outline" size={20} color={theme.primary} />
        </View>
        <Pressable onPress={onClassPress}>
          <Text className="text-base" style={{ color: theme.textPrimary }}>
            {t('travel.flights.search.adults', { count: passengers })}
          </Text>
          <Text className="text-sm" style={{ color: theme.textSecondary }}>
            {t(`travel.class.${flightClass}`)}
          </Text>
        </Pressable>
      </View>

      <View className="flex-row items-center gap-3">
        <Pressable
          onPress={onDecrement}
          disabled={passengers <= 1}
          className="w-8 h-8 rounded-full items-center justify-center"
          style={{
            backgroundColor: passengers <= 1 ? theme.surface2 : theme.primary + '1a',
          }}
        >
          <Ionicons
            name="remove"
            size={20}
            color={passengers <= 1 ? theme.textSecondary : theme.primary}
          />
        </Pressable>

        <Text
          className="text-lg font-bold w-8 text-center"
          style={{ color: theme.textPrimary }}
        >
          {passengers}
        </Text>

        <Pressable
          onPress={onIncrement}
          disabled={passengers >= 9}
          className="w-8 h-8 rounded-full items-center justify-center"
          style={{
            backgroundColor: passengers >= 9 ? theme.surface2 : theme.primary + '1a',
          }}
        >
          <Ionicons
            name="add"
            size={20}
            color={passengers >= 9 ? theme.textSecondary : theme.primary}
          />
        </Pressable>
      </View>
    </View>
  );
}
