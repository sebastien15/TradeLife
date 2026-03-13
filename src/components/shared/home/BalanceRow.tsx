import React from 'react';
import { View } from 'react-native';
import { Spacing } from '@/constants/spacing';
import { WalletBalanceCard } from './WalletBalanceCard';
import { CallingCard } from './CallingCard';

interface BalanceRowProps {
  onMakeCall: () => void;
}

export function BalanceRow({ onMakeCall }: BalanceRowProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        gap: Spacing.md,
        marginHorizontal: Spacing.md,
        marginTop: Spacing.lg,
      }}
    >
      <WalletBalanceCard />
      <CallingCard onMakeCall={onMakeCall} />
    </View>
  );
}
