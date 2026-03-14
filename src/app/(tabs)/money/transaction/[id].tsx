import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Share,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '@/components/layout/Screen';
import { useTheme } from '@/hooks/useTheme';
import { walletService } from '@/services/wallet.service';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { Spacing, Radius } from '@/constants/spacing';
import type { TransactionRecord, TransactionStatus, TransactionType } from '@/types/domain.types';

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return (
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
    ' · ' +
    d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  );
}

function amountSign(type: TransactionType) {
  return type === 'receive' || type === 'refund' ? '+' : '-';
}

function statusIconName(status: TransactionStatus): keyof typeof MaterialIcons.glyphMap {
  if (status === 'failed' || status === 'cancelled') return 'cancel';
  if (status === 'pending' || status === 'processing') return 'schedule';
  return 'check-circle';
}

function statusColor(status: TransactionStatus) {
  if (status === 'failed' || status === 'cancelled') return Colors.error;
  if (status === 'pending' || status === 'processing') return Colors.warning;
  return Colors.primary;
}

function methodIcon(method?: string): keyof typeof MaterialIcons.glyphMap {
  if (!method) return 'account-balance-wallet';
  if (method.includes('bank')) return 'account-balance';
  if (method.includes('mobile') || method.includes('momo')) return 'phone-android';
  if (method.includes('wechat')) return 'chat';
  if (method.includes('alipay')) return 'payments';
  return 'account-balance-wallet';
}

function methodLabel(method?: string) {
  const map: Record<string, string> = {
    wechat: 'WeChat Pay', alipay: 'Alipay',
    bank_transfer: 'Bank Transfer', mobile_money: 'Mobile Money',
    wallet: 'Wallet', system: 'System',
  };
  return method ? (map[method] ?? method) : 'Wallet';
}

// ── Timeline builder ──────────────────────────────────────────────────────────
interface TimelineStep { label: string; time: string; done: boolean; note?: string }

function buildTimeline(txn: TransactionRecord, t: (k: string) => string): TimelineStep[] {
  const t0s = formatDateTime(txn.createdAt);
  const t1  = formatDateTime(new Date(new Date(txn.createdAt).getTime() + 60_000).toISOString());
  const t2  = formatDateTime(new Date(new Date(txn.createdAt).getTime() + 120_000).toISOString());

  if (txn.status === 'failed') {
    return [
      { label: t('transaction.initiated'), time: t0s, done: true },
      { label: t('transaction.failed'),    time: t1,  done: false },
    ];
  }
  const processing = txn.status === 'processing';
  const completed  = txn.status === 'completed';
  return [
    { label: t('transaction.initiated'), time: t0s, done: true },
    { label: t('transaction.processed'), time: t1,  done: processing || completed },
    { label: t('transaction.completed'), time: t2,  done: completed, note: completed ? t('transaction.fundsNote') : undefined },
  ];
}

// ── Reusable row ──────────────────────────────────────────────────────────────
function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.md }}>
      <Text style={{ ...Typography.bodySm, color: theme.textSecondary }}>{label}</Text>
      {typeof children === 'string'
        ? <Text style={{ ...Typography.bodySm, color: theme.textPrimary, fontWeight: '500' }}>{children}</Text>
        : children}
    </View>
  );
}

function Divider() {
  const theme = useTheme();
  return <View style={{ height: 1, backgroundColor: theme.border }} />;
}

