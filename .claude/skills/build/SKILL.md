---
name: build
description: Ejecutar lint y build de produccion
disable-model-invocation: true
allowed-tools: Bash(npm run *)
---

Ejecuta la verificacion completa del proyecto:

1. Ejecuta `npm run lint` para comprobar errores de ESLint
2. Si hay errores de lint, corrigelos antes de continuar
3. Ejecuta `npm run build` para verificar el build de produccion
4. Reporta el resultado: rutas generadas, tamano del bundle, y cualquier warning
