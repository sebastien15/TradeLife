import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import { Badge } from '@/components/ui/Badge';
import { Typography } from '@/constants/typography';
import { Spacing } from '@/constants/spacing';
import type { SearchResult } from '@/types/domain.types';

interface SearchResultRowProps {
  result: SearchResult;
  onPress: (result: SearchResult) => void;
}

function getCategoryIcon(category: SearchResult['category']): React.ComponentProps<typeof MaterialIcons>['name'] {
  switch (category) {
    case 'shipments':
      return 'local-shipping';
    case 'samples':
      return 'inventory-2';
    case 'transactions':
      return 'receipt';
    case 'contacts':
      return 'person';
    default:
      return 'search';
  }
}

export const SearchResultRow = React.memo(function SearchResultRow({
  result,
  onPress,
}: SearchResultRowProps) {
  const theme = useTheme();
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePress = useCallback(() => {
    onPress(result);
  }, [result, onPress]);

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={() => {
        scale.value = withSpring(0.98);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
    >
      <Animated.View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: Spacing.md,
            paddingVertical: 12,
            gap: Spacing.md,
          },
          animStyle,
        ]}
      >
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: theme.primary + '1a',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MaterialIcons name={getCategoryIcon(result.category)} size={20} color={theme.primary} />
        </View>

        <View style={{ flex: 1, gap: 2 }}>
          <Text style={{ ...Typography.bodyMedium, color: theme.textPrimary }} numberOfLines={1}>
            {result.title}
          </Text>
          <Text style={{ ...Typography.caption, color: theme.textSecondary }} numberOfLines={1}>
            {result.subtitle}
          </Text>
        </View>

        {result.metadata && (
          <Badge variant="neutral" label={result.metadata} size="sm" />
        )}

        <MaterialIcons name="chevron-right" size={20} color={theme.textMuted} />
      </Animated.View>
    </Pressable>
  );
});
