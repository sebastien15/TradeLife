import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MaterialIcons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { Screen } from '@/components/layout/Screen';
import { PINBottomSheet, type PINBottomSheetHandle } from '@/components';
import { useTheme } from '@/hooks/useTheme';
import { useExchangeRate } from '@/hooks/useExchangeRate';
import { useWalletStore } from '@/stores/walletStore';
import { useAuthStore } from '@/stores/authStore';
import { walletService } from '@/services/wallet.service';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { Spacing, Radius } from '@/constants/spacing';
import { mockSuppliers } from '@/services/mocks';
import type { SupplierType } from '@/types/domain.types';

// ── Types & Schemas ───────────────────────────────────────────────────────────
type TabKey = 'send' | 'receive' | 'topup' | 'pay';
type TopUpMethod = 'mtn' | 'airtel' | 'card' | 'bank';

const sendSchema = z.object({
  amount: z.coerce.number({ invalid_type_error: 'Enter an amount' }).min(1),
  recipientPhone: z.string().min(1, 'Enter recipient'),
});
type SendForm = z.infer<typeof sendSchema>;

const topUpSchema = z.object({
  amount: z.coerce.number({ invalid_type_error: 'Enter an amount' }).min(1000),
  method: z.enum(['mtn', 'airtel', 'card', 'bank']),
});
type TopUpForm = z.infer<typeof topUpSchema>;

// ── Exchange Rate Ribbon ──────────────────────────────────────────────────────
function ExchangeRateRibbon({ rate }: { rate: number | null }) {
  const { t } = useTranslation();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.xs, paddingVertical: Spacing.xs + 2, paddingHorizontal: Spacing.md, backgroundColor: Colors.primary + '1A', borderBottomWidth: 1, borderBottomColor: Colors.primary + '33' }}>
      <MaterialIcons name="trending-up" size={14} color={Colors.primary} />
      <Text style={{ ...Typography.caption, color: Colors.primary, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 }}>
        {rate != null ? t('money.rateRibbon', { rate: rate.toFixed(2) }) : '···'}
      </Text>
    </View>
  );
}

// ── Segmented Control ─────────────────────────────────────────────────────────
const TABS: { key: TabKey; i18nKey: string }[] = [
  { key: 'send',    i18nKey: 'money.send' },
  { key: 'receive', i18nKey: 'money.receive' },
  { key: 'topup',   i18nKey: 'money.topUp' },
  { key: 'pay',     i18nKey: 'money.supplierPay' },
];

