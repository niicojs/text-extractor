# Repository Guide

## Toolchain

- Use Vite+ (`vp`) for project commands; `package.json` scripts are thin wrappers around it.
- Install/update dependencies with `vp install` after dependency or lockfile changes. The package manager is `pnpm@11.1.1`.
- `vite.config.ts` is the source of truth for build/check formatting: `vp pack` builds, lint is type-aware, and formatting uses single quotes, 120 columns, and sorted imports.

## Commands

- Full validation: `vp check` then `vp test`.
- Auto-fix format/lint issues: `vp check --fix`.
- Focus checks on paths: `vp check src/index.ts` or `vp check --no-lint src/index.ts` to keep the type check but skip lint rules.
- Run one test file: `vp test run tests/index.test.ts`; filter by test name with `vp test -t <pattern>`.
- Build the library: `vp pack` or `vp run build`; watch build: `vp pack --watch` or `vp run dev`.

## Package Shape

- This is a Node ESM library package (`type: module`) that publishes only `dist` and exports `./dist/index.mjs`.
- Public source exports are centralized in `src/index.ts`; add new extractors there if they are part of the package API.
- Source imports intentionally include `.ts` extensions (`moduleResolution: nodenext`, `allowImportingTsExtensions: true`). Do not "fix" them to extensionless imports.
- Current extractors accept `ArrayBuffer`: PDFs use `unpdf` in `src/pdf.ts`, Word documents use `mammoth` in `src/word.ts`.
