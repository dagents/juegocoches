---
name: build
description: Run lint and production build
disable-model-invocation: true
allowed-tools: Bash(pnpm *)
---

Run full project verification:

1. Run `pnpm lint` to check for ESLint errors
2. If there are lint errors, fix them before continuing
3. Run `pnpm build` to verify the production build
4. Report the result: generated routes, bundle size, and any warnings
