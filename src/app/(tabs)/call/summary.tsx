import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { useTheme } from '@/hooks/useTheme';
import { useAppRouter } from '@/hooks/useAppRouter';
import { useCallStore } from '@/stores/callStore';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { Spacing } from '@/constants/spacing';
import { t } from '@/i18n';

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function CallSummaryScreen() {
  const theme = useTheme();
  const router = useAppRouter();
  const callStore = useCallStore();

  const contactName = 'Wei Zhang';
  const contactNumber = callStore.remoteNumber;
  const duration = callStore.duration;
  const cost = callStore.cost;

  const handleCallAgain = () => {
    router.push('/call/dialer');
  };

  const handleDone = () => {
    router.back();
  };

  return (
    <Screen backgroundColor={theme.background}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: Spacing.md,
          paddingTop: Spacing.xxl,
          alignItems: 'center',
        }}
      >
        {/* Success Icon */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(50)}
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: Colors.successBg,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: Spacing.lg,
          }}
        >
          <Ionicons name="checkmark-circle" size={48} color={Colors.success} />
        </Animated.View>

        {/* Title */}
        <Animated.View entering={FadeInDown.duration(400).delay(100)}>
          <Text
            style={{
              ...Typography.h2,
              color: theme.textPrimary,
              marginBottom: Spacing.sm,
            }}
          >
            {t('call.callSummary')}
          </Text>
        </Animated.View>

        {/* Contact Info */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(150)}
          style={{
            alignItems: 'center',
            marginBottom: Spacing.xl,
          }}
        >
          <Avatar
            source={{ uri: 'https://i.pravatar.cc/300?u=wei' }}
            size="lg"
            label={contactName}
            style={{ marginBottom: Spacing.sm }}
          />
          <Text
            style={{
              ...Typography.h3,
              color: theme.textPrimary,
              marginBottom: 2,
            }}
          >
            {contactName}
          </Text>
          <Text
            style={{
              ...Typography.bodySm,
              color: theme.textSecondary,
            }}
          >
            {contactNumber}
          </Text>
        </Animated.View>

        {/* Summary Card */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(200)}
          style={{ width: '100%', marginBottom: Spacing.xl }}
        >
          <Card radius="lg" padding="lg">
            {/* Duration */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: Spacing.md,
                borderBottomWidth: 1,
                borderBottomColor: theme.divider,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
                <Ionicons name="time-outline" size={20} color={theme.textSecondary} />
                <Text
                  style={{
                    ...Typography.bodyMedium,
                    color: theme.textSecondary,
                  }}
                >
                  {t('call.totalDuration')}
                </Text>
              </View>
              <Text
                style={{
                  ...Typography.h3,
                  color: theme.textPrimary,
                  fontWeight: '600',
                }}
              >
                {formatDuration(duration)}
              </Text>
            </View>

            {/* Cost */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: Spacing.md,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
                <Ionicons name="cash-outline" size={20} color={theme.textSecondary} />
                <Text
                  style={{
                    ...Typography.bodyMedium,
                    color: theme.textSecondary,
                  }}
                >
                  {t('call.totalCost')}
                </Text>
              </View>
              <Text
                style={{
                  ...Typography.h3,
                  color: Colors.primary,
                  fontWeight: '700',
                }}
              >
                {cost.toFixed(2)} RWF
              </Text>
            </View>
          </Card>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(250)}
          style={{ width: '100%', gap: Spacing.md }}
        >
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleCallAgain}
            leftIcon={<Ionicons name="call" size={20} color={Colors.white} />}
          >
            {t('call.callAgain')}
          </Button>
          <Button variant="outline" size="lg" fullWidth onPress={handleDone}>
            {t('common.done')}
          </Button>
        </Animated.View>
      </View>
    </Screen>
  );
}
