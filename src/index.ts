import { Hono } from 'hono'
import { generateText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import * as Sentry from "@sentry/cloudflare";

interface CloudflareBindings {
  OPENAI_API_KEY?: string
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


export default Sentry.withSentry(
  () => {
    return {
      dsn: 'https://11ddea14960f3dc9e2567e07751988b7@o4510053563891712.ingest.us.sentry.io/4510229366833152',
      tracesSampleRate: 1.0,
      integrations: [Sentry.vercelAIIntegration()],
    }
  },
  app
)
