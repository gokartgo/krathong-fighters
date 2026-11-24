# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

This repo currently contains a single app at `krathong-fighters/`. There is no root-level `package.json` — all commands below must be run from inside `krathong-fighters/`.

The app is presently the **unmodified Vite React-TS starter scaffold** (`App.tsx` is still the "Get started" demo page with the counter button and Vite/React links). No Loy Krathong-specific product code exists yet, despite the repo name — don't assume features, routes, or components exist beyond what's actually in `src/`.

## Commands

Run from `krathong-fighters/`:

```bash
npm run dev       # start Vite dev server with HMR
npm run build     # tsc -b (type-check via project references) && vite build
npm run lint      # eslint .
npm run preview   # serve the production build locally
```

There is no test framework configured in this project (no test runner dependency, no test script, no test files). Don't assume Jest/Vitest conventions or invent a test command — if tests are needed, the framework has to be set up first.

## Architecture notes

- **Build tooling is bleeding-edge and non-standard for a typical Vite app** — don't assume older Vite/React/TS behavior:
  - Vite **8** (`vite.config.ts`), React **19.3**, TypeScript **~6.0**, ESLint **10** (flat config).
  - The React Compiler is wired manually: `vite.config.ts` applies `@rolldown/plugin-babel` with `reactCompilerPreset()` from `@vitejs/plugin-react`, rather than using the simpler `compiler: true` option mentioned in `krathong-fighters/README.md`. If compiler behavior ever needs to change, it's configured in `vite.config.ts`, not via plugin options.
- **TypeScript uses project references**, split by runtime environment:
  - `tsconfig.app.json` — covers `src/` (browser code), DOM lib, `jsx: react-jsx`.
  - `tsconfig.node.json` — covers `vite.config.ts` only (Node environment).
  - `tsconfig.json` is the root pointing at both; `npm run build` type-checks via `tsc -b` before `vite build` runs.
- **ESLint** (`eslint.config.js`) is a flat config applying `typescript-eslint` recommended rules, `eslint-plugin-react-hooks`, and `eslint-plugin-react-refresh` (Vite-specific fast-refresh rules) to `**/*.{ts,tsx}`. It is not type-aware (no `recommendedTypeChecked`) — see `README.md` if that needs upgrading.
- **Assets**: images imported into components live in `src/assets/` (bundled by Vite). Files referenced by raw URL/path (e.g. `<use href="/icons.svg#...">`) live in `public/` and are served as-is, unprocessed.
