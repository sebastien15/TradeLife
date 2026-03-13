import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';

interface KeypadButton {
  number: string;
  letters?: string;
}

const KEYPAD_LAYOUT: KeypadButton[] = [
  { number: '1', letters: '' },
  { number: '2', letters: 'ABC' },
  { number: '3', letters: 'DEF' },
  { number: '4', letters: 'GHI' },
  { number: '5', letters: 'JKL' },
  { number: '6', letters: 'MNO' },
  { number: '7', letters: 'PQRS' },
  { number: '8', letters: 'TUV' },
  { number: '9', letters: 'WXYZ' },
  { number: '*', letters: '' },
  { number: '0', letters: '+' },
  { number: '#', letters: '' },
];

interface DialerKeypadProps {
  onPress: (digit: string) => void;
  onLongPress?: (digit: string) => void;
}

interface KeypadButtonProps {
  button: KeypadButton;
  onPress: (digit: string) => void;
  onLongPress?: (digit: string) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function KeypadButtonComponent({ button, onPress, onLongPress }: KeypadButtonProps) {
  const theme = useTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 400 });
    opacity.value = 0.7;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [scale, opacity]);

  const handlePressOut = useCallback(() => {
    scale.value = withSequence(
      withSpring(1.05, { damping: 10, stiffness: 400 }),
      withSpring(1, { damping: 15, stiffness: 400 })
    );
    opacity.value = 1;
  }, [scale, opacity]);

  const handlePress = useCallback(() => {
    onPress(button.number);
  }, [button.number, onPress]);

  const handleLongPress = useCallback(() => {
    if (onLongPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onLongPress(button.number);
    }
  }, [button.number, onLongPress]);

  return (
    <AnimatedPressable
      onPress={handlePress}
      onLongPress={handleLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        {
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: theme.surface,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: theme.border,
        },
        animatedStyle,
      ]}
    >
      <Text
        style={{
          ...Typography.h1,
          fontSize: 28,
          color: theme.textPrimary,
          fontWeight: '400',
        }}
      >
        {button.number}
      </Text>
      {button.letters && (
        <Text
          style={{
            ...Typography.caption,
            fontSize: 10,
            color: theme.textMuted,
            letterSpacing: 1,
            marginTop: -2,
          }}
        >
          {button.letters}
        </Text>
      )}
    </AnimatedPressable>
  );
}

export function DialerKeypad({ onPress, onLongPress }: DialerKeypadProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 16,
        paddingHorizontal: 20,
        maxWidth: 320,
        alignSelf: 'center',
      }}
    >
      {KEYPAD_LAYOUT.map((button, index) => (
        <KeypadButtonComponent
          key={`${button.number}-${index}`}
          button={button}
          onPress={onPress}
          onLongPress={onLongPress}
        />
      ))}
    </View>
  );
}
