import { useState } from 'react'

const DEFAULT_CRITERIA = [
  { id: 1, label: 'Geographic coverage', weight: 25 },
  { id: 2, label: 'Industry specialisation', weight: 20 },
  { id: 3, label: 'Company size / stability', weight: 20 },
  { id: 4, label: 'Track record / references', weight: 20 },
  { id: 5, label: 'Pricing model', weight: 15 },
]

export default function IntakeForm({ onSearch }) {
  const [brief, setBrief] = useState('')
  const [criteria, setCriteria] = useState(DEFAULT_CRITERIA)
  const [vendorCount, setVendorCount] = useState('8-10')
  const [newCriterion, setNewCriterion] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0)

  function removeCriterion(id) {
    const removed = criteria.find(c => c.id === id)
    const remaining = criteria.filter(c => c.id !== id)
    // redistribute the removed weight evenly
    if (remaining.length > 0) {
      const extra = Math.floor(removed.weight / remaining.length)
      const updated = remaining.map((c, i) => ({
        ...c,
        weight: i === 0 ? c.weight + removed.weight - extra * (remaining.length - 1) : c.weight + extra,
      }))
      setCriteria(updated)
    } else {
      setCriteria([])
    }
  }

  function updateWeight(id, value) {
    const num = parseInt(value) || 0
    setCriteria(prev => prev.map(c => c.id === id ? { ...c, weight: num } : c))
  }

  function addCriterion() {
    if (!newCriterion.trim()) return
    const id = Date.now()
    setCriteria(prev => [...prev, { id, label: newCriterion.trim(), weight: 0 }])
    setNewCriterion('')
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!brief.trim()) {
      setError('Please enter a sourcing brief.')
      return
    }
    if (criteria.length === 0) {
      setError('Please add at least one scoring criterion.')
      return
    }
    if (totalWeight !== 100) {
      setError(`Criteria weights must sum to 100%. Currently: ${totalWeight}%.`)
      return
    }
    setError('')
    onSearch({ brief: brief.trim(), criteria, vendorCount })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Find vendors for your RFP</h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          Describe your sourcing need in plain language. The AI agent will search the web,
          identify vendors, and return a scored shortlist in under 5 minutes.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sourcing Brief */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
            Sourcing Brief
          </label>
          <p className="text-xs text-gray-400 mb-2">
            Describe what you're sourcing, the category, geography, and any key requirements.
          </p>
          <textarea
            value={brief}
            onChange={e => setBrief(e.target.value)}
            rows={4}
            placeholder='e.g. "Cloud ERP software vendor for a mid-size manufacturing company in Southeast Asia, budget ~$500K. Must have local implementation support."'
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none bg-white"
          />
        </div>

        {/* Scoring Criteria */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
            Scoring Criteria
          </label>
          <p className="text-xs text-gray-400 mb-3">
            Weights must sum to 100%. Click a weight to edit it.
          </p>

          <div className="flex flex-wrap gap-2 mb-3">
            {criteria.map(c => (
              <div
                key={c.id}
                className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1.5 text-sm"
              >
                <span className="text-gray-700">{c.label}</span>
                {editingId === c.id ? (
                  <input
                    autoFocus
                    type="number"
                    value={c.weight}
                    onChange={e => updateWeight(c.id, e.target.value)}
                    onBlur={() => setEditingId(null)}
                    onKeyDown={e => e.key === 'Enter' && setEditingId(null)}
                    className="w-10 text-center text-xs border border-gray-300 rounded px-1 py-0.5"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setEditingId(c.id)}
                    className="text-xs text-gray-400 hover:text-gray-700 font-medium"
                  >
                    {c.weight}%
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeCriterion(c.id)}
                  className="text-gray-300 hover:text-gray-500 text-xs leading-none"
                >
                  ×
                </button>
              </div>
            ))}

            {/* Add new criterion */}
            <div className="flex items-center gap-1 bg-white border border-dashed border-gray-300 rounded-full px-3 py-1.5">
              <input
                type="text"
                value={newCriterion}
                onChange={e => setNewCriterion(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCriterion())}
                placeholder="+ Add criterion"
                className="text-sm text-gray-500 placeholder-gray-300 bg-transparent outline-none w-28"
              />
              {newCriterion && (
                <button type="button" onClick={addCriterion} className="text-xs text-gray-400 hover:text-gray-700">
                  ↵
                </button>
              )}
            </div>
          </div>

          {/* Weight total indicator */}
          <div className={`text-xs font-medium ${totalWeight === 100 ? 'text-green-600' : 'text-amber-600'}`}>
            Total: {totalWeight}% {totalWeight === 100 ? '✓' : `— need ${100 - totalWeight > 0 ? '+' : ''}${100 - totalWeight}% more`}
          </div>
        </div>

        {/* Vendor count */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
            Number of vendors to find
          </label>
          <select
            value={vendorCount}
            onChange={e => setVendorCount(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            <option value="8-10">8–10 vendors (recommended)</option>
            <option value="5-7">5–7 vendors</option>
            <option value="12-15">12–15 vendors</option>
          </select>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-gray-900 text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Find vendors →
          </button>
        </div>
      </form>
    </div>
  )
}
