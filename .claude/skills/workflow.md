# Workflow & Quality Standards

## Commit / PR Guidelines

- Run `npx tsc --noEmit` before every commit — must be 0 errors.
- Grep for hardcoded hex: `grep -rE '#[0-9a-fA-F]{3,6}' src/components/` — must return 0 matches.
- All user-visible strings must exist in `en.json` before the component is committed.
