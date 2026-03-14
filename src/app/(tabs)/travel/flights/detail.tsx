import React, { useState, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { SeatGrid, FareBenefitCard } from '@/components/shared/travel';
import { useTheme } from '@/hooks/useTheme';
import { useAppRouter } from '@/hooks/useAppRouter';
import { useTranslation } from 'react-i18next';
import { useFlightStore } from '@/stores/flightStore';
import { flightService } from '@/services/flight.service';
import { Typography } from '@/constants/typography';
import type { SeatMap } from '@/types/domain.types';
import { format } from 'date-fns';

// Mock seat map for development
const MOCK_SEAT_MAP: SeatMap = {
  rows: 15,
  columns: ['A', 'B', 'C', 'D', 'E', 'F'],
  available: [
    '1A', '1B', '1C', '1D', '1E', '1F',
    '2A', '2B', '2D', '2E', '2F',
    '3A', '3C', '3D', '3F',
    '4B', '4C', '4D', '4E',
    '5A', '5B', '5C', '5D', '5E', '5F',
  ],
  occupied: [
    '2C', '3B', '3E', '4A', '4F',
  ],
  premium: ['1A', '1B', '1C', '1D', '1E', '1F'],
};

export default function FlightDetailScreen() {
  const theme = useTheme();
  const router = useAppRouter();
  const { t } = useTranslation();
  const flightStore = useFlightStore();
  const { selectedFlight, selectedSeat } = flightStore;
  const [seatMap, setSeatMap] = useState<SeatMap>(MOCK_SEAT_MAP);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch seat map
    if (selectedFlight) {
      setIsLoading(true);
      flightService
        .getFlightDetail(selectedFlight.id)
        .then((data) => {
          setSeatMap(data.seatMap);
        })
        .catch((error) => {
          console.error('Failed to load seat map:', error);
          // Use mock data as fallback
          setSeatMap(MOCK_SEAT_MAP);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [selectedFlight]);

  const handleContinue = async () => {
    if (!selectedSeat) {
      // TODO: Show toast: Please select a seat
      return;
    }

    // TODO: Check wallet balance
    // const totalPrice = selectedFlight.price;
    // if (walletStore.balance < totalPrice) {
    //   // Show top-up sheet
    //   return;
    // }

    // TODO: Open PIN gate
    // After PIN success, proceed to booking
    router.push('/travel/flights/eticket');
  };

  if (!selectedFlight) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center p-6">
          <Text style={{ ...Typography.body, color: theme.textSecondary }}>
            No flight selected
          </Text>
          <Pressable onPress={() => router.back()} className="mt-4">
            <Text className="text-sm font-semibold" style={{ color: theme.primary }}>
              {t('common.back')}
            </Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  const departureTime = format(new Date(selectedFlight.departureTime), 'HH:mm');
  const arrivalTime = format(new Date(selectedFlight.arrivalTime), 'HH:mm');
  const departureDate = format(new Date(selectedFlight.departureTime), 'MMM dd, yyyy');

  // Calculate duration
  const durationMs =
    new Date(selectedFlight.arrivalTime).getTime() -
    new Date(selectedFlight.departureTime).getTime();
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <View className="flex-1">
      <Screen scroll>
        {/* Header */}
        <View
          className="flex-row items-center px-4 py-3"
          style={{
            backgroundColor: theme.background,
            borderBottomWidth: 1,
            borderColor: theme.border,
          }}
        >
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
          </Pressable>
          <Text
            className="flex-1 text-center text-lg font-bold"
            style={{ color: theme.textPrimary }}
          >
            {t('travel.flights.detail.title')}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Flight Summary Card - Gradient */}
        <View className="px-4 pt-6">
          <LinearGradient
            colors={[theme.primary, theme.primaryLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-xl p-6"
          >
            {/* Route display with departure → arrival */}
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-1">
                <Text className="text-[10px] text-white/60 uppercase tracking-wider mb-1">
                  {t('travel.departure')}
                </Text>
                <Text className="text-2xl font-black text-white">
                  {selectedFlight.origin}
                </Text>
                <Text className="text-xs text-white/80">{departureTime}</Text>
              </View>

              <View className="items-center px-4">
                <Ionicons name="airplane-outline" size={20} color="rgba(255,255,255,0.6)" />
                <Text className="text-xs italic text-white/60 mt-1">
                  {hours}h {minutes}m
                </Text>
              </View>

              <View className="flex-1 items-end">
                <Text className="text-[10px] text-white/60 uppercase tracking-wider mb-1">
                  Arrival
                </Text>
                <Text className="text-2xl font-black text-white">
                  {selectedFlight.destination}
                </Text>
                <Text className="text-xs text-white/80">{arrivalTime}</Text>
              </View>
            </View>

            {/* Date + Change Flight button */}
            <View
              className="flex-row items-center justify-between pt-4"
              style={{ borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.3)' }}
            >
              <View className="flex-row items-center gap-2">
                <Ionicons name="calendar-outline" size={16} color="rgba(255,255,255,0.9)" />
                <Text className="text-sm text-white/90">{departureDate}</Text>
              </View>
              <Pressable
                className="px-3 py-1.5 rounded-lg"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                onPress={() => router.back()}
              >
                <Text className="text-sm text-white">
                  {t('travel.flights.detail.changeFlight')}
                </Text>
              </Pressable>
            </View>
          </LinearGradient>
        </View>

        {/* Fare Benefits - 2 column grid */}
        <View className="px-4 pt-6">
          <Text
            className="text-lg font-bold mb-3"
            style={{ color: theme.textPrimary }}
          >
            {t('travel.flights.detail.fareBenefits')}
          </Text>
          <View className="flex-row flex-wrap gap-3">
            <FareBenefitCard
              icon="bag-handle-outline"
              title="2x Checked Bags"
              description="Up to 23kg each"
            />
            <FareBenefitCard
              icon="restaurant-outline"
              title="Meals Included"
              description="Hot meal + snacks"
            />
            <FareBenefitCard
              icon="tv-outline"
              title="Entertainment"
              description="Streaming available"
            />
            <FareBenefitCard
              icon="wifi-outline"
              title="WiFi Access"
              description="High-speed internet"
            />
          </View>
        </View>

        {/* Seat Map Legend */}
        <View className="px-4 pt-6">
          <View className="flex-row flex-wrap items-center justify-center gap-4">
            <View className="flex-row items-center gap-2">
              <View className="w-6 h-6 rounded" style={{ backgroundColor: theme.surface2 }} />
              <Text className="text-xs" style={{ color: theme.textSecondary }}>
                {t('travel.flights.detail.available')}
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <View className="w-6 h-6 rounded" style={{ backgroundColor: theme.primary }} />
              <Text className="text-xs" style={{ color: theme.textSecondary }}>
                {t('travel.flights.detail.selected')}
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <View
                className="w-6 h-6 rounded"
                style={{ backgroundColor: theme.textSecondary + '40' }}
              />
              <Text className="text-xs" style={{ color: theme.textSecondary }}>
                {t('travel.flights.detail.occupied')}
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <View className="w-6 h-6 rounded" style={{ backgroundColor: theme.accent }} />
              <Text className="text-xs" style={{ color: theme.textSecondary }}>
                {t('travel.flights.detail.premium')}
              </Text>
            </View>
          </View>
        </View>

        {/* Seat Grid */}
        {!isLoading && seatMap && (
          <View className="px-4 pt-6 pb-32">
            <SeatGrid
              seatMap={seatMap}
              selectedSeat={selectedSeat || undefined}
              onSelectSeat={(seat) => flightStore.setSelectedSeat(seat)}
            />
          </View>
        )}
      </Screen>

      {/* Sticky Bottom Bar - Price + CTA */}
      <View
        className="absolute bottom-0 left-0 right-0 px-4 py-4 flex-row items-center justify-between"
        style={{
          backgroundColor: theme.surface,
          borderTopWidth: 1,
          borderColor: theme.border,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <View>
          {selectedSeat && (
            <Text className="text-sm" style={{ color: theme.textSecondary }}>
              {t('travel.flights.detail.selectedSeat', { seat: selectedSeat })}
            </Text>
          )}
          <Text className="text-2xl font-black" style={{ color: theme.textPrimary }}>
            ${selectedFlight.price}
          </Text>
        </View>
        <View style={{ maxWidth: 240 }}>
          <Button
            variant="primary"
            onPress={handleContinue}
            disabled={!selectedSeat}
          >
            {t('travel.flights.detail.continue')}
          </Button>
        </View>
      </View>
    </View>
  );
}
