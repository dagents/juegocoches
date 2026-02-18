---
name: build
description: Run lint and production build
disable-model-invocation: true
allowed-tools: Bash(npm run *)
---

Run full project verification:

1. Run `npm run lint` to check for ESLint errors
2. If there are lint errors, fix them before continuing
3. Run `npm run build` to verify the production build
4. Report the result: generated routes, bundle size, and any warnings
