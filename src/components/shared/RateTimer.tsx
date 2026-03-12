import React, { useState, useEffect, useCallback } from 'react';
import { View, Text } from 'react-native';
import { differenceInSeconds } from 'date-fns';
import { useTheme } from '@/hooks/useTheme';
import { Typography } from '@/constants/typography';
import { Spacing } from '@/constants/spacing';
import { MaterialIcons } from '@expo/vector-icons';

interface RateTimerProps {
  expiresAt: Date;
  onExpire: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(Math.max(0, seconds) / 60);
  const s = Math.max(0, seconds) % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function RateTimer({ expiresAt, onExpire }: RateTimerProps) {
  const theme = useTheme();
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, differenceInSeconds(expiresAt, new Date())),
  );

  const timerColor =
    remaining > 30 ? theme.success : remaining > 10 ? theme.warning : theme.error;

  useEffect(() => {
    if (remaining <= 0) {
      onExpire();
      return;
    }
    const interval = setInterval(() => {
      const next = Math.max(0, differenceInSeconds(expiresAt, new Date()));
      setRemaining(next);
      if (next <= 0) {
        clearInterval(interval);
        onExpire();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, onExpire, remaining]);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs }}>
      <MaterialIcons name="timer" size={14} color={timerColor} />
      <Text style={{ ...Typography.caption, color: timerColor, fontWeight: '700' }}>
        {formatTime(remaining)}
      </Text>
    </View>
  );
}
