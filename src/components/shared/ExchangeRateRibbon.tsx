import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { Spacing } from '@/constants/spacing';
import { Skeleton } from '@/components/ui/Skeleton';

interface ExchangeRateRibbonProps {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  updatedSecondsAgo?: number;
  isLoading?: boolean;
  showUSD?: boolean;
  compact?: boolean;
}

export function ExchangeRateRibbon({
  fromCurrency,
  toCurrency,
  rate,
  updatedSecondsAgo,
  isLoading = false,
  compact = false,
}: ExchangeRateRibbonProps) {
  const theme = useTheme();
  const dotOpacity = useSharedValue(1);

  useEffect(() => {
    dotOpacity.value = withRepeat(withTiming(0.2, { duration: 800 }), -1, true);
  }, [dotOpacity]);

  const dotStyle = useAnimatedStyle(() => ({ opacity: dotOpacity.value }));

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: compact ? Spacing.xs : 10,
        paddingHorizontal: Spacing.md,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: Colors.primary + '33',
        backgroundColor: Colors.primary + '1a',
        gap: Spacing.sm,
      }}
    >
      {/* Pulsing dot */}
      <Animated.View
        style={[
          { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.success },
          dotStyle,
        ]}
      />

      <Text style={{ ...Typography.buttonSm, color: theme.textSecondary }}>
        {`1 ${fromCurrency} =`}
      </Text>

      {isLoading ? (
        <Skeleton width={80} height={16} />
      ) : (
        <Text style={{ ...Typography.buttonSm, color: theme.primary, fontWeight: '700' }}>
          {`${rate.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${toCurrency}`}
        </Text>
      )}

      {updatedSecondsAgo !== undefined && !compact ? (
        <Text style={{ ...Typography.caption, color: theme.textMuted }}>
          {`· ${updatedSecondsAgo}s ago`}
        </Text>
      ) : null}
    </View>
  );
}
