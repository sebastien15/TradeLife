import React, { useEffect } from 'react';
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
import { Spacing, Radius } from '@/constants/spacing';

interface RightAction {
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
  badge?: number;
}

interface HeaderProps {
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  rightActions?: RightAction[];
  rightElement?: React.ReactNode;
  transparent?: boolean;
  showBorder?: boolean;
  large?: boolean;
}

export function Header({
  title,
  subtitle,
  onBack,
  rightActions,
  rightElement,
  transparent = false,
  showBorder = false,
  large = false,
}: HeaderProps) {
  const theme = useTheme();
  const translateY = useSharedValue(-20);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withSpring(0, { damping: 20, stiffness: 200 });
    opacity.value = withTiming(1, { duration: 250 });
  }, [translateY, opacity]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const backBtn = onBack ? (
    <Pressable
      onPress={onBack}
      style={{
        width: 40,
        height: 40,
        borderRadius: Radius.full,
        backgroundColor: theme.primary + '1a',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      hitSlop={8}
    >
      <MaterialIcons name="arrow-back" size={22} color={theme.primary} />
    </Pressable>
  ) : (
    <View style={{ width: 40 }} />
  );

  const rightSlot = rightElement ?? (
    <View style={{ flexDirection: 'row', gap: Spacing.xs }}>
      {(rightActions ?? []).map((action, i) => (
        <Pressable
          key={i}
          onPress={action.onPress}
          style={{
            width: 40,
            height: 40,
            borderRadius: Radius.full,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          hitSlop={8}
        >
          <MaterialIcons name={action.icon} size={22} color={theme.textPrimary} />
          {action.badge !== undefined && action.badge > 0 ? (
            <View
              style={{
                position: 'absolute',
                top: 6,
                right: 6,
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: theme.accent,
              }}
            />
          ) : null}
        </Pressable>
      ))}
      {!rightActions?.length ? <View style={{ width: 40 }} /> : null}
    </View>
  );

  return (
    <Animated.View
      style={[
        {
          minHeight: 64,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: Spacing.md,
          paddingVertical: large ? Spacing.sm : 0,
          backgroundColor: transparent ? 'transparent' : theme.headerBg,
          borderBottomWidth: showBorder ? 1 : 0,
          borderBottomColor: theme.border,
        },
        animStyle,
      ]}
    >
      {backBtn}
      <View style={{ flex: 1, alignItems: 'center' }}>
        {title ? (
          <Text
            style={{
              ...(large ? Typography.h1 : Typography.h3),
              color: theme.textPrimary,
            }}
            numberOfLines={1}
          >
            {title}
          </Text>
        ) : null}
        {subtitle ? (
          <Text style={{ ...Typography.caption, color: theme.textSecondary }}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {rightSlot}
    </Animated.View>
  );
}
