import React, { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Avatar } from '@/components/ui/Avatar';
import { CallTimer, CallControlButton, LowBalanceAlert } from '@/components/shared/call';
import { useTheme } from '@/hooks/useTheme';
import { useAppRouter } from '@/hooks/useAppRouter';
import { useCallStore } from '@/stores/callStore';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { Spacing } from '@/constants/spacing';
import { t } from '@/i18n';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function ActiveCallScreen() {
  const theme = useTheme();
  const router = useAppRouter();
  const insets = useSafeAreaInsets();
  const callStore = useCallStore();

  const [status, setStatus] = useState<'dialing' | 'ringing' | 'connected'>('dialing');

  const avatarScale = useSharedValue(1);
  const avatarGlow = useSharedValue(0);
  const endCallScale = useSharedValue(1);
  const resumeBtnScale = useSharedValue(1);

  // Simulate call connection sequence
  useEffect(() => {
    const dialingTimer = setTimeout(() => {
      setStatus('ringing');
      callStore.setStatus('ringing');
    }, 1500);

    const connectTimer = setTimeout(() => {
      setStatus('connected');
      callStore.setStatus('connected');
    }, 3500);

    return () => {
      clearTimeout(dialingTimer);
      clearTimeout(connectTimer);
    };
  }, [callStore]);

  // Timer interval for connected call
  useEffect(() => {
    if (status === 'connected') {
      const interval = setInterval(() => {
        callStore.tick();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [status, callStore]);

  // Avatar pulse animation during ringing
  useEffect(() => {
    if (status === 'ringing') {
      avatarScale.value = withRepeat(
        withSequence(
          withTiming(1.08, { duration: 800, easing: Easing.ease }),
          withTiming(1, { duration: 800, easing: Easing.ease })
        ),
        -1,
        false
      );
      avatarGlow.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 800, easing: Easing.ease }),
          withTiming(0, { duration: 800, easing: Easing.ease })
        ),
        -1,
        false
      );
    } else {
      avatarScale.value = withSpring(1);
      avatarGlow.value = withTiming(0);
    }
  }, [status, avatarScale, avatarGlow]);

  const avatarAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: avatarScale.value }],
  }));

  const glowAnimStyle = useAnimatedStyle(() => ({
    opacity: avatarGlow.value * 0.4,
  }));

  const endCallAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: endCallScale.value }],
  }));

  const handleEndCall = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    callStore.endCall();
    router.push('/call/summary');
  };

  const handleMute = () => {
    callStore.toggleMute();
  };

  const handleSpeaker = () => {
    callStore.toggleSpeaker();
  };

  const handleHold = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    callStore.toggleHold();
  };

  // Extract contact info from phone number (in production, lookup contact by number)
  const contactName = 'Wei Zhang';
  const contactNumber = callStore.remoteNumber;

  const statusText = callStore.isOnHold
    ? t('call.onHold')
    : status === 'dialing'
    ? t('call.calling')
    : status === 'ringing'
    ? 'Ringing...'
    : t('call.connected');

  const resumeBtnAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: resumeBtnScale.value }],
  }));

  return (
    <LinearGradient
      colors={['#004d4d', '#011a1a']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <View
        style={{
          flex: 1,
          paddingTop: insets.top + Spacing.md,
          paddingBottom: insets.bottom + Spacing.xl,
        }}
      >
        {/* Status Bar Text */}
        <Animated.View
          entering={FadeIn.duration(400)}
          style={{
            alignItems: 'center',
            paddingVertical: Spacing.sm,
          }}
        >
          {callStore.isOnHold ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="pause-circle" size={16} color={Colors.accent} />
              <Text
                style={{
                  ...Typography.caption,
                  color: Colors.accent,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  fontWeight: '600',
                }}
              >
                {statusText}
              </Text>
            </View>
          ) : (
            <Text
              style={{
                ...Typography.caption,
                color: 'rgba(255, 255, 255, 0.6)',
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              {statusText}
            </Text>
          )}
        </Animated.View>

        {/* Avatar Section */}
        <Animated.View
          entering={FadeInDown.duration(600).delay(100)}
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: Spacing.xl,
          }}
        >
          {/* Glow Effect */}
          <Animated.View
            style={[
              {
                position: 'absolute',
                width: 240,
                height: 240,
                borderRadius: 120,
                backgroundColor: Colors.primary,
                opacity: 0,
              },
              glowAnimStyle,
            ]}
          />

          {/* Avatar */}
          <Animated.View style={avatarAnimStyle}>
            <Avatar
              source={{ uri: 'https://i.pravatar.cc/300?u=wei' }}
              size="xl"
              label={contactName}
              style={{
                width: 192,
                height: 192,
                borderRadius: 96,
                borderWidth: 4,
                borderColor: 'rgba(255, 255, 255, 0.2)',
              }}
            />
          </Animated.View>

          {/* Contact Info */}
          <Animated.View
            entering={FadeInDown.duration(400).delay(200)}
            style={{
              marginTop: Spacing.xl,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                ...Typography.h1,
                fontSize: 28,
                color: Colors.white,
                fontWeight: '600',
                marginBottom: 4,
              }}
            >
              {contactName}
            </Text>

            {/* On Hold Badge */}
            {callStore.isOnHold && (
              <Animated.View entering={FadeIn.duration(300)}>
                <Text
                  style={{
                    fontSize: 18,
                    color: Colors.accent,
                    fontWeight: '700',
                    marginTop: Spacing.xs,
                    marginBottom: Spacing.xs,
                  }}
                >
                  {t('call.onHold')}
                </Text>
              </Animated.View>
            )}

            <Text
              style={{
                ...Typography.body,
                color: 'rgba(255, 255, 255, 0.7)',
                marginBottom: Spacing.md,
              }}
            >
              {contactNumber}
            </Text>

            {/* Call Timer - Only show when connected */}
            {status === 'connected' && (
              <Animated.View entering={FadeIn.duration(400)}>
                <CallTimer duration={callStore.duration} showDot={true} color={Colors.white} />
              </Animated.View>
            )}
          </Animated.View>
        </Animated.View>

        {/* Control Buttons */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(300)}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingHorizontal: Spacing.xl,
            marginBottom: Spacing.xl,
          }}
        >
          <CallControlButton
            icon={callStore.isMuted ? 'mic-off' : 'mic'}
            label={callStore.isMuted ? t('call.unmute') : t('call.mute')}
            onPress={handleMute}
            active={callStore.isMuted}
            disabled={callStore.isOnHold}
          />
          <CallControlButton
            icon={callStore.isOnHold ? 'play' : 'pause'}
            label={callStore.isOnHold ? t('call.resume') : t('call.hold')}
            onPress={handleHold}
            active={callStore.isOnHold}
          />
          <CallControlButton
            icon={callStore.isSpeaker ? 'volume-high' : 'volume-medium'}
            label={t('call.speaker')}
            onPress={handleSpeaker}
            active={callStore.isSpeaker}
            disabled={callStore.isOnHold}
          />
          <CallControlButton
            icon="videocam-off"
            label="Video"
            onPress={() => {}}
            disabled={true}
          />
        </Animated.View>

        {/* Resume Button - Only show when on hold */}
        {callStore.isOnHold && (
          <Animated.View
            entering={FadeIn.duration(300)}
            style={{
              paddingHorizontal: Spacing.xl,
              marginBottom: Spacing.md,
            }}
          >
            <AnimatedPressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                callStore.toggleHold();
              }}
              onPressIn={() => {
                resumeBtnScale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
              }}
              onPressOut={() => {
                resumeBtnScale.value = withSpring(1, { damping: 15, stiffness: 400 });
              }}
              style={[
                {
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: Colors.accent,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: Spacing.sm,
                  shadowColor: Colors.accent,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.4,
                  shadowRadius: 12,
                  elevation: 8,
                },
                resumeBtnAnimStyle,
              ]}
            >
              <Ionicons name="play" size={28} color={Colors.white} />
              <Text style={{ fontSize: 18, fontWeight: '700', color: Colors.white }}>
                {t('call.resumeCall')}
              </Text>
            </AnimatedPressable>
          </Animated.View>
        )}

        {/* End Call Button */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(400)}
          style={{
            alignItems: 'center',
          }}
        >
          <AnimatedPressable
            onPress={handleEndCall}
            onPressIn={() => {
              endCallScale.value = withSpring(0.92, { damping: 15, stiffness: 400 });
            }}
            onPressOut={() => {
              endCallScale.value = withSpring(1, { damping: 15, stiffness: 400 });
            }}
            style={[
              {
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: Colors.error,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: Colors.error,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.5,
                shadowRadius: 16,
                elevation: 10,
              },
              endCallAnimStyle,
            ]}
          >
            <Ionicons name="call" size={36} color={Colors.white} style={{ transform: [{ rotate: '135deg' }] }} />
          </AnimatedPressable>
          <Text
            style={{
              ...Typography.bodyMedium,
              color: Colors.white,
              marginTop: Spacing.sm,
            }}
          >
            {t('call.endCall')}
          </Text>
        </Animated.View>
      </View>

      {/* Low Balance Alert Modal */}
      <LowBalanceAlert
        visible={callStore.showLowBalanceWarning}
        onClose={callStore.dismissLowBalanceWarning}
        remainingBalance={callStore.currentBalance - callStore.cost}
      />
    </LinearGradient>
  );
}
