import Anthropic from '@anthropic-ai/sdk'

// Node.js runtime (default) — reliably reads .env.local in vercel dev

function buildSystemPrompt(criteria, vendorCount) {
  const criteriaText = criteria.map(c => `  - ${c.label} (${c.weight}%)`).join('\n')
  return `You are an expert procurement research assistant who finds vendors for RFP sourcing.

Your task:
1. Run ${Math.ceil(vendorCount / 2)} targeted web searches to identify ${vendorCount} relevant vendors
2. For each vendor found, research their profile and score them against the criteria
3. Output each vendor as a JSON block as soon as you've researched it — do not wait until the end

Scoring criteria (weights sum to 100%):
${criteriaText}

OUTPUT FORMAT — for each vendor, output exactly this block on its own lines:
[VENDOR_START]
{"id":"v1","name":"Vendor Name","company":"Company Inc","category":"Category","score":82,"description":"2-3 sentence description of what they do and why they fit the brief","rationale":"Specific reasoning referencing the criteria weights","tags":["Tag1","Tag2","Tag3"],"sourceUrl":"https://actual-url-you-found"}
[VENDOR_END]

Rules:
- Output each [VENDOR_START]...[VENDOR_END] block as you research each vendor, not all at once at the end
- Score honestly on a 0-100 scale — not every vendor should score above 80
- sourceUrl must be a real URL you found via web search, not a guessed URL
- Keep descriptions factual and based on search results
- Find exactly ${vendorCount} vendors`
}

function buildUserPrompt(brief, vendorCount) {
  return `Sourcing brief: ${brief}

Please find ${vendorCount} vendors. Run searches, research each one, and output each vendor block as you finish researching it.`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end('Method not allowed')
    return
  }

  const body = req.body
  const { brief, criteria, vendorCount: vendorCountStr } = body || {}
  if (!brief || !criteria?.length) {
    res.status(400).end('Missing brief or criteria')
    return
  }

  const vendorCount = vendorCountStr === '5-7' ? 6 : vendorCountStr === '12-15' ? 12 : 9

  const apiKey = process.env.ANTHROPIC_API_KEY
  console.log('[search] apiKey present:', !!apiKey, 'length:', apiKey?.length)

  const client = new Anthropic({ apiKey })

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('Access-Control-Allow-Origin', '*')

  const write = (data) => res.write(`data: ${JSON.stringify(data)}\n\n`)

  try {
    console.log('[search] brief:', brief.slice(0, 80))
    console.log('[search] vendorCount:', vendorCount)
    write({ type: 'step', status: 'active', message: 'Analysing sourcing brief…' })

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 16000,
      system: buildSystemPrompt(criteria, vendorCount),
      messages: [{ role: 'user', content: buildUserPrompt(brief, vendorCount) }],
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      stream: true,
    })

    let textBuffer = ''
    let searchCount = 0
    let vendorsFound = 0
    let inputBuffer = ''
    let currentToolName = null

    for await (const event of response) {
      console.log('[event]', event.type, event.content_block?.type || event.delta?.type || '')

      if (event.type === 'content_block_start' && event.content_block?.type === 'tool_use') {
        currentToolName = event.content_block.name
        inputBuffer = ''
        if (currentToolName === 'web_search') {
          searchCount++
          console.log('[search] web_search started #', searchCount)
        }
      }

      if (event.type === 'content_block_delta' && event.delta?.type === 'input_json_delta') {
        inputBuffer += event.delta.partial_json || ''
      }

      if (event.type === 'content_block_stop' && currentToolName === 'web_search') {
        let query = `search ${searchCount}`
        try {
          const parsed = JSON.parse(inputBuffer)
          if (parsed.query) query = parsed.query
        } catch {}
        console.log('[search] web_search query:', query)
        write({ type: 'step', status: 'done', message: `Searching: "${query}"` })
        currentToolName = null
        inputBuffer = ''
      }

      if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
        textBuffer += event.delta.text

        let startIdx
        while ((startIdx = textBuffer.indexOf('[VENDOR_START]')) !== -1) {
          const endIdx = textBuffer.indexOf('[VENDOR_END]', startIdx)
          if (endIdx === -1) break

          const block = textBuffer.slice(startIdx + 14, endIdx).trim()
          textBuffer = textBuffer.slice(endIdx + 12)

          try {
            const vendor = JSON.parse(block)
            if (!vendor.id) vendor.id = `v-${Date.now()}-${Math.random().toString(36).slice(2)}`
            vendorsFound++
            console.log('[search] vendor parsed:', vendor.name, '(total:', vendorsFound, ')')
            write({ type: 'vendor', vendor })
          } catch (parseErr) {
            console.log('[search] vendor parse error:', parseErr.message, 'block:', block.slice(0, 100))
          }
        }
      }
    }

    // Parse any remaining complete vendor blocks
    let startIdx
    while ((startIdx = textBuffer.indexOf('[VENDOR_START]')) !== -1) {
      const endIdx = textBuffer.indexOf('[VENDOR_END]', startIdx)
      if (endIdx === -1) break
      const block = textBuffer.slice(startIdx + 14, endIdx).trim()
      textBuffer = textBuffer.slice(endIdx + 12)
      try {
        const vendor = JSON.parse(block)
        if (!vendor.id) vendor.id = `v-${Date.now()}-${Math.random().toString(36).slice(2)}`
        write({ type: 'vendor', vendor })
      } catch {}
    }

    // Log token usage from the final message_delta event
    try {
      const finalUsage = response?.finalMessage?.usage
      if (finalUsage) {
        console.log('[search] tokens — input:', finalUsage.input_tokens, 'output:', finalUsage.output_tokens, 'total:', finalUsage.input_tokens + finalUsage.output_tokens)
      }
    } catch {}

    console.log('[search] done. vendors found:', vendorsFound)
    write({ type: 'step', status: 'done', message: 'Research complete' })
    res.write('data: [DONE]\n\n')
  } catch (err) {
    console.error('[search] error:', err.message)
    write({ type: 'error', message: err.message || 'Search failed' })
  } finally {
    res.end()
  }
}
