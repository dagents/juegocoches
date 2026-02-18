---
paths:
  - "src/lib/**/*.ts"
  - "src/actions/**/*.ts"
  - "middleware.ts"
  - ".env*"
---

# Reglas de Seguridad

- NUNCA leer, mostrar ni commitear archivos `.env`, `.env.local` o similares con credenciales reales.
- NUNCA hardcodear API keys, URLs de base de datos ni secretos en el codigo fuente.
- Toda nueva variable de entorno debe anadirse al schema Zod en `src/lib/env.ts` y al `.env.example`.
- Todo input de usuario DEBE pasar por schemas Zod con `sanitizeHtml()` antes de almacenarse.
- Las respuestas de la IA de moderacion deben validarse con Zod y sanitizarse antes de guardarse en DB.
- El contenido del usuario en prompts de IA debe delimitarse con etiquetas XML y pasar por `stripXmlTags()`.
- Al crear nuevas rutas protegidas, anadirlas al array `protectedPaths` en `src/lib/supabase/middleware.ts`.
