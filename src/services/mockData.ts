// ─────────────────────────────────────────────────────────────────────────────
// TradeLife — Mock Auth Data
// In-memory user registry used during development to test screens end-to-end
// without a live backend.  Replace calls to this with real API when ready.
// ─────────────────────────────────────────────────────────────────────────────
import type { UserType, RegisterPayload } from '@/types/domain.types';

interface MockUser {
  user: UserType;
  password: string;
  phone: string;
  email: string;
}

// Pre-seeded demo accounts — use these to test sign-in immediately
const MOCK_USERS: MockUser[] = [
  {
    user: {
      id: 'demo-001',
      fullName: 'Demo User',
      email: 'demo@tradelife.rw',
      phone: '+250788000001',
      countryCode: 'RW',
      businessType: 'importer',
      membershipTier: 'free',
      createdAt: '2025-01-01T00:00:00.000Z',
    },
    password: 'Demo1234',
    phone: '+250788000001',
    email: 'demo@tradelife.rw',
  },
];

export const mockAuthDB = {
  /** Find a user by phone number or email address */
  findByIdentifier(identifier: string): MockUser | undefined {
    const id = identifier.trim().toLowerCase();
    return MOCK_USERS.find(
      (u) =>
        u.phone === identifier ||
        u.phone === id ||
        u.email === id ||
        u.email === identifier,
    );
  },

  /** Register a new user; throws if phone or email already taken */
  register(payload: RegisterPayload): MockUser {
    const phone = payload.phone.trim();
    const email = payload.email.trim().toLowerCase();

    const duplicate = MOCK_USERS.find(
      (u) => u.phone === phone || u.email.toLowerCase() === email,
    );
    if (duplicate) throw new Error('An account with this phone or email already exists.');

    const user: UserType = {
      id: `user-${Date.now()}`,
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      countryCode: payload.countryCode,
      businessType: payload.businessType,
      membershipTier: 'free',
      createdAt: new Date().toISOString(),
    };

    const mockUser: MockUser = {
      user,
      password: payload.password ?? '',
      phone,
      email,
    };

    MOCK_USERS.push(mockUser);
    return mockUser;
  },

  /** Generate a mock JWT-like token */
  generateToken(userId: string): string {
    return `mock-token-${userId}-${Date.now()}`;
  },
};
