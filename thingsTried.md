## Attempts

1. Wrapped `streamText` with `onFinish` / `onAbort` / `onError` callbacks that resolved or rejected a shared promise, then passed that promise into `c.executionCtx.waitUntil` to keep the Worker alive while streaming and flush Sentry afterwards. Result: Cloudflare still reported the Worker as hung and cancelled the request.
2. Piped the stream through a `TransformStream` and `result.pipeTextStreamToResponse(new Response(readable))` before returning `new Response(readable, ...)`. Result: helper assumed a Node `ServerResponse` and threw `TypeError: response.writeHead is not a function`.
3. Consumed `result.textStream` manually via `ReadableStream`, closing the iterator and deferring `result.response` to `executionCtx.waitUntil`. Result: streaming worked, but the telemetry still never arrived in Sentry.
