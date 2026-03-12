import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useTheme } from '@/hooks/useTheme';
import { useShipmentStore } from '@/stores/shipmentStore';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { Spacing } from '@/constants/spacing';
import { t } from '@/i18n';

const LOCATIONS = [
  { name: 'Guangzhou', status: 'completed' as const },
  { name: 'Mombasa', status: 'current' as const },
  { name: 'Kigali', status: 'pending' as const },
];

export function ContainerETA() {
  const theme = useTheme();
  const { shipments } = useShipmentStore();

  const activeShipment = shipments.length > 0 ? shipments[0] : null;
  const progress = activeShipment?.progress || 0.3;

  // Pulse animation for the active dot
  const pulse = useSharedValue(1);
  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1.25, { duration: 900 }), -1, true);
  }, [pulse]);

  return (
    <Card
      radius="md"
      style={{
        marginHorizontal: Spacing.md,
        marginTop: Spacing.lg,
        padding: 20,
        borderWidth: 1,
        borderColor: theme.border,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: Spacing.md,
        }}
      >
        <View>
          <Text style={{ ...Typography.h3, color: theme.textPrimary }}>
            {t('home.shipmentTracker')}
          </Text>
          {activeShipment && (
            <Text style={{ ...Typography.caption, color: theme.textSecondary, marginTop: 2 }}>
              {t('home.orderNumber', { id: activeShipment.id.slice(0, 10) })}
            </Text>
          )}
        </View>
        <Badge variant="info" label={t('home.inTransit')} size="sm" />
      </View>

      {/* Progress with dots above bar */}
      <View style={{ position: 'relative', paddingTop: 32, paddingBottom: Spacing.sm }}>
        <ProgressBar progress={progress} height={4} />
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          {LOCATIONS.map((loc) => {
            const dotSize = loc.status === 'current' ? 16 : 12;
            const dotBg =
              loc.status === 'completed'
                ? Colors.success
                : loc.status === 'current'
                ? Colors.primary
                : theme.border;
            const labelColor =
              loc.status === 'current' ? theme.primary : theme.textSecondary;
            const labelWeight = loc.status === 'current' ? '700' : '400';

            return (
              <View key={loc.name} style={{ alignItems: 'center' }}>
                <Animated.View
                  style={[
                    {
                      width: dotSize,
                      height: dotSize,
                      borderRadius: dotSize / 2,
                      backgroundColor: dotBg,
                      borderWidth: 4,
                      borderColor: theme.surface,
                    },
                    loc.status === 'current' ? pulseStyle : undefined,
                  ]}
                />
                <Text
                  style={{
                    fontSize: 10,
                    color: labelColor,
                    fontWeight: labelWeight,
                    marginTop: Spacing.xs,
                    textAlign: 'center',
                  }}
                >
                  {loc.name}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </Card>
  );
}
