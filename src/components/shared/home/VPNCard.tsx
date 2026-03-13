import React, { useCallback, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useTheme } from '@/hooks/useTheme';
import { useVpnStore } from '@/stores/vpnStore';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { Spacing, Elevation } from '@/constants/spacing';
import { t } from '@/i18n';

interface VPNCardProps {
  onCardPress: () => void;
  onToggle: () => void;
  onRenewPress: () => void;
}

export function VPNCard({ onCardPress, onToggle, onRenewPress }: VPNCardProps) {
  const theme = useTheme();
  const vpn = useVpnStore();

  const isConnected = vpn.isConnected;
  const isConnecting = vpn.isConnecting;
  const isExpired = !vpn.subscriptionActive && vpn.daysRemaining === 0;

  // Animated toggle thumb
  const thumbX = useSharedValue(isConnected ? 20 : 0);
  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: thumbX.value }],
  }));

  useEffect(() => {
    thumbX.value = withSpring(isConnected ? 24 : 0, { damping: 18, stiffness: 200 });
  }, [isConnected, thumbX]);

  const handleCardPress = useCallback(() => {
    console.log('🎯 VPN Card pressed!', { isConnected, isConnecting, isExpired });
    if (isConnected || isConnecting) {
      console.log('📊 Opening VPN Dashboard');
      onCardPress();
    } else if (!isExpired) {
      console.log('🔘 Opening Server Selection');
      onToggle();
    }
  }, [isConnected, isConnecting, isExpired, onCardPress, onToggle]);

  const handleToggle = useCallback(() => {
    console.log('🔘 Toggle pressed!');
    if (!isConnected && !isConnecting && !isExpired) {
      onToggle();
    }
  }, [isConnected, isConnecting, isExpired, onToggle]);

  const iconBg = isExpired
    ? theme.neutralBg
    : isConnected
    ? Colors.successBg
    : isConnecting
    ? Colors.warningBg
    : theme.errorBg;

  const iconColor = isExpired
    ? theme.textMuted
    : isConnected
    ? Colors.success
    : isConnecting
    ? Colors.warning
    : theme.error;

  const statusText = isExpired
    ? t('home.serverExpired')
    : isConnected
    ? t('home.connected')
    : isConnecting
    ? t('home.connectingTo')
    : t('home.disconnected');

  const statusColor = isConnected
    ? theme.success
    : isConnecting
    ? theme.warning
    : isExpired
    ? theme.textMuted
    : theme.error;

  return (
    <Card
      radius="md"
      style={{
        marginHorizontal: Spacing.md,
        marginTop: Spacing.lg,
        padding: 20,
        borderWidth: 1,
        borderColor: theme.border,
      }}
      onPress={handleCardPress}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md, flex: 1 }}>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: iconBg,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isConnecting ? (
              <Spinner size="sm" color={iconColor} />
            ) : (
              <MaterialIcons
                name={isExpired ? 'lock' : isConnected ? 'verified-user' : 'security'}
                size={24}
                color={iconColor}
              />
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                ...Typography.caption,
                color: theme.textMuted,
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: 0.8,
              }}
            >
              {t('home.vpnStatus')}
            </Text>
            <Text style={{ ...Typography.h3, color: statusColor, fontWeight: '700' }}>
              {statusText}
            </Text>
            {isConnected && vpn.server ? (
              <Text style={{ ...Typography.bodySm, color: theme.textSecondary }}>
                Server: {vpn.server.country}
              </Text>
            ) : isConnecting && vpn.server ? (
              <Text style={{ ...Typography.bodySm, color: theme.textSecondary }}>
                {vpn.server.country}...
              </Text>
            ) : !isConnected && !isExpired ? (
              <Text style={{ ...Typography.bodySm, color: theme.textSecondary }}>
                {t('home.disconnected')}
              </Text>
            ) : null}
            {isConnected && (
              <Text style={{ ...Typography.caption, color: theme.textMuted, marginTop: 2 }}>
                Tap card for details →
              </Text>
            )}
          </View>
        </View>

        {isExpired ? (
          <Button variant="primary" size="sm" onPress={onRenewPress}>
            {t('home.renewNow')}
          </Button>
        ) : (
          <Pressable
            onPress={handleToggle}
            disabled={isConnecting}
            style={{
              width: 44,
              height: 24,
              borderRadius: 12,
              backgroundColor: isConnected || isConnecting ? Colors.primary : theme.border,
              justifyContent: 'center',
              paddingHorizontal: 2,
            }}
          >
            <Animated.View
              style={[
                {
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: theme.surface,
                  ...Elevation[1],
                },
                thumbStyle,
              ]}
            />
          </Pressable>
        )}
      </View>
    </Card>
  );
}
