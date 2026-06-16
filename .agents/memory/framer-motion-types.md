---
name: Framer Motion Variants Type Quirks
description: Type pitfalls in framer-motion v11+ that cause TS errors in this project.
---

## Rules

1. **wordReveal / similar helpers**: Return type must use `TargetAndTransition` (imported from `framer-motion`), NOT `object`. `object` is too wide for the `animate` prop.

2. **`as const` on arrays breaks `animate`**: Framer Motion expects mutable arrays for keyframe definitions. Using `as const` makes them `readonly`, causing `TS2322`. Remove `as const` from objects passed to `animate`.

3. **`ease` string in `Variants`**: When `ease` is typed as `string`, TS rejects it in `Variants`. Cast with `"easeInOut" as const` or use the `ease` object from `lib/motion.ts` which is typed as a 4-tuple.

4. **`floatAnim` pattern**: Do NOT use a `variants` prop with keyframe arrays and string ease together — Framer Motion's `Variants` type rejects it. Instead use `animate={obj}` + `transition={obj}` as separate props.

**Why:** framer-motion v11+ uses motion-dom's stricter `Easing` union type that rejects plain `string`. The `Variants` index signature also conflicts with keyframe arrays inside variant values.

**How to apply:** Any time you write animation helpers or inline variant objects, check the three rules above before spreading them onto `motion.*` components.
