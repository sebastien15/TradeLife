import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Avatar } from '@/components/ui/Avatar';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/stores/authStore';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { t } from '@/i18n';

interface HomeNavBarProps {
  onSearchPress: () => void;
  onNotificationPress: () => void;
  unreadCount: number;
}

export function HomeNavBar({ onSearchPress, onNotificationPress, unreadCount }: HomeNavBarProps) {
  const theme = useTheme();
  const { user } = useAuthStore();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.md,
        paddingTop: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
        <Avatar uri={user?.avatar} name={user?.fullName} size="sm" />
        <Text style={{ fontSize: 20, fontWeight: '700', color: Colors.primary }}>
          {t('home.title')}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
        <Pressable
          onPress={onSearchPress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <MaterialIcons name="search" size={24} color={theme.textSecondary} />
        </Pressable>
        <Pressable
          onPress={onNotificationPress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={{ position: 'relative' }}
        >
          <MaterialIcons name="notifications-none" size={24} color={theme.textSecondary} />
          {unreadCount > 0 && (
            <View
              style={{
                position: 'absolute',
                top: -4,
                right: -8,
                minWidth: 18,
                height: 18,
                borderRadius: 9,
                backgroundColor: Colors.accent,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: '700',
                  color: '#ffffff',
                }}
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
}
