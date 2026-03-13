import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { Spacing } from '@/constants/spacing';
import type { Notification, NotificationType } from '@/types/domain.types';

interface NotificationRowProps {
  notification: Notification;
  onPress: (notification: Notification) => void;
}

function getNotificationIcon(type: NotificationType): React.ComponentProps<typeof MaterialIcons>['name'] {
  switch (type) {
    case 'shipment_update':
      return 'local-shipping';
    case 'payment_success':
      return 'check-circle';
    case 'payment_failed':
      return 'error';
    case 'warehouse_alert':
      return 'inventory';
    case 'system':
      return 'info';
    case 'promotion':
      return 'local-offer';
    default:
      return 'notifications';
  }
}

function getNotificationColor(type: NotificationType): string {
  switch (type) {
    case 'shipment_update':
      return Colors.primary;
    case 'payment_success':
      return Colors.success;
    case 'payment_failed':
      return Colors.error;
    case 'warehouse_alert':
      return Colors.warning;
    case 'system':
      return Colors.info;
    case 'promotion':
      return Colors.accent;
    default:
      return Colors.neutral;
  }
}

function formatTimestamp(timestamp: string): string {
  const now = new Date();
  const notifDate = new Date(timestamp);
  const diffMs = now.getTime() - notifDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return notifDate.toLocaleDateString();
}

export const NotificationRow = React.memo(function NotificationRow({
  notification,
  onPress,
}: NotificationRowProps) {
  const theme = useTheme();
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePress = useCallback(() => {
    onPress(notification);
  }, [notification, onPress]);

  const iconColor = getNotificationColor(notification.type);

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={() => {
        scale.value = withSpring(0.98);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
    >
      <Animated.View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'flex-start',
            paddingHorizontal: Spacing.md,
            paddingVertical: 12,
            gap: Spacing.md,
            backgroundColor: notification.isRead ? 'transparent' : theme.primary + '05',
          },
          animStyle,
        ]}
      >
        {/* Icon */}
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: iconColor + '1a',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MaterialIcons name={getNotificationIcon(notification.type)} size={20} color={iconColor} />
        </View>

        {/* Content */}
        <View style={{ flex: 1, gap: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text
              style={{
                ...Typography.bodyMedium,
                color: theme.textPrimary,
                fontWeight: notification.isRead ? '400' : '600',
                flex: 1,
              }}
              numberOfLines={1}
            >
              {notification.title}
            </Text>
            {!notification.isRead && (
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: Colors.accent,
                }}
              />
            )}
          </View>
          <Text style={{ ...Typography.caption, color: theme.textSecondary }} numberOfLines={2}>
            {notification.body}
          </Text>
          <Text style={{ ...Typography.caption, color: theme.textMuted, fontSize: 11 }}>
            {formatTimestamp(notification.timestamp)}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
});
