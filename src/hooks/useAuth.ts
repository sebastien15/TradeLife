import { useAuthStore } from '@/stores/authStore';
import { authService } from '@/services/auth.service';
import { useToast } from '@/hooks/useToast';
import { useAppRouter } from '@/hooks/useAppRouter';
import type { RegisterPayload } from '@/types/domain.types';

/**
 * Convenience hook that combines authStore state with async auth actions.
 * Use this in screens instead of accessing authStore + authService separately.
 */
export function useAuth() {
  const store = useAuthStore();
  const { show } = useToast();
  const router = useAppRouter();

  /** Request an OTP to a phone number */
  const requestOtp = async (phone: string): Promise<boolean> => {
    store.setLoading(true);
    try {
      await authService.requestOtp(phone);
      return true;
    } catch {
      show('Could not send OTP. Please try again.', 'error');
      return false;
    } finally {
      store.setLoading(false);
    }
  };

  /** Verify OTP and log in — navigates to profile setup or home depending on onboarding state */
  const login = async (phone: string, otp: string): Promise<boolean> => {
    store.setLoading(true);
    try {
      const { data } = await authService.login(phone, otp);
      store.setToken(data.token);
      store.setUser(data.user);
      if (store.onboardingComplete) {
        router.toHome();
      } else {
        router.toProfileSetup();
      }
      return true;
    } catch {
      show('Login failed. Please check your code and try again.', 'error');
      return false;
    } finally {
      store.setLoading(false);
    }
  };

  /** Password-based login (sign-in screen) — navigates to home on success */
  const loginWithPassword = async (phoneOrEmail: string, password: string): Promise<boolean> => {
    store.setLoading(true);
    try {
      const { data } = await authService.loginWithPassword(phoneOrEmail, password);
      store.setToken(data.token);
      store.setUser(data.user);
      router.toHome();
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Incorrect phone/email or password.';
      show(message, 'error');
      return false;
    } finally {
      store.setLoading(false);
    }
  };

  /** Register a new account — saves to mock store and navigates to OTP for verification */
  const register = async (payload: RegisterPayload): Promise<boolean> => {
    store.setLoading(true);
    try {
      const { data } = await authService.register(payload);
      store.setToken(data.token);
      store.setUser(data.user);
      router.toOtp(payload.phone || payload.email);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      show(message, 'error');
      return false;
    } finally {
      store.setLoading(false);
    }
  };

  /** Log out — clears store and navigates to sign-in */
  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch {
      // Best-effort — clear local state regardless of server response
    }
    store.logout();
    router.toSignIn();
  };

  return {
    // State
    user: store.user,
    token: store.token,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    preferredLanguage: store.preferredLanguage,
    onboardingComplete: store.onboardingComplete,
    // Auth actions
    requestOtp,
    login,
    loginWithPassword,
    register,
    logout,
    // Store setters (for onboarding screens)
    setLanguage: store.setLanguage,
    setOnboardingComplete: store.setOnboardingComplete,
  };
}
