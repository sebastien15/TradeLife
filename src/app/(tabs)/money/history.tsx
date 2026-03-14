import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  SectionList,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '@/components/layout/Screen';
import { useTheme } from '@/hooks/useTheme';
import { walletService } from '@/services/wallet.service';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { Spacing } from '@/constants/spacing';
import type { TransactionRecord, TransactionType, TransactionStatus } from '@/types/domain.types';

// ── Types ─────────────────────────────────────────────────────────────────────
type FilterKey = 'all' | 'send' | 'receive' | 'refund' | 'exchange';

interface DateSection {
  title: string;
  data: TransactionRecord[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function getSectionLabel(dateStr: string, today: Date, yesterday: Date, t: (k: string) => string): string {
  const d = new Date(dateStr);
  if (d.toDateString() === today.toDateString()) return t('money.today');
  if (d.toDateString() === yesterday.toDateString()) return t('money.yesterday');
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function groupByDate(transactions: TransactionRecord[], t: (k: string) => string): DateSection[] {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const groups = new Map<string, TransactionRecord[]>();
  for (const txn of transactions) {
    const key = getSectionLabel(txn.createdAt, today, yesterday, t);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(txn);
  }
  return Array.from(groups.entries()).map(([title, data]) => ({ title, data }));
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function formatAmount(amount: number, currency: string, type: TransactionType): string {
  const sign = type === 'receive' || type === 'refund' ? '+' : '-';
  return `${sign}${currency} ${amount.toLocaleString()}`;
}

function txnIcon(type: TransactionType): keyof typeof MaterialIcons.glyphMap {
  switch (type) {
    case 'send':     return 'arrow-upward';
    case 'receive':  return 'arrow-downward';
    case 'exchange': return 'swap-horiz';
    case 'refund':   return 'undo';
    case 'fee':      return 'receipt';
  }
}

function amountColor(type: TransactionType): string {
  return type === 'receive' || type === 'refund' ? Colors.success : Colors.textPrimary;
}

function badgeStyle(status: TransactionStatus): { bg: string; text: string; labelKey: string } {
  switch (status) {
    case 'completed':  return { bg: Colors.neutralBg,  text: Colors.neutralText,  labelKey: 'money.statusCompleted' };
    case 'pending':    return { bg: Colors.warningBg,  text: Colors.warningText,  labelKey: 'money.statusPending' };
    case 'processing': return { bg: Colors.infoBg,     text: Colors.infoText,     labelKey: 'money.statusProcessing' };
    case 'failed':     return { bg: Colors.errorBg,    text: Colors.errorText,    labelKey: 'money.statusFailed' };
    default:           return { bg: Colors.neutralBg,  text: Colors.neutralText,  labelKey: 'money.statusCompleted' };
  }
}

function txnLabel(type: TransactionType, t: (k: string) => string): string {
  const map: Record<TransactionType, string> = {
    send:     t('money.typeSend'),
    receive:  t('money.typeReceive'),
    exchange: t('money.typeExchange'),
    fee:      t('money.typeFee'),
    refund:   t('money.typeRefund'),
  };
  return map[type];
}

// ── TransactionRow (memoized) ─────────────────────────────────────────────────
interface RowProps {
  item: TransactionRecord;
  onPress: (id: string) => void;
}

const TransactionRow = React.memo(function TransactionRow({ item, onPress }: RowProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const badge = badgeStyle(item.status);

  return (
    <TouchableOpacity
      onPress={() => onPress(item.id)}
      activeOpacity={0.7}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm + 4,
        borderRadius: 12,
      }}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          backgroundColor: theme.surface2,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MaterialIcons name={txnIcon(item.type)} size={22} color={Colors.primary} />
      </View>

      <View style={{ flex: 1, marginLeft: Spacing.sm + 4 }}>
        <Text
          style={{ ...Typography.bodyMedium, color: theme.textPrimary, fontWeight: '600' }}
          numberOfLines={1}
        >
          {item.recipient ?? txnLabel(item.type, t)}
        </Text>
        <Text style={{ ...Typography.caption, color: theme.textSecondary, marginTop: 2 }}>
          {txnLabel(item.type, t)} · {formatTime(item.createdAt)}
        </Text>
      </View>

      <View style={{ alignItems: 'flex-end' }}>
        <Text style={{ ...Typography.bodyMedium, color: amountColor(item.type), fontWeight: '700' }}>
          {formatAmount(item.amount, item.currency, item.type)}
        </Text>
        <View
          style={{
            marginTop: 4,
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 4,
            backgroundColor: badge.bg,
          }}
        >
          <Text style={{ ...Typography.badge, color: badge.text, textTransform: 'uppercase' }}>
            {t(badge.labelKey)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

// ── FilterPill (memoized) ─────────────────────────────────────────────────────
const FilterPill = React.memo(function FilterPill({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={{
        height: 36,
        paddingHorizontal: Spacing.md,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: active ? Colors.primary : theme.surface2,
      }}
    >
      <Text
        style={{
          ...Typography.buttonSm,
          color: active ? Colors.white : theme.textSecondary,
          fontWeight: active ? '700' : '500',
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
});

// ── EmptyState ────────────────────────────────────────────────────────────────
function EmptyState() {
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 }}>
      <MaterialIcons name="receipt-long" size={56} color={theme.textSecondary} />
      <Text style={{ ...Typography.h3, color: theme.textPrimary, marginTop: Spacing.md }}>
        {t('money.noTransactions')}
      </Text>
      <Text
        style={{
          ...Typography.bodySm,
          color: theme.textSecondary,
          marginTop: Spacing.xs,
          textAlign: 'center',
          paddingHorizontal: Spacing.xl,
        }}
      >
        {t('money.noTransactionsDesc')}
      </Text>
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
const FILTERS: { key: FilterKey; i18nKey: string }[] = [
  { key: 'all',      i18nKey: 'money.filterAll' },
  { key: 'send',     i18nKey: 'money.filterSent' },
  { key: 'receive',  i18nKey: 'money.filterReceived' },
  { key: 'refund',   i18nKey: 'money.filterRefund' },
  { key: 'exchange', i18nKey: 'money.filterExchange' },
];

export default function HistoryScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();

  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => walletService.getTransactions(1, 50).then((r) => r.data),
    staleTime: 30_000,
  });

  const sections = useMemo(() => {
    const records: TransactionRecord[] = data ?? [];
    const filtered = records.filter((txn) => {
      const matchesFilter = activeFilter === 'all' || txn.type === activeFilter;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        (txn.recipient?.toLowerCase().includes(q) ?? false) ||
        txn.reference.toLowerCase().includes(q) ||
        String(txn.amount).includes(q);
      return matchesFilter && matchesSearch;
    });
    return groupByDate(filtered, t);
  }, [data, activeFilter, search, t]);

  const handleRowPress = useCallback(
    (id: string) => { router.push(`/money/transaction/${id}` as never); },
    [router],
  );

  const renderItem = useCallback(
    ({ item }: { item: TransactionRecord }) => (
      <TransactionRow item={item} onPress={handleRowPress} />
    ),
    [handleRowPress],
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: DateSection }) => (
      <Text
        style={{
          ...Typography.sectionLabel,
          color: theme.textSecondary,
          textTransform: 'uppercase',
          paddingHorizontal: Spacing.md,
          paddingTop: Spacing.lg,
          paddingBottom: Spacing.xs,
          backgroundColor: theme.background,
        }}
      >
        {section.title}
      </Text>
    ),
    [theme],
  );

  return (
    <Screen edges={['top', 'left', 'right']} noAnimation>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: 64,
          paddingHorizontal: Spacing.md,
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ padding: Spacing.xs }}>
          <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={{ ...Typography.h3, color: theme.textPrimary, flex: 1, textAlign: 'center' }}>
          {t('money.transactionHistory')}
        </Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Search Bar */}
      <View style={{ paddingHorizontal: Spacing.md, paddingTop: Spacing.md }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.surface2,
            borderRadius: 12,
            paddingHorizontal: Spacing.sm + 4,
            height: 48,
          }}
        >
          <MaterialIcons name="search" size={20} color={theme.textSecondary} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder={t('money.searchPlaceholder')}
            placeholderTextColor={theme.textSecondary}
            style={{
              flex: 1,
              marginLeft: Spacing.xs,
              ...Typography.body,
              color: theme.textPrimary,
            }}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>
      </View>

      {/* Filter Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: Spacing.md, gap: Spacing.xs, paddingVertical: Spacing.sm + 4 }}
        style={{ flexGrow: 0 }}
      >
        {FILTERS.map((f) => (
          <FilterPill
            key={f.key}
            label={t(f.i18nKey)}
            active={activeFilter === f.key}
            onPress={() => setActiveFilter(f.key)}
          />
        ))}
      </ScrollView>

      {/* Body */}
      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : isError ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.md }}>
          <MaterialIcons name="error-outline" size={48} color={theme.textSecondary} />
          <Text style={{ ...Typography.body, color: theme.textSecondary }}>{t('common.error')}</Text>
          <TouchableOpacity onPress={() => refetch()}>
            <Text style={{ ...Typography.bodyMedium, color: Colors.primary }}>{t('common.retry')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          ListEmptyComponent={<EmptyState />}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: Spacing.xl * 2 }}
          stickySectionHeadersEnabled={false}
        />
      )}
    </Screen>
  );
}
