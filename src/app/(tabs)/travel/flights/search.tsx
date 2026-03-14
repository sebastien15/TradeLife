import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DatePicker } from '@/components/forms/DatePicker';
import {
  AirportSelector,
  SwapButton,
  TripTypeToggle,
  PassengerSelector,
  RecentSearchCard,
} from '@/components/shared/travel';
import { useTheme } from '@/hooks/useTheme';
import { useAppRouter } from '@/hooks/useAppRouter';
import { useTranslation } from 'react-i18next';
import { useFlightStore } from '@/stores/flightStore';
import { flightService } from '@/services/flight.service';
import type { FlightSearchParams } from '@/types/domain.types';
import { Ionicons } from '@expo/vector-icons';

// Airport code lookup (in a real app, this would be an API call)
const AIRPORT_CITIES: Record<string, string> = {
  KGL: 'Kigali',
  DXB: 'Dubai',
  ADD: 'Addis Ababa',
  NBO: 'Nairobi',
  JNB: 'Johannesburg',
  LOS: 'Lagos',
  CAN: 'Guangzhou',
  PEK: 'Beijing',
  PVG: 'Shanghai',
  HKG: 'Hong Kong',
};

export default function FlightSearchScreen() {
  const theme = useTheme();
  const router = useAppRouter();
  const { t } = useTranslation();
  const flightStore = useFlightStore();

  const { control, handleSubmit, watch, setValue } = useForm<FlightSearchParams>({
    defaultValues: {
      tripType: 'roundtrip',
      origin: 'KGL',
      destination: 'DXB',
      departureDate: '',
      returnDate: '',
      passengers: 1,
      class: 'economy',
    },
  });

  const tripType = watch('tripType');
  const origin = watch('origin');
  const destination = watch('destination');

  const onSubmit = async (data: FlightSearchParams) => {
    try {
      flightStore.setSearchParams(data);
      flightStore.addRecentSearch(data);

      // Call API
      const results = await flightService.searchFlights(data);
      flightStore.setSearchResults(results);

      router.push('/travel/flights/results');
    } catch (error) {
      console.error('Flight search error:', error);
      // In a real app, show error toast
    }
  };

  const handleSwap = () => {
    const currentOrigin = origin;
    const currentDestination = destination;
    setValue('origin', currentDestination);
    setValue('destination', currentOrigin);
  };

  const handleRecentSearchPress = (search: FlightSearchParams) => {
    // Pre-fill form with recent search
    setValue('tripType', search.tripType);
    setValue('origin', search.origin);
    setValue('destination', search.destination);
    setValue('departureDate', search.departureDate);
    setValue('returnDate', search.returnDate || '');
    setValue('passengers', search.passengers);
    setValue('class', search.class);
  };

  return (
    <Screen scroll>
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-8 pb-4">
        {/* Back Button */}
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 rounded items-center justify-center"
          style={{ backgroundColor: theme.textPrimary + '0d' }}
        >
          <Ionicons name="arrow-back" size={20} color={theme.textPrimary} />
        </Pressable>

        {/* Title */}
        <Text className="text-xl font-bold tracking-tight" style={{ color: theme.textPrimary }}>
          {t('travel.flights.search.title')}
        </Text>

        {/* Profile Button */}
        <Pressable
          className="w-10 h-10 rounded items-center justify-center"
          style={{ backgroundColor: theme.textPrimary + '0d' }}
        >
          <Ionicons name="person" size={20} color={theme.textPrimary} />
        </Pressable>
      </View>

      {/* Trip Type Toggle */}
      <View className="px-4 pt-4">
        <Controller
          control={control}
          name="tripType"
          render={({ field }) => (
            <TripTypeToggle
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </View>

      {/* Search Form Card */}
      <View className="px-4 pt-6">
        <Card padding="md">
          {/* Airport Selectors with Swap Button */}
          <View className="relative">
            <Controller
              control={control}
              name="origin"
              render={({ field }) => (
                <AirportSelector
                  label={t('travel.from')}
                  code={field.value}
                  city={AIRPORT_CITIES[field.value] || ''}
                  onPress={() => {
                    // TODO: Open airport picker sheet
                    console.log('Open origin picker');
                  }}
                />
              )}
            />

            {/* Swap Button - positioned between selectors */}
            <View
              className="absolute z-10"
              style={{
                left: '50%',
                marginLeft: -20,
                bottom: -44,
              }}
            >
              <SwapButton onPress={handleSwap} />
            </View>

            <View className="mt-4">
              <Controller
                control={control}
                name="destination"
                render={({ field }) => (
                  <AirportSelector
                    label={t('travel.to')}
                    code={field.value}
                    city={AIRPORT_CITIES[field.value] || ''}
                    onPress={() => {
                      // TODO: Open airport picker sheet
                      console.log('Open destination picker');
                    }}
                  />
                )}
              />
            </View>
          </View>

          {/* Date Pickers - Grid 2 columns */}
          <View className="flex-row gap-3 mt-2">
            <View className="flex-1">
              <DatePicker
                control={control}
                name="departureDate"
                label={t('travel.departure')}
              />
            </View>
            {tripType === 'roundtrip' && (
              <View className="flex-1">
                <DatePicker
                  control={control}
                  name="returnDate"
                  label={t('travel.return')}
                />
              </View>
            )}
          </View>

          {/* Passenger + Class Selector */}
          <Controller
            control={control}
            name="passengers"
            render={({ field }) => (
              <PassengerSelector
                passengers={field.value}
                class={watch('class')}
                onIncrement={() => field.onChange(Math.min(field.value + 1, 9))}
                onDecrement={() => field.onChange(Math.max(field.value - 1, 1))}
                onClassPress={() => {
                  // Toggle between economy and business
                  const currentClass = watch('class');
                  setValue('class', currentClass === 'economy' ? 'business' : 'economy');
                }}
              />
            )}
          />

          {/* Search Button */}
          <View className="mt-2">
            <Button
              variant="primary"
              leftIcon={<Ionicons name="search" size={20} color="white" />}
              onPress={handleSubmit(onSubmit)}
            >
              {t('travel.flights.search.searchFlights')}
            </Button>
          </View>
        </Card>
      </View>

      {/* Recent Searches */}
      {flightStore.recentSearches.length > 0 && (
        <View className="px-4 pt-6 pb-8">
          <Text
            className="text-lg font-bold mb-3"
            style={{ color: theme.textPrimary }}
          >
            {t('travel.flights.search.recentSearches')}
          </Text>
          {flightStore.recentSearches.map((search) => (
            <RecentSearchCard
              key={search.id}
              route={`${search.origin} → ${search.destination}`}
              dateRange={`${search.departureDate} ${search.returnDate ? `- ${search.returnDate}` : '- One way'}`}
              passengers={search.passengers}
              price={420} // TODO: fetch avg price from API
              onPress={() => handleRecentSearchPress(search)}
            />
          ))}
        </View>
      )}
    </Screen>
  );
}
