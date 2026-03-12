# TypeScript & Internationalization

## TypeScript Conventions

- **No `any` types** anywhere.
- Strict mode is on (`tsconfig.json: strict: true`).
- Every component has a typed `Props` interface.
- `forwardRef` on: Input, BottomSheet, PINBottomSheet.
- `React.memo` on all list-item components: ShipmentCard, WarehouseItemCard, TransactionRow, VPN server rows.
- `useCallback` on all FlatList `renderItem` handlers and BottomSheet callbacks.

## Internationalization (i18n)

- **No hardcoded user-visible strings** in components.
- All labels, placeholders, errors, titles → use `t('key')` from `useTranslation()` or the `t` export from `@/i18n`.
- Add new keys to `src/i18n/locales/en.json` before using them.
