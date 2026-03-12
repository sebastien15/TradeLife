import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Typography } from '@/constants/typography';
import { Spacing, Radius } from '@/constants/spacing';

interface StepIndicatorProps {
  steps: string[];
  currentStep: number; // 0-indexed
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  const theme = useTheme();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {steps.map((step, index) => {
        const isPast    = index < currentStep;
        const isCurrent = index === currentStep;
        const isLast    = index === steps.length - 1;

        const circleColor = isPast
          ? theme.success
          : isCurrent
          ? theme.primary
          : 'transparent';

        const circleBorder = isPast || isCurrent ? 'transparent' : theme.border;

        return (
          <React.Fragment key={index}>
            <View style={{ alignItems: 'center', gap: 4 }}>
              {/* Circle */}
              <View
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: Radius.full,
                  backgroundColor: circleColor,
                  borderWidth: 2,
                  borderColor: circleBorder,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isPast ? (
                  <MaterialIcons name="check" size={14} color="#ffffff" />
                ) : (
                  <Text
                    style={{
                      ...Typography.badge,
                      color: isCurrent ? '#ffffff' : theme.textMuted,
                      lineHeight: 14,
                    }}
                  >
                    {String(index + 1)}
                  </Text>
                )}
              </View>
              {/* Label */}
              <Text
                style={{
                  ...Typography.caption,
                  color: isCurrent ? theme.primary : isPast ? theme.success : theme.textMuted,
                  fontWeight: isCurrent ? '700' : '400',
                  textAlign: 'center',
                  maxWidth: 60,
                }}
                numberOfLines={2}
              >
                {step}
              </Text>
            </View>

            {/* Connector line */}
            {!isLast ? (
              <View
                style={{
                  flex: 1,
                  height: 2,
                  backgroundColor: isPast ? theme.success : theme.border,
                  marginBottom: 20,
                  marginHorizontal: 4,
                }}
              />
            ) : null}
          </React.Fragment>
        );
      })}
    </View>
  );
}
