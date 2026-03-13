import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Avatar } from '@/components/ui/Avatar';
import { useTheme } from '@/hooks/useTheme';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { Spacing } from '@/constants/spacing';

type CallType = 'incoming' | 'outgoing' | 'missed';

interface RecentCall {
  id: string;
  name: string;
  number: string;
  type: CallType;
  timestamp: Date;
  duration: number; // seconds
  avatarUrl?: string;
}

interface RecentCallRowProps {
  call: RecentCall;
  onPress?: () => void;
  onCallPress?: (number: string) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (secs === 0) return `${mins}m`;
  return `${mins}m ${secs}s`;
}

export function RecentCallRow({ call, onPress, onCallPress }: RecentCallRowProps) {
  const theme = useTheme();
  const rowScale = useSharedValue(1);
  const callBtnScale = useSharedValue(1);

  const isMissed = call.type === 'missed';

  const rowAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: rowScale.value }],
  }));

  const callBtnAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: callBtnScale.value }],
  }));

  const handleRowPressIn = useCallback(() => {
    rowScale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
  }, [rowScale]);

  const handleRowPressOut = useCallback(() => {
    rowScale.value = withSpring(1, { damping: 15, stiffness: 400 });
  }, [rowScale]);

  const handleRowPress = useCallback(() => {
    if (onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  }, [onPress]);

  const handleCallPress = useCallback(() => {
    if (onCallPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onCallPress(call.number);
    }
  }, [onCallPress, call.number]);

  const getCallIcon = (): keyof typeof Ionicons.glyphMap => {
    switch (call.type) {
      case 'incoming':
        return 'call-outline';
      case 'outgoing':
        return 'call-outline';
      case 'missed':
        return 'call-outline';
      default:
        return 'call-outline';
    }
  };

  const getCallIconColor = (): string => {
    switch (call.type) {
      case 'missed':
        return Colors.error;
      case 'incoming':
        return Colors.success;
      case 'outgoing':
        return theme.textSecondary;
      default:
        return theme.textSecondary;
    }
  };

  return (
    <AnimatedPressable
      onPress={handleRowPress}
      onPressIn={handleRowPressIn}
      onPressOut={handleRowPressOut}
      disabled={!onPress}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: Spacing.sm,
          paddingHorizontal: Spacing.md,
          gap: Spacing.md,
          backgroundColor: theme.surface,
          borderBottomWidth: 1,
          borderBottomColor: theme.divider,
        },
        rowAnimatedStyle,
      ]}
    >
      <Avatar
        source={call.avatarUrl ? { uri: call.avatarUrl } : undefined}
        size="md"
        label={call.name}
      />

      <View style={{ flex: 1, gap: 2 }}>
        <Text
          style={{
            ...Typography.bodyMedium,
            color: isMissed ? Colors.error : theme.textPrimary,
            fontWeight: '500',
          }}
        >
          {call.name}
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Ionicons name={getCallIcon()} size={14} color={getCallIconColor()} />
          <Text
            style={{
              ...Typography.caption,
              color: theme.textSecondary,
            }}
          >
            {call.type === 'missed' ? 'Missed' : formatDuration(call.duration)}
          </Text>
          <Text
            style={{
              ...Typography.caption,
              color: theme.textMuted,
            }}
          >
            • {formatTimestamp(call.timestamp)}
          </Text>
        </View>
      </View>

      {onCallPress && (
        <AnimatedPressable
          onPress={handleCallPress}
          onPressIn={() => {
            callBtnScale.value = withSpring(0.9, { damping: 15, stiffness: 400 });
          }}
          onPressOut={() => {
            callBtnScale.value = withSpring(1, { damping: 15, stiffness: 400 });
          }}
          style={[
            {
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: Colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
            },
            callBtnAnimatedStyle,
          ]}
        >
          <Ionicons name="call" size={20} color={Colors.white} />
        </AnimatedPressable>
      )}
    </AnimatedPressable>
  );
}
