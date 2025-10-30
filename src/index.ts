import { Hono } from 'hono'
import { generateText, streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import * as Sentry from "@sentry/cloudflare";

interface CloudflareBindings {
  OPENAI_API_KEY?: string
  SENTRY_DSN?: string
}

// Type the Hono app with the Cloudflare Bindings interface so c.env is typed.
const app = new Hono<{ Bindings: CloudflareBindings }>()

app.get('/generate', async (c) => {
  const apiKey = c.env.OPENAI_API_KEY
  const gpt4omini = createOpenAI({
    apiKey: apiKey,
  })
  const now = new Date()
  const pst = now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })
  const results = await generateText({
    model: gpt4omini('gpt-4o-mini'),
    prompt: `Write a short poem about the sea. ${pst}`,
    experimental_telemetry: {
      isEnabled: true,
      recordInputs: true,
      recordOutputs: true,
    }
  })
  return c.text(results.text)
})

app.post('/stream', async (c) => {
  const apiKey = c.env.OPENAI_API_KEY
  const gpt4omini = createOpenAI({
    apiKey: apiKey,
  })
  const now = new Date()
  const pst = now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })
  const result = streamText({
    model: gpt4omini('gpt-4o-mini'),
    prompt: `Write a short poem about the mountains. ${pst}`,
    experimental_telemetry: {
      isEnabled: true,
      recordInputs: true,
      recordOutputs: true,
    }
  })
  return result.toTextStreamResponse();
})

export default Sentry.withSentry(
  (env: CloudflareBindings) => {
    const dsn = env.SENTRY_DSN

    if (!dsn) {
      throw new Error('Sentry DSN is not set; define the SENTRY_DSN binding to enable telemetry.')
    }

    return {
      dsn,
      tracesSampleRate: 1.0,
      integrations: [Sentry.vercelAIIntegration()],
    }
  },
  app
)
