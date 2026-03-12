import React, { useEffect, useCallback } from 'react';
import { View, Text, ScrollView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { format } from 'date-fns';
import { useTheme } from '@/hooks/useTheme';
import { Typography } from '@/constants/typography';
import { Spacing, Radius } from '@/constants/spacing';
import { Button } from '@/components/ui/Button';

interface Action {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  onPress: () => void;
}

interface ReceiptRow {
  label: string;
  value: string;
  highlight?: boolean;
}

interface PaymentSuccessProps {
  title?: string;
  subtitle?: string;
  amount: number;
  currency: string;
  recipient: string;
  reference: string;
  date?: Date;
  fee?: number;
  extraRows?: ReceiptRow[];
  actions: Action[];
}

function Row({ label, value, highlight }: ReceiptRow) {
  const theme = useTheme();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text style={{ ...Typography.bodySm, color: theme.textSecondary }}>{label}</Text>
      <Text
        style={{
          ...Typography.bodySm,
          color: highlight ? theme.primary : theme.textPrimary,
          fontWeight: highlight ? '700' : '600',
        }}
      >
        {value}
      </Text>
    </View>
  );
}

export function PaymentSuccess({
  title = 'Payment Sent!',
  amount,
  currency,
  recipient,
  reference,
  date = new Date(),
  fee,
  extraRows,
  actions,
}: PaymentSuccessProps) {
  const theme = useTheme();
  const checkScale = useSharedValue(0);
  const amountOp   = useSharedValue(0);
  const cardOp     = useSharedValue(0);
  const actionsOp  = useSharedValue(0);

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    checkScale.value = withSpring(1, { damping: 8, stiffness: 150 });
    amountOp.value   = withDelay(300, withTiming(1, { duration: 400 }));
    cardOp.value     = withDelay(500, withTiming(1, { duration: 400 }));
    actionsOp.value  = withDelay(700, withTiming(1, { duration: 300 }));
  }, [checkScale, amountOp, cardOp, actionsOp]);

  const checkStyle   = useAnimatedStyle(() => ({ transform: [{ scale: checkScale.value }] }));
  const amountStyle  = useAnimatedStyle(() => ({ opacity: amountOp.value }));
  const cardStyle    = useAnimatedStyle(() => ({ opacity: cardOp.value }));
  const actionsStyle = useAnimatedStyle(() => ({ opacity: actionsOp.value }));

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{ padding: Spacing.lg, gap: Spacing.lg }}
      showsVerticalScrollIndicator={false}
    >
      {/* Animated checkmark */}
      <View style={{ alignItems: 'center', gap: Spacing.md, paddingTop: Spacing.xl }}>
        <Animated.View
          style={[
            {
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: theme.successBg,
              alignItems: 'center',
              justifyContent: 'center',
            },
            checkStyle,
          ]}
        >
          <MaterialIcons name="check-circle" size={80} color={theme.success} />
        </Animated.View>

        <Text style={{ ...Typography.h1, color: theme.textPrimary }}>{title}</Text>

        <Animated.Text
          style={[
            { ...Typography.display, color: theme.primary, fontWeight: '900' },
            amountStyle,
          ]}
        >
          {`${currency} ${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
        </Animated.Text>
      </View>

      {/* Receipt card */}
      <Animated.View
        style={[
          {
            borderRadius: Radius.lg,
            borderWidth: 1,
            borderColor: theme.border,
            borderStyle: 'dashed',
            overflow: 'hidden',
          },
          cardStyle,
        ]}
      >
        <View
          style={{
            paddingHorizontal: Spacing.md,
            paddingVertical: Spacing.sm,
            backgroundColor: theme.surface2,
            borderBottomWidth: 1,
            borderBottomColor: theme.divider,
          }}
        >
          <Text
            style={{
              ...Typography.sectionLabel,
              color: theme.textSecondary,
              textTransform: 'uppercase',
            }}
          >
            Receipt
          </Text>
        </View>
        <View style={{ padding: Spacing.md, gap: Spacing.md }}>
          <Row label="Recipient"  value={recipient} />
          <Row label="Reference"  value={reference} />
          {fee !== undefined ? (
            <Row label="Fee" value={`${currency} ${fee.toFixed(2)}`} />
          ) : null}
          <Row label="Date" value={format(date, 'MMM d, yyyy · HH:mm')} />
          {extraRows?.map((r) => <Row key={r.label} {...r} />)}
          <View style={{ height: 1, backgroundColor: theme.divider }} />
          <Row label="Total" value={`${currency} ${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} highlight />
        </View>
      </Animated.View>

      {/* Actions */}
      <Animated.View style={[{ gap: Spacing.sm }, actionsStyle]}>
        {actions.map((a, i) => (
          <Button key={i} variant={a.variant ?? 'primary'} fullWidth onPress={a.onPress}>
            {a.label}
          </Button>
        ))}
      </Animated.View>
    </ScrollView>
  );
}
