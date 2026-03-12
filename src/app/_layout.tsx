import '../../global.css';
import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Slot, SplashScreen, useRouter, useSegments } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider } from '@/theme';
import { useSettingsStore } from '@/stores/settingsStore';
import { useAuthStore } from '@/stores/authStore';
import { useToasts, useToastStore } from '@/hooks/useToast';
import { Toast } from '@/components/ui/Toast';
import i18n from '@/i18n';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime:    30 * 60 * 1000,
      retry: 2,
    },
  },
});

function AuthGuard() {
  const { isAuthenticated } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);

  // Wait for Zustand AsyncStorage hydration before redirecting
  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => setHydrated(true));
    // If already hydrated (fast load), set immediately
    if (useAuthStore.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/splash' as never);
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)/money' as never);
    }
  }, [hydrated, isAuthenticated, segments, router]);

  return null;
}

export default function RootLayout() {
  const { colorScheme, language } = useSettingsStore();
  const toasts = useToasts();

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider scheme={colorScheme}>
        <QueryClientProvider client={queryClient}>
          <BottomSheetModalProvider>
            <Slot />
            <AuthGuard />
            {toasts.map((toast) => (
              <Toast
                key={toast.id}
                toast={toast}
                onDismiss={(id) => useToastStore.getState().dismiss(id)}
              />
            ))}
          </BottomSheetModalProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
