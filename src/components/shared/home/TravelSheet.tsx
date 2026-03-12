import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable } from 'react-native';
import GorhomBottomSheet from '@gorhom/bottom-sheet';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BottomSheet } from '@/components/layout/BottomSheet';
import { useTheme } from '@/hooks/useTheme';
import { Typography } from '@/constants/typography';
import { Spacing } from '@/constants/spacing';
import { t } from '@/i18n';

interface TravelSheetProps {
  visible: boolean;
  onClose: () => void;
}

const TRAVEL_ITEMS: { icon: keyof typeof MaterialIcons.glyphMap; labelKey: string; route: string }[] = [
  { icon: 'flight-takeoff', labelKey: 'travel.flights', route: '/travel/flights' },
  { icon: 'description',    labelKey: 'travel.visa',    route: '/travel/visa/step-1-docs' },
  { icon: 'vpn-key',        labelKey: 'travel.vpn',     route: '/' },
  { icon: 'hotel',          labelKey: 'travel.title',   route: '/travel' },
];

export function TravelSheet({ visible, onClose }: TravelSheetProps) {
  const theme = useTheme();
  const router = useRouter();
  const sheetRef = useRef<GorhomBottomSheet>(null);

  useEffect(() => {
    if (visible) sheetRef.current?.expand();
    else sheetRef.current?.close();
  }, [visible]);

  return (
    <BottomSheet ref={sheetRef} snapPoints={['40%']} index={-1} onClose={onClose}>
      <View style={{ paddingHorizontal: Spacing.md, gap: Spacing.xs }}>
        <Text style={{ ...Typography.h3, color: theme.textPrimary, marginBottom: Spacing.sm }}>
          {t('tabs.travel')}
        </Text>
        {TRAVEL_ITEMS.map((item) => (
          <Pressable
            key={item.labelKey}
            onPress={() => {
              router.push(item.route as Parameters<typeof router.push>[0]);
              onClose();
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: Spacing.md,
              paddingVertical: Spacing.md,
            }}
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
              <MaterialIcons name={item.icon} size={20} color={theme.primary} />
            </View>
            <Text style={{ ...Typography.body, color: theme.textPrimary }}>
              {t(item.labelKey as Parameters<typeof t>[0])}
            </Text>
          </Pressable>
        ))}
      </View>
    </BottomSheet>
  );
}
