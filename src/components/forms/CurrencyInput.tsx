import React, { useCallback } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { FieldValues, Control, Path } from 'react-hook-form';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Typography } from '@/constants/typography';
import { Spacing, Radius } from '@/constants/spacing';
import { FormField } from './FormField';

interface CurrencyInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  currency: string;
  label?: string;
  readOnly?: boolean;
  onCurrencyPress?: () => void;
  balance?: number;
  convertedAmount?: string;
  showMax?: boolean;
  onMax?: () => void;
}

function formatWithCommas(val: string): string {
  const num = val.replace(/[^0-9.]/g, '');
  const parts = num.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

export function CurrencyInput<T extends FieldValues>({
  control,
  name,
  currency,
  label,
  readOnly = false,
  onCurrencyPress,
  balance,
  convertedAmount,
  showMax = false,
  onMax,
}: CurrencyInputProps<T>) {
  const theme = useTheme();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, error }) => (
        <View style={{ gap: 6 }}>
          {label ? (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ ...Typography.label, color: theme.textPrimary }}>{label}</Text>
              {balance !== undefined ? (
                <Text style={{ ...Typography.caption, color: theme.textMuted }}>
                  {`Bal: ${currency} ${balance.toLocaleString()}`}
                </Text>
              ) : null}
            </View>
          ) : null}

          <View
            style={{
              borderRadius: Radius.lg,
              borderWidth: 1.5,
              borderColor: error ? theme.error : theme.primary + '1a',
              backgroundColor: theme.inputBg,
              paddingHorizontal: Spacing.md,
              paddingVertical: Spacing.sm,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
              <TextInput
                style={{
                  flex: 1,
                  ...Typography.display,
                  color: readOnly ? theme.primary : theme.textPrimary,
                  paddingVertical: Spacing.xs,
                  minHeight: 48,
                }}
                keyboardType="numeric"
                editable={!readOnly}
                placeholder="0.00"
                placeholderTextColor={theme.textMuted}
                value={String(field.value ?? '')}
                onChangeText={(v) => field.onChange(formatWithCommas(v))}
                onBlur={field.onBlur}
              />

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                {showMax && onMax ? (
                  <Pressable
                    onPress={onMax}
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: Radius.full,
                      backgroundColor: theme.primary + '1a',
                    }}
                  >
                    <Text style={{ ...Typography.caption, color: theme.primary, fontWeight: '700' }}>
                      MAX
                    </Text>
                  </Pressable>
                ) : null}

                {onCurrencyPress ? (
                  <Pressable
                    onPress={onCurrencyPress}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: Spacing.sm,
                      paddingVertical: 6,
                      borderRadius: Radius.sm,
                      borderWidth: 1,
                      borderColor: theme.primary + '1a',
                      gap: 4,
                    }}
                  >
                    <Text style={{ ...Typography.bodyMedium, color: theme.textPrimary }}>{currency}</Text>
                    <MaterialIcons name="arrow-drop-down" size={18} color={theme.textMuted} />
                  </Pressable>
                ) : (
                  <Text style={{ ...Typography.bodyMedium, color: theme.textSecondary }}>{currency}</Text>
                )}
              </View>
            </View>

            {convertedAmount ? (
              <Text style={{ ...Typography.caption, color: theme.textMuted, marginTop: 4 }}>
                {`≈ ${convertedAmount}`}
              </Text>
            ) : null}
          </View>

          {error ? (
            <Text style={{ ...Typography.caption, color: theme.error }}>{error}</Text>
          ) : null}
        </View>
      )}
    />
  );
}
