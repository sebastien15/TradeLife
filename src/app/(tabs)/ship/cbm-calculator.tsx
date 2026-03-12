import React from 'react';
import { View, Text } from 'react-native';
import { Screen } from '@/components/layout/Screen';
import { useTheme } from '@/hooks/useTheme';
import { Typography } from '@/constants/typography';

export default function CbmCalculatorScreen() {
  const theme = useTheme();
  return (
    <Screen>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ ...Typography.h2, color: theme.textPrimary }}>Coming Soon</Text>
      </View>
    </Screen>
  );
}
