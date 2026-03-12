import React, { memo, useEffect, useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Typography } from '@/constants/typography';
import { Spacing, Radius, Elevation } from '@/constants/spacing';
import { Badge, BadgeVariant } from '@/components/ui/Badge';
import type { WarehouseItem, WarehouseStatus } from '@/types/domain.types';

interface WarehouseItemCardProps {
  item: WarehouseItem;
  onPress: () => void;
  selected?: boolean;
}

const STATUS_BADGE: Record<WarehouseStatus, BadgeVariant> = {
  received:      'success',
  in_inspection: 'neutral',
  ready:         'info',
  shipped:       'primary',
  returned:      'error',
};

export const WarehouseItemCard = memo(function WarehouseItemCard({
  item,
  onPress,
  selected = false,
}: WarehouseItemCardProps) {
  const theme = useTheme();
  const badgeVariant = STATUS_BADGE[item.status] ?? 'neutral';

  const scale   = useSharedValue(1);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 260 });
  }, [opacity]);

  const handlePressIn  = useCallback(() => { scale.value = withSpring(0.97, { damping: 15, stiffness: 400 }); }, [scale]);
  const handlePressOut = useCallback(() => { scale.value = withSpring(1,    { damping: 15, stiffness: 400 }); }, [scale]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{
          flexDirection: 'row',
          backgroundColor: theme.surface,
          borderRadius: Radius.lg,
          padding: Spacing.md,
          gap: Spacing.md,
          alignItems: 'center',
          borderWidth: selected ? 2 : 0,
          borderColor: selected ? theme.primary : 'transparent',
          ...Elevation[1],
        }}
      >
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: Radius.md,
            backgroundColor: theme.surface2,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MaterialIcons name="inventory-2" size={32} color={theme.primary} />
        </View>

        <View style={{ flex: 1, gap: 4 }}>
          <Text style={{ ...Typography.bodyMedium, color: theme.textPrimary }} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={{ ...Typography.caption, color: theme.textMuted }}>{`SKU: ${item.sku}`}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: 4 }}>
            <Badge variant={badgeVariant} label={item.status.replace(/_/g, ' ')} size="sm" />
            <Text style={{ ...Typography.caption, color: theme.textSecondary }}>
              {`${item.qty} units · ${item.volume} CBM`}
            </Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
});
