import React, { useCallback, useRef } from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import GorhomBottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useTheme } from '@/hooks/useTheme';
import { Typography } from '@/constants/typography';
import { Spacing, Radius } from '@/constants/spacing';
import { BottomSheet } from '@/components/layout/BottomSheet';

export interface DropdownItem {
  label: string;
  value: string;
  icon?: string;
}

interface DropdownProps {
  items: DropdownItem[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
}

export function Dropdown({
  items,
  value,
  onValueChange,
  placeholder = 'Select an option',
  label,
  error,
}: DropdownProps) {
  const theme = useTheme();
  const sheetRef = useRef<GorhomBottomSheet>(null);

  const selectedItem = items.find((i) => i.value === value);

  const openSheet = useCallback(() => sheetRef.current?.expand(), []);

  const handleSelect = useCallback(
    (item: DropdownItem) => {
      onValueChange(item.value);
      sheetRef.current?.close();
    },
    [onValueChange],
  );

  const renderItem = useCallback(
    ({ item }: { item: DropdownItem }) => (
      <Pressable
        onPress={() => handleSelect(item)}
        style={{
          height: 56,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: Spacing.md,
          justifyContent: 'space-between',
          backgroundColor: item.value === value ? theme.primary + '0d' : 'transparent',
        }}
      >
        <Text style={{ ...Typography.body, color: theme.textPrimary }}>{item.label}</Text>
        {item.value === value ? (
          <MaterialIcons name="check" size={20} color={theme.primary} />
        ) : null}
      </Pressable>
    ),
    [handleSelect, value, theme],
  );

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
            color: selectedItem ? theme.textPrimary : theme.textMuted,
            flex: 1,
          }}
          numberOfLines={1}
        >
          {selectedItem?.label ?? placeholder}
        </Text>
        <MaterialIcons name="arrow-drop-down" size={24} color={theme.textMuted} />
      </Pressable>

      {error ? (
        <Text style={{ ...Typography.caption, color: theme.error }}>{error}</Text>
      ) : null}

      <BottomSheet ref={sheetRef} snapPoints={['50%']} index={-1}>
        {label ? (
          <View style={{ paddingHorizontal: Spacing.md, paddingBottom: Spacing.sm }}>
            <Text style={{ ...Typography.h3, color: theme.textPrimary }}>{label}</Text>
          </View>
        ) : null}
        <BottomSheetFlatList
          data={items}
          keyExtractor={(item: DropdownItem) => item.value}
          renderItem={renderItem}
          ItemSeparatorComponent={() => (
            <View style={{ height: 1, backgroundColor: theme.divider, marginHorizontal: Spacing.md }} />
          )}
        />
      </BottomSheet>
    </View>
  );
}