function SegmentedControl({ active, onChange }: { active: TabKey; onChange: (k: TabKey) => void }) {
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <View style={{ flexDirection: 'row', margin: Spacing.md, padding: 4, backgroundColor: theme.surface2, borderRadius: Radius.md }}>
      {TABS.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          onPress={() => onChange(tab.key)}
          activeOpacity={0.8}
          style={{ flex: 1, paddingVertical: Spacing.sm + 2, borderRadius: Radius.sm, alignItems: 'center', backgroundColor: active === tab.key ? Colors.primary : 'transparent' }}
        >
          <Text style={{ ...Typography.buttonSm, color: active === tab.key ? Colors.white : theme.textSecondary, fontWeight: active === tab.key ? '700' : '500' }} numberOfLines={1}>
            {t(tab.i18nKey)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ── Send View ─────────────────────────────────────────────────────────────────
function SendView({ rate, onConfirm }: { rate: number | null; onConfirm: (amount: number, recipient: string) => void }) {
  const theme = useTheme();
  const { t } = useTranslation();
  const { control, handleSubmit, watch, formState: { errors } } = useForm<SendForm>({
    resolver: zodResolver(sendSchema),
    defaultValues: { amount: 0, recipientPhone: '' },
  });
  const amount = watch('amount') || 0;
  const rwfEquivalent = rate ? amount * rate : 0;
  const fee = amount > 0 ? Math.max(1, amount * 0.0025) : 0;

  return (
    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      {/* Amount Card */}
      <View style={{ marginHorizontal: Spacing.md, backgroundColor: theme.surface, borderRadius: Radius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.primary + '1A' }}>
        <Text style={{ ...Typography.sectionLabel, color: theme.textSecondary, textTransform: 'uppercase', marginBottom: Spacing.xs }}>{t('money.youSend')}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Controller
            control={control}
            name="amount"
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value ? String(value) : ''}
                onChangeText={(v) => onChange(v.replace(/[^0-9.]/g, ''))}
                keyboardType="decimal-pad"
                placeholder="0"
                placeholderTextColor={theme.textSecondary}
                style={{ ...Typography.display, color: theme.textPrimary, flex: 1 }}
              />
            )}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, backgroundColor: theme.surface2, paddingHorizontal: Spacing.sm, paddingVertical: 6, borderRadius: Radius.sm }}>
            <Text style={{ ...Typography.label, color: theme.textPrimary }}>CNY</Text>
            <MaterialIcons name="expand-more" size={16} color={theme.textSecondary} />
          </View>
        </View>
        {errors.amount && <Text style={{ ...Typography.caption, color: Colors.error }}>{errors.amount.message}</Text>}

        {/* Swap divider */}
        <View style={{ alignItems: 'center', marginVertical: Spacing.md }}>
          <View style={{ position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: Colors.primary + '1A', top: 12 }} />
          <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
            <MaterialIcons name="swap-vert" size={20} color={Colors.white} />
          </View>
        </View>

        <Text style={{ ...Typography.sectionLabel, color: theme.textSecondary, textTransform: 'uppercase', marginBottom: Spacing.xs }}>{t('money.theyReceive')}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ ...Typography.display, color: Colors.primary }}>{rwfEquivalent.toLocaleString()}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, backgroundColor: theme.surface2, paddingHorizontal: Spacing.sm, paddingVertical: 6, borderRadius: Radius.sm }}>
            <Text style={{ ...Typography.label, color: theme.textPrimary }}>RWF</Text>
            <MaterialIcons name="expand-more" size={16} color={theme.textSecondary} />
          </View>
        </View>
      </View>

      {/* Recipient */}
      <View style={{ marginHorizontal: Spacing.md, marginTop: Spacing.lg }}>
        <Text style={{ ...Typography.label, color: theme.textPrimary, marginBottom: Spacing.sm }}>{t('money.recipient')}</Text>
        <Controller
          control={control}
          name="recipientPhone"
          render={({ field: { onChange, value } }) => (
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: theme.surface2, borderRadius: Radius.md, paddingHorizontal: Spacing.sm + 4, height: 48 }}>
              <MaterialIcons name="search" size={20} color={theme.textSecondary} />
              <TextInput value={value} onChangeText={onChange} placeholder={t('money.enterRecipient')} placeholderTextColor={theme.textSecondary} style={{ ...Typography.body, color: theme.textPrimary, flex: 1, marginLeft: Spacing.xs }} keyboardType="email-address" autoCapitalize="none" />
            </View>
          )}
        />
        {errors.recipientPhone && <Text style={{ ...Typography.caption, color: Colors.error }}>{errors.recipientPhone.message}</Text>}
      </View>

      {/* Summary */}
      {amount > 0 && (
        <View style={{ marginHorizontal: Spacing.md, marginTop: Spacing.lg, backgroundColor: theme.surface, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.primary + '1A', overflow: 'hidden' }}>
          <View style={{ paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm + 2, backgroundColor: theme.surface2 }}>
            <Text style={{ ...Typography.sectionLabel, color: theme.textSecondary, textTransform: 'uppercase' }}>{t('money.txDetails')}</Text>
          </View>
          <View style={{ padding: Spacing.md, gap: Spacing.sm }}>
            {[
              [t('money.transferAmount'), `${amount.toLocaleString()} CNY`],
              [t('money.serviceFee'), `${fee.toFixed(2)} CNY`],
            ].map(([label, value]) => (
              <View key={label} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ ...Typography.bodySm, color: theme.textSecondary }}>{label}</Text>
                <Text style={{ ...Typography.bodySm, color: theme.textPrimary, fontWeight: '600' }}>{value}</Text>
              </View>
            ))}
            <View style={{ height: 1, backgroundColor: Colors.primary + '1A' }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <Text style={{ ...Typography.label, color: theme.textPrimary }}>{t('money.total')}</Text>
              <Text style={{ ...Typography.h2, color: Colors.primary }}>{(amount + fee).toFixed(2)} CNY</Text>
            </View>
          </View>
        </View>
      )}

      <View style={{ paddingHorizontal: Spacing.md, paddingVertical: Spacing.lg }}>
        <TouchableOpacity onPress={handleSubmit((d) => onConfirm(d.amount, d.recipientPhone))} activeOpacity={0.85} style={{ backgroundColor: Colors.primary, height: 56, borderRadius: Radius.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm }}>
          <Text style={{ ...Typography.button, color: Colors.white }}>{t('money.send')}</Text>
          <MaterialIcons name="send" size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ── Receive View ──────────────────────────────────────────────────────────────
