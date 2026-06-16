---
name: First-Load Optimization Patterns
description: Key patterns applied to fix the blank/blurred first-render and improve perceived performance.
---

## Patterns

### 1. AnimatePresence `initial={false}`
Without this, every `motion.div` with `variants` animates in from its `initial` state on the very first render — making the page start invisible. Add `initial={false}` to `AnimatePresence` so entry animations only play on *route changes*, not on the first load.

### 2. Avoid `filter: blur()` in page transitions
CSS blur triggers a full repaint on every animation frame and is expensive on mobile. Replace with a clean `opacity + y` fade. The visual result is equally polished and significantly faster.

### 3. Never hardcode `willChange` on the page wrapper
`style={{ willChange: "opacity, transform, filter" }}` on the outermost motion wrapper forces permanent GPU composite layers for the entire page tree. Let Framer Motion manage `will-change` internally (it adds it during animation only).

### 4. Preload critical images in `index.html`
Add `<link rel="preload" as="image" href="/koshari.png" fetchpriority="high" />` for the hero image and the first carousel image so they are fetched before the JS bundle parses.

### 5. Carousel image skeletons
Images starting at `opacity: 0` with no placeholder show blank circles until `onLoad`. Add a pulsing `div` behind each image (using a `@keyframes carousel-pulse` animation) that auto-hides when the image loads.

### 6. Google Fonts `font-display=swap`
Without `&font-display=swap` in the Google Fonts URL, the browser may block rendering while fonts download. Adding it falls back to system fonts immediately and swaps in the custom font once ready.

**Why:** All six of the above were causing a visible blank or blurred first-render in the Get Mumm app.
