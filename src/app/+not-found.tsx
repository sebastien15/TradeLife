import React from 'react';
import { View, Text } from 'react-native';
import { Link } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { Typography } from '@/constants/typography';

export default function NotFoundScreen() {
  const theme = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.background }}>
      <Text style={{ ...Typography.h2, color: theme.textPrimary }}>Page Not Found</Text>
      <Link href="/" style={{ marginTop: 16 }}>
        <Text style={{ ...Typography.body, color: theme.primary }}>Go Home</Text>
      </Link>
    </View>
  );
}
