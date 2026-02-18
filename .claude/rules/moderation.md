---
paths:
  - "src/lib/moderation.ts"
---

# Reglas del Sistema de Moderacion IA

- Usar OpenRouter API (`OPENROUTER_URL`). El modelo se configura via `OPENROUTER_MODEL`.
- Los prompts del sistema deben instruir a responder SOLO con JSON valido.
- El contenido del usuario se delimita con `<contenido_usuario>` tags XML.
- Aplicar `stripXmlTags()` al input del usuario ANTES de interpolarlo en el prompt.
- Validar la respuesta con `ModerationResultSchema` (Zod).
- Validar categorias contra la lista permitida (`IDEA_CATEGORIES` o `GAME_CATEGORIES`).
- Sanitizar el campo `motivo` con `sanitizeHtml()` y truncar a 500 chars.
- Rechazar respuestas de la IA mayores a `MAX_AI_RESPONSE_LENGTH` chars.
- **Fail-closed**: cualquier error o excepcion resulta en `approved: false`.
- Usar `temperature: 0.1` para respuestas deterministas.
