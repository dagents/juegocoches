---
name: check-security
description: Audit project security
disable-model-invocation: true
allowed-tools: Bash(pnpm *), Bash(npx *), Bash(git *)
---

Run a project security audit:

1. Run `pnpm audit` to check for dependency vulnerabilities
2. Verify `.env` is NOT tracked by git (`git ls-files .env`)
3. Search source code for possible hardcoded secrets (API keys, passwords, tokens)
4. Verify all variables in `src/lib/env.ts` are present in `.env.example`
5. Check that protected routes in `src/lib/supabase/middleware.ts` cover all pages requiring auth
6. Report a summary with findings and recommendations
