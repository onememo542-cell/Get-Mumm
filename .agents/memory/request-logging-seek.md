---
name: RequestLoggingMiddleware MemoryStream seek fix
description: The middleware swaps Response.Body with a MemoryStream; forgetting Seek(0,Begin) before CopyToAsync means all API responses have empty bodies.
---

The `RequestLoggingMiddleware` captures the response body by swapping `context.Response.Body` with a `MemoryStream`. After the inner pipeline writes the body, the stream position is at the end. Calling `CopyToAsync(originalBodyStream)` without seeking to position 0 first copies 0 bytes — the client receives the correct HTTP status code but an empty body.

**Fix applied (line ~86 of RequestLoggingMiddleware.cs):**
```csharp
responseBodyStream.Seek(0, SeekOrigin.Begin);
await responseBodyStream.CopyToAsync(originalBodyStream);
```

**Why:** MemoryStream is both readable and writable; position advances on every write. `CopyToAsync` reads from the current position to the end, which is nothing after a write.

**How to apply:** Any middleware that wraps `Response.Body` with a `MemoryStream` must seek to 0 before copying back to the original stream. Also: `SendFileAsync` bypasses this stream swap (it uses `ISendFileFeature`), so static file responses or any `SendFileAsync` call must run BEFORE this middleware in the pipeline.
