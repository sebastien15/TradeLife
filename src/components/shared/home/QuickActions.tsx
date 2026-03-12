import React, { useCallback, useMemo } from 'react';
import { View, Text, FlatList, Pressable, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useWarehouseStore } from '@/stores/warehouseStore';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { Spacing, Radius, Elevation } from '@/constants/spacing';
import { t } from '@/i18n';

interface QuickAction {
  id: string;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  route?: '/money' | '/ship/quote' | '/ship/warehouse' | '/more/community' | '/more/community/marketplace';
  badge?: number;
  accent?: boolean;
  sheetAction?: 'travel';
}

const QUICK_ACTIONS: QuickAction[] = [
  { id: '1', label: t('home.sendMoney'),    icon: 'payments',         route: '/money' },
  { id: '2', label: t('home.bookCargo'),    icon: 'local-shipping',   route: '/ship/quote' },
  { id: '3', label: t('home.travelHub'),    icon: 'flight-takeoff',   sheetAction: 'travel' },
  { id: '4', label: t('home.bookInspector'),icon: 'verified-user',    route: '/ship/warehouse', badge: 0 },
  { id: '5', label: t('home.mentorChat'),   icon: 'forum',            route: '/more/community' },
  { id: '6', label: t('home.emergency'),    icon: 'emergency',        route: '/more/community', accent: true },
];

interface QuickActionCardProps {
  action: QuickAction;
  onPress: () => void;
}

const QuickActionCard = React.memo(function QuickActionCard({ action, onPress }: QuickActionCardProps) {
  const theme = useTheme();
  const cardWidth = (Dimensions.get('window').width - Spacing.md * 2 - 12 * 2) / 3;
  const iconBg = action.accent ? theme.errorBg : theme.primary + '1a';
  const iconColor = action.accent ? theme.error : theme.primary;

  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => { scale.value = withSpring(0.96); }}
      onPressOut={() => { scale.value = withSpring(1); }}
    >
      <Animated.View
        style={[
          {
            width: cardWidth,
            backgroundColor: theme.surface,
            borderRadius: Radius.md,
            padding: Spacing.md,
            alignItems: 'center',
            gap: Spacing.sm,
            borderWidth: 1,
            borderColor: theme.border,
            ...Elevation[1],
          },
          animStyle,
        ]}
      >
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: iconBg,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MaterialIcons name={action.icon} size={20} color={iconColor} />
        </View>
        <Text
          style={{
            fontSize: 10,
            fontWeight: '600',
            color: theme.textSecondary,
            textAlign: 'center',
          }}
          numberOfLines={2}
        >
          {action.label}
        </Text>
      </Animated.View>
    </Pressable>
  );
});

interface QuickActionsProps {
  onTravelPress: () => void;
}

export function QuickActions({ onTravelPress }: QuickActionsProps) {
  const theme = useTheme();
  const router = useRouter();
  const { items } = useWarehouseStore();

  const actionsWithBadges = useMemo(
    () => QUICK_ACTIONS.map((a) => (a.id === '4' ? { ...a, badge: items.length } : a)) as QuickAction[],
    [items.length]
  );

  const handlePress = useCallback(
    (action: QuickAction) => {
      if (action.sheetAction === 'travel') { onTravelPress(); return; }
      if (action.route) router.push(action.route);
    },
    [router, onTravelPress]
  );

  const renderItem = useCallback(
    ({ item }: { item: QuickAction }) => (
      <QuickActionCard action={item} onPress={() => handlePress(item)} />
    ),
    [handlePress]
  );

  const keyExtractor = useCallback((item: QuickAction) => item.id, []);

  return (
    <View style={{ marginTop: Spacing.lg, paddingHorizontal: Spacing.md }}>
      <Text style={{ ...Typography.h3, color: theme.textPrimary, marginBottom: Spacing.sm }}>
        {t('home.services')}
      </Text>
      <FlatList
        data={actionsWithBadges}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={3}
        columnWrapperStyle={{ gap: 12, marginBottom: 12 }}
        scrollEnabled={false}
      />
    </View>
  );
}
