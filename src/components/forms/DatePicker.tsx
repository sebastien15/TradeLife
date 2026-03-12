import React, { useState, useCallback, useRef } from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import GorhomBottomSheet from '@gorhom/bottom-sheet';
import { format } from 'date-fns';
import { FieldValues, Control, Path } from 'react-hook-form';
import { useTheme } from '@/hooks/useTheme';
import { Typography } from '@/constants/typography';
import { Spacing, Radius } from '@/constants/spacing';
import { BottomSheet } from '@/components/layout/BottomSheet';
import { Button } from '@/components/ui/Button';
import { FormField } from './FormField';

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const now = new Date();
const DAYS  = Array.from({ length: 31 }, (_, i) => i + 1);
const YEARS = Array.from(
  { length: 91 },
  (_, i) => now.getFullYear() - 80 + i,
);

interface DatePickerProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  minimumDate?: Date;
}

export function DatePicker<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = 'Select date',
}: DatePickerProps<T>) {
  const theme = useTheme();
  const sheetRef = useRef<GorhomBottomSheet>(null);
  const [day,   setDay]   = useState(now.getDate());
  const [month, setMonth] = useState(now.getMonth());
  const [year,  setYear]  = useState(now.getFullYear());

  const openSheet = useCallback(() => sheetRef.current?.expand(), []);

  const Col = ({
    data,
    selected,
    onSelect,
    flex = 1,
  }: {
    data: (number | string)[];
    selected: number | string;
    onSelect: (v: number) => void;
    flex?: number;
  }) => (
    <FlatList
      data={data}
      keyExtractor={(d) => String(d)}
      style={{ flex }}
      showsVerticalScrollIndicator={false}
      renderItem={({ item, index }) => {
        const isSelected = item === selected;
        return (
          <Pressable
            onPress={() => onSelect(typeof item === 'number' ? item : index)}
            style={{
              height: 48,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: Radius.sm,
              backgroundColor: isSelected ? theme.primary + '1a' : 'transparent',
            }}
          >
            <Text
              style={{
                ...Typography.body,
                color: isSelected ? theme.primary : theme.textPrimary,
                fontWeight: isSelected ? '700' : '400',
              }}
            >
              {item}
            </Text>
          </Pressable>
        );
      }}
    />
  );

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, error }) => {
        const dateValue = field.value instanceof Date ? field.value : null;

        const handleConfirm = () => {
          field.onChange(new Date(year, month, day));
          sheetRef.current?.close();
        };

        return (
          <View style={{ gap: 6 }}>
            {label ? (
              <Text style={{ ...Typography.label, color: theme.textPrimary }}>{label}</Text>
            ) : null}

            <Pressable
              onPress={openSheet}
              style={{
                height: 56,
                borderRadius: Radius.md,
                borderWidth: 1.5,
                borderColor: error ? theme.error : theme.border,
                backgroundColor: theme.inputBg,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: Spacing.md,
                justifyContent: 'space-between',
              }}
            >
              <Text
                style={{
                  ...Typography.body,
                  color: dateValue ? theme.textPrimary : theme.textMuted,
                }}
              >
                {dateValue ? format(dateValue, 'MMM d, yyyy') : placeholder}
              </Text>
              <MaterialIcons name="calendar-today" size={20} color={theme.textMuted} />
            </Pressable>

            {error ? (
              <Text style={{ ...Typography.caption, color: theme.error }}>{error}</Text>
            ) : null}

            <BottomSheet ref={sheetRef} snapPoints={['55%']} index={-1}>
              <View style={{ flex: 1, paddingHorizontal: Spacing.md }}>
                <View style={{ flexDirection: 'row', flex: 1, gap: Spacing.sm }}>
                  <Col data={DAYS}   selected={day}          onSelect={setDay}   flex={1} />
                  <Col data={MONTHS} selected={MONTHS[month]} onSelect={setMonth} flex={2} />
                  <Col data={YEARS}  selected={year}          onSelect={setYear}  flex={1} />
                </View>
                <Button
                  variant="primary"
                  fullWidth
                  onPress={handleConfirm}
                  style={{ marginVertical: Spacing.md }}
                >
                  Confirm
                </Button>
              </View>
            </BottomSheet>
          </View>
        );
      }}
    />
  );
}
