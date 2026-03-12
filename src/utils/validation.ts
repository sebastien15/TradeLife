// ─────────────────────────────────────────────────────────────────────────────
// TradeLife — Zod Validation Schemas
// All schemas are built from reusable primitive field validators.
// Import the schema you need in any screen; error messages are i18n-ready.
// ─────────────────────────────────────────────────────────────────────────────
import { z } from 'zod';
import { t } from '@/i18n';

// ─────────────────────────────────────────────────────────────────────────────
// Reusable primitive field validators
// Import these directly when you need to compose a custom schema.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Accepts a valid international phone number OR a standard email address.
 * Phone: optional leading +, then 7+ digits / spaces / dashes / parens.
 * Email: user@domain.tld format.
 */
export const phoneOrEmailField = z
  .string()
  .min(1, t('validation.phoneOrEmailRequired'))
  .refine(
    (val) =>
      /^\+?[\d\s\-()\u200B]{7,}$/.test(val) ||
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
    t('validation.phoneOrEmailInvalid'),
  );

/**
 * Strong password for account creation.
 * Min 8 chars, at least one uppercase letter and one digit.
 */
export const strongPasswordField = z
  .string()
  .min(8, t('validation.passwordMin'))
  .regex(/[A-Z]/, t('validation.passwordUppercase'))
  .regex(/[0-9]/, t('validation.passwordNumber'));

/**
 * Full name: 2–80 chars, letters / spaces / hyphens / apostrophes only.
 * Uses Unicode letter class so non-Latin scripts are accepted.
 */
export const fullNameField = z
  .string()
  .min(1, t('validation.fullNameRequired'))
  .min(2, t('validation.fullNameMin'))
  .max(80, t('validation.fullNameMax'))
  .regex(/^[\p{L}\s\-']+$/u, t('validation.fullNameInvalid'));

/**
 * Optional referral code: alphanumeric only, max 20 chars.
 */
export const referralCodeField = z
  .string()
  .max(20, t('validation.referralCodeMax'))
  .regex(/^[A-Za-z0-9]*$/)
  .optional();

// ─────────────────────────────────────────────────────────────────────────────
// Auth schemas
// ─────────────────────────────────────────────────────────────────────────────

export const signUpSchema = z
  .object({
    fullName: fullNameField,
    phoneOrEmail: phoneOrEmailField,
    password: strongPasswordField,
    confirmPassword: z.string().min(1, t('validation.passwordRequired')),
    agreeToTerms: z.literal(true, {
      errorMap: () => ({ message: t('validation.agreeToTerms') }),
    }),
    referralCode: referralCodeField,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: t('validation.confirmPasswordMatch'),
    path: ['confirmPassword'],
  });

export type SignUpFormValues = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  /** Sign-in intentionally lenient — let the server handle format checks. */
  phoneOrEmail: z.string().min(1, t('validation.phoneOrEmailRequired')),
  password: z.string().min(1, t('validation.passwordRequired')),
  rememberMe: z.boolean().optional(),
});

export type SignInFormValues = z.infer<typeof signInSchema>;

export const forgotPasswordSchema = z.object({
  /** Reuses the same phone-or-email validator as sign-up. */
  identifier: phoneOrEmailField,
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const otpSchema = z.object({
  code: z
    .string()
    .length(6, t('validation.otpLength'))
    .regex(/^\d{6}$/, t('validation.otpLength')),
});

export type OtpFormValues = z.infer<typeof otpSchema>;

export const profileSetupSchema = z.object({
  fullName: fullNameField,
  businessType: z.enum(['importer', 'exporter', 'both']).optional(),
  country: z.string().optional(),
});

export type ProfileSetupFormValues = z.infer<typeof profileSetupSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Password Strength Helper
// ─────────────────────────────────────────────────────────────────────────────

export type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong';

export function getPasswordStrength(password: string): {
  strength: PasswordStrength;
  score: number;
} {
  if (!password) return { strength: 'weak', score: 0 };

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { strength: 'weak', score: score / 5 };
  if (score === 2) return { strength: 'fair', score: score / 5 };
  if (score === 3) return { strength: 'good', score: score / 5 };
  return { strength: 'strong', score: Math.min(score / 5, 1) };
}
