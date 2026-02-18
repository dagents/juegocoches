---
paths:
  - "src/actions/**/*.ts"
---

# Server Action Rules

All Server Actions follow an 8-step pattern and return `ActionResult<T>`:

1. **Auth**: `requireAuth()` from `@/lib/auth`
2. **Time window**: check if the action is allowed (Madrid time)
3. **Rate limit**: `checkRateLimit(userId, action)` from `@/lib/rate-limit`
4. **Validation**: Zod schema with `sanitizeHtml` transforms
5. **Daily limit**: Prisma uniqueness query (1 per user per day)
6. **AI moderation**: if applicable, call `moderateIdea()` or `moderateGameProposal()`
7. **DB write**: create record via Prisma
8. **Revalidate**: `revalidatePath("/poll")`

- Use `"use server"` at the top of the file.
- Never expose sensitive data in the return type.
- User-facing errors in Spanish, `console.error` messages in English.
