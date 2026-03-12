import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Typography } from '@/constants/typography';
import { Spacing, Radius } from '@/constants/spacing';
import { Button } from './Button';

interface EmptyStateProps {
  iconName?: keyof typeof MaterialIcons.glyphMap;
  title: string;
  description?: string;
  action?: { label: string; onPress: () => void };
}

export function EmptyState({ iconName = 'inbox', title, description, action }: EmptyStateProps) {
  const theme = useTheme();
  const iconScale = useSharedValue(0);
  const titleOp   = useSharedValue(0);
  const descOp    = useSharedValue(0);
  const btnOp     = useSharedValue(0);

  useEffect(() => {
    iconScale.value = withSpring(1, { damping: 10, stiffness: 200 });
    titleOp.value   = withDelay(120, withTiming(1, { duration: 300 }));
    descOp.value    = withDelay(220, withTiming(1, { duration: 300 }));
    btnOp.value     = withDelay(320, withTiming(1, { duration: 300 }));
  }, [iconScale, titleOp, descOp, btnOp]);

  const iconStyle  = useAnimatedStyle(() => ({ transform: [{ scale: iconScale.value }] }));
  const titleStyle = useAnimatedStyle(() => ({ opacity: titleOp.value }));
  const descStyle  = useAnimatedStyle(() => ({ opacity: descOp.value }));
  const btnStyle   = useAnimatedStyle(() => ({ opacity: btnOp.value }));

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.xl,
        gap: Spacing.md,
      }}
    >
      <Animated.View
        style={[
          {
            width: 128,
            height: 128,
            borderRadius: Radius.full,
            backgroundColor: theme.primary + '1a',
            alignItems: 'center',
            justifyContent: 'center',
          },
          iconStyle,
        ]}
      >
        <MaterialIcons name={iconName} size={64} color={theme.primary} />
      </Animated.View>

      <Animated.Text
        style={[
          { ...Typography.h3, color: theme.textPrimary, textAlign: 'center' },
          titleStyle,
        ]}
      >
        {title}
      </Animated.Text>

      {description ? (
        <Animated.Text
          style={[
            { ...Typography.bodySm, color: theme.textSecondary, textAlign: 'center' },
            descStyle,
          ]}
        >
          {description}
        </Animated.Text>
      ) : null}

      {action ? (
        <Animated.View style={btnStyle}>
          <Button variant="primary" size="md" onPress={action.onPress} style={{ minWidth: 160 }}>
            {action.label}
          </Button>
        </Animated.View>
      ) : null}
    </View>
  );
}
