import { Hono } from 'hono'
import { generateText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'

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
  const results = await generateText({
    model: gpt4omini('gpt-4o-mini'),
    prompt: 'Write a short poem about the sea.',
  })
  return c.text(results.text)
})


export default app
