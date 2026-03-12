// ─────────────────────────────────────────────────────────────────────────────
// TradeLife — Shared SettingsRow component
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '@/hooks/useTheme';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

type IconName = keyof typeof MaterialIcons.glyphMap;

export interface SettingsRowProps {
  icon: IconName;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  /** Badge/tag shown before the chevron, e.g. "Active" */
  badge?: string;
  /** Content shown before the chevron, like a current-value label */
  valueLabel?: string;
  /** Show a toggle control instead of a chevron */
  toggleValue?: boolean;
  onToggle?: (val: boolean) => void;
  /** Destructive row — uses error color for icon and text */
  destructive?: boolean;
  isLast?: boolean;
}

export function SettingsRow({
  icon,
  title,
  subtitle,
  onPress,
  badge,
  valueLabel,
  toggleValue,
  onToggle,
  destructive = false,
  isLast = false,
}: SettingsRowProps) {
  const theme = useTheme();
  const scale = useSharedValue(1);
  const iconColor = destructive ? Colors.error : Colors.primary;
  const hasToggle = toggleValue !== undefined;

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animStyle}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={() => { scale.value = withSpring(0.98, { damping: 14, stiffness: 300 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 14, stiffness: 300 }); }}
        activeOpacity={0.7}
        disabled={!onPress}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          minHeight: 56,
          paddingHorizontal: Spacing.md,
          paddingVertical: Spacing.sm,
          borderBottomWidth: isLast ? 0 : 1,
          borderBottomColor: theme.divider,
        }}
      >
        {/* Icon bubble */}
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: destructive ? `${Colors.error}18` : `${Colors.primary}18`,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: Spacing.md,
          }}
        >
          <MaterialIcons name={icon} size={20} color={iconColor} />
        </View>

        {/* Title + optional subtitle */}
        <View style={{ flex: 1 }}>
          <Text style={{ ...Typography.body, color: destructive ? Colors.error : theme.textPrimary }}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={{ ...Typography.caption, color: theme.textMuted, marginTop: 2 }}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        {/* Optional badge */}
        {badge ? (
          <View
            style={{
              paddingHorizontal: 8,
              paddingVertical: 2,
              borderRadius: 6,
              backgroundColor: `${Colors.primary}18`,
              marginRight: Spacing.sm,
            }}
          >
            <Text style={{ ...Typography.caption, color: Colors.primary, fontWeight: '700' }}>
              {badge}
            </Text>
          </View>
        ) : null}

        {/* Optional value label */}
        {valueLabel ? (
          <Text style={{ ...Typography.bodySm, color: theme.textMuted, marginRight: Spacing.xs }}>
            {valueLabel}
          </Text>
        ) : null}

        {/* Toggle OR Chevron */}
        {hasToggle ? (
          <Switch
            value={toggleValue}
            onValueChange={onToggle}
            trackColor={{ false: theme.border, true: Colors.primary }}
            thumbColor={Colors.white}
          />
        ) : onPress ? (
          <MaterialIcons name="chevron-right" size={24} color={theme.textMuted} />
        ) : null}
      </TouchableOpacity>
    </Animated.View>
  );
}
