import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/colors';
import type { FlightBooking } from '@/types/domain.types';
import { format } from 'date-fns';

interface TicketCardProps {
  booking: FlightBooking;
}

export function TicketCard({ booking }: TicketCardProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  const departureTime = format(new Date(booking.flight.departureTime), 'HH:mm');
  const arrivalTime = format(new Date(booking.flight.arrivalTime), 'HH:mm');
  const departureDate = format(new Date(booking.flight.departureTime), 'MMM dd, yyyy');

  return (
    <View className="relative">
      {/* Main ticket card with gradient */}
      <LinearGradient
        colors={[theme.primary, Colors.primaryMid]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="rounded-2xl overflow-hidden"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.2,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        {/* Die-cut circles on sides */}
        <View className="absolute left-0"
          style={{
            top: '72%',
            width: 20,
            height: 40,
            marginTop: -20,
            marginLeft: -10,
            borderRadius: 20,
            backgroundColor: theme.background,
          }}
        />
        <View className="absolute right-0"
          style={{
            top: '72%',
            width: 20,
            height: 40,
            marginTop: -20,
            marginRight: -10,
            borderRadius: 20,
            backgroundColor: theme.background,
          }}
        />

        {/* Top section: Flight details */}
        <View className="p-6">
          {/* Header: Airline + Flight number */}
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center gap-3">
              {booking.flight.airlineLogoUrl && (
                <Image
                  source={{ uri: booking.flight.airlineLogoUrl }}
                  className="w-10 h-10 rounded"
                  contentFit="contain"
                  tintColor="white"
                />
              )}
              <View>
                <Text className="text-base font-bold text-white">
                  {booking.flight.airline}
                </Text>
                <Text className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  {booking.flight.flightNumber}
                </Text>
              </View>
            </View>

            <View
              className="px-3 py-1 rounded-full"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            >
              <Text className="text-xs font-bold text-white uppercase tracking-wider">
                {t(`travel.class.${booking.flight.class}`)}
              </Text>
            </View>
          </View>

          {/* Route: Origin → Destination */}
          <View className="flex-row items-center justify-between mb-8">
            <View className="flex-1">
              <Text className="text-[10px] uppercase tracking-wider mb-1"
                style={{ color: 'rgba(255,255,255,0.6)' }}
              >
                {t('travel.departure')}
              </Text>
              <Text className="text-3xl font-black text-white mb-1">
                {booking.flight.origin}
              </Text>
              <Text className="text-sm" style={{ color: 'rgba(255,255,255,0.9)' }}>
                {departureTime}
              </Text>
            </View>

            <View className="items-center px-4">
              <Ionicons name="airplane-outline" size={24} color="rgba(255,255,255,0.6)" />
            </View>

            <View className="flex-1 items-end">
              <Text className="text-[10px] uppercase tracking-wider mb-1"
                style={{ color: 'rgba(255,255,255,0.6)' }}
              >
                {t('travel.travel.flights.detail.arrival')}
              </Text>
              <Text className="text-3xl font-black text-white mb-1">
                {booking.flight.destination}
              </Text>
              <Text className="text-sm" style={{ color: 'rgba(255,255,255,0.9)' }}>
                {arrivalTime}
              </Text>
            </View>
          </View>

          {/* Details grid */}
          <View className="flex-row flex-wrap gap-4">
            <View className="flex-1 min-w-[120px]">
              <Text className="text-[10px] uppercase tracking-wider mb-1"
                style={{ color: 'rgba(255,255,255,0.6)' }}
              >
                {t('travel.flights.confirmation.passenger')}
              </Text>
              <Text className="text-sm font-semibold text-white">
                {booking.passenger.name}
              </Text>
            </View>

            <View className="flex-1 min-w-[120px]">
              <Text className="text-[10px] uppercase tracking-wider mb-1"
                style={{ color: 'rgba(255,255,255,0.6)' }}
              >
                {t('travel.flights.confirmation.date')}
              </Text>
              <Text className="text-sm font-semibold text-white">
                {departureDate}
              </Text>
            </View>

            <View className="flex-1 min-w-[120px]">
              <Text className="text-[10px] uppercase tracking-wider mb-1"
                style={{ color: 'rgba(255,255,255,0.6)' }}
              >
                {t('travel.flights.confirmation.seat')}
              </Text>
              <Text className="text-sm font-semibold text-white">
                {booking.passenger.seatNumber}
              </Text>
            </View>

            {booking.gate && (
              <View className="flex-1 min-w-[120px]">
                <Text className="text-[10px] uppercase tracking-wider mb-1"
                  style={{ color: 'rgba(255,255,255,0.6)' }}
                >
                  {t('travel.flights.confirmation.gate')}
                </Text>
                <Text className="text-sm font-semibold text-white">
                  {booking.gate}
                </Text>
              </View>
            )}

            {booking.boardingTime && (
              <View className="flex-1 min-w-[120px]">
                <Text className="text-[10px] uppercase tracking-wider mb-1"
                  style={{ color: 'rgba(255,255,255,0.6)' }}
                >
                  {t('travel.flights.confirmation.boarding')}
                </Text>
                <Text className="text-sm font-semibold text-white">
                  {booking.boardingTime}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Dashed divider line */}
        <View className="h-px mx-6"
          style={{
            borderStyle: 'dashed',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.3)',
          }}
        />

        {/* Bottom section: QR Code + Booking Reference */}
        <View
          className="p-6"
          style={{
            backgroundColor: 'rgba(0,0,0,0.1)',
          }}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-[10px] uppercase tracking-wider mb-1"
                style={{ color: 'rgba(255,255,255,0.6)' }}
              >
                {t('travel.flights.confirmation.reference')}
              </Text>
              <Text className="text-xl font-black text-white mb-2">
                {booking.bookingReference}
              </Text>
              {booking.gate && (
                <Text className="text-xs" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  {t('travel.flights.confirmation.scanAtGate', { gate: booking.gate })}
                </Text>
              )}
            </View>

            {/* QR Code placeholder */}
            <View
              className="w-24 h-24 rounded-xl items-center justify-center"
              style={{
                backgroundColor: 'white',
                padding: 8,
              }}
            >
              {booking.qrCodeUrl ? (
                <Image
                  source={{ uri: booking.qrCodeUrl }}
                  className="w-full h-full"
                  contentFit="contain"
                />
              ) : (
                <Ionicons name="qr-code" size={64} color={theme.primary} />
              )}
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
