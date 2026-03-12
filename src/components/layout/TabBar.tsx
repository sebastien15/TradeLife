import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';
import { Typography } from '@/constants/typography';

type IconName = keyof typeof MaterialIcons.glyphMap;

const TAB_CONFIG: Record<string, { labelKey: string; icon: IconName; activeIcon: IconName }> = {
  index: { labelKey: 'tabs.home',    icon: 'home',        activeIcon: 'home' },
  money: { labelKey: 'tabs.trade',   icon: 'bar-chart',   activeIcon: 'bar-chart' },
  ship:  { labelKey: 'tabs.ship',    icon: 'inventory-2', activeIcon: 'inventory-2' },
  more:  { labelKey: 'tabs.profile', icon: 'person',      activeIcon: 'person' },
};

interface TabItemProps {
  routeName: string;
  label: string;
  isFocused: boolean;
  badge?: number;
  onPress: () => void;
  onLongPress: () => void;
}

function TabItem({ routeName, label, isFocused, badge, onPress, onLongPress }: TabItemProps) {
  const theme = useTheme();
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = useCallback(() => {
    scale.value = withSpring(1.2, { damping: 8, stiffness: 300 }, () => {
      scale.value = withSpring(1, { damping: 12, stiffness: 300 });
    });
    onPress();
  }, [onPress, scale]);

  const config = TAB_CONFIG[routeName] ?? { labelKey: '', icon: 'circle' as IconName, activeIcon: 'circle' as IconName };
  const color = isFocused ? theme.tabBarActive : theme.tabBarInactive;

  return (
    <Pressable
      onPress={handlePress}
      onLongPress={onLongPress}
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 8 }}
    >
      <Animated.View style={[{ alignItems: 'center', gap: 2 }, animStyle]}>
        <View style={{ position: 'relative' }}>
          <MaterialIcons
            name={isFocused ? config.activeIcon : config.icon}
            size={26}
            color={color}
          />
          {badge !== undefined && badge > 0 ? (
            <View
              style={{
                position: 'absolute',
                top: -4,
                right: -6,
                minWidth: 16,
                height: 16,
                borderRadius: 8,
                backgroundColor: theme.accent,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 3,
              }}
            >
              <Text
                style={{
                  fontSize: 9,
                  fontWeight: '700',
                  color: '#ffffff',
                  lineHeight: 12,
                }}
              >
                {badge > 99 ? '99+' : String(badge)}
              </Text>
            </View>
          ) : null}
        </View>
        <Text
          style={{
            ...Typography.tabLabel,
            color,
            fontWeight: isFocused ? '700' : '500',
          }}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <SafeAreaView
      edges={['bottom']}
      style={{
        backgroundColor: theme.tabBarBg,
        borderTopWidth: 0,
      }}
    >
      <View style={{ flexDirection: 'row', height: 60 }}>
        {state.routes.map((route, index) => {
          const config = TAB_CONFIG[route.name];
          if (!config) return null;
          const isFocused = state.index === index;
          const label = t(config.labelKey);

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({ type: 'tabLongPress', target: route.key });
          };

          return (
            <TabItem
              key={route.key}
              routeName={route.name}
              label={label}
              isFocused={isFocused}
              onPress={onPress}
              onLongPress={onLongPress}
            />
          );
        })}
      </View>
    </SafeAreaView>
  );
}
