import React, { useState, useCallback, useRef, useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import GorhomBottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Typography } from '@/constants/typography';
import { Spacing } from '@/constants/spacing';
import { BottomSheet } from '@/components/layout/BottomSheet';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { SearchResultRow } from './SearchResultRow';
import { useSearchStore } from '@/stores/searchStore';
import { searchAll } from '@/services/search.service';
import { t } from '@/i18n';
import type { SearchResult, SearchCategory } from '@/types/domain.types';

interface SearchBottomSheetProps {
  visible: boolean;
  onClose: () => void;
}

const CATEGORIES: { key: SearchCategory; label: string }[] = [
  { key: 'all', label: 'search.categoryAll' },
  { key: 'shipments', label: 'search.categoryShipments' },
  { key: 'samples', label: 'search.categorySamples' },
  { key: 'transactions', label: 'search.categoryTransactions' },
  { key: 'contacts', label: 'search.categoryContacts' },
];

export function SearchBottomSheet({ visible, onClose }: SearchBottomSheetProps) {
  const theme = useTheme();
  const sheetRef = useRef<GorhomBottomSheet>(null);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SearchCategory>('all');
  const { recentSearches, addSearch, clearSearchHistory } = useSearchStore();

  React.useEffect(() => {
    if (visible) {
      sheetRef.current?.expand();
      setQuery('');
      setSelectedCategory('all');
    } else {
      sheetRef.current?.close();
    }
  }, [visible]);

  const allResults = useMemo(() => searchAll(query), [query]);

  const filteredResults = useMemo(() => {
    if (selectedCategory === 'all') return allResults;
    return allResults.filter((r) => r.category === selectedCategory);
  }, [allResults, selectedCategory]);

  const handleResultPress = useCallback(
    (result: SearchResult) => {
      // Save to recent searches
      addSearch({ query, category: result.category });

      // TODO: Navigate to detail screen based on result.actionUrl
      onClose();
    },
    [query, addSearch, onClose]
  );

  const handleRecentPress = useCallback(
    (recentQuery: string, category: SearchCategory) => {
      setQuery(recentQuery);
      setSelectedCategory(category);
    },
    []
  );

  const handleClear = useCallback(() => {
    setQuery('');
  }, []);

  const renderCategory = useCallback(
    (cat: { key: SearchCategory; label: string }) => {
      const isSelected = cat.key === selectedCategory;
      return (
        <Pressable
          key={cat.key}
          onPress={() => setSelectedCategory(cat.key)}
          style={{
            paddingHorizontal: Spacing.md,
            paddingVertical: Spacing.xs,
            borderRadius: 20,
            backgroundColor: isSelected ? theme.primary : theme.surface,
            borderWidth: 1,
            borderColor: isSelected ? theme.primary : theme.border,
          }}
        >
          <Text
            style={{
              ...Typography.buttonSm,
              color: isSelected ? '#ffffff' : theme.textSecondary,
            }}
          >
            {t(cat.label)}
          </Text>
        </Pressable>
      );
    },
    [selectedCategory, theme]
  );

  const renderResult = useCallback(
    ({ item }: { item: SearchResult }) => (
      <SearchResultRow result={item} onPress={handleResultPress} />
    ),
    [handleResultPress]
  );

  const renderRecentSearch = useCallback(
    ({ item }: { item: typeof recentSearches[0] }) => (
      <Pressable
        onPress={() => handleRecentPress(item.query, item.category)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: Spacing.md,
          paddingVertical: 12,
          gap: Spacing.md,
        }}
      >
        <MaterialIcons name="history" size={20} color={theme.textMuted} />
        <Text style={{ ...Typography.bodyMedium, color: theme.textPrimary, flex: 1 }}>
          {item.query}
        </Text>
        <MaterialIcons name="north-west" size={16} color={theme.textMuted} />
      </Pressable>
    ),
    [handleRecentPress, theme]
  );

  const showRecent = query.trim().length === 0;
  const showNoResults = !showRecent && filteredResults.length === 0;

  return (
    <BottomSheet ref={sheetRef} snapPoints={['90%']} index={-1} onClose={onClose}>
      <View style={{ flex: 1, gap: Spacing.sm }}>
        {/* Header */}
        <View style={{ paddingHorizontal: Spacing.md }}>
          <Text style={{ ...Typography.h3, color: theme.textPrimary, textAlign: 'center' }}>
            {t('search.title')}
          </Text>
        </View>

        {/* Search Input */}
        <View style={{ paddingHorizontal: Spacing.md }}>
          <Input
            placeholder={t('search.placeholder')}
            value={query}
            onChangeText={setQuery}
            autoFocus
            leftIcon={<MaterialIcons name="search" size={20} color={theme.textMuted} />}
            rightIcon={
              query.length > 0 ? (
                <Pressable onPress={handleClear}>
                  <MaterialIcons name="close" size={20} color={theme.textMuted} />
                </Pressable>
              ) : undefined
            }
          />
        </View>

        {/* Category Tabs */}
        {!showRecent && (
          <View
            style={{
              flexDirection: 'row',
              gap: Spacing.sm,
              paddingHorizontal: Spacing.md,
            }}
          >
            {CATEGORIES.map(renderCategory)}
          </View>
        )}

        {/* Content */}
        {showRecent ? (
          recentSearches.length > 0 ? (
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: Spacing.md,
                  paddingVertical: Spacing.xs,
                }}
              >
                <Text style={{ ...Typography.caption, color: theme.textSecondary }}>
                  {t('search.recentSearches')}
                </Text>
                <Pressable onPress={clearSearchHistory}>
                  <Text style={{ ...Typography.caption, color: theme.primary }}>
                    {t('search.clearHistory')}
                  </Text>
                </Pressable>
              </View>
              <BottomSheetFlatList
                data={recentSearches}
                keyExtractor={(item) => item.id}
                renderItem={renderRecentSearch}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => (
                  <View
                    style={{
                      height: 1,
                      backgroundColor: theme.divider,
                      marginHorizontal: Spacing.md,
                    }}
                  />
                )}
              />
            </View>
          ) : null
        ) : showNoResults ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <EmptyState
              icon="search-off"
              title={t('search.noResults')}
              message={t('search.tryDifferentKeywords')}
            />
          </View>
        ) : (
          <BottomSheetFlatList
            data={filteredResults}
            keyExtractor={(item) => item.id}
            renderItem={renderResult}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  height: 1,
                  backgroundColor: theme.divider,
                  marginHorizontal: Spacing.md,
                }}
              />
            )}
          />
        )}
      </View>
    </BottomSheet>
  );
}
