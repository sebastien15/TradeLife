import React, { useEffect } from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeIn,
  FadeInDown,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';
import { useAppRouter } from '@/hooks/useAppRouter';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { Spacing, Radius } from '@/constants/spacing';
import { t } from '@/i18n';

interface LowBalanceAlertProps {
  visible: boolean;
  onClose: () => void;
  remainingBalance: number; // in RWF
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function LowBalanceAlert({ visible, onClose, remainingBalance }: LowBalanceAlertProps) {
  const theme = useTheme();
  const router = useAppRouter();
  const iconScale = useSharedValue(0);

  const iconAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  useEffect(() => {
    if (visible) {
      iconScale.value = withSpring(1, { damping: 8, stiffness: 150 });
    } else {
      iconScale.value = 0;
    }
  }, [visible, iconScale]);

  const handleAddCredit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onClose();
    router.push('/(tabs)/money');
  };

  const handleDismiss = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  const minutesRemaining = Math.floor(remainingBalance / (50 / 60)); // 50 RWF per minute

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Backdrop */}
      <Pressable
        onPress={onClose}
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          justifyContent: 'flex-end',
        }}
      >
        {/* Bottom Sheet Content */}
        <AnimatedPressable
          entering={FadeInDown.duration(300).springify()}
          onPress={(e) => e.stopPropagation()}
          style={{
            backgroundColor: theme.surface,
            borderTopLeftRadius: Radius.xl,
            borderTopRightRadius: Radius.xl,
            padding: Spacing.xl,
            paddingBottom: Spacing.xxl,
          }}
        >
          {/* Warning Icon */}
          <Animated.View
            entering={FadeIn.duration(400)}
            style={[
              {
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: Colors.accent + '33', // 20% opacity
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: Spacing.md,
                alignSelf: 'center',
              },
              iconAnimStyle,
            ]}
          >
            <Ionicons name="warning" size={48} color={Colors.accent} />
          </Animated.View>

          {/* Title */}
          <Text
            style={{
              ...Typography.h2,
              fontSize: 28,
              color: theme.textPrimary,
              textAlign: 'center',
              marginBottom: Spacing.sm,
            }}
          >
            {t('call.lowBalanceAlert')}
          </Text>

          {/* Description */}
          <Text
            style={{
              ...Typography.body,
              color: theme.textSecondary,
              textAlign: 'center',
              maxWidth: 280,
              marginBottom: Spacing.lg,
              alignSelf: 'center',
            }}
          >
            {t('call.minutesRemaining', { count: minutesRemaining })}
          </Text>

          {/* Balance Display Card */}
          <View
            style={{
              width: '100%',
              backgroundColor: Colors.accent + '0D', // 5% opacity
              borderWidth: 1,
              borderColor: Colors.accent + '33', // 20% opacity
              borderRadius: Radius.md,
              padding: Spacing.lg,
              alignItems: 'center',
              marginBottom: Spacing.xl,
            }}
          >
            <Text
              style={{
                ...Typography.caption,
                color: theme.textSecondary,
                textTransform: 'uppercase',
                letterSpacing: 0.8,
                marginBottom: Spacing.xs,
              }}
            >
              {t('call.currentBalance')}
            </Text>
            <Text
              style={{
                fontSize: 48,
                fontWeight: '700',
                color: theme.textPrimary,
                lineHeight: 48,
              }}
            >
              {remainingBalance.toFixed(2)} RWF
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={{ width: '100%', gap: Spacing.sm }}>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onPress={handleAddCredit}
            >
              {t('call.addCreditAmount', { amount: '10.00' })}
            </Button>

            <Pressable
              onPress={handleDismiss}
              style={{
                height: 48,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  ...Typography.bodyMedium,
                  color: theme.textSecondary,
                  fontWeight: '600',
                }}
              >
                {t('call.dismissAndContinue')}
              </Text>
            </Pressable>
          </View>
        </AnimatedPressable>
      </Pressable>
    </Modal>
  );
}
