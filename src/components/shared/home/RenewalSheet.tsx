import React, { useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import GorhomBottomSheet from '@gorhom/bottom-sheet';
import { MaterialIcons } from '@expo/vector-icons';
import { BottomSheet } from '@/components/layout/BottomSheet';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useTheme } from '@/hooks/useTheme';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { Spacing } from '@/constants/spacing';
import { t } from '@/i18n';

interface RenewalSheetProps {
  visible: boolean;
  onClose: () => void;
}

const PLANS = [
  {
    name: 'Monthly',
    price: '5,000 RWF',
    period: '/month',
    features: ['30 days access', 'All servers', 'Standard speed'],
    popular: false,
  },
  {
    name: 'Annual',
    price: '50,000 RWF',
    period: '/year',
    features: ['365 days access', 'All servers + Premium', 'Priority support'],
    popular: true,
  },
];

export function RenewalSheet({ visible, onClose }: RenewalSheetProps) {
  const theme = useTheme();
  const sheetRef = useRef<GorhomBottomSheet>(null);

  useEffect(() => {
    if (visible) {
      sheetRef.current?.expand();
    } else {
      sheetRef.current?.close();
    }
  }, [visible]);

  return (
    <BottomSheet ref={sheetRef} snapPoints={['60%']} index={-1} onClose={onClose}>
      <View style={{ flex: 1, paddingHorizontal: Spacing.md, gap: Spacing.lg }}>
        <Text style={{ ...Typography.h3, color: theme.textPrimary, textAlign: 'center' }}>
          {t('home.serverExpired')}
        </Text>

        {PLANS.map((plan) => (
          <Card
            key={plan.name}
            radius="lg"
            padding="lg"
            accentColor={plan.popular ? Colors.accent : undefined}
            style={{ backgroundColor: plan.popular ? theme.primary + '0d' : theme.surface }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text style={{ ...Typography.body, color: theme.textPrimary, fontWeight: '700' }}>
                  {plan.name}
                </Text>
                <Text style={{ ...Typography.h2, color: theme.primary, marginTop: Spacing.xs }}>
                  {plan.price}
                  <Text style={{ fontSize: 14, color: theme.textSecondary }}>{plan.period}</Text>
                </Text>
              </View>
              {plan.popular && <Badge variant="primary" label="Popular" size="sm" />}
            </View>
            <View style={{ marginTop: Spacing.md, gap: Spacing.xs }}>
              {plan.features.map((feature) => (
                <View key={feature} style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs }}>
                  <MaterialIcons name="check-circle" size={16} color={Colors.success} />
                  <Text style={{ ...Typography.caption, color: theme.textSecondary }}>{feature}</Text>
                </View>
              ))}
            </View>
          </Card>
        ))}

        <Button variant="primary" size="lg" fullWidth onPress={onClose}>
          {t('home.renewNow')}
        </Button>
      </View>
    </BottomSheet>
  );
}
