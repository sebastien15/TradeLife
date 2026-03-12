import React, { useEffect, useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Typography } from '@/constants/typography';
import { Spacing, Radius, Elevation } from '@/constants/spacing';
import type { ToastItem } from '@/hooks/useToast';

interface ToastProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

type IconName = keyof typeof MaterialIcons.glyphMap;
const ICON_MAP: Record<ToastItem['variant'], IconName> = {
  success: 'check-circle',
  error:   'cancel',
  warning: 'warning',
  info:    'info',
};

export function Toast({ toast, onDismiss }: ToastProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(-120);
  const opacity = useSharedValue(0);

  const colorMap: Record<ToastItem['variant'], { bg: string; text: string; icon: string }> = {
    success: { bg: theme.successBg, text: theme.successText, icon: theme.success },
    error:   { bg: theme.errorBg,   text: theme.errorText,   icon: theme.error },
    warning: { bg: theme.warningBg, text: theme.warningText, icon: theme.warning },
    info:    { bg: theme.infoBg,    text: theme.infoText,    icon: theme.info },
  };
  const { bg, text, icon } = colorMap[toast.variant];

  const dismiss = useCallback(() => {
    opacity.value = withTiming(0, { duration: 200 });
    translateY.value = withTiming(-120, { duration: 250 });
    setTimeout(() => onDismiss(toast.id), 260);
  }, [toast.id, onDismiss, opacity, translateY]);

  useEffect(() => {
    translateY.value = withSpring(insets.top + Spacing.md, { damping: 18, stiffness: 200 });
    opacity.value = withTiming(1, { duration: 200 });
    const t = setTimeout(dismiss, 3000);
    return () => clearTimeout(t);
  }, [insets.top, translateY, opacity, dismiss]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: 0,
          left: Spacing.md,
          right: Spacing.md,
          zIndex: 9999,
          borderRadius: Radius.md,
          backgroundColor: bg,
          paddingHorizontal: Spacing.md,
          paddingVertical: Spacing.sm + 2,
          flexDirection: 'row',
          alignItems: 'center',
          gap: Spacing.sm,
          ...Elevation[4],
        },
        animStyle,
      ]}
    >
      <MaterialIcons name={ICON_MAP[toast.variant]} size={20} color={icon} />
      <Text style={{ ...Typography.bodySm, color: text, flex: 1 }}>{toast.message}</Text>
      <Pressable onPress={dismiss} hitSlop={8}>
        <MaterialIcons name="close" size={18} color={text} />
      </Pressable>
    </Animated.View>
  );
}