// ── Screen ────────────────────────────────────────────────────────────────────
export default function TransactionDetailScreen() {
  const { id }  = useLocalSearchParams<{ id: string }>();
  const router  = useRouter();
  const theme   = useTheme();
  const { t }   = useTranslation();

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => walletService.getTransactions(1, 50).then((r) => r.data),
    staleTime: 30_000,
  });

  const txn = transactions?.find((tx) => tx.id === id);

  const handleCopyRef = useCallback(async () => {
    if (!txn) return;
    await Clipboard.setStringAsync(txn.reference);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [txn]);

  const handleShare = useCallback(() => {
    if (!txn) return;
    Share.share({
      message: `TradeLife Receipt\nRef: ${txn.reference}\nAmount: ${txn.currency} ${txn.amount}\nTo: ${txn.recipient ?? '—'}\nStatus: ${txn.status}\nDate: ${formatDateTime(txn.createdAt)}`,
      title: t('transaction.detail'),
    });
  }, [txn, t]);

  const handleSupport = useCallback(() => {
    Linking.openURL(`mailto:support@tradelife.rw?subject=Transaction%20Issue&body=Reference:%20${txn?.reference ?? ''}`);
  }, [txn]);

  if (isLoading) {
    return (
      <Screen>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </Screen>
    );
  }

  if (!txn) {
    return (
      <Screen edges={['top', 'left', 'right']}>
        <View style={{ flexDirection: 'row', alignItems: 'center', height: 64, paddingHorizontal: Spacing.md, borderBottomWidth: 1, borderBottomColor: theme.border }}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: Spacing.xs }}>
            <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={{ ...Typography.h3, color: theme.textPrimary, flex: 1, textAlign: 'center' }}>{t('transaction.detail')}</Text>
          <View style={{ width: 32 }} />
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl }}>
          <MaterialIcons name="receipt-long" size={56} color={theme.textSecondary} />
          <Text style={{ ...Typography.h3, color: theme.textPrimary, marginTop: Spacing.md }}>{t('transaction.notFound')}</Text>
          <Text style={{ ...Typography.bodySm, color: theme.textSecondary, marginTop: Spacing.xs, textAlign: 'center' }}>{t('transaction.notFoundDesc')}</Text>
        </View>
      </Screen>
    );
  }

  const sColor   = statusColor(txn.status);
  const timeline = buildTimeline(txn, t);

  return (
    <Screen edges={['top', 'left', 'right']} noAnimation>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', height: 64, paddingHorizontal: Spacing.md, borderBottomWidth: 1, borderBottomColor: theme.border }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: Spacing.xs }}>
          <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={{ ...Typography.h3, color: theme.textPrimary, flex: 1, textAlign: 'center' }}>{t('transaction.detail')}</Text>
        <TouchableOpacity onPress={handleShare} style={{ padding: Spacing.xs }}>
          <MaterialIcons name="share" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
        {/* Hero */}
        <View style={{ alignItems: 'center', paddingTop: Spacing.xl, paddingBottom: Spacing.lg, gap: Spacing.sm }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: sColor + '20', alignItems: 'center', justifyContent: 'center' }}>
            <MaterialIcons name={statusIconName(txn.status)} size={40} color={sColor} />
          </View>
          <Text style={{ ...Typography.display, color: theme.textPrimary }}>
            {amountSign(txn.type)}{txn.currency} {txn.amount.toLocaleString()}
          </Text>
          {txn.recipient && (
            <Text style={{ ...Typography.bodyMedium, color: theme.textSecondary }}>{txn.recipient}</Text>
          )}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, backgroundColor: sColor + '18', paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: Radius.full }}>
            <Text style={{ ...Typography.bodySm, color: sColor, fontWeight: '600', textTransform: 'capitalize' }}>{txn.status}</Text>
            <Text style={{ ...Typography.bodySm, color: sColor }}>·</Text>
            <Text style={{ ...Typography.bodySm, color: sColor }}>{formatDate(txn.createdAt)}</Text>
          </View>
        </View>

        {/* Payment Details */}
        <View style={{ paddingHorizontal: Spacing.md }}>
          <Text style={{ ...Typography.sectionLabel, color: theme.textSecondary, textTransform: 'uppercase', paddingHorizontal: Spacing.xs, marginBottom: Spacing.sm }}>
            {t('transaction.paymentDetails')}
          </Text>
          <View style={{ backgroundColor: theme.surface, borderRadius: Radius.md, borderWidth: 1, borderColor: theme.border, overflow: 'hidden' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.md }}>
              <Text style={{ ...Typography.bodySm, color: theme.textSecondary }}>{t('transaction.referenceId')}</Text>
              <TouchableOpacity onPress={handleCopyRef} activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs }}>
                <Text style={{ ...Typography.bodySm, color: theme.textPrimary, fontWeight: '500' }}>#{txn.reference}</Text>
                <MaterialIcons name="content-copy" size={14} color={Colors.primary} />
              </TouchableOpacity>
            </View>
            <Divider />
            <DetailRow label={t('transaction.dateTime')}>{formatDateTime(txn.createdAt)}</DetailRow>
            <Divider />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.md }}>
              <Text style={{ ...Typography.bodySm, color: theme.textSecondary }}>{t('transaction.paymentMethod')}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs }}>
                <MaterialIcons name={methodIcon(txn.method)} size={18} color={Colors.primary} />
                <Text style={{ ...Typography.bodySm, color: theme.textPrimary, fontWeight: '500' }}>{methodLabel(txn.method)}</Text>
              </View>
            </View>
            <Divider />
            <DetailRow label={t('transaction.totalFee')}>
              {txn.fees === 0 ? t('transaction.free') : `${txn.currency} ${txn.fees}`}
            </DetailRow>
          </View>
        </View>

        {/* Timeline */}
        <View style={{ paddingHorizontal: Spacing.md, marginTop: Spacing.xl }}>
          <Text style={{ ...Typography.sectionLabel, color: theme.textSecondary, textTransform: 'uppercase', paddingHorizontal: Spacing.xs, marginBottom: Spacing.md }}>
            {t('transaction.timeline')}
          </Text>
          <View style={{ paddingLeft: Spacing.xl, position: 'relative' }}>
            <View style={{ position: 'absolute', left: Spacing.xl - 2, top: 11, bottom: 11, width: 2, backgroundColor: theme.border }} />
            {timeline.map((step, i) => (
              <View key={i} style={{ flexDirection: 'row', marginBottom: i < timeline.length - 1 ? Spacing.lg + Spacing.sm : 0 }}>
                <View style={{ position: 'absolute', left: -Spacing.md - 3, top: 0, width: 22, height: 22, borderRadius: 11, backgroundColor: step.done ? Colors.primary : theme.surface2, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: theme.background, zIndex: 1 }}>
                  {step.done && <MaterialIcons name="check" size={12} color={Colors.white} />}
                </View>
                <View>
                  <Text style={{ ...Typography.bodySm, color: step.done ? theme.textPrimary : theme.textSecondary, fontWeight: '700' }}>{step.label}</Text>
                  <Text style={{ ...Typography.caption, color: theme.textSecondary }}>{step.time}</Text>
                  {step.note && <Text style={{ ...Typography.caption, color: Colors.primary, fontStyle: 'italic', marginTop: 2 }}>{step.note}</Text>}
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: theme.background + 'F2', borderTopWidth: 1, borderTopColor: theme.border, padding: Spacing.md }}>
        <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
          <TouchableOpacity onPress={handleShare} activeOpacity={0.8} style={{ flex: 1, height: 48, borderRadius: Radius.sm, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.xs, borderWidth: 1, borderColor: theme.border }}>
            <MaterialIcons name="download" size={20} color={theme.textPrimary} />
            <Text style={{ ...Typography.buttonSm, color: theme.textPrimary }}>{t('transaction.downloadReceipt')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.8} style={{ flex: 1, height: 48, borderRadius: Radius.sm, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.xs, backgroundColor: Colors.primary }}>
            <MaterialIcons name="replay" size={20} color={Colors.white} />
            <Text style={{ ...Typography.buttonSm, color: Colors.white }}>{t('transaction.repeat')}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleSupport} activeOpacity={0.7} style={{ alignSelf: 'center', paddingTop: Spacing.sm, paddingBottom: Spacing.xs }}>
          <Text style={{ ...Typography.caption, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: 1.2 }}>{t('transaction.reportIssue')}</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}
