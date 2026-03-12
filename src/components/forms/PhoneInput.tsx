import React, { useState, useCallback, useRef } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { FieldValues, Control, Path } from 'react-hook-form';
import { MaterialIcons } from '@expo/vector-icons';
import GorhomBottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useTheme } from '@/hooks/useTheme';
import { Typography } from '@/constants/typography';
import { Spacing, Radius } from '@/constants/spacing';
import { BottomSheet } from '@/components/layout/BottomSheet';
import { Input } from '@/components/ui/Input';
import { FormField } from './FormField';

interface Country {
  code: string;
  name: string;
  dial: string;
  flag: string;
}

const COUNTRIES: Country[] = [
  { code: 'RW', name: 'Rwanda',         dial: '+250', flag: '🇷🇼' },
  { code: 'CN', name: 'China',          dial: '+86',  flag: '🇨🇳' },
  { code: 'KE', name: 'Kenya',          dial: '+254', flag: '🇰🇪' },
  { code: 'UG', name: 'Uganda',         dial: '+256', flag: '🇺🇬' },
  { code: 'TZ', name: 'Tanzania',       dial: '+255', flag: '🇹🇿' },
  { code: 'US', name: 'United States',  dial: '+1',   flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', dial: '+44',  flag: '🇬🇧' },
  { code: 'FR', name: 'France',         dial: '+33',  flag: '🇫🇷' },
];

interface PhoneInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
}

export function PhoneInput<T extends FieldValues>({ control, name, label }: PhoneInputProps<T>) {
  const theme = useTheme();
  const sheetRef = useRef<GorhomBottomSheet>(null);
  const [selected, setSelected] = useState(COUNTRIES[0]);
  const [search, setSearch] = useState('');

  const filtered = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dial.includes(search),
  );

  const openSheet = useCallback(() => sheetRef.current?.expand(), []);

  const handleSelect = useCallback((c: Country) => {
    setSelected(c);
    sheetRef.current?.close();
    setSearch('');
  }, []);

  const renderCountry = useCallback(
    ({ item }: { item: Country }) => (
      <Pressable
        onPress={() => handleSelect(item)}
        style={{
          height: 56,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: Spacing.md,
          gap: Spacing.sm,
        }}
      >
        <Text style={{ fontSize: 24 }}>{item.flag}</Text>
        <Text style={{ ...Typography.body, color: theme.textPrimary, flex: 1 }}>{item.name}</Text>
        <Text style={{ ...Typography.bodySm, color: theme.textSecondary }}>{item.dial}</Text>
      </Pressable>
    ),
    [handleSelect, theme],
  );

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, error }) => (
        <View style={{ gap: 6 }}>
          {label ? (
            <Text style={{ ...Typography.label, color: theme.textPrimary }}>{label}</Text>
          ) : null}

          <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
            {/* Country picker trigger */}
            <Pressable
              onPress={openSheet}
              style={{
                height: 56,
                borderRadius: Radius.md,
                borderWidth: 1.5,
                borderColor: theme.border,
                backgroundColor: theme.inputBg,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: Spacing.sm,
                gap: 4,
              }}
            >
              <Text style={{ fontSize: 20 }}>{selected.flag}</Text>
              <Text style={{ ...Typography.bodyMedium, color: theme.textPrimary }}>
                {selected.dial}
              </Text>
              <MaterialIcons name="arrow-drop-down" size={20} color={theme.textMuted} />
            </Pressable>

            {/* Number input */}
            <TextInput
              style={{
                flex: 1,
                height: 56,
                borderRadius: Radius.md,
                borderWidth: 1.5,
                borderColor: error ? theme.error : theme.border,
                backgroundColor: theme.inputBg,
                paddingHorizontal: Spacing.md,
                ...Typography.body,
                color: theme.textPrimary,
              }}
              keyboardType="phone-pad"
              placeholder="Phone number"
              placeholderTextColor={theme.textMuted}
              value={String(field.value ?? '')}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
            />
          </View>

          {error ? (
            <Text style={{ ...Typography.caption, color: theme.error }}>{error}</Text>
          ) : null}

          <BottomSheet ref={sheetRef} snapPoints={['60%']} index={-1}>
            <View style={{ flex: 1, paddingHorizontal: Spacing.md, gap: Spacing.sm }}>
              <Input
                placeholder="Search country"
                value={search}
                onChangeText={setSearch}
                leftIcon={<MaterialIcons name="search" size={20} color={theme.textMuted} />}
              />
              <BottomSheetFlatList
                data={filtered}
                keyExtractor={(item: Country) => item.code}
                renderItem={renderCountry}
              />
            </View>
          </BottomSheet>
        </View>
      )}
    />
  );
}
