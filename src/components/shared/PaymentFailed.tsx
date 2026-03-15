import React, { useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';
import { Typography } from '@/constants/typography';
import { Radius, Spacing } from '@/constants/spacing';
import { Button } from '@/components/ui/Button';

interface SummaryRow {
  label: string;
  value: string;
}

export interface PaymentFailedProps {
  reason: string;
  reasonTitle?: string;
  amount: number;
  currency: string;
  recipient: string;
  date?: Date;
  errorCode?: string;
  onRetry: () => void;
  onAddFunds?: () => void;
  onChangeMethod?: () => void;
  onCancel: () => void;
}

function Row({ label, value }: SummaryRow) {
  const theme = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: Spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: theme.divider,
      }}
    >
      <Text style={{ ...Typography.bodySm, color: theme.textSecondary }}>{label}</Text>
      <Text style={{ ...Typography.bodySm, color: theme.textPrimary, fontWeight: '600' }}>
        {value}
      </Text>
    </View>
  );
}

export function PaymentFailed({
  reason,
  reasonTitle,
  amount,
  currency,
  recipient,
  date = new Date(),
  errorCode,
  onRetry,
  onAddFunds,
  onChangeMethod,
  onCancel,
}: PaymentFailedProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  const iconScale  = useSharedValue(0);
  const shake      = useSharedValue(0);
  const contentOp  = useSharedValue(0);
  const actionsOp  = useSharedValue(0);

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

    // Pop in then shake
    iconScale.value = withSpring(1, { damping: 8, stiffness: 150 });
    shake.value = withDelay(
      400,
      withSequence(
        withTiming(-12, { duration: 60 }),
        withTiming(12,  { duration: 60 }),
        withTiming(-8,  { duration: 60 }),
        withTiming(8,   { duration: 60 }),
        withTiming(-4,  { duration: 60 }),
        withTiming(0,   { duration: 60 }),
      ),
    );

    contentOp.value = withDelay(300, withTiming(1, { duration: 400 }));
    actionsOp.value = withDelay(600, withTiming(1, { duration: 300 }));
  }, []);

  const iconStyle    = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }, { translateX: shake.value }],
  }));
  const contentStyle = useAnimatedStyle(() => ({ opacity: contentOp.value }));
  const actionsStyle = useAnimatedStyle(() => ({ opacity: actionsOp.value }));

  const formattedAmount = `${currency} ${amount.toLocaleString()}`;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{ padding: Spacing.lg, gap: Spacing.lg }}
      showsVerticalScrollIndicator={false}
    >
      {/* Error icon + title */}
      <View style={{ alignItems: 'center', gap: Spacing.md, paddingTop: Spacing.xl }}>
        <Animated.View
          style={[
            {
              width: 120,
              height: 120,
              borderRadius: 60,
              borderWidth: 4,
              borderColor: theme.error + '33',
              backgroundColor: theme.errorBg,
              alignItems: 'center',
              justifyContent: 'center',
            },
            iconStyle,
          ]}
        >
          <MaterialIcons name="close" size={72} color={theme.error} />
        </Animated.View>

        <Text style={{ ...Typography.h1, color: theme.textPrimary, textAlign: 'center' }}>
          {t('money.paymentFailed')}
        </Text>
        <Text style={{ ...Typography.bodySm, color: theme.textSecondary, textAlign: 'center' }}>
          {t('money.paymentFailedReason')}
        </Text>
      </View>

      <Animated.View style={[{ gap: Spacing.md }, contentStyle]}>
        {/* Reason card */}
        <View
          style={{
            borderRadius: Radius.lg,
            borderWidth: 1,
            borderColor: theme.error + '33',
            backgroundColor: theme.surface,
            padding: Spacing.md,
            gap: Spacing.sm,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
            <View
              style={{
                backgroundColor: theme.errorBg,
                padding: Spacing.sm,
                borderRadius: Radius.md,
              }}
            >
              <MaterialIcons name="account-balance-wallet" size={20} color={theme.error} />
            </View>
            <Text style={{ ...Typography.label, color: theme.textPrimary, flex: 1 }}>
              {reasonTitle ?? t('money.whyFailed')}
            </Text>
          </View>
          <Text style={{ ...Typography.bodySm, color: theme.textSecondary, lineHeight: 20 }}>
            {reason}
          </Text>
          {errorCode ? (
            <Text style={{ ...Typography.caption, color: theme.textMuted }}>
              {t('money.errorCode', { code: errorCode })}
            </Text>
          ) : null}
        </View>

        {/* Transaction summary */}
        <View>
          <Row label={t('money.amount')}    value={formattedAmount} />
          <Row label={t('money.recipient')} value={recipient} />
          <Row label={t('money.date')}      value={format(date, 'MMM d, yyyy · HH:mm')} />
        </View>

        {/* "Not charged" reassurance */}
        <View
          style={{
            borderRadius: Radius.md,
            backgroundColor: theme.surface2,
            padding: Spacing.md,
            flexDirection: 'row',
            alignItems: 'center',
            gap: Spacing.sm,
          }}
        >
          <MaterialIcons name="lock" size={18} color={theme.success} />
          <Text style={{ ...Typography.bodySm, color: theme.textSecondary, flex: 1 }}>
            {t('money.notCharged')}.{' '}
            {t('money.notChargedDetail', {
              currency,
              amount: amount.toLocaleString(),
              recipient,
            })}
          </Text>
        </View>
      </Animated.View>

      {/* Action buttons */}
      <Animated.View style={[{ gap: Spacing.sm }, actionsStyle]}>
        <Button
          variant="primary"
          fullWidth
          leftIcon={<MaterialIcons name="refresh" size={18} color="#fff" />}
          onPress={onRetry}
        >
          {t('common.tryAgain')}
        </Button>

        {onAddFunds ? (
          <Button variant="secondary" fullWidth onPress={onAddFunds}>
            {t('common.addFunds')}
          </Button>
        ) : null}

        {onChangeMethod ? (
          <Button variant="secondary" fullWidth onPress={onChangeMethod}>
            {t('money.changePaymentMethod')}
          </Button>
        ) : null}

        <Button variant="ghost" fullWidth onPress={onCancel}>
          {t('money.cancelTransaction')}
        </Button>
      </Animated.View>
    </ScrollView>
  );
}
