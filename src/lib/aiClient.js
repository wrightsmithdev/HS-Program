import { getApiKey } from './aiSettings'

const MODEL = 'claude-haiku-4-5-20251001'
const API_URL = 'https://api.anthropic.com/v1/messages'

export class AIError extends Error {
  constructor(kind, message) {
    super(message)
    this.kind = kind // 'no_key' | 'network' | 'api'
  }
}

async function callClaude(system, userPrompt, maxTokens = 1024) {
  const apiKey = getApiKey()
  if (!apiKey) throw new AIError('no_key', 'No API key set.')

  let res
  try {
    res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: maxTokens,
        system,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    })
  } catch {
    throw new AIError('network', "Couldn't reach the AI service. Check your internet connection.")
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    let detail = text
    try {
      detail = JSON.parse(text)?.error?.message || text
    } catch {
      // keep raw text
    }
    throw new AIError('api', `AI request failed (${res.status}): ${detail?.slice?.(0, 200) ?? detail}`)
  }

  const data = await res.json()
  return data.content?.[0]?.text ?? ''
}

export async function askAI(question) {
  const system =
    "You are a friendly, knowledgeable study helper for a high school freshman-senior in a Texas Early College High School program (taking honors classes and TCC dual-credit college courses). Answer the student's question clearly and helpfully, at a level appropriate for their grade level. You can help with any subject - English, math, science, social studies, Spanish, college/career questions, or general study advice. Keep answers focused and not overly long (a few short paragraphs at most, use bullet points for steps/lists). If asked to just do their homework for them (e.g. write their essay, or give test answers with no explanation), instead help them understand and work through it themselves."
  return callClaude(system, question, 1024)
}
