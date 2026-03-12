// ─────────────────────────────────────────────────────────────────────────────
// TradeLife — Language Settings
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@/hooks/useTheme';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Radius } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { Screen } from '@/components/layout/Screen';
import { useAppRouter } from '@/hooks/useAppRouter';

// ── Types ─────────────────────────────────────────────────────────────────────
interface LanguageOption {
  code: string;
  labelKey: string;
  regionKey: string;
  flag: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: 'en', labelKey: 'language.english',    regionKey: 'language.englishRegion',    flag: '🇺🇸' },
  { code: 'fr', labelKey: 'language.french',     regionKey: 'language.frenchRegion',     flag: '🇫🇷' },
  { code: 'rw', labelKey: 'language.kinyarwanda',regionKey: 'language.kinyarwandaRegion', flag: '🇷🇼' },
  { code: 'zh', labelKey: 'language.chinese',    regionKey: 'language.chineseRegion',    flag: '🇨🇳' },
];

// ── Language Row ──────────────────────────────────────────────────────────────
interface LanguageRowProps {
  option: LanguageOption;
  selected: boolean;
  onSelect: () => void;
  isLast: boolean;
}

const LanguageRow = React.memo(({ option, selected, onSelect, isLast }: LanguageRowProps) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animStyle}>
      <TouchableOpacity
        onPress={onSelect}
        onPressIn={() => { scale.value = withSpring(0.97, { damping: 14, stiffness: 300 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 14, stiffness: 300 }); }}
        activeOpacity={0.7}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          minHeight: 64,
          paddingHorizontal: Spacing.md,
          paddingVertical: Spacing.sm,
          borderBottomWidth: isLast ? 0 : 1,
          borderBottomColor: theme.divider,
          backgroundColor: selected ? `${Colors.primary}0a` : 'transparent',
        }}
      >
        {/* Flag */}
        <Text style={{ fontSize: 28, marginRight: Spacing.md }}>{option.flag}</Text>

        {/* Labels */}
        <View style={{ flex: 1 }}>
          <Text style={{ ...Typography.body, color: selected ? Colors.primary : theme.textPrimary, fontWeight: selected ? '600' : '400' }}>
            {t(option.labelKey)}
          </Text>
          <Text style={{ ...Typography.caption, color: theme.textMuted, marginTop: 2 }}>
            {t(option.regionKey)}
          </Text>
        </View>

        {/* Selected indicator */}
        <View
          style={{
            width: 22,
            height: 22,
            borderRadius: 11,
            borderWidth: 2,
            borderColor: selected ? Colors.primary : theme.border,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: selected ? Colors.primary : 'transparent',
          }}
        >
          {selected && <MaterialIcons name="check" size={13} color={Colors.white} />}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

// ── Main Screen ────────────────────────────────────────────────────────────────
export default function LanguageScreen() {
  const theme = useTheme();
  const router = useAppRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const backScale = useSharedValue(1);
  const btnScale = useSharedValue(1);

  const [selected, setSelected] = useState('en');

  const backAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: backScale.value }],
  }));

  const btnAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: btnScale.value }],
  }));

  const handleApply = () => {
    // In production: i18n.changeLanguage(selected) + persist to store
    console.log('Apply language:', selected);
    router.back();
  };

  return (
    <Screen edges={['left', 'right']} backgroundColor={theme.background} scroll>

      {/* ── Header ── */}
      <View
        style={{
          paddingTop: insets.top + Spacing.sm,
          paddingBottom: Spacing.sm,
          paddingHorizontal: Spacing.md,
          flexDirection: 'row',
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: theme.divider,
          backgroundColor: theme.background,
        }}
      >
        <Animated.View style={backAnimStyle}>
          <TouchableOpacity
            onPress={router.back}
            onPressIn={() => { backScale.value = withSpring(0.9); }}
            onPressOut={() => { backScale.value = withSpring(1); }}
            activeOpacity={0.7}
            style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginLeft: -8 }}
          >
            <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
        </Animated.View>
        <Text style={{ flex: 1, textAlign: 'center', ...Typography.h3, color: theme.textPrimary, paddingRight: 32 }}>
          {t('language.title')}
        </Text>
      </View>

      {/* ── Subtitle ── */}
      <Animated.View entering={FadeInDown.duration(400).delay(60)} style={{ paddingHorizontal: Spacing.md, paddingTop: Spacing.lg, paddingBottom: Spacing.sm }}>
        <Text style={{ ...Typography.bodySm, color: theme.textSecondary }}>
          {t('language.subtitle')}
        </Text>
      </Animated.View>

      {/* ── Language List ── */}
      <Animated.View
        entering={FadeInDown.duration(400).delay(100)}
        style={{
          marginHorizontal: Spacing.md,
          borderRadius: 14,
          overflow: 'hidden',
          backgroundColor: theme.surface,
        }}
      >
        {LANGUAGES.map((lang, index) => (
          <LanguageRow
            key={lang.code}
            option={lang}
            selected={selected === lang.code}
            onSelect={() => setSelected(lang.code)}
            isLast={index === LANGUAGES.length - 1}
          />
        ))}
      </Animated.View>

      {/* ── Restart note ── */}
      <Animated.View entering={FadeInDown.duration(400).delay(180)} style={{ paddingHorizontal: Spacing.md, marginTop: Spacing.sm }}>
        <Text style={{ ...Typography.caption, color: theme.textMuted }}>
          {t('language.restartNote')}
        </Text>
      </Animated.View>

      {/* ── Apply Button ── */}
      <Animated.View
        entering={FadeInDown.duration(400).delay(220)}
        style={[{ paddingHorizontal: Spacing.md, marginTop: Spacing.xl }, btnAnimStyle]}
      >
        <TouchableOpacity
          onPress={handleApply}
          onPressIn={() => { btnScale.value = withSpring(0.96); }}
          onPressOut={() => { btnScale.value = withSpring(1); }}
          activeOpacity={0.85}
          style={{
            height: Spacing.inputHeight,
            borderRadius: Radius.md,
            backgroundColor: Colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ ...Typography.button, color: Colors.white }}>
            {t('language.applyButton')}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <View style={{ height: Spacing.xxl }} />
    </Screen>
  );
}
