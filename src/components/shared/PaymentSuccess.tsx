import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';
import { Typography } from '@/constants/typography';
import { Radius, Spacing } from '@/constants/spacing';
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

export interface PaymentSuccessProps {
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
          color: highlight ? theme.success : theme.textPrimary,
          fontWeight: highlight ? '700' : '600',
        }}
      >
        {value}
      </Text>
    </View>
  );
}

function ReferenceRow({ label, value }: { label: string; value: string }) {
  const theme = useTheme();
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await Clipboard.setStringAsync(value);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [value]);

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text style={{ ...Typography.bodySm, color: theme.textSecondary }}>{label}</Text>
      <Pressable
        onPress={handleCopy}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
      >
        <Text
          style={{ ...Typography.bodySm, color: theme.primary, fontWeight: '600' }}
          numberOfLines={1}
        >
          {value}
        </Text>
        <MaterialIcons
          name={copied ? 'check' : 'content-copy'}
          size={14}
          color={copied ? theme.success : theme.primary}
        />
      </Pressable>
    </View>
  );
}

export function PaymentSuccess({
  title,
  subtitle,
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
  const { t } = useTranslation();

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
  }, []);

  const checkStyle   = useAnimatedStyle(() => ({ transform: [{ scale: checkScale.value }] }));
  const amountStyle  = useAnimatedStyle(() => ({ opacity: amountOp.value }));
  const cardStyle    = useAnimatedStyle(() => ({ opacity: cardOp.value }));
  const actionsStyle = useAnimatedStyle(() => ({ opacity: actionsOp.value }));

  const formattedAmount = `${currency} ${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{ padding: Spacing.lg, gap: Spacing.lg }}
      showsVerticalScrollIndicator={false}
    >
      {/* Animated checkmark + title */}
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

        <Text style={{ ...Typography.h1, color: theme.textPrimary, textAlign: 'center' }}>
          {title ?? t('money.paymentSuccess')}
        </Text>

        {(subtitle ?? true) ? (
          <Text style={{ ...Typography.bodySm, color: theme.textSecondary, textAlign: 'center' }}>
            {subtitle ?? t('money.paymentSuccessSubtitle')}
          </Text>
        ) : null}

        <Animated.Text
          style={[
            { ...Typography.display, color: theme.primary, fontWeight: '900' },
            amountStyle,
          ]}
        >
          {formattedAmount}
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
        {/* Card header */}
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
            {t('money.receipt')}
          </Text>
        </View>

        {/* Rows */}
        <View style={{ padding: Spacing.md, gap: Spacing.md }}>
          <Row label={t('money.recipient')} value={recipient} />
          <ReferenceRow label={t('money.reference')} value={reference} />
          {fee !== undefined ? (
            <Row label={t('money.fee')} value={`${currency} ${fee.toFixed(2)}`} />
          ) : null}
          <Row label={t('money.date')} value={format(date, 'MMM d, yyyy · HH:mm')} />
          {extraRows?.map((r) => <Row key={r.label} {...r} />)}
          <View style={{ height: 1, backgroundColor: theme.divider }} />
          <Row label={t('money.total')} value={formattedAmount} highlight />
        </View>
      </Animated.View>

      {/* Action buttons */}
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
