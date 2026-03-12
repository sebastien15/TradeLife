import React, { memo, useEffect, useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useTheme } from '@/hooks/useTheme';
import { Typography } from '@/constants/typography';
import { Spacing, Radius } from '@/constants/spacing';
import { Badge, BadgeVariant } from '@/components/ui/Badge';
import type { Transaction, TransactionStatus, TransactionType } from '@/types/domain.types';

interface TransactionRowProps {
  transaction: Transaction;
  onPress: () => void;
}

type IconName = keyof typeof MaterialIcons.glyphMap;

const TYPE_ICON: Record<TransactionType, IconName> = {
  send:     'arrow-upward',
  receive:  'arrow-downward',
  exchange: 'swap-horiz',
  fee:      'receipt',
  refund:   'undo',
};

const STATUS_BADGE: Record<TransactionStatus, BadgeVariant> = {
  pending:    'warning',
  processing: 'info',
  completed:  'success',
  failed:     'error',
  cancelled:  'neutral',
};

export const TransactionRow = memo(function TransactionRow({ transaction, onPress }: TransactionRowProps) {
  const theme = useTheme();
  const isCredit = transaction.amount > 0;
  const amountColor = isCredit ? theme.primary : theme.textPrimary;
  const iconName = TYPE_ICON[transaction.type] ?? 'circle';
  const badgeVariant = STATUS_BADGE[transaction.status] ?? 'neutral';

  const opacity    = useSharedValue(0);
  const translateX = useSharedValue(-12);
  const pressOp    = useSharedValue(1);

  useEffect(() => {
    opacity.value    = withTiming(1, { duration: 250 });
    translateX.value = withSpring(0, { damping: 20, stiffness: 200 });
  }, [opacity, translateX]);

  const handlePressIn  = useCallback(() => { pressOp.value = withTiming(0.7, { duration: 80 }); }, [pressOp]);
  const handlePressOut = useCallback(() => { pressOp.value = withTiming(1,   { duration: 120 }); }, [pressOp]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value * pressOp.value,
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View style={animStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: Spacing.md,
          paddingVertical: Spacing.sm,
        }}
      >
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: Radius.md,
            backgroundColor: theme.surface2,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MaterialIcons name={iconName} size={22} color={theme.primary} />
        </View>

        <View style={{ flex: 1, gap: 2 }}>
          <Text style={{ ...Typography.bodyMedium, color: theme.textPrimary }} numberOfLines={1}>
            {transaction.title}
          </Text>
          <Text style={{ ...Typography.caption, color: theme.textSecondary }} numberOfLines={1}>
            {transaction.subtitle}
          </Text>
          <Text style={{ ...Typography.caption, color: theme.textMuted }}>
            {format(transaction.date, 'MMM d, HH:mm')}
          </Text>
        </View>

        <View style={{ alignItems: 'flex-end', gap: 4 }}>
          <Text style={{ ...Typography.bodyMedium, color: amountColor, fontWeight: '700' }}>
            {`${isCredit ? '+' : ''}${transaction.currency} ${Math.abs(transaction.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          </Text>
          <Badge variant={badgeVariant} label={transaction.status} size="sm" />
        </View>
      </Pressable>
    </Animated.View>
  );
});
