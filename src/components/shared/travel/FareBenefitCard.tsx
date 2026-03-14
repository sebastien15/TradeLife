import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';

interface FareBenefitCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

export function FareBenefitCard({ icon, title, description }: FareBenefitCardProps) {
  const theme = useTheme();

  return (
    <View
      className="flex-1 min-w-[160px] p-4 rounded-xl"
      style={{
        backgroundColor: theme.primary + '0d', // 5% opacity
        borderWidth: 1,
        borderColor: theme.primary + '1a', // 10% opacity
      }}
    >
      <View
        className="w-10 h-10 rounded-full items-center justify-center mb-3"
        style={{ backgroundColor: theme.primary + '1a' }}
      >
        <Ionicons name={icon} size={20} color={theme.primary} />
      </View>

      <Text
        className="text-sm font-semibold mb-1"
        style={{ color: theme.textPrimary }}
      >
        {title}
      </Text>

      <Text
        className="text-xs"
        style={{ color: theme.textSecondary }}
      >
        {description}
      </Text>
    </View>
  );
}
