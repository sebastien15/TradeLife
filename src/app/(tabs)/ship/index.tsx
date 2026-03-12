import React from 'react';
import { View, Text } from 'react-native';
import { Screen } from '@/components/layout/Screen';
import { useTheme } from '@/hooks/useTheme';
import { Typography } from '@/constants/typography';

export default function ShipScreen() {
  const theme = useTheme();
  return (
    <Screen>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ ...Typography.h2, color: theme.textPrimary }}>Ship</Text>
        <Text style={{ ...Typography.body, color: theme.textSecondary, marginTop: 8 }}>Coming soon</Text>
      </View>
    </Screen>
  );
}
