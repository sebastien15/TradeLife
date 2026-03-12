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
import { Spacing, Radius, Elevation } from '@/constants/spacing';
import { Badge, BadgeVariant } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import type { ShipmentSummary, ShipmentStatus } from '@/types/domain.types';

interface ShipmentCardProps {
  shipment: ShipmentSummary;
  onPress: () => void;
}

const STATUS_BADGE: Record<ShipmentStatus, BadgeVariant> = {
  pending:       'neutral',
  in_transit:    'info',
  in_inspection: 'warning',
  ready:         'success',
  delivered:     'success',
  cancelled:     'error',
};

export const ShipmentCard = memo(function ShipmentCard({ shipment, onPress }: ShipmentCardProps) {
  const theme = useTheme();
  const badgeVariant = STATUS_BADGE[shipment.status] ?? 'neutral';

  const scale    = useSharedValue(1);
  const opacity  = useSharedValue(0);
  const translateY = useSharedValue(16);

  useEffect(() => {
    opacity.value    = withTiming(1, { duration: 280 });
    translateY.value = withSpring(0, { damping: 18, stiffness: 180 });
  }, [opacity, translateY]);

  const handlePressIn  = useCallback(() => { scale.value = withSpring(0.97, { damping: 15, stiffness: 400 }); }, [scale]);
  const handlePressOut = useCallback(() => { scale.value = withSpring(1,    { damping: 15, stiffness: 400 }); }, [scale]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  return (
    <Animated.View style={animStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{
          backgroundColor: theme.surface,
          borderRadius: Radius.lg,
          padding: Spacing.md,
          gap: Spacing.sm,
          ...Elevation[1],
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ ...Typography.label, color: theme.textSecondary }}>
            {`#${shipment.trackingNumber}`}
          </Text>
          <Badge variant={badgeVariant} label={shipment.status.replace(/_/g, ' ')} />
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
          <Text style={{ ...Typography.bodyMedium, color: theme.textPrimary, flex: 1 }} numberOfLines={1}>
            {shipment.origin}
          </Text>
          <MaterialIcons name="flight" size={18} color={theme.primary} />
          <Text style={{ ...Typography.bodyMedium, color: theme.textPrimary, flex: 1, textAlign: 'right' }} numberOfLines={1}>
            {shipment.destination}
          </Text>
        </View>

        <ProgressBar progress={shipment.progress} />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ ...Typography.caption, color: theme.textMuted }}>{shipment.carrier}</Text>
          <Text style={{ ...Typography.caption, color: theme.textSecondary }}>
            {`ETA: ${format(shipment.eta, 'MMM d, yyyy')}`}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
});
