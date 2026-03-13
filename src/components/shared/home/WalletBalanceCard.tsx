import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useWalletStore } from '@/stores/walletStore';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { Spacing, Radius, Elevation } from '@/constants/spacing';
import { t } from '@/i18n';

// Exchange rate: 1 CNY = ~120 RWF (approximate)
const RWF_TO_CNY_RATE = 1 / 120;

export function WalletBalanceCard() {
  const { balance } = useWalletStore();
  const [showBalance, setShowBalance] = useState(true);

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(16);

  const mountStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 300 });
    translateY.value = withSpring(0, { damping: 18 });
  }, [opacity, translateY]);

  const handleToggleBalance = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowBalance((prev) => !prev);
  }, []);

  const formattedRwf = Math.floor(balance).toLocaleString();
  const formattedCny = (balance * RWF_TO_CNY_RATE).toFixed(2);
  const maskedBalance = '••••••';

  return (
    <Animated.View
      style={[
        {
          flex: 1,
          borderRadius: Radius.md,
          overflow: 'hidden',
          ...Elevation[2],
        },
        mountStyle,
      ]}
    >
      <LinearGradient
        colors={[Colors.accent, '#fb923c']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ padding: 20 }}
      >
        {/* Ghost watermark icon */}
        <MaterialIcons
          name="account-balance-wallet"
          size={120}
          color={Colors.white}
          style={{ position: 'absolute', right: -12, top: -12, opacity: 0.1 }}
        />

        {/* Header row */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: Spacing.md,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
            <MaterialIcons name="account-balance-wallet" size={20} color={Colors.white + 'cc'} />
            <Text style={{ ...Typography.body, color: Colors.white, fontWeight: '700' }}>
              {t('home.wallet')}
            </Text>
          </View>
          <Pressable
            onPress={handleToggleBalance}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MaterialIcons
              name={showBalance ? 'visibility' : 'visibility-off'}
              size={20}
              color={Colors.white + 'cc'}
            />
          </Pressable>
        </View>

        {/* Balance display */}
        <View style={{ gap: 4 }}>
          {/* RWF Balance */}
          <Text style={{ ...Typography.h2, color: Colors.white, fontWeight: '700' }}>
            RWF {showBalance ? formattedRwf : maskedBalance}
          </Text>
          {/* CNY Balance */}
          <Text
            style={{
              ...Typography.caption,
              color: Colors.white,
              opacity: 0.85,
            }}
          >
            ¥ {showBalance ? formattedCny : '••••'}
          </Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}
