import React, { useState, useCallback, useRef, useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import GorhomBottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Typography } from '@/constants/typography';
import { Spacing, Radius } from '@/constants/spacing';
import { BottomSheet } from '@/components/layout/BottomSheet';
import { Input } from '@/components/ui/Input';
import { Badge, BadgeVariant } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { t } from '@/i18n';
import type { VPNServer } from '@/types/domain.types';

interface VPNServerSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (server: VPNServer) => void;
  servers: VPNServer[];
  selectedId?: string;
}

function latencyBadge(ms: number): BadgeVariant {
  if (ms < 50) return 'success';
  if (ms <= 100) return 'warning';
  return 'error';
}

interface ServerRowProps {
  server: VPNServer;
  isSelected: boolean;
  onSelect: (server: VPNServer) => void;
}

const ServerRow = React.memo(function ServerRow({ server, isSelected, onSelect }: ServerRowProps) {
  const theme = useTheme();
  const handlePress = useCallback(() => onSelect(server), [server, onSelect]);

  return (
    <Pressable
      onPress={handlePress}
      style={{
        height: 64,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        gap: Spacing.md,
        backgroundColor: isSelected ? theme.primary + '0d' : 'transparent',
      }}
    >
      <Text style={{ fontSize: 28 }}>{server.flagEmoji}</Text>
      <View style={{ flex: 1, gap: 2 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
          <Text style={{ ...Typography.bodyMedium, color: theme.textPrimary }}>{server.country}</Text>
          {server.isRecommended ? (
            <Badge variant="primary" label="Best" size="sm" />
          ) : null}
        </View>
        <Text style={{ ...Typography.caption, color: theme.textSecondary }}>{server.city}</Text>
      </View>
      <Badge variant={latencyBadge(server.latencyMs)} label={`${server.latencyMs}ms`} size="sm" />
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          borderWidth: 2,
          borderColor: isSelected ? theme.primary : theme.border,
          backgroundColor: isSelected ? theme.primary : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isSelected ? (
          <MaterialIcons name="check" size={12} color="#ffffff" />
        ) : null}
      </View>
    </Pressable>
  );
});

export function VPNServerSheet({
  visible,
  onClose,
  onSelect,
  servers,
  selectedId,
}: VPNServerSheetProps) {
  const theme = useTheme();
  const sheetRef = useRef<GorhomBottomSheet>(null);
  const [search, setSearch] = useState('');

  React.useEffect(() => {
    if (visible) {
      sheetRef.current?.expand();
    } else {
      sheetRef.current?.close();
    }
  }, [visible]);

  const filtered = useMemo(
    () =>
      servers.filter(
        (s) =>
          s.country.toLowerCase().includes(search.toLowerCase()) ||
          s.city.toLowerCase().includes(search.toLowerCase()),
      ),
    [servers, search],
  );

  const recommended = useMemo(
    () => filtered.find((s) => s.isRecommended) || filtered[0],
    [filtered]
  );

  const handleQuickConnect = useCallback(() => {
    if (recommended) {
      onSelect(recommended);
    }
  }, [recommended, onSelect]);

  const renderItem = useCallback(
    ({ item }: { item: VPNServer }) => (
      <ServerRow server={item} isSelected={item.id === selectedId} onSelect={onSelect} />
    ),
    [selectedId, onSelect],
  );

  return (
    <BottomSheet ref={sheetRef} snapPoints={['80%']} index={-1} onClose={onClose}>
      <View style={{ flex: 1, paddingHorizontal: Spacing.md, gap: Spacing.sm }}>
        <Text style={{ ...Typography.h3, color: theme.textPrimary, textAlign: 'center' }}>
          {t('travel.selectServer')}
        </Text>
        <Input
          placeholder={t('home.searchServer')}
          value={search}
          onChangeText={setSearch}
          leftIcon={<MaterialIcons name="search" size={20} color={theme.textMuted} />}
        />
        <BottomSheetFlatList
          data={filtered}
          keyExtractor={(item: VPNServer) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => (
            <View style={{ height: 1, backgroundColor: theme.divider, marginHorizontal: Spacing.md }} />
          )}
        />
        <View style={{ paddingVertical: Spacing.md, borderTopWidth: 1, borderTopColor: theme.divider }}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleQuickConnect}
            disabled={!recommended}
          >
            {t('home.quickConnect')}
          </Button>
        </View>
      </View>
    </BottomSheet>
  );
}