function ReceiveView() {
  const theme = useTheme();
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const qrValue = `tradelife:${user?.phone ?? user?.email ?? 'demo'}`;

  const copyText = useCallback(async (text: string) => {
    await Clipboard.setStringAsync(text);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const details = [
    { label: t('money.accountHolder'), value: user?.fullName ?? '—' },
    { label: t('money.phoneNumber'),   value: user?.phone ?? '—' },
    { label: t('money.accountNumber'), value: user?.id ?? '—' },
  ];

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: Spacing.md, gap: Spacing.lg }}>
      <View style={{ alignItems: 'center', gap: Spacing.sm }}>
        <View style={{ backgroundColor: Colors.white, padding: Spacing.lg, borderRadius: Radius.lg, shadowColor: Colors.textPrimary, shadowOpacity: 0.12, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 4 }}>
          <QRCode value={qrValue} size={200} color={Colors.primary} />
        </View>
        <Text style={{ ...Typography.bodySm, color: theme.textSecondary }}>{t('money.qrHint')}</Text>
      </View>

      <View style={{ backgroundColor: theme.surface2, borderRadius: Radius.md, borderWidth: 1, borderColor: theme.border, overflow: 'hidden' }}>
        {details.map((d, i) => (
          <View key={d.label} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.md, borderBottomWidth: i < details.length - 1 ? 1 : 0, borderBottomColor: theme.border }}>
            <View>
              <Text style={{ ...Typography.sectionLabel, color: theme.textSecondary, textTransform: 'uppercase' }}>{d.label}</Text>
              <Text style={{ ...Typography.bodyMedium, color: theme.textPrimary, fontWeight: '700', marginTop: 2 }}>{d.value}</Text>
            </View>
            <TouchableOpacity onPress={() => copyText(d.value)} style={{ padding: Spacing.xs }}>
              <MaterialIcons name="content-copy" size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <TouchableOpacity activeOpacity={0.85} style={{ backgroundColor: Colors.primary, height: 56, borderRadius: Radius.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm }}>
        <MaterialIcons name="share" size={20} color={Colors.white} />
        <Text style={{ ...Typography.button, color: Colors.white }}>{t('money.shareQR')}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => copyText(details.map((d) => `${d.label}: ${d.value}`).join('\n'))} activeOpacity={0.85} style={{ height: 56, borderRadius: Radius.md, borderWidth: 2, borderColor: Colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm }}>
        <MaterialIcons name="content-copy" size={20} color={Colors.primary} />
        <Text style={{ ...Typography.button, color: Colors.primary }}>{t('money.copyAllDetails')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ── Top-Up View ───────────────────────────────────────────────────────────────
type MethodConfig = { key: TopUpMethod; labelKey: string; subKey: string; bg: string; textColor: string; abbr?: string; icon?: keyof typeof MaterialIcons.glyphMap };

const METHODS: MethodConfig[] = [
  { key: 'mtn',    labelKey: 'money.mtnMoMo',        subKey: 'money.instantNoFee',   bg: Colors.mtn,     textColor: Colors.textPrimary, abbr: 'MTN' },
  { key: 'airtel', labelKey: 'money.airtelMoney',     subKey: 'money.instantOnePct',  bg: Colors.airtel,  textColor: Colors.white,       abbr: 'Airtel' },
  { key: 'card',   labelKey: 'money.debitCreditCard', subKey: 'money.visaMastercard', bg: Colors.cardBg,  textColor: Colors.white,       icon: 'credit-card' },
  { key: 'bank',   labelKey: 'money.bankTransfer',    subKey: 'money.bankDays',       bg: Colors.primary, textColor: Colors.white,       icon: 'account-balance' },
];

const QUICK_AMOUNTS = [10_000, 50_000, 100_000, 500_000];

function TopUpView({ balance, onTopUp }: { balance: number; onTopUp: (amount: number, method: TopUpMethod) => void }) {
  const theme = useTheme();
  const { t } = useTranslation();
  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<TopUpForm>({
    resolver: zodResolver(topUpSchema),
    defaultValues: { amount: 0, method: 'mtn' },
  });
  const selectedMethod = watch('method');
  const amount = watch('amount') || 0;

  return (
    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      {/* Balance Card */}
      <View style={{ marginHorizontal: Spacing.md, borderRadius: Radius.lg, backgroundColor: Colors.primary, padding: Spacing.lg }}>
        <Text style={{ ...Typography.caption, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 0.8 }}>{t('money.currentBalance')}</Text>
        <Text style={{ fontSize: 36, fontWeight: '800', color: Colors.white, marginTop: Spacing.xs }}>{balance.toLocaleString()} RWF</Text>
      </View>

      {/* Method */}
      <View style={{ marginHorizontal: Spacing.md, marginTop: Spacing.lg }}>
        <Text style={{ ...Typography.label, color: theme.textPrimary, marginBottom: Spacing.sm }}>{t('money.paymentMethod')}</Text>
        <View style={{ gap: Spacing.sm }}>
          {METHODS.map((m) => (
            <TouchableOpacity key={m.key} onPress={() => setValue('method', m.key)} activeOpacity={0.8} style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.md, borderRadius: Radius.md, backgroundColor: theme.surface, borderWidth: 2, borderColor: selectedMethod === m.key ? Colors.primary : theme.border }}>
              <View style={{ width: 40, height: 40, borderRadius: Radius.sm, backgroundColor: m.bg, alignItems: 'center', justifyContent: 'center' }}>
                {m.abbr
                  ? <Text style={{ fontSize: 10, fontWeight: '700', color: m.textColor }}>{m.abbr}</Text>
                  : <MaterialIcons name={m.icon!} size={20} color={m.textColor} />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ ...Typography.label, color: theme.textPrimary }}>{t(m.labelKey)}</Text>
                <Text style={{ ...Typography.caption, color: theme.textSecondary }}>{t(m.subKey)}</Text>
              </View>
              <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: selectedMethod === m.key ? Colors.primary : theme.border, alignItems: 'center', justifyContent: 'center' }}>
                {selectedMethod === m.key && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary }} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Amount */}
      <View style={{ marginHorizontal: Spacing.md, marginTop: Spacing.lg }}>
        <Text style={{ ...Typography.label, color: theme.textPrimary, marginBottom: Spacing.sm }}>{t('money.selectAmount')}</Text>
        <Controller
          control={control}
          name="amount"
          render={({ field: { onChange, value } }) => (
            <TextInput
              value={value ? String(value) : ''}
              onChangeText={(v) => onChange(v.replace(/[^0-9]/g, ''))}
              keyboardType="number-pad"
              placeholder={t('money.enterAmount')}
              placeholderTextColor={theme.textSecondary}
              style={{ ...Typography.h2, color: theme.textPrimary, backgroundColor: theme.surface2, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: errors.amount ? Colors.error : theme.border }}
            />
          )}
        />
        {errors.amount && <Text style={{ ...Typography.caption, color: Colors.error, marginTop: 4 }}>{errors.amount.message}</Text>}
        <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm }}>
          {QUICK_AMOUNTS.map((qa) => (
            <TouchableOpacity key={qa} onPress={() => setValue('amount', qa)} activeOpacity={0.8} style={{ flex: 1, paddingVertical: Spacing.sm, borderRadius: Radius.sm, alignItems: 'center', backgroundColor: amount === qa ? Colors.primary + '1A' : theme.surface2, borderWidth: 1, borderColor: amount === qa ? Colors.primary : theme.border }}>
              <Text style={{ ...Typography.caption, color: amount === qa ? Colors.primary : theme.textSecondary, fontWeight: '700' }}>
                {(qa / 1000).toFixed(0)}k
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={{ marginHorizontal: Spacing.md, marginTop: Spacing.lg, marginBottom: Spacing.xl, gap: Spacing.sm }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.xs }}>
          <MaterialIcons name="lock" size={14} color={theme.textSecondary} />
          <Text style={{ ...Typography.caption, color: theme.textSecondary }}>{t('money.securePayment')}</Text>
        </View>
        <TouchableOpacity onPress={handleSubmit((d) => onTopUp(d.amount, d.method))} activeOpacity={0.85} style={{ backgroundColor: Colors.primary, height: 56, borderRadius: Radius.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm }}>
          <Text style={{ ...Typography.button, color: Colors.white }}>{t('money.topUpNow')}</Text>
          <MaterialIcons name="arrow-forward" size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ── Pay Supplier View ─────────────────────────────────────────────────────────
const SupplierRow = React.memo(function SupplierRow({ item, selected, onPress }: { item: SupplierType; selected: boolean; onPress: (s: SupplierType) => void }) {
  const theme = useTheme();
  return (
    <TouchableOpacity onPress={() => onPress(item)} activeOpacity={0.8} style={{ flexDirection: 'row', alignItems: 'center', padding: Spacing.md, borderRadius: Radius.md, backgroundColor: theme.surface, borderWidth: 2, borderColor: selected ? Colors.primary : theme.border, marginBottom: Spacing.sm }}>
      <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primary + '1A', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ ...Typography.label, color: Colors.primary, fontWeight: '700' }}>{item.name.charAt(0)}</Text>
      </View>
      <View style={{ flex: 1, marginLeft: Spacing.sm }}>
        <Text style={{ ...Typography.label, color: theme.textPrimary }}>{item.name}</Text>
        <Text style={{ ...Typography.caption, color: theme.textSecondary }}>{item.phone}</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={{ ...Typography.caption, color: Colors.primary, fontWeight: '700' }}>★ {item.rating}</Text>
        <Text style={{ ...Typography.badge, color: theme.textSecondary }}>{item.tradeCount} trades</Text>
      </View>
    </TouchableOpacity>
  );
});

