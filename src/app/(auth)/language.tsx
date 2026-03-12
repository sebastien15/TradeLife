// ─────────────────────────────────────────────────────────────────────────────
// TradeLife — Language Selection Screen
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/theme';
import { Typography } from '@/constants/typography';
import { Spacing } from '@/constants/spacing';
import { useAppRouter } from '@/hooks/useAppRouter';
import { useAuthStore } from '@/stores/authStore';
import { t } from '@/i18n';
import i18n from '@/i18n';
import type { SupportedLanguage } from '@/types/domain.types';

interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'rw', name: 'Kinyarwanda', nativeName: 'Ikinyarwanda', flag: '🇷🇼' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
];

export default function LanguageScreen() {
  const { theme, isDark } = useTheme();
  const router = useAppRouter();
  const setLanguage = useAuthStore((s) => s.setLanguage);
  const preferredLanguage = useAuthStore((s) => s.preferredLanguage);

  const [selected, setSelected] = useState<SupportedLanguage>(preferredLanguage ?? 'en');

  const handleSelect = (code: SupportedLanguage) => {
    setSelected(code);
    void i18n.changeLanguage(code);
  };

  const handleContinue = () => {
    setLanguage(selected);
    router.toSignIn();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* ── Header ── */}
      <Animated.View
        entering={FadeInDown.duration(400)}
        style={{ paddingHorizontal: 24, paddingTop: Spacing.md, paddingBottom: 24 }}
      >
        <TouchableOpacity
          onPress={router.back}
          activeOpacity={0.7}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: Spacing.md,
            marginLeft: -8,
          }}
        >
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={{ ...Typography.h1, marginBottom: 4, color: theme.textPrimary }}>
          {t('auth.chooseLanguage')}
        </Text>
        <Text style={{ ...Typography.body, color: theme.textSecondary }}>
          {t('auth.languageSubtitle')}
        </Text>
      </Animated.View>

      {/* ── Language list ── */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 24, gap: 12, paddingBottom: Spacing.md }}
        showsVerticalScrollIndicator={false}
      >
        {LANGUAGES.map((lang, index) => {
          const isSelected = selected === lang.code;
          return (
            <Animated.View
              key={lang.code}
              entering={FadeInDown.duration(400).delay(index * 80)}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleSelect(lang.code)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: Spacing.md,
                  borderRadius: 16,
                  borderWidth: 2,
                  gap: 12,
                  // Left accent bar on selected card
                  borderLeftWidth: isSelected ? 4 : 2,
                  borderLeftColor: isSelected ? theme.primary : theme.border,
                  borderColor: isSelected ? theme.primary : theme.border,
                  backgroundColor: isSelected
                    ? theme.primary + '15'
                    : theme.surface,
                }}
              >
                <Text style={{ fontSize: 32 }}>{lang.flag}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ ...Typography.bodyMedium, fontSize: 17, color: theme.textPrimary }}>
                    {lang.nativeName}
                  </Text>
                  <Text style={{ ...Typography.caption, marginTop: 2, color: theme.textSecondary }}>
                    {lang.name}
                  </Text>
                </View>
                {isSelected && (
                  <Animated.View entering={ZoomIn.duration(200)}>
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: theme.primary,
                      }}
                    >
                      <Ionicons name="checkmark" size={14} color="#fff" />
                    </View>
                  </Animated.View>
                )}
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </ScrollView>

      {/* ── Continue button ── */}
      <Animated.View
        entering={FadeInDown.duration(400).delay(400)}
        style={{
          padding: 24,
          paddingBottom: 28,
          borderTopWidth: 1,
          borderTopColor: theme.border,
        }}
      >
        <TouchableOpacity
          onPress={handleContinue}
          activeOpacity={0.85}
          style={{
            height: 56,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.primary,
          }}
        >
          <Text style={{ ...Typography.button, color: '#fff' }}>
            {t('common.continue')}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}
