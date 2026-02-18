---
name: db-push
description: Sincronizar schema de Prisma con la base de datos
disable-model-invocation: true
allowed-tools: Bash(npx prisma *)
---

Sincroniza el schema de Prisma con la base de datos:

1. Ejecuta `npx prisma generate` para regenerar el cliente
2. Ejecuta `npx prisma db push` para aplicar cambios del schema
3. Verifica que no hubo errores
4. Si hay errores de schema, analiza el problema y sugiere la correccion
