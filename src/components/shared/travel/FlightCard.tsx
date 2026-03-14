import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from 'react-i18next';
import { Typography } from '@/constants/typography';
import type { FlightType } from '@/types/domain.types';
import { format } from 'date-fns';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface FlightCardProps {
  flight: FlightType;
  isBestDeal?: boolean;
  onSelect: () => void;
}

export function FlightCard({ flight, isBestDeal, onSelect }: FlightCardProps) {
  const theme = useTheme();
  const { t } = useTranslation();
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

  const departureTime = format(new Date(flight.departureTime), 'HH:mm');
  const arrivalTime = format(new Date(flight.arrivalTime), 'HH:mm');

  // Calculate duration
  const durationMs = new Date(flight.arrivalTime).getTime() - new Date(flight.departureTime).getTime();
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

  const stops = flight.stops ?? 0;

  return (
    <View>
      {isBestDeal && (
        <View
          className="px-3 py-1.5 rounded-t-xl"
          style={{ backgroundColor: '#ef4444' }}
        >
          <Text className="text-xs font-bold text-white uppercase tracking-wider">
            {t('travel.flights.results.bestDeal')}
          </Text>
        </View>
      )}

      <AnimatedPressable
        onPress={onSelect}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          animStyle,
          {
            backgroundColor: theme.surface,
            borderWidth: isBestDeal ? 2 : 1,
            borderColor: isBestDeal ? theme.primary : theme.border,
            borderTopLeftRadius: isBestDeal ? 0 : 12,
            borderTopRightRadius: isBestDeal ? 0 : 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: isBestDeal ? 8 : 2 },
            shadowOpacity: isBestDeal ? 0.15 : 0.05,
            shadowRadius: isBestDeal ? 16 : 4,
            elevation: isBestDeal ? 8 : 2,
          },
        ]}
        className="p-4 rounded-b-xl"
        accessibilityRole="button"
      >
        {/* Airline Header */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center gap-3">
            {flight.airlineLogoUrl && (
              <Image
                source={{ uri: flight.airlineLogoUrl }}
                className="w-10 h-10 rounded"
                contentFit="contain"
              />
            )}
            <View>
              <Text
                className="text-base font-semibold"
                style={{ color: theme.textPrimary }}
              >
                {flight.airline}
              </Text>
              <Text
                className="text-sm"
                style={{ color: theme.textSecondary }}
              >
                {flight.flightNumber}
              </Text>
            </View>
          </View>

          <View className="items-end">
            <Text
              className="text-2xl font-black"
              style={{ color: theme.primary, ...Typography.h2 }}
            >
              ${flight.price}
            </Text>
            <Text
              className="text-xs"
              style={{ color: theme.textSecondary }}
            >
              {t('travel.flights.results.perPerson')}
            </Text>
          </View>
        </View>

        {/* Flight Timeline */}
        <View className="flex-row items-center mb-4">
          {/* Departure */}
          <View className="items-center" style={{ width: 60 }}>
            <Text
              className="text-2xl font-black mb-1"
              style={{ color: theme.textPrimary }}
            >
              {departureTime}
            </Text>
            <Text
              className="text-sm"
              style={{ color: theme.textSecondary }}
            >
              {flight.origin}
            </Text>
          </View>

          {/* Timeline */}
          <View className="flex-1 items-center px-3">
            <View className="relative w-full items-center">
              {/* Duration + Stops Label */}
              <View className="flex-row items-center gap-2 mb-2">
                <Text
                  className="text-xs font-semibold"
                  style={{ color: theme.textSecondary }}
                >
                  {t('travel.flights.results.duration', { hours, minutes })}
                </Text>
                {stops === 0 && (
                  <View
                    className="px-2 py-0.5 rounded"
                    style={{ backgroundColor: theme.primary + '1a' }}
                  >
                    <Text
                      className="text-[9px] font-bold uppercase tracking-wider"
                      style={{ color: theme.primary }}
                    >
                      {t('travel.flights.results.nonStopLabel')}
                    </Text>
                  </View>
                )}
              </View>

              {/* Line with dots and plane icon */}
              <View className="relative w-full h-8 justify-center">
                {/* Background line */}
                <View
                  className="absolute left-0 right-0 h-0.5"
                  style={{ backgroundColor: theme.border, top: '50%' }}
                />

                {/* Start dot */}
                <View
                  className="absolute w-2 h-2 rounded-full"
                  style={{ backgroundColor: theme.primary, left: 0, top: '50%', marginTop: -4 }}
                />

                {/* End dot */}
                <View
                  className="absolute w-2 h-2 rounded-full"
                  style={{ backgroundColor: theme.primary, right: 0, top: '50%', marginTop: -4 }}
                />

                {/* Plane icon in center */}
                <View
                  className="absolute items-center justify-center"
                  style={{ left: '50%', marginLeft: -12, top: '50%', marginTop: -12 }}
                >
                  <View
                    className="w-6 h-6 rounded-full items-center justify-center"
                    style={{ backgroundColor: theme.surface }}
                  >
                    <Ionicons
                      name="airplane"
                      size={14}
                      color={theme.textSecondary}
                      style={{ transform: [{ rotate: '45deg' }] }}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Arrival */}
          <View className="items-center" style={{ width: 60 }}>
            <Text
              className="text-2xl font-black mb-1"
              style={{ color: theme.textPrimary }}
            >
              {arrivalTime}
            </Text>
            <Text
              className="text-sm"
              style={{ color: theme.textSecondary }}
            >
              {flight.destination}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View className="flex-row items-center justify-between pt-3"
          style={{ borderTopWidth: 1, borderTopColor: theme.border }}
        >
          <View className="flex-row items-center gap-2">
            <Ionicons name="calendar-outline" size={14} color={theme.textSecondary} />
            <Text className="text-sm" style={{ color: theme.textSecondary }}>
              {flight.seats} seats left
            </Text>
          </View>

          <Pressable>
            <Text
              className="text-sm font-semibold"
              style={{ color: theme.primary }}
            >
              {t('travel.flights.results.selectFlight')} →
            </Text>
          </Pressable>
        </View>
      </AnimatedPressable>
    </View>
  );
}
