import React, { useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Typography } from '@/constants/typography';
import { Spacing, Radius } from '@/constants/spacing';
import { Skeleton } from '@/components/ui/Skeleton';

interface WalletBalanceProps {
  balance: number;
  currency: string;
  label?: string;
  isLoading?: boolean;
  showTopUp?: boolean;
  onTopUp?: () => void;
  compact?: boolean;
}

export function WalletBalance({
  balance,
  currency,
  label = 'Available Balance',
  isLoading = false,
  showTopUp = false,
  onTopUp,
  compact = false,
}: WalletBalanceProps) {
  const theme = useTheme();
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 400 });
  }, [opacity]);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={[{ alignItems: 'center', gap: compact ? Spacing.xs : Spacing.sm }, animStyle]}>
      <Text
        style={{
          ...Typography.caption,
          color: theme.textSecondary,
          textTransform: 'uppercase',
          letterSpacing: 1,
        }}
      >
        {label}
      </Text>

      {isLoading ? (
        <Skeleton width={200} height={compact ? 32 : 44} radius={8} />
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6 }}>
          <Text
            style={{
              ...Typography.bodySm,
              color: theme.textSecondary,
              marginBottom: compact ? 4 : 8,
            }}
          >
            {currency}
          </Text>
          <Text
            style={{
              fontSize: compact ? 24 : 36,
              fontWeight: '900',
              color: theme.textPrimary,
              lineHeight: compact ? 30 : 44,
            }}
          >
            {balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
        </View>
      )}

      {showTopUp && onTopUp ? (
        <Pressable
          onPress={onTopUp}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            paddingHorizontal: Spacing.md,
            paddingVertical: Spacing.xs,
            borderRadius: Radius.full,
            backgroundColor: theme.primary + '1a',
          }}
        >
          <MaterialIcons name="add" size={16} color={theme.primary} />
          <Text style={{ ...Typography.buttonSm, color: theme.primary }}>Top Up</Text>
        </Pressable>
      ) : null}
    </Animated.View>
  );
}
