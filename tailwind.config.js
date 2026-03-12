/** @type {import('tailwindcss').Config} */

// ─────────────────────────────────────────────────────────────────────────────
// TradeLife Tailwind Config — Colors mapped from src/constants/colors.ts
// Every Colors key is registered here so NativeWind classes like
//   className="bg-primary text-accent border-success"
// work throughout the app.
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // ── Brand ────────────────────────────────────────────────────────────
        primary:       '#0b4c4c',
        'primary-light':'#166565',
        'primary-mid':  '#1a7a7a',
        'primary-dark': '#0A4B4B',
        'primary-deep': '#073535',
        accent:         '#f97316',

        // ── Semantic ─────────────────────────────────────────────────────────
        success:         '#10B981',
        'success-text':  '#047857',
        'success-bg':    '#d1fae5',
        'success-bg-dk': '#064e3b',

        error:           '#ef4444',
        'error-text':    '#dc2626',
        'error-bg':      '#fee2e2',
        'error-bg-dk':   '#7f1d1d',

        warning:         '#f59e0b',
        'warning-text':  '#b45309',
        'warning-bg':    '#fef3c7',
        'warning-bg-dk': '#451a03',

        info:            '#3b82f6',
        'info-text':     '#1d4ed8',
        'info-bg':       '#dbeafe',
        'info-bg-dk':    '#1e3a8a',

        // ── Neutrals (Light) ──────────────────────────────────────────────────
        background:      '#f6f8f8',
        surface:         '#ffffff',
        'surface-2':     '#f1f5f9',
        'text-primary':  '#0f172a',
        'text-secondary':'#475569',
        'text-muted':    '#94a3b8',
        border:          '#e2e8f0',
        divider:         '#f1f5f9',
        'input-bg':      '#ffffff',
        'neutral-bg':    '#f1f5f9',
        'neutral-text':  '#334155',

        // ── Dark Mode Surfaces ────────────────────────────────────────────────
        'dark-bg':       '#112121',
        'dark-surface':  '#1E1E1E',
        'dark-surface-2':'#2C2C2C',
        'dark-border':   '#1e293b',

        // ── Payment Providers ─────────────────────────────────────────────────
        wechat:   '#07C160',
        alipay:   '#1677FF',
        whatsapp: '#25D366',

        // ── Tab Bar ───────────────────────────────────────────────────────────
        'tab-active':   '#0b4c4c',
        'tab-inactive': '#94a3b8',
      },

      // ── Border Radius (matches tailwind config in all 5 screen HTML files) ──
      borderRadius: {
        DEFAULT: '0.25rem',  // 4px  — badges, chips
        sm:      '0.25rem',  // 4px
        md:      '0.5rem',   // 8px  — thumbnails, small cards
        lg:      '0.5rem',   // 8px
        xl:      '0.75rem',  // 12px — inputs, buttons, cards (most common)
        '2xl':   '1rem',     // 16px — large cards (amount card, fee card)
        '3xl':   '1.5rem',   // 24px
        full:    '9999px',   // avatars, FAB, toggle
      },

      // ── Font Family ───────────────────────────────────────────────────────────
      fontFamily: {
        display: ['Inter_700Bold', 'Inter', 'System'],
        sans:    ['Inter_400Regular', 'Inter', 'System'],
      },

      // ── Spacing additions ─────────────────────────────────────────────────────
      // Standard Tailwind scale covers all values used. No custom additions needed.
    },
  },
  plugins: [],
};
