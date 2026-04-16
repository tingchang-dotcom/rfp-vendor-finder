import { useState } from 'react'
import IntakeForm from './components/IntakeForm'
import ResultsView from './components/ResultsView'

export default function App() {
  const [view, setView] = useState('intake') // 'intake' | 'results'
  const [searchParams, setSearchParams] = useState(null)
  const [vendors, setVendors] = useState([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [agentSteps, setAgentSteps] = useState([])

  function handleSearch(params) {
    setSearchParams(params)
    setVendors([])
    setAgentSteps([])
    setView('results')
    runSearch(params)
  }

  function handleNewSearch() {
    setView('intake')
    setSearchParams(null)
    setVendors([])
    setAgentSteps([])
    setIsStreaming(false)
  }

  async function runSearch(params) {
    setIsStreaming(true)
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      })

      if (!response.ok) throw new Error('Search failed')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop()

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6).trim()
          if (data === '[DONE]') continue
          try {
            const event = JSON.parse(data)
            if (event.type === 'step') {
              setAgentSteps(prev => [...prev, event])
            } else if (event.type === 'vendor') {
              setVendors(prev => [...prev, event.vendor])
            }
          } catch {}
        }
      }
    } catch (err) {
      console.error('Search error:', err)
    } finally {
      setIsStreaming(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gray-900 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">V</span>
            </div>
            <span className="font-semibold text-gray-900 text-sm">RFP Vendor Finder</span>
          </div>
          {view === 'results' && (
            <button
              onClick={handleNewSearch}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              ← New search
            </button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {view === 'intake' ? (
          <IntakeForm onSearch={handleSearch} />
        ) : (
          <ResultsView
            searchParams={searchParams}
            vendors={vendors}
            isStreaming={isStreaming}
            agentSteps={agentSteps}
            onNewSearch={handleNewSearch}
          />
        )}
      </main>
    </div>
  )
}
