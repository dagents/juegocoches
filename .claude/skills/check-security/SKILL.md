---
name: check-security
description: Auditar seguridad del proyecto
disable-model-invocation: true
allowed-tools: Bash(npm *), Bash(npx *), Bash(git *)
---

Ejecuta una auditoria de seguridad del proyecto:

1. Ejecuta `npm audit` para verificar vulnerabilidades en dependencias
2. Verifica que `.env` NO esta trackeado por git (`git ls-files .env`)
3. Busca en el codigo fuente posibles secretos hardcodeados (API keys, passwords, tokens)
4. Verifica que todas las variables de `src/lib/env.ts` estan en `.env.example`
5. Revisa que las rutas protegidas en `src/lib/supabase/middleware.ts` cubren todas las paginas que requieren auth
6. Reporta un resumen con los hallazgos y recomendaciones
