---
paths:
  - "src/lib/moderation.ts"
---

# AI Moderation System Rules

- Use OpenRouter API (`OPENROUTER_URL`). Model is configured via `OPENROUTER_MODEL`.
- System prompts must instruct the LLM to respond ONLY with valid JSON.
- User content is delimited with `<contenido_usuario>` XML tags.
- Apply `stripXmlTags()` to user input BEFORE interpolating it into the prompt.
- Validate the response with `ModerationResultSchema` (Zod).
- Validate categories against the allow-list (`IDEA_CATEGORIES` or `GAME_CATEGORIES`).
- Sanitize the `motivo` field with `sanitizeHtml()` and truncate to 500 chars.
- Reject AI responses longer than `MAX_AI_RESPONSE_LENGTH` chars.
- **Fail-closed**: any error or exception results in `approved: false`.
- Use `temperature: 0.1` for deterministic responses.
