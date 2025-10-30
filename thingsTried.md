## Attempts

1. Wrapped `streamText` with `onFinish` / `onAbort` / `onError` callbacks that resolved or rejected a shared promise, then passed that promise into `c.executionCtx.waitUntil` to keep the Worker alive while streaming and flush Sentry afterwards. Result: Cloudflare still reported the Worker as hung and cancelled the request.
