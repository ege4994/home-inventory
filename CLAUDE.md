# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Node.js is not installed on this machine. Use Bun instead (installed at `~/.bun/bin/bun`):

```bash
~/.bun/bin/bun run dev              # start dev server
~/.bun/bin/bun run dev -- --host   # + expose to local network (for mobile testing)
~/.bun/bin/bun run build           # production build
~/.bun/bin/bun run lint            # eslint
```

When running with `--host`, the terminal prints a `Network:` URL (e.g. `http://192.168.1.103:5174`). Open that URL in Safari on iPhone (same Wi-Fi required) to test on mobile.

If Bun is not yet installed: `curl -fsSL https://bun.sh/install | bash`

No test suite is configured.

## Architecture

Single-page PWA — no routing library. All navigation is modal-based, controlled by a `ModalState` discriminated union in [App.tsx](src/App.tsx). Adding a new "screen" means adding a new variant to `ModalState` in [src/types/index.ts](src/types/index.ts) and a conditional render in App.tsx.

### Data layer

[Dexie](https://dexie.org/) wraps IndexedDB. The singleton DB instance lives in [src/db/db.ts](src/db/db.ts) with two tables: `boxes` and `items`. Schema migrations are versioned there.

Reactive reads use `useLiveQuery` from `dexie-react-hooks` — components automatically re-render when the underlying IndexedDB data changes. Write operations (add/update/delete) are plain async functions, **not** hooks, but are co-located in the same hook files:

- [src/hooks/useBoxes.ts](src/hooks/useBoxes.ts) — `useBoxes()` hook + `addBox`, `updateBox`, `deleteBox`
- [src/hooks/useItems.ts](src/hooks/useItems.ts) — item CRUD
- [src/hooks/useSearch.ts](src/hooks/useSearch.ts) — client-side full-text search across item name/description, capped at 50 results

### Photo storage

Photos are stored as base64 JPEG strings directly in IndexedDB on the `Item.photoBase64` field. [src/utils/photo.ts](src/utils/photo.ts) resizes to max 800px wide and compresses at 0.7 quality before storing.

### PWA

Configured via `vite-plugin-pwa` in [vite.config.ts](vite.config.ts). Workbox pre-caches all JS/CSS/HTML/images. Service worker auto-updates (`registerType: 'autoUpdate'`). Safe-area insets are handled with `tailwindcss-safe-area` (`pt-safe-top`, `pb-safe` classes).

### Component layout

```
src/components/
  layout/AppShell     — top nav bar with search + add-box button
  boxes/              — BoxList, BoxCard, BoxModal (add/edit), BoxDetailModal
  items/              — ItemCard, ItemModal (add/edit), QuickAddModal
  shared/Modal        — base modal wrapper
  shared/EmptyState   — reusable empty-state display
```

QuickAddModal is a camera-first rapid batch-entry flow with an internal phase state machine (`photo → compressing → naming → saving → photo`).
