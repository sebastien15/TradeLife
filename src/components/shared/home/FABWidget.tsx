import React, { useCallback, useEffect, useRef } from 'react';
import { View, Text, Pressable } from 'react-native';
import GorhomBottomSheet from '@gorhom/bottom-sheet';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { BottomSheet } from '@/components/layout/BottomSheet';
import { useTheme } from '@/hooks/useTheme';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { Spacing, Elevation } from '@/constants/spacing';
import { t } from '@/i18n';

interface FABSheetProps {
  visible: boolean;
  onClose: () => void;
}

function FABSheet({ visible, onClose }: FABSheetProps) {
  const theme = useTheme();
  const sheetRef = useRef<GorhomBottomSheet>(null);

  useEffect(() => {
    if (visible) {
      sheetRef.current?.expand();
    } else {
      sheetRef.current?.close();
    }
  }, [visible]);

  const quickActions: { icon: keyof typeof MaterialIcons.glyphMap; labelKey: string }[] = [
    { icon: 'qr-code-scanner',      labelKey: 'home.fabScanQR' },
    { icon: 'add-photo-alternate',   labelKey: 'home.fabPhotoDeclaration' },
    { icon: 'support-agent',         labelKey: 'home.fabLiveSupport' },
    { icon: 'translate',             labelKey: 'home.fabTranslate' },
  ];

  const handleAction = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <BottomSheet ref={sheetRef} snapPoints={['30%']} index={-1} onClose={onClose}>
      <View style={{ paddingHorizontal: Spacing.md, gap: Spacing.sm }}>
        {quickActions.map((action) => (
          <Pressable
            key={action.labelKey}
            onPress={() => handleAction()}
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
              <MaterialIcons name={action.icon} size={20} color={theme.primary} />
            </View>
            <Text style={{ ...Typography.body, color: theme.textPrimary }}>
              {t(action.labelKey as Parameters<typeof t>[0])}
            </Text>
          </Pressable>
        ))}
      </View>
    </BottomSheet>
  );
}

interface FABWidgetProps {
  onFABPress: () => void;
  fabSheetVisible: boolean;
  onFABSheetClose: () => void;
}

export function FABWidget({ onFABPress, fabSheetVisible, onFABSheetClose }: FABWidgetProps) {
  const fabScale = useSharedValue(0);
  const fabAnimStyle = useAnimatedStyle(() => ({ transform: [{ scale: fabScale.value }] }));

  const pressScale = useSharedValue(1);
  const pressAnimStyle = useAnimatedStyle(() => ({ transform: [{ scale: pressScale.value }] }));

  useEffect(() => {
    fabScale.value = withSpring(1, { damping: 12, stiffness: 200 });
  }, [fabScale]);

  return (
    <>
      <Pressable
        onPress={onFABPress}
        onPressIn={() => { pressScale.value = withSpring(0.94); }}
        onPressOut={() => { pressScale.value = withSpring(1); }}
        style={{ position: 'absolute', bottom: 80, right: Spacing.md }}
      >
        <Animated.View
          style={[
            {
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: Colors.accent,
              alignItems: 'center',
              justifyContent: 'center',
              ...Elevation[3],
            },
            fabAnimStyle,
            pressAnimStyle,
          ]}
        >
          <MaterialIcons name="mic" size={24} color={Colors.white} />
        </Animated.View>
      </Pressable>

      <FABSheet visible={fabSheetVisible} onClose={onFABSheetClose} />
    </>
  );
}
