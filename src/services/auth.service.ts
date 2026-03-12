// ─────────────────────────────────────────────────────────────────────────────
// TradeLife — Auth Service (Mock Mode)
// All methods use the in-memory mockAuthDB for development/testing.
// To switch to a real API, replace each method body with the commented
// api.post() call below it.
// ─────────────────────────────────────────────────────────────────────────────
import type { UserType, RegisterPayload } from '@/types/domain.types';
import { mockAuthDB } from './mockData';

interface LoginResponse {
  user: UserType;
  token: string;
}

interface OtpResponse {
  expiresIn: number;
}

interface TokenResponse {
  token: string;
}

/** Wrap a value in the same {data} shape that api.post() returns */
function mockResponse<T>(data: T): Promise<{ data: T }> {
  return new Promise((resolve) => setTimeout(() => resolve({ data }), 600));
}

export const authService = {
  /**
   * Request an OTP to the given phone number.
   * Mock: always succeeds — any 6-digit code will be accepted in login().
   */
  requestOtp: (_phone: string) =>
    // Real: api.post<OtpResponse>('/auth/otp', { phone }),
    mockResponse<OtpResponse>({ expiresIn: 300 }),

  /**
   * Verify an OTP and log in.
   * Mock: accepts ANY 6-digit numeric code for a registered phone number.
   */
  login: (phoneOrEmail: string, otp: string) => {
    // Real: return api.post<LoginResponse>('/auth/login', { phone: phoneOrEmail, otp });
    const mockUser = mockAuthDB.findByIdentifier(phoneOrEmail);
    if (!mockUser) return Promise.reject(new Error('No account found for this phone or email.'));
    // Accept any 6-digit code for OTP flows
    if (!/^\d{6}$/.test(otp)) return Promise.reject(new Error('Enter a valid 6-digit code.'));
    const token = mockAuthDB.generateToken(mockUser.user.id);
    return mockResponse<LoginResponse>({ user: mockUser.user, token });
  },

  /**
   * Password-based login (sign-in screen).
   * Mock: checks stored password against the registry.
   */
  loginWithPassword: (phoneOrEmail: string, password: string) => {
    // Real: return api.post<LoginResponse>('/auth/login-password', { phoneOrEmail, password });
    const mockUser = mockAuthDB.findByIdentifier(phoneOrEmail);
    if (!mockUser || mockUser.password !== password) {
      return Promise.reject(new Error('Incorrect phone/email or password.'));
    }
    const token = mockAuthDB.generateToken(mockUser.user.id);
    return mockResponse<LoginResponse>({ user: mockUser.user, token });
  },

  /**
   * Register a new user account.
   * Mock: saves to in-memory registry; navigated to OTP for verification.
   */
  register: (data: RegisterPayload) => {
    // Real: return api.post<LoginResponse>('/auth/register', data);
    try {
      const mockUser = mockAuthDB.register(data);
      const token = mockAuthDB.generateToken(mockUser.user.id);
      return mockResponse<LoginResponse>({ user: mockUser.user, token });
    } catch (err) {
      return Promise.reject(err);
    }
  },

  /** Refresh the current token */
  refreshToken: () =>
    // Real: api.post<TokenResponse>('/auth/refresh'),
    mockResponse<TokenResponse>({ token: `mock-token-refresh-${Date.now()}` }),

  /** Invalidate the session on the server */
  logout: () =>
    // Real: api.post<void>('/auth/logout'),
    mockResponse<void>(undefined),
};
