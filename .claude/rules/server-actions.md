---
paths:
  - "src/actions/**/*.ts"
---

# Reglas para Server Actions

Todas las Server Actions siguen el patron de 8 pasos y retornan `ActionResult<T>`:

1. **Auth**: `requireAuth()` de `@/lib/auth`
2. **Ventana temporal**: verificar si la accion esta permitida (hora Madrid)
3. **Rate limit**: `checkRateLimit(userId, action)` de `@/lib/rate-limit`
4. **Validacion**: schema Zod con `sanitizeHtml` en transforms
5. **Limite diario**: query Prisma de unicidad (1 por usuario por dia)
6. **Moderacion IA**: si aplica, llamar a `moderateIdea()` o `moderateGameProposal()`
7. **Escritura DB**: crear registro via Prisma
8. **Revalidar**: `revalidatePath("/")`

- Usar `"use server"` al inicio del archivo.
- Nunca exponer datos sensibles en el tipo de retorno.
- Los errores para el usuario van en espanol, los `console.error` en ingles.
