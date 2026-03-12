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
        <Pressable onPress={onSearchPress}>
          <MaterialIcons name="search" size={24} color={theme.textSecondary} />
        </Pressable>
        <Pressable onPress={onNotificationPress} style={{ position: 'relative' }}>
          <MaterialIcons name="notifications-none" size={24} color={theme.textSecondary} />
          {unreadCount > 0 && (
            <View
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: Colors.accent,
              }}
            />
          )}
        </Pressable>
      </View>
    </View>
  );
}
