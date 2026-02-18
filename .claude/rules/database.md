---
paths:
  - "prisma/**"
  - "src/actions/**/*.ts"
  - "supabase/**"
---

# Reglas de Base de Datos

- Acceso exclusivamente a traves de Prisma (`@/lib/prisma`).
- Mapear camelCase (TypeScript) a snake_case (PostgreSQL) con `@map()` y `@@map()`.
- IDs son UUIDs generados por PostgreSQL (`gen_random_uuid()`).
- El conteo de votos lo gestionan **triggers de PostgreSQL**, no codigo de aplicacion.
- Las constraints unicas (`@@unique`) son la red de seguridad contra race conditions.
- Las migraciones SQL van en `supabase/migrations/`.
- Despues de cambiar el schema de Prisma, ejecutar `npx prisma generate`.
