import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withRepeat, withSequence } from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import type { SeatMap } from '@/types/domain.types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface SeatGridProps {
  seatMap: SeatMap;
  selectedSeat?: string;
  onSelectSeat: (seat: string) => void;
}

export function SeatGrid({ seatMap, selectedSeat, onSelectSeat }: SeatGridProps) {
  const theme = useTheme();

  const getSeatState = (seatNumber: string): 'available' | 'selected' | 'occupied' | 'premium' => {
    if (seatNumber === selectedSeat) return 'selected';
    if (seatMap.occupied.includes(seatNumber)) return 'occupied';
    if (seatMap.premium.includes(seatNumber)) return 'premium';
    return 'available';
  };

  const getSeatColor = (state: ReturnType<typeof getSeatState>) => {
    switch (state) {
      case 'selected':
        return theme.primary;
      case 'occupied':
        return theme.textSecondary + '40'; // 25% opacity
      case 'premium':
        return theme.accent;
      case 'available':
      default:
        return theme.surface2;
    }
  };

  const renderSeat = (row: number, col: string) => {
    const seatNumber = `${row}${col}`;
    const state = getSeatState(seatNumber);
    const isDisabled = state === 'occupied';

    return (
      <SeatButton
        key={seatNumber}
        seatNumber={seatNumber}
        state={state}
        color={getSeatColor(state)}
        disabled={isDisabled}
        onPress={() => onSelectSeat(seatNumber)}
        theme={theme}
      />
    );
  };

  const renderRow = (row: number) => (
    <View key={row} className="flex-row items-center gap-2 mb-2">
      {/* Row number */}
      <Text
        className="text-xs font-semibold w-6 text-center"
        style={{ color: theme.textSecondary }}
      >
        {row}
      </Text>

      {/* Left side seats (A, B, C) */}
      <View className="flex-row gap-2">
        {seatMap.columns.slice(0, 3).map((col) => renderSeat(row, col))}
      </View>

      {/* Aisle */}
      <View style={{ width: 40 }} />

      {/* Right side seats (D, E, F) */}
      <View className="flex-row gap-2">
        {seatMap.columns.slice(3, 6).map((col) => renderSeat(row, col))}
      </View>
    </View>
  );

  return (
    <View>
      {/* Airplane cockpit (rounded top) */}
      <View
        className="h-16 mb-4 items-center justify-end pb-2"
        style={{
          backgroundColor: theme.surface2,
          borderTopLeftRadius: 100,
          borderTopRightRadius: 100,
          borderWidth: 1,
          borderColor: theme.border,
          borderBottomWidth: 0,
        }}
      >
        <View className="flex-row items-center gap-12">
          {/* Column labels */}
          {seatMap.columns.slice(0, 3).map((col) => (
            <Text
              key={`label-${col}`}
              className="text-xs font-semibold w-8 text-center"
              style={{ color: theme.textSecondary }}
            >
              {col}
            </Text>
          ))}

          <View style={{ width: 40 }} />

          {seatMap.columns.slice(3, 6).map((col) => (
            <Text
              key={`label-${col}`}
              className="text-xs font-semibold w-8 text-center"
              style={{ color: theme.textSecondary }}
            >
              {col}
            </Text>
          ))}
        </View>
      </View>

      {/* Seat rows */}
      <View
        className="p-4"
        style={{
          backgroundColor: theme.surface2,
          borderWidth: 1,
          borderColor: theme.border,
          borderTopWidth: 0,
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
        }}
      >
        {Array.from({ length: seatMap.rows }, (_, i) => i + 1).map((row) =>
          renderRow(row)
        )}
      </View>
    </View>
  );
}

interface SeatButtonProps {
  seatNumber: string;
  state: 'available' | 'selected' | 'occupied' | 'premium';
  color: string;
  disabled: boolean;
  onPress: () => void;
  theme: ReturnType<typeof useTheme>;
}

function SeatButton({ seatNumber, state, color, disabled, onPress, theme }: SeatButtonProps) {
  const scale = useSharedValue(1);
  const pulseScale = useSharedValue(1);

  // Pulse animation for selected seat
  React.useEffect(() => {
    if (state === 'selected') {
      pulseScale.value = withRepeat(
        withSequence(
          withSpring(1.05, { damping: 3 }),
          withSpring(1, { damping: 3 })
        ),
        -1,
        true
      );
    } else {
      pulseScale.value = withSpring(1);
    }
  }, [state]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value * pulseScale.value }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    opacity: state === 'selected' ? 1 : 0,
    transform: [{ scale: pulseScale.value * 1.15 }],
  }));

  const handlePressIn = () => {
    if (!disabled) {
      scale.value = withSpring(0.9);
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <View className="relative">
      {/* Pulse ring for selected seat */}
      {state === 'selected' && (
        <Animated.View
          style={[
            ringStyle,
            StyleSheet.absoluteFill,
            {
              borderWidth: 2,
              borderColor: theme.primary + '40',
              borderRadius: 6,
            },
          ]}
        />
      )}

      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[
          animStyle,
          {
            backgroundColor: color,
            opacity: disabled ? 0.5 : 1,
          },
        ]}
        className="w-8 h-8 rounded items-center justify-center"
        accessibilityRole="button"
        accessibilityLabel={`Seat ${seatNumber}, ${state}`}
        accessibilityState={{ selected: state === 'selected', disabled }}
      >
        <Text
          className="text-xs font-semibold"
          style={{ color: state === 'selected' || state === 'premium' ? 'white' : theme.textSecondary }}
        >
          {seatNumber.slice(-1)}
        </Text>
      </AnimatedPressable>
    </View>
  );
}
