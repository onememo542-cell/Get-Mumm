---
name: Vite API Proxy Required
description: The Get Mumm frontend Vite config must proxy /api/* to the API server or data hooks silently receive HTML strings instead of JSON arrays.
---

# Vite Must Proxy /api/* to the API Server

## The Rule
`artifacts/get-mumm/vite.config.ts` must have a `server.proxy` block forwarding `/api` to `http://localhost:5000`.

**Why:** In dev mode, the browser makes relative fetches like `/api/menu/items/featured`. Without a proxy, Vite's dev server intercepts these and serves the SPA's `index.html` (SPA fallback). The `customFetch` utility sees `text/html` and returns the HTML as a string. When code does `featuredItems?.slice(0,3).map(...)`, `String.prototype.slice` returns a string (not an array), causing `TypeError: .map is not a function`. React then also throws "Invalid hook call" as a cascading error.

**How to apply:** Always check for this proxy whenever adding a new Vite artifact that consumes the shared API server.

```ts
server: {
  proxy: {
    "/api": {
      target: "http://localhost:5000",
      changeOrigin: true,
      secure: false,
    },
  },
}
```
