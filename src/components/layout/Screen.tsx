import React, { useEffect } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, ViewStyle } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import { useToasts } from '@/hooks/useToast';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { Toast } from '@/components/ui/Toast';
import { MaterialIcons } from '@expo/vector-icons';
import { Text } from 'react-native';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

interface ScreenProps {
  children: React.ReactNode;
  scroll?: boolean;
  edges?: Edge[];
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  backgroundColor?: string;
  noAnimation?: boolean;
}

function OfflineBanner({ visible }: { visible: boolean }) {
  const theme = useTheme();
  const translateY = useSharedValue(-48);

  useEffect(() => {
    translateY.value = withSpring(visible ? 0 : -48, { damping: 20, stiffness: 200 });
  }, [visible, translateY]);

  const animStyle = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9998,
          height: 40,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.warning,
          gap: Spacing.xs,
          paddingHorizontal: Spacing.md,
        },
        animStyle,
      ]}
    >
      <MaterialIcons name="wifi-off" size={16} color="#ffffff" />
      <Text style={{ ...Typography.caption, color: '#ffffff', fontWeight: '700' }}>
        No internet connection
      </Text>
    </Animated.View>
  );
}

export function Screen({
  children,
  scroll = false,
  edges = ['top', 'bottom', 'left', 'right'],
  style,
  contentContainerStyle,
  backgroundColor,
  noAnimation = false,
}: ScreenProps) {
  const theme = useTheme();
  const toasts = useToasts();
  const { isConnected } = useNetworkStatus();
  const opacity = useSharedValue(noAnimation ? 1 : 0);

  useEffect(() => {
    if (!noAnimation) opacity.value = withTiming(1, { duration: 220 });
  }, [noAnimation, opacity]);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  const content = scroll ? (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[{ flexGrow: 1 }, contentContainerStyle]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  ) : (
    <View style={[{ flex: 1 }, contentContainerStyle]}>{children}</View>
  );

  return (
    <SafeAreaView
      edges={edges}
      style={[{ flex: 1, backgroundColor: backgroundColor ?? theme.background }, style]}
    >
      <OfflineBanner visible={!isConnected} />
      <Animated.View style={[{ flex: 1 }, animStyle]}>
        {content}
      </Animated.View>
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onDismiss={() => {}} />
      ))}
    </SafeAreaView>
  );
}
