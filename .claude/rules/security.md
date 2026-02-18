---
paths:
  - "src/lib/**/*.ts"
  - "src/actions/**/*.ts"
  - "middleware.ts"
  - ".env*"
---

# Security Rules

- NEVER read, display, or commit `.env`, `.env.local`, or similar files containing real credentials.
- NEVER hardcode API keys, database URLs, or secrets in source code.
- Every new environment variable must be added to the Zod schema in `src/lib/env.ts` and to `.env.example`.
- All user input MUST go through Zod schemas with `sanitizeHtml()` before storage.
- AI moderation responses must be validated with Zod and sanitized before saving to DB.
- User content in AI prompts must be delimited with XML tags and passed through `stripXmlTags()`.
- When creating new protected routes, add them to the `protectedPaths` array in `src/lib/supabase/middleware.ts`.
