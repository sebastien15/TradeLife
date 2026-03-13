import React, { useCallback } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { Spacing, Radius, Elevation } from '@/constants/spacing';
import { t } from '@/i18n';

interface Sample {
  id: string;
  name: string;
  image: string;
  status: 'pending' | 'approved' | 'rejected';
}

const SAMPLE_DATA: Sample[] = [
  { id: '1', name: 'Solar Panel V3',  image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=320&h=224&fit=crop', status: 'pending' },
  { id: '2', name: 'LED High Bay',    image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=320&h=224&fit=crop', status: 'approved' },
  { id: '3', name: 'Smart Meter X',   image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=320&h=224&fit=crop', status: 'pending' },
  { id: '4', name: 'Safety Helmet',   image: 'https://images.unsplash.com/photo-1617957772002-57adde1156fa?w=320&h=224&fit=crop', status: 'rejected' },
  { id: '5', name: 'Power Cable',     image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=320&h=224&fit=crop', status: 'approved' },
];

interface SampleCardProps {
  sample: Sample;
  onPress: () => void;
}

const SampleCard = React.memo(function SampleCard({ sample, onPress }: SampleCardProps) {
  const theme = useTheme();
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const statusLabel =
    sample.status === 'pending'
      ? 'At Port'
      : sample.status === 'approved'
      ? 'Arrived'
      : 'In Customs';

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => { scale.value = withSpring(0.96); }}
      onPressOut={() => { scale.value = withSpring(1); }}
    >
      <Animated.View
        style={[
          {
            width: 160,
            backgroundColor: theme.surface,
            borderRadius: Radius.md,
            marginRight: Spacing.md,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: theme.border,
            ...Elevation[1],
          },
          animStyle,
        ]}
      >
        {/* Product image */}
        <Image
          source={{ uri: sample.image }}
          style={{ width: '100%', height: 112 }}
          contentFit="cover"
          transition={200}
        />
        {/* Content */}
        <View style={{ padding: 12 }}>
          <Text
            style={{ fontSize: 12, fontWeight: '500', color: theme.textPrimary }}
            numberOfLines={1}
          >
            {sample.name}
          </Text>
          <Text style={{ fontSize: 10, color: theme.textSecondary, marginTop: 2 }}>
            {statusLabel}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
});

export function SampleTracking() {
  const theme = useTheme();

  // Hide if no samples
  if (SAMPLE_DATA.length === 0) {
    return null;
  }

  const handlePress = useCallback((_sample: Sample) => {
    // TODO: navigate to sample detail
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Sample }) => <SampleCard sample={item} onPress={() => handlePress(item)} />,
    [handlePress]
  );

  return (
    <View style={{ marginTop: Spacing.lg }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: Spacing.md,
          marginBottom: Spacing.sm,
        }}
      >
        <Text style={{ ...Typography.h3, color: theme.textPrimary }}>{t('home.sampleTracking')}</Text>
        <Pressable>
          <Text style={{ fontSize: 12, fontWeight: '600', color: theme.primary }}>
            {t('common.viewAll')}
          </Text>
        </Pressable>
      </View>
      <FlatList
        data={SAMPLE_DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: Spacing.md }}
      />
    </View>
  );
}
