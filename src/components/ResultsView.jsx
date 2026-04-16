import { useState } from 'react'
import { CSVLink } from 'react-csv'
import VendorCard from './VendorCard'
import AgentLog from './AgentLog'

export default function ResultsView({ searchParams, vendors, isStreaming, agentSteps, onNewSearch }) {
  const [excluded, setExcluded] = useState({}) // id -> reason

  const activeVendors = vendors.filter(v => !excluded[v.id])
  const excludedVendors = vendors.filter(v => excluded[v.id])
  const showExcluded = excludedVendors.length > 0

  const csvData = activeVendors.map((v, i) => ({
    Rank: i + 1,
    'Vendor Name': v.name,
    Company: v.company,
    Category: v.category,
    'Fit Score': v.score,
    Description: v.description,
    'Source URL': v.sourceUrl || '',
    Rationale: v.rationale || '',
    Tags: (v.tags || []).join(', '),
  }))

  const briefSummary = searchParams
    ? `${searchParams.brief.slice(0, 80)}${searchParams.brief.length > 80 ? '…' : ''}`
    : ''

  return (
    <div>
      {/* Brief summary pill */}
      {searchParams && (
        <div className="bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-xs text-gray-500 mb-6 flex flex-wrap gap-x-3 gap-y-1 items-center">
          <span><strong className="text-gray-700">Brief:</strong> {briefSummary}</span>
          <span className="text-gray-200">·</span>
          <span>
            <strong className="text-gray-700">Criteria:</strong>{' '}
            {searchParams.criteria.map(c => `${c.label} ${c.weight}%`).join(' · ')}
          </span>
        </div>
      )}

      {/* Agent log */}
      {(isStreaming || agentSteps.length > 0) && (
        <AgentLog
          steps={agentSteps}
          isStreaming={isStreaming}
          vendorCount={vendors.length}
        />
      )}

      {/* Results header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {isStreaming
              ? `${vendors.length} vendor${vendors.length !== 1 ? 's' : ''} found so far…`
              : `${vendors.length} vendor${vendors.length !== 1 ? 's' : ''} found`}
          </h2>
          {!isStreaming && vendors.length > 0 && (
            <p className="text-sm text-gray-400 mt-0.5">
              Ranked by weighted fit score
              {excludedVendors.length > 0 && ` · ${excludedVendors.length} excluded`}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!isStreaming && vendors.length > 0 && (
            <CSVLink
              data={csvData}
              filename="vendor-shortlist.csv"
              className="text-xs font-semibold text-gray-700 border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors no-underline"
            >
              ↓ Export CSV
            </CSVLink>
          )}
        </div>
      </div>

      {/* Empty state */}
      {!isStreaming && vendors.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-sm">No vendors found. Try broadening your brief or adjusting the criteria.</p>
          <button onClick={onNewSearch} className="mt-4 text-sm text-gray-600 underline">
            Start a new search
          </button>
        </div>
      )}

      {/* Vendor grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {activeVendors.map((vendor, i) => (
          <VendorCard
            key={vendor.id}
            vendor={vendor}
            rank={i + 1}
            excluded={false}
            onExclude={() => setExcluded(prev => ({ ...prev, [vendor.id]: true }))}
          />
        ))}

        {/* Ghost cards while streaming */}
        {isStreaming && (
          <>
            <VendorCard streaming />
            <VendorCard streaming />
          </>
        )}
      </div>

      {/* Excluded vendors */}
      {showExcluded && (
        <div className="mt-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Excluded ({excludedVendors.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {excludedVendors.map(vendor => (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                excluded
                onRestore={() => setExcluded(prev => {
                  const next = { ...prev }
                  delete next[vendor.id]
                  return next
                })}
              />
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      {!isStreaming && vendors.length > 0 && (
        <p className="text-xs text-gray-300 mt-8 text-center">
          AI-researched — verify vendor details before inviting to RFP.
        </p>
      )}
    </div>
  )
}
