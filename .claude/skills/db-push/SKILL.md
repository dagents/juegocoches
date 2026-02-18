---
name: db-push
description: Sync Prisma schema with the database
disable-model-invocation: true
allowed-tools: Bash(npx prisma *)
---

Sync the Prisma schema with the database:

1. Run `npx prisma generate` to regenerate the client
2. Run `npx prisma db push` to apply schema changes
3. Verify there were no errors
4. If there are schema errors, analyze the problem and suggest a fix
