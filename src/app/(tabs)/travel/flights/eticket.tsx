import React, { useState, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence } from 'react-native-reanimated';
import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { TicketCard } from '@/components/shared/travel';
import { useTheme } from '@/hooks/useTheme';
import { useAppRouter } from '@/hooks/useAppRouter';
import { useTranslation } from 'react-i18next';
import { useFlightStore } from '@/stores/flightStore';
import { Typography } from '@/constants/typography';
import type { FlightBooking, FlightType } from '@/types/domain.types';

// Mock booking for development
const createMockBooking = (
  selectedFlight: FlightType | null,
  selectedSeat: string | null
): FlightBooking => {

  if (!selectedFlight || !selectedSeat) {
    throw new Error('No flight or seat selected');
  }

  return {
    id: `BK${Date.now()}`,
    flight: selectedFlight,
    passenger: {
      name: 'John Doe', // TODO: Get from auth store
      passportNumber: 'P123456789',
      seatNumber: selectedSeat,
    },
    bookingReference: `TL${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    totalPrice: selectedFlight.price,
    currency: selectedFlight.currency,
    status: 'confirmed',
    qrCodeUrl: '', // TODO: Generate QR code
    gate: 'A12',
    boardingTime: '14:30',
  };
};

export default function ETicketScreen() {
  const theme = useTheme();
  const router = useAppRouter();
  const { t } = useTranslation();
  const flightStore = useFlightStore();
  const [booking, setBooking] = useState<FlightBooking | null>(null);

  // Success animation
  const scale = useSharedValue(0);
  const checkmarkScale = useSharedValue(0);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const checkmarkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkmarkScale.value }],
  }));

  useEffect(() => {
    // Fetch or create booking details after payment
    try {
      const mockBooking = createMockBooking(
        flightStore.selectedFlight,
        flightStore.selectedSeat
      );
      setBooking(mockBooking);

      // Trigger success animation
      scale.value = withSpring(1, { damping: 8, stiffness: 200 });
      setTimeout(() => {
        checkmarkScale.value = withSequence(
          withSpring(1.2, { damping: 8 }),
          withSpring(1, { damping: 12 })
        );
      }, 200);
    } catch (error) {
      console.error('Failed to create booking:', error);
      // TODO: Show error state
    }
  }, [flightStore]);

  const handleSaveToWallet = () => {
    // TODO: Implement Apple Wallet integration
    console.log('Save to wallet');
  };

  const handleShareReceipt = () => {
    // TODO: Implement share functionality
    console.log('Share receipt');
  };

  const handleDownload = () => {
    // TODO: Implement download functionality
    console.log('Download ticket');
  };

  if (!booking) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center p-6">
          <Text style={{ ...Typography.body, color: theme.textSecondary }}>
            Loading booking...
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll>
      {/* Header */}
      <View
        className="flex-row items-center justify-between px-4 py-3"
        style={{
          backgroundColor: theme.background,
          borderBottomWidth: 1,
          borderColor: theme.border,
        }}
      >
        <Pressable onPress={() => router.push('/travel')}>
          <Ionicons name="close" size={24} color={theme.textPrimary} />
        </Pressable>
        <Text
          className="flex-1 text-center text-lg font-bold"
          style={{ color: theme.textPrimary }}
        >
          {t('travel.flights.confirmation.title')}
        </Text>
        <Pressable>
          <Ionicons name="ellipsis-vertical" size={24} color={theme.textPrimary} />
        </Pressable>
      </View>

      {/* Success Animation */}
      <View className="items-center py-12">
        <Animated.View
          style={[
            containerStyle,
            {
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: theme.primary + '20',
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}
        >
          <View
            className="w-16 h-16 rounded-full items-center justify-center"
            style={{ backgroundColor: theme.primary }}
          >
            <Animated.View style={checkmarkStyle}>
              <Ionicons name="checkmark" size={32} color="white" />
            </Animated.View>
          </View>
        </Animated.View>

        <Text
          className="mt-4 text-2xl font-black"
          style={{ color: theme.textPrimary }}
        >
          {t('travel.flights.confirmation.success')}
        </Text>
        <Text
          className="text-base"
          style={{ color: theme.textSecondary }}
        >
          {t('travel.flights.confirmation.message')}
        </Text>
      </View>

      {/* Ticket Card - Premium Design */}
      <View className="px-4 pb-6">
        <TicketCard booking={booking} />
      </View>

      {/* Action Buttons */}
      <View className="px-4 pb-8 gap-3">
        <Button
          variant="primary"
          leftIcon={<Ionicons name="wallet-outline" size={20} color="white" />}
          onPress={handleSaveToWallet}
        >
          {t('travel.flights.confirmation.saveToWallet')}
        </Button>
        <View className="flex-row gap-3">
          <View style={{ flex: 1 }}>
            <Button
              variant="secondary"
              leftIcon={<Ionicons name="share-outline" size={20} color={theme.primary} />}
              onPress={handleShareReceipt}
            >
              {t('travel.flights.confirmation.shareReceipt')}
            </Button>
          </View>
          <Pressable
            className="px-5 py-4 rounded-xl items-center justify-center"
            style={{ backgroundColor: theme.primary + '1a' }}
            onPress={handleDownload}
          >
            <Ionicons name="download-outline" size={20} color={theme.primary} />
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}
