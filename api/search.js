import Anthropic from '@anthropic-ai/sdk'

export const config = { runtime: 'edge' }

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function sseEvent(data) {
  return `data: ${JSON.stringify(data)}\n\n`
}

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  let body
  try {
    body = await req.json()
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  const { brief, criteria, vendorCount } = body
  if (!brief || !criteria?.length) {
    return new Response('Missing brief or criteria', { status: 400 })
  }

  const criteriaText = criteria
    .map(c => `- ${c.label} (weight: ${c.weight}%)`)
    .join('\n')

  const systemPrompt = `You are an expert procurement research assistant. Your job is to find vendors for an RFP sourcing brief.

When given a sourcing brief and scoring criteria, you will:
1. Run targeted web searches to identify relevant vendors
2. Research each vendor's profile, capabilities, and fit
3. Score each vendor 0-100 against the provided criteria
4. Return structured results as you find them

For each vendor you find, output a JSON object on a single line starting with VENDOR: like this:
VENDOR: {"id":"unique-id","name":"Vendor Name","company":"Company Name","category":"Category","score":85,"description":"2-3 sentence description of the vendor and why they fit","rationale":"Specific reasoning for this fit score referencing the criteria","tags":["Tag 1","Tag 2"],"sourceUrl":"https://example.com"}

Also output progress steps starting with STEP: like this:
STEP: {"status":"done","message":"Running search: cloud ERP Southeast Asia"}
STEP: {"status":"active","message":"Researching vendor profiles..."}

Rules:
- Find ${vendorCount || '8-10'} vendors
- Score honestly — not every vendor should score 80+
- Always include a real source URL you found during research
- Keep descriptions factual and based on what you found
- The disclaimer "verify before inviting to RFP" is already shown in the UI — no need to repeat it`

  const userPrompt = `Sourcing brief: ${brief}

Scoring criteria:
${criteriaText}

Please research and find ${vendorCount || '8-10'} vendors. Output each vendor as you find them.`

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Step 1: announce start
        controller.enqueue(encoder.encode(sseEvent({
          type: 'step',
          status: 'active',
          message: `Analysing sourcing brief and preparing searches…`,
        })))

        const response = await client.messages.create({
          model: 'claude-sonnet-4-6',
          max_tokens: 8192,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }],
          tools: [{
            type: 'web_search_20250305',
            name: 'web_search',
          }],
          stream: true,
        })

        let fullText = ''
        let vendorCount = 0

        for await (const event of response) {
          if (event.type === 'content_block_delta') {
            if (event.delta.type === 'text_delta') {
              fullText += event.delta.text

              // Parse complete lines for VENDOR: and STEP: markers
              const lines = fullText.split('\n')
              // Keep last incomplete line in buffer
              fullText = lines.pop()

              for (const line of lines) {
                const trimmed = line.trim()
                if (trimmed.startsWith('VENDOR:')) {
                  try {
                    const vendor = JSON.parse(trimmed.slice(7).trim())
                    vendorCount++
                    vendor.id = vendor.id || `vendor-${vendorCount}`
                    controller.enqueue(encoder.encode(sseEvent({ type: 'vendor', vendor })))
                  } catch {}
                } else if (trimmed.startsWith('STEP:')) {
                  try {
                    const step = JSON.parse(trimmed.slice(5).trim())
                    controller.enqueue(encoder.encode(sseEvent({ type: 'step', ...step })))
                  } catch {}
                }
              }
            }
          } else if (event.type === 'tool_use' || event.type === 'content_block_start') {
            if (event.content_block?.type === 'tool_use') {
              const query = event.content_block.input?.query || 'web search'
              controller.enqueue(encoder.encode(sseEvent({
                type: 'step',
                status: 'done',
                message: `Running search: "${query}"`,
              })))
            }
          }
        }

        // Parse any remaining buffered text
        if (fullText.trim().startsWith('VENDOR:')) {
          try {
            const vendor = JSON.parse(fullText.trim().slice(7).trim())
            vendorCount++
            vendor.id = vendor.id || `vendor-${vendorCount}`
            controller.enqueue(encoder.encode(sseEvent({ type: 'vendor', vendor })))
          } catch {}
        }

        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
      } catch (err) {
        controller.enqueue(encoder.encode(sseEvent({
          type: 'error',
          message: err.message || 'Search failed',
        })))
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
