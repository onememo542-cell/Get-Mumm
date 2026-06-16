---
name: Lib Declarations Must Be Built First
description: TypeScript project-reference setup requires lib packages to emit .d.ts before artifacts can typecheck.
---

## Rule

Before running `pnpm --filter @workspace/get-mumm run typecheck` (or any artifact typecheck), first run:

```
pnpm run typecheck:libs   # runs tsc --build at workspace root
```

This emits declaration files for `api-client-react`, `api-zod`, and `db` into their `dist/` directories.

**Why:** The artifact `tsconfig.json` files declare `"references"` pointing to the lib packages. TypeScript project references require `.d.ts` outputs to exist; without them, you get "Output file has not been built from source file" errors on every import from those libs.

**How to apply:** Always run `typecheck:libs` first in a fresh environment or after a `git clean`. The CI `build` script already does this via `pnpm run typecheck`.
