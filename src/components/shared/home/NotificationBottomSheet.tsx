import React, { useCallback, useRef, useEffect } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import GorhomBottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Typography } from '@/constants/typography';
import { Spacing } from '@/constants/spacing';
import { BottomSheet } from '@/components/layout/BottomSheet';
import { EmptyState } from '@/components/ui/EmptyState';
import { NotificationRow } from './NotificationRow';
import { useNotificationStore } from '@/stores/notificationStore';
import { fetchNotifications } from '@/services/notification.service';
import { t } from '@/i18n';
import type { Notification } from '@/types/domain.types';

interface NotificationBottomSheetProps {
  visible: boolean;
  onClose: () => void;
}

export function NotificationBottomSheet({ visible, onClose }: NotificationBottomSheetProps) {
  const theme = useTheme();
  const sheetRef = useRef<GorhomBottomSheet>(null);
  const { notifications, markAsRead, markAllAsRead, clearAll, setNotifications } = useNotificationStore();

  // Load notifications on mount
  useEffect(() => {
    const loadNotifications = () => {
      const notifs = fetchNotifications();
      setNotifications(notifs);
    };
    loadNotifications();
  }, [setNotifications]);

  React.useEffect(() => {
    if (visible) {
      sheetRef.current?.expand();
    } else {
      sheetRef.current?.close();
    }
  }, [visible]);

  const handleNotificationPress = useCallback(
    (notification: Notification) => {
      // Mark as read
      markAsRead(notification.id);

      // TODO: Navigate to actionUrl if provided
      // For now, just close
      onClose();
    },
    [markAsRead, onClose]
  );

  const handleMarkAllRead = useCallback(() => {
    markAllAsRead();
  }, [markAllAsRead]);

  const handleClearAll = useCallback(() => {
    Alert.alert(
      t('notifications.clearAll'),
      'Are you sure you want to clear all notifications?',
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.confirm'),
          style: 'destructive',
          onPress: () => {
            clearAll();
            onClose();
          },
        },
      ]
    );
  }, [clearAll, onClose]);

  const renderItem = useCallback(
    ({ item }: { item: Notification }) => (
      <NotificationRow notification={item} onPress={handleNotificationPress} />
    ),
    [handleNotificationPress]
  );

  return (
    <BottomSheet ref={sheetRef} snapPoints={['90%']} index={-1} onClose={onClose}>
      <View style={{ flex: 1, gap: Spacing.sm }}>
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: Spacing.md,
          }}
        >
          <Text style={{ ...Typography.h3, color: theme.textPrimary }}>
            {t('notifications.title')}
          </Text>
          {notifications.length > 0 && (
            <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
              <Pressable onPress={handleMarkAllRead}>
                <MaterialIcons name="done-all" size={20} color={theme.primary} />
              </Pressable>
              <Pressable onPress={handleClearAll}>
                <MaterialIcons name="delete-outline" size={20} color={theme.textMuted} />
              </Pressable>
            </View>
          )}
        </View>

        {/* Content */}
        {notifications.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <EmptyState
              icon="notifications-none"
              title={t('notifications.noNotifications')}
              message={t('notifications.checkBackLater')}
            />
          </View>
        ) : (
          <BottomSheetFlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  height: 1,
                  backgroundColor: theme.divider,
                  marginHorizontal: Spacing.md,
                }}
              />
            )}
          />
        )}
      </View>
    </BottomSheet>
  );
}
