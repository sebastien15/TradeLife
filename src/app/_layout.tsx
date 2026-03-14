import '../../global.css';
import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Slot, SplashScreen, useRouter, useSegments, usePathname } from 'expo-router';
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

// Hydration Context — signals to splash screen when auth state is ready
const HydrationContext = React.createContext({ isHydrated: false });

function AuthGuard() {
  const { isAuthenticated } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Wait for Zustand AsyncStorage hydration before redirecting
  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setHydrated(true);
      setIsHydrated(true);
    });
    // If already hydrated (fast load), set immediately
    if (useAuthStore.persist.hasHydrated()) {
      setHydrated(true);
      setIsHydrated(true);
    }
    return unsub;
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/splash' as never);
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)/' as never);
    }
  }, [hydrated, isAuthenticated, segments, router]);

  return React.createElement(
    HydrationContext.Provider,
    { value: { isHydrated } },
    null
  );
}

// Export hook for components to check hydration state
export function useHydration() {
  return React.useContext(HydrationContext);
}

// Keyboard Dismissal on Route Change
function KeyboardDismissListener() {
  const pathname = usePathname();

  useEffect(() => {
    Keyboard.dismiss();
  }, [pathname]);

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
            <KeyboardDismissListener />
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
