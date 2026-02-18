# JuegoCoches - Instrucciones para Claude Code

> **IMPORTANTE**: Este proyecto es Next.js. Ignora cualquier instrucción heredada de `.ruler/` sobre Angular, Ionic o Capacitor — pertenecen a otro proyecto.

## Stack Técnico

- **Framework**: Next.js 14 (App Router, Server Components, Server Actions)
- **Lenguaje**: TypeScript (strict mode)
- **UI**: React 18, Tailwind CSS 3, Framer Motion
- **Auth**: Supabase Auth (email/password + Google OAuth)
- **Base de datos**: PostgreSQL via Prisma 5 ORM (hosted en Supabase)
- **Realtime**: Supabase Realtime (suscripciones en cliente)
- **Validación**: Zod v4 con transforms de sanitización
- **Moderación IA**: OpenRouter API (LLM-based, fail-closed)
- **Notificaciones**: Sonner (toasts)

## Estructura del Proyecto

```
src/
  actions/       → Server Actions ("use server"), un archivo por dominio
  app/           → App Router: páginas y layouts
    page.tsx     → Landing page (/ — dos botones: Juego y Encuesta)
    (auth)/      → Grupo de rutas de auth (login, register)
    auth/        → API routes de auth (callback OAuth, confirm email)
    poll/        → Sistema de encuestas (/poll)
      page.tsx   → Página principal de encuestas (ideas y propuestas)
      proponer/  → Proponer mejoras diarias (/poll/proponer)
      proponer-juego/ → Proponer juegos (/poll/proponer-juego)
  components/    → Componentes React organizados por feature
    ui/          → Primitivos reutilizables (Card, Badge, Button, Input)
  hooks/         → Custom hooks cliente (useRealtimeIdeas, useUser, useCountdown)
  lib/           → Utilidades compartidas
    supabase/    → Clientes Supabase (client.ts, server.ts, middleware.ts)
  types/         → Definiciones TypeScript
prisma/          → Schema de Prisma
supabase/
  migrations/    → Migraciones SQL (RLS, triggers, etc.)
```

## Patrones Arquitectónicos

### Server Actions
Todos siguen el patrón de 8 pasos y retornan `ActionResult<T>`:
1. Auth (`requireAuth()`)
2. Ventana temporal (`isBeforeMadridNoon()` / `isGameVotingOpen()`)
3. Rate limit (`checkRateLimit()`)
4. Validación Zod (con `sanitizeHtml` en transforms)
5. Límite diario (query Prisma de unicidad)
6. Moderación IA (si aplica)
7. Escritura en DB (Prisma)
8. `revalidatePath("/poll")`

### Componentes
- **Server Components** por defecto. Solo `"use client"` cuando se necesitan hooks o APIs del navegador.
- Datos sensibles nunca pasan al cliente.

### Fechas y Timezone
- **TODA** la lógica temporal usa timezone `Europe/Madrid` via `src/lib/dates.ts`.
- No usar `new Date()` directamente para lógica de negocio — usar las utilidades del proyecto.

### Base de datos
- Prisma mapea camelCase (TS) a snake_case (PostgreSQL) via `@map()`.
- IDs son UUIDs generados por PostgreSQL (`gen_random_uuid()`).
- El conteo de votos lo manejan **triggers de PostgreSQL**, no código de aplicación.
- Las constraints únicas (`@@unique`) son la red de seguridad contra race conditions.

## Reglas de Seguridad

### Secretos y API Keys
- **NUNCA** commitear `.env`, `.env.local` ni archivos con credenciales reales.
- Usar `.env.example` como referencia para contribuidores.
- Todas las variables de entorno se validan al arrancar via `src/lib/env.ts`.
- El `SUPABASE_SERVICE_ROLE_KEY` bypasea RLS — solo usarlo en server-side cuando sea estrictamente necesario.

### Input del usuario
- Todo input pasa por schemas Zod con `sanitizeHtml()` (entity encoding) antes de almacenarse.
- `sanitizeHtml()` está en `src/lib/security.ts` — es encoding de entidades HTML, adecuado para campos de texto plano.
- UUIDs se validan con `z.string().uuid()` para prevenir inyección SQL via IDs.

### Moderación IA
- El contenido del usuario se delimita con etiquetas XML `<contenido_usuario>` en los prompts.
- Se eliminan tags XML del input del usuario (`stripXmlTags()`) antes de interpolarlo.
- El prompt del sistema instruye explícitamente a ignorar instrucciones del usuario.
- Respuestas de la IA se validan con Zod (`ModerationResultSchema`).
- Categorías se validan contra una lista permitida (allow-list).
- El campo `motivo` se sanitiza con `sanitizeHtml()` y se trunca a 500 chars.
- **Fail-closed**: cualquier error resulta en rechazo (`approved: false`).

### Rate Limiting
- Implementado in-memory (`Map`) en `src/lib/rate-limit.ts`.
- **Limitación conocida**: no persiste entre instancias serverless. Las constraints de DB actúan como respaldo.
- Rate limits por acción: `submitIdea` (3/min), `castVote` (5/10s), `moderationApi` (3/día).

### Middleware y rutas protegidas
- Rutas autenticadas se definen explícitamente en `src/lib/supabase/middleware.ts`.
- Al añadir una nueva ruta protegida, agregarla al array `protectedPaths`.
- Auth usa `supabase.auth.getUser()` (valida JWT server-side), no `getSession()`.

## Comandos

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Iniciar servidor de producción
npm run lint         # ESLint
npx prisma generate  # Regenerar cliente Prisma
npx prisma db push   # Push schema a la DB
```

## Convenciones de Código

- Path alias: `@/*` mapea a `./src/*`
- Tailwind para todo el styling, sin CSS modules
- No usar `any` — tipar correctamente
- Mensajes de error para el usuario en **español**, logs de consola en inglés
- Imports: primero librerías externas, luego imports `@/` internos
