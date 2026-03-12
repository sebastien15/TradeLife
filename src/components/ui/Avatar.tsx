import React, { useEffect } from 'react';
import { View, Text, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import { useTheme } from '@/hooks/useTheme';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const SIZE_MAP: Record<AvatarSize, number> = {
  xs: 24, sm: 32, md: 40, lg: 56, xl: 80,
};
const FONT_SIZE_MAP: Record<AvatarSize, number> = {
  xs: 10, sm: 12, md: 14, lg: 18, xl: 24,
};

interface AvatarProps {
  uri?: string;
  name?: string;
  size?: AvatarSize;
  badge?: 'online' | 'offline';
  border?: boolean;
  style?: ViewStyle;
}

function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

export function Avatar({ uri, name, size = 'md', badge, border, style }: AvatarProps) {
  const theme = useTheme();
  const dim = SIZE_MAP[size];
  const dotSize = Math.max(8, Math.round(dim * 0.25));
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 250 });
  }, [scale]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[{ position: 'relative', alignSelf: 'flex-start' }, animStyle, style]}>
      <View
        style={{
          width: dim,
          height: dim,
          borderRadius: dim / 2,
          backgroundColor: theme.primary + '1a',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          borderWidth: border ? 2 : 0,
          borderColor: theme.primary,
        }}
      >
        {uri ? (
          <Image
            source={{ uri }}
            style={{ width: dim, height: dim }}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <Text
            style={{
              fontSize: FONT_SIZE_MAP[size],
              fontWeight: '700',
              color: theme.primary,
            }}
          >
            {name ? getInitials(name) : '?'}
          </Text>
        )}
      </View>

      {badge ? (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize / 2,
            backgroundColor: badge === 'online' ? theme.success : theme.textMuted,
            borderWidth: 2,
            borderColor: theme.surface,
          }}
        />
      ) : null}
    </Animated.View>
  );
}
