# Sentry AI

A CloudFlare Worker project integrating Sentry error monitoring with the Vercel AI SDK, built using Hono for routing and handling requests.

## Overview

This project demonstrates how to set up a CloudFlare Worker that uses the Vercel AI SDK to generate text via OpenAI's GPT models, while integrating Sentry for error tracking and monitoring. It leverages Hono for a lightweight, fast web framework tailored for edge runtimes.

Key features:
- Text generation using OpenAI's GPT-4o-mini model
- Error monitoring with Sentry
- Environment variable management via `.dev.vars`
- Type-safe bindings with CloudFlare Workers

## Prerequisites

- Node.js (version 18 or later)
- pnpm (package manager)
- A CloudFlare account with Wrangler CLI installed
- OpenAI API key
- Sentry DSN (for error monitoring)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd sentry-ai
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

## Environment Setup

Create a `.dev.vars` file in the project root for local development environment variables:

```bash
cp ./dev.vars.example ./dev.vars
#Edit the .dev.vars with the values below
OPENAI_API_KEY=your-openai-api-key-here
SENTRY_DSN=http://sentry.dsn...
```

## Development

1. Start the development server:
   ```bash
   pnpm dev
   ```

   This will start the Wrangler dev server, typically on `http://127.0.0.1:8787`.

2. Test the endpoints:

   - Generate text:
     ```bash
     curl -i http://127.0.0.1:8787/generate
     ```

  - Stream text:
    ```bash
    curl -N -X POST http://127.0.0.1:8787/stream
    ```

## Deployment

Deploy to CloudFlare Workers:

```bash
pnpm deploy
```

This will build and deploy your Worker to production.

## Type Generation

To generate TypeScript types based on your Worker configuration:

```bash
pnpm run cf-typegen
```

This creates type definitions for your CloudFlare bindings.

## Configuration

The Worker is configured in `wrangler.jsonc` with Node.js compatibility enabled for broader package support.

## Usage

The main endpoint `/generate` uses the Vercel AI SDK to generate a short poem about the sea. Sentry is integrated for error tracking.

Example request:
```bash
curl http://127.0.0.1:8787/generate
```

Response:
```
HTTP/1.1 200 OK
Content-Type: text/plain;charset=UTF-8

[Generated poem text]
```

## Notes

- The project uses `nodejs_compat` in `wrangler.jsonc` to enable Node.js-compatible APIs in the Worker runtime.
- Ensure your Sentry DSN is correctly configured for CloudFlare Workers.
- For production deployments, use Wrangler secrets instead of `.dev.vars`.

