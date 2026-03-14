import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, Pressable, FlatList, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/layout/Screen';
import { EmptyState } from '@/components/ui/EmptyState';
import { FlightCard, FilterPill } from '@/components/shared/travel';
import { useTheme } from '@/hooks/useTheme';
import { useAppRouter } from '@/hooks/useAppRouter';
import { useTranslation } from 'react-i18next';
import { useFlightStore } from '@/stores/flightStore';
import { Typography } from '@/constants/typography';
import type { FlightType } from '@/types/domain.types';
import { format } from 'date-fns';

type FilterType = 'cheapest' | 'fastest' | 'nonstop' | null;

export default function FlightResultsScreen() {
  const theme = useTheme();
  const router = useAppRouter();
  const { t } = useTranslation();
  const flightStore = useFlightStore();
  const [activeFilter, setActiveFilter] = useState<FilterType>('cheapest');

  const { searchParams, searchResults } = flightStore;

  // Apply filter and sort
  const filteredResults = useMemo(() => {
    let results = [...searchResults];

    if (activeFilter === 'cheapest') {
      results.sort((a, b) => a.price - b.price);
    } else if (activeFilter === 'fastest') {
      results.sort((a, b) => {
        const durationA = new Date(a.arrivalTime).getTime() - new Date(a.departureTime).getTime();
        const durationB = new Date(b.arrivalTime).getTime() - new Date(b.departureTime).getTime();
        return durationA - durationB;
      });
    } else if (activeFilter === 'nonstop') {
      results = results.filter((flight) => (flight.stops ?? 0) === 0);
    }

    return results;
  }, [searchResults, activeFilter]);

  const bestDealIndex = activeFilter === 'cheapest' ? 0 : -1;

  const renderFlightCard = useCallback(
    ({ item, index }: { item: FlightType; index: number }) => (
      <FlightCard
        flight={item}
        isBestDeal={index === bestDealIndex && bestDealIndex >= 0}
        onSelect={() => {
          flightStore.setSelectedFlight(item);
          router.push(`/travel/flights/detail?id=${item.id}`);
        }}
      />
    ),
    [bestDealIndex, router, flightStore]
  );

  if (!searchParams) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center p-6">
          <EmptyState
            title="No search parameters found"
            description="Please search for flights first"
          />
          <Pressable onPress={() => router.back()} className="mt-4">
            <Text className="text-sm font-semibold" style={{ color: theme.primary }}>
              {t('common.back')}
            </Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  const departureDate = searchParams.departureDate
    ? format(new Date(searchParams.departureDate), 'MMM dd, yyyy')
    : '';

  return (
    <Screen>
      {/* Header - sticky with back, route info, filter button */}
      <View
        className="flex-row items-center justify-between px-4 py-3"
        style={{
          backgroundColor: theme.background,
          borderBottomWidth: 1,
          borderColor: theme.border,
        }}
      >
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </Pressable>

        <View className="flex-1 items-center">
          <Text
            className="text-lg font-bold"
            style={{ color: theme.textPrimary }}
          >
            {t('travel.flights.results.title', {
              origin: searchParams.origin,
              destination: searchParams.destination,
            })}
          </Text>
          <Text className="text-sm" style={{ color: theme.textSecondary }}>
            {t('travel.flights.results.meta', {
              date: departureDate,
              passengers: searchParams.passengers,
              count: searchParams.passengers,
            })}
          </Text>
        </View>

        <Pressable>
          <Ionicons name="filter" size={24} color={theme.primary} />
        </Pressable>
      </View>

      {/* Filter Pills - horizontal scrollable */}
      <View className="px-4 pt-4">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
        >
          <FilterPill
            label={t('travel.flights.results.cheapest')}
            icon="flash"
            isActive={activeFilter === 'cheapest'}
            onPress={() => setActiveFilter('cheapest')}
          />
          <FilterPill
            label={t('travel.flights.results.fastest')}
            icon="time"
            isActive={activeFilter === 'fastest'}
            onPress={() => setActiveFilter('fastest')}
          />
          <FilterPill
            label={t('travel.flights.results.nonStop')}
            icon="airplane"
            isActive={activeFilter === 'nonstop'}
            onPress={() => setActiveFilter('nonstop')}
          />
        </ScrollView>
      </View>

      {/* Results count */}
      <View className="px-4 pt-4 pb-2">
        <Text
          className="text-lg font-bold"
          style={{ color: theme.textPrimary }}
        >
          {t('travel.flights.results.foundCount', { count: filteredResults.length })}
        </Text>
      </View>

      {/* Flight List */}
      <FlatList
        data={filteredResults}
        renderItem={renderFlightCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 24,
          gap: 16,
        }}
        ListEmptyComponent={
          <EmptyState
            title={t('common.noResults')}
            description="Try adjusting your filters"
          />
        }
      />
    </Screen>
  );
}