function PaySupplierView({ onPay }: { onPay: (amount: number, supplier: SupplierType) => void }) {
  const theme = useTheme();
  const { t } = useTranslation();
  const savedSuppliers = useWalletStore((s) => s.savedSuppliers);
  const suppliers = savedSuppliers.length > 0 ? savedSuppliers : mockSuppliers;
  const [selected, setSelected] = useState<SupplierType | null>(null);
  const [amount, setAmount] = useState('');

  return (
    <View style={{ padding: Spacing.md }}>
      <Text style={{ ...Typography.label, color: theme.textPrimary, marginBottom: Spacing.sm }}>{t('money.selectSupplier')}</Text>
      <FlatList
        data={suppliers}
        keyExtractor={(s) => s.id}
        renderItem={({ item }) => <SupplierRow item={item} selected={selected?.id === item.id} onPress={setSelected} />}
        scrollEnabled={false}
      />
      {selected && (
        <View style={{ marginTop: Spacing.md, gap: Spacing.sm }}>
          <TextInput
            value={amount}
            onChangeText={(v) => setAmount(v.replace(/[^0-9]/g, ''))}
            keyboardType="number-pad"
            placeholder={t('money.enterAmount')}
            placeholderTextColor={theme.textSecondary}
            style={{ ...Typography.h2, color: theme.textPrimary, backgroundColor: theme.surface2, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: theme.border }}
          />
          <TouchableOpacity onPress={() => amount && onPay(Number(amount), selected)} disabled={!amount} activeOpacity={0.85} style={{ backgroundColor: Colors.primary, height: 56, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center', opacity: amount ? 1 : 0.5 }}>
            <Text style={{ ...Typography.button, color: Colors.white }}>{t('money.payNow')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// ── Confirm Modal ─────────────────────────────────────────────────────────────
function ConfirmModal({ visible, amount, recipient, fee, rate, onConfirm, onCancel }: { visible: boolean; amount: number; recipient: string; fee: number; rate: number | null; onConfirm: () => void; onCancel: () => void }) {
  const theme = useTheme();
  const { t } = useTranslation();
  const rwf = rate ? (amount * rate).toLocaleString() : '—';

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
        <View style={{ backgroundColor: theme.background, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: Spacing.lg, paddingBottom: Spacing.xl }}>
          <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: theme.border, alignSelf: 'center', marginBottom: Spacing.lg }} />
          <Text style={{ ...Typography.h2, color: theme.textPrimary, textAlign: 'center', marginBottom: Spacing.xs }}>{t('money.reviewTransfer')}</Text>
          <Text style={{ ...Typography.caption, color: theme.textSecondary, textAlign: 'center', marginBottom: Spacing.lg }}>{recipient}</Text>
          <View style={{ alignItems: 'center', marginBottom: Spacing.lg }}>
            <Text style={{ ...Typography.caption, color: theme.textSecondary }}>{t('money.sendingAmount')}</Text>
            <Text style={{ fontSize: 42, fontWeight: '800', color: theme.textPrimary, marginTop: 4 }}>{amount.toLocaleString()} CNY</Text>
            {rate && <Text style={{ ...Typography.bodySm, color: theme.textSecondary, marginTop: 4 }}>≈ {rwf} RWF</Text>}
          </View>
          <View style={{ backgroundColor: theme.surface2, borderRadius: Radius.md, padding: Spacing.md, gap: Spacing.sm, marginBottom: Spacing.lg }}>
            {[
              [t('money.subtotal'),    `${amount.toLocaleString()} CNY`],
              [t('money.txFee'),       fee > 0 ? `${fee.toFixed(2)} CNY` : t('money.free')],
              [t('money.arrivalTime'), t('money.instant')],
            ].map(([label, value]) => (
              <View key={label} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ ...Typography.bodySm, color: theme.textSecondary }}>{label}</Text>
                <Text style={{ ...Typography.bodySm, color: theme.textPrimary, fontWeight: '600' }}>{value}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity onPress={onConfirm} activeOpacity={0.85} style={{ backgroundColor: Colors.primary, height: 56, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm }}>
            <Text style={{ ...Typography.button, color: Colors.white }}>{t('money.confirmSendBtn')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onCancel} activeOpacity={0.8} style={{ height: 44, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ ...Typography.bodyMedium, color: theme.textSecondary }}>{t('common.cancel')}</Text>
          </TouchableOpacity>
          <Text style={{ ...Typography.caption, color: theme.textSecondary, textAlign: 'center', marginTop: Spacing.sm }}>{t('money.transferTerms')}</Text>
        </View>
      </View>
    </Modal>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function MoneyScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation();
  const { rate } = useExchangeRate('CNY', 'RWF');
  const balance = useWalletStore((s) => s.balance);
  const deduct = useWalletStore((s) => s.deduct);
  const credit = useWalletStore((s) => s.credit);
  const setBalance = useWalletStore((s) => s.setBalance);
  const pinRef = useRef<PINBottomSheetHandle>(null);

  const [activeTab, setActiveTab] = useState<TabKey>('send');
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [pendingSend, setPendingSend] = useState<{ amount: number; recipient: string } | null>(null);
  const [pendingTopUp, setPendingTopUp] = useState<{ amount: number; method: TopUpMethod } | null>(null);
  const [pendingPay, setPendingPay] = useState<{ amount: number; supplier: SupplierType } | null>(null);

  useEffect(() => {
    walletService.getBalance()
      .then((r) => setBalance(r.data.balance))
      .catch(() => {});
  }, [setBalance]);

  const handleSendConfirm = useCallback((amount: number, recipient: string) => {
    setPendingSend({ amount, recipient });
    setConfirmVisible(true);
  }, []);

  const openPin = useCallback(() => {
    setConfirmVisible(false);
    setTimeout(() => pinRef.current?.open(), 300);
  }, []);

  const handleTopUp = useCallback((amount: number, method: TopUpMethod) => {
    setPendingTopUp({ amount, method });
    pinRef.current?.open();
  }, []);

  const handleSupplierPay = useCallback((amount: number, supplier: SupplierType) => {
    setPendingPay({ amount, supplier });
    pinRef.current?.open();
  }, []);

  const handlePinSuccess = useCallback(async () => {
    pinRef.current?.close();
    try {
      if (pendingSend) {
        await walletService.sendMoney({ recipientPhone: pendingSend.recipient, amount: pendingSend.amount, currency: 'CNY' });
        deduct(pendingSend.amount * (rate ?? 198));
        setPendingSend(null);
        router.push('/money/history' as never);
      } else if (pendingTopUp) {
        await walletService.topUp({ amount: pendingTopUp.amount, currency: 'RWF', method: pendingTopUp.method });
        credit(pendingTopUp.amount);
        setPendingTopUp(null);
        router.push('/money/history' as never);
      } else if (pendingPay) {
        await walletService.sendMoney({ recipientPhone: pendingPay.supplier.phone, amount: pendingPay.amount, currency: 'RWF' });
        deduct(pendingPay.amount);
        setPendingPay(null);
        router.push('/money/history' as never);
      }
    } catch {
      // TODO: wire up PaymentFailed
    }
  }, [pendingSend, pendingTopUp, pendingPay, deduct, credit, rate, router]);

  return (
    <Screen edges={['top', 'left', 'right']} noAnimation>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', height: 64, paddingHorizontal: Spacing.md, borderBottomWidth: 1, borderBottomColor: theme.border }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: Spacing.xs }}>
          <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={{ ...Typography.h3, color: theme.textPrimary, flex: 1, textAlign: 'center' }}>{t('money.hub')}</Text>
        <TouchableOpacity style={{ padding: Spacing.xs }}>
          <MaterialIcons name="notifications-none" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
      </View>

      <ExchangeRateRibbon rate={rate} />
      <SegmentedControl active={activeTab} onChange={setActiveTab} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {activeTab === 'send'    && <SendView rate={rate} onConfirm={handleSendConfirm} />}
        {activeTab === 'receive' && <ReceiveView />}
        {activeTab === 'topup'   && <TopUpView balance={balance} onTopUp={handleTopUp} />}
        {activeTab === 'pay'     && <ScrollView><PaySupplierView onPay={handleSupplierPay} /></ScrollView>}
      </KeyboardAvoidingView>

      {pendingSend && (
        <ConfirmModal
          visible={confirmVisible}
          amount={pendingSend.amount}
          recipient={pendingSend.recipient}
          fee={Math.max(1, pendingSend.amount * 0.0025)}
          rate={rate}
          onConfirm={openPin}
          onCancel={() => { setConfirmVisible(false); setPendingSend(null); }}
        />
      )}

      <PINBottomSheet ref={pinRef} onSuccess={handlePinSuccess} />
    </Screen>
  );
}
