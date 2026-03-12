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
import { useTheme } from '@/hooks/useTheme';
import { Typography } from '@/constants/typography';
import { Spacing, Radius } from '@/constants/spacing';
import { Button } from '@/components/ui/Button';

interface PaymentFailedProps {
  reason: string;
  amount: number;
  currency: string;
  recipient: string;
  errorCode?: string;
  onRetry: () => void;
  onChangeMethod?: () => void;
  onCancel: () => void;
}

export function PaymentFailed({
  reason,
  amount,
  currency,
  recipient,
  errorCode,
  onRetry,
  onChangeMethod,
  onCancel,
}: PaymentFailedProps) {
  const theme = useTheme();
  const xScale   = useSharedValue(0);
  const contentOp = useSharedValue(0);

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    xScale.value    = withSpring(1, { damping: 8, stiffness: 150 });
    contentOp.value = withDelay(300, withTiming(1, { duration: 400 }));
  }, [xScale, contentOp]);

  const xStyle      = useAnimatedStyle(() => ({ transform: [{ scale: xScale.value }] }));
  const contentStyle = useAnimatedStyle(() => ({ opacity: contentOp.value }));

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{ padding: Spacing.lg, gap: Spacing.lg }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ alignItems: 'center', gap: Spacing.md, paddingTop: Spacing.xl }}>
        <Animated.View
          style={[
            {
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: theme.errorBg,
              alignItems: 'center',
              justifyContent: 'center',
            },
            xScale && xStyle,
          ]}
        >
          <MaterialIcons name="cancel" size={80} color={theme.error} />
        </Animated.View>
        <Text style={{ ...Typography.h1, color: theme.textPrimary }}>Payment Failed</Text>
      </View>

      <Animated.View style={[{ gap: Spacing.md }, contentStyle]}>
        {/* Reason card */}
        <View
          style={{
            borderRadius: Radius.lg,
            borderWidth: 1,
            borderColor: theme.error + '40',
            backgroundColor: theme.errorBg,
            padding: Spacing.md,
            gap: Spacing.sm,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
            <MaterialIcons name="info-outline" size={18} color={theme.error} />
            <Text style={{ ...Typography.label, color: theme.error }}>Why did this happen?</Text>
          </View>
          <Text style={{ ...Typography.bodySm, color: theme.textSecondary }}>{reason}</Text>
          {errorCode ? (
            <Text style={{ ...Typography.caption, color: theme.textMuted }}>{`Code: ${errorCode}`}</Text>
          ) : null}
        </View>

        {/* "You were not charged" */}
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
            {`You were not charged. ${currency} ${amount.toLocaleString()} intended for ${recipient} is safe.`}
          </Text>
        </View>

        {/* Actions */}
        <View style={{ gap: Spacing.sm, marginTop: Spacing.sm }}>
          <Button variant="primary"   fullWidth onPress={onRetry}>Try Again</Button>
          {onChangeMethod ? (
            <Button variant="secondary" fullWidth onPress={onChangeMethod}>Change Payment Method</Button>
          ) : null}
          <Button variant="ghost"     fullWidth onPress={onCancel}>Cancel</Button>
        </View>
      </Animated.View>
    </ScrollView>
  );
}
