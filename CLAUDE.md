# TradeLife — Claude Code Rules

This file is the authoritative table of contents for AI-assisted development on this project. Detailed documentation is stored in `.claude/skills/`.

---

## ⚠️ SESSION START PROTOCOL (MANDATORY)

Before starting any task, you MUST:
1. Read `knowledge/context.md` (Project overview, stack, hard rules)
2. Read `knowledge/screens.md` (Screen/design map, routes)
3. Reference relevant `.claude/skills/` files as needed.

---

## Technical Skills List

| Skill | Purpose |
|---|---|
| [Architecture](./.claude/skills/architecture.md) | Stack, Route locations, Layer order, File Structure |
| [Design System](./.claude/skills/design-system.md) | Colors, Styling rules, Typography, Spacing, Radius |
| [Animations](./.claude/skills/animations.md) | Reanimated v3 patterns and UX conventions |
| [TypeScript & i18n](./.claude/skills/typescript-i18n.md) | Typed props, Memoization, Localization rules |
| [Workflow](./.claude/skills/workflow.md) | Commit rules, Pre-commit checks, Quality standards |

---

## CodeGraph Status

- **Status**: ✓ indexed in `.codegraph/`
- Use `codegraph_*` tools for symbol lookup and context gathering.

---

## Self-Update Rule

- Never edit skill files or `CLAUDE.md` without explicit user confirmation.
- If a new pattern or convention is established, append a suggestion to add it to the relevant skill file at the end of the response.
