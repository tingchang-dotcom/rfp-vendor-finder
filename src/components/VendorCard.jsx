import { useState } from 'react'

export default function VendorCard({ vendor, rank, excluded, onExclude, onRestore, streaming = false }) {
  const [expanded, setExpanded] = useState(false)

  if (streaming) {
    return (
      <div className="bg-white border border-dashed border-gray-200 rounded-xl p-5 animate-pulse">
        <div className="h-4 bg-gray-100 rounded w-1/2 mb-2" />
        <div className="h-3 bg-gray-100 rounded w-1/3 mb-4" />
        <div className="h-3 bg-gray-100 rounded w-full mb-1" />
        <div className="h-3 bg-gray-100 rounded w-3/4" />
      </div>
    )
  }

  if (excluded) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-5 opacity-50">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-300 mb-1">Excluded</p>
            <h3 className="text-sm font-semibold text-gray-400">{vendor.name}</h3>
            <p className="text-xs text-gray-300 mt-0.5">{vendor.company}</p>
          </div>
          <button
            onClick={onRestore}
            className="text-xs text-gray-400 hover:text-gray-700 border border-gray-200 rounded px-2 py-1 transition-colors"
          >
            Restore
          </button>
        </div>
        {vendor.excludeReason && (
          <p className="text-xs text-gray-300 mt-2 italic">{vendor.excludeReason}</p>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            {rank && (
              <span className="text-xs text-gray-400 font-medium">#{rank}</span>
            )}
            <h3 className="text-sm font-semibold text-gray-900 truncate">{vendor.name}</h3>
          </div>
          <p className="text-xs text-gray-400">{vendor.company} · {vendor.category}</p>
        </div>
        <div className="ml-3 flex-shrink-0">
          <div className="border border-gray-900 rounded px-2 py-0.5 text-xs font-bold text-gray-900">
            {vendor.score} / 100
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed mb-3">{vendor.description}</p>

      {vendor.tags && vendor.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {vendor.tags.map((tag, i) => (
            <span key={i} className="text-xs bg-gray-50 border border-gray-100 text-gray-500 rounded px-2 py-0.5">
              {tag}
            </span>
          ))}
        </div>
      )}

      {vendor.sourceUrl && (
        <a
          href={vendor.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-400 hover:text-gray-700 underline block mb-3 truncate"
        >
          {vendor.sourceUrl}
        </a>
      )}

      {vendor.rationale && (
        <div className="mt-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
          >
            {expanded ? '▲ Hide rationale' : '▼ Why included'}
          </button>
          {expanded && (
            <p className="text-xs text-gray-500 mt-2 bg-gray-50 rounded p-2.5 leading-relaxed border-l-2 border-gray-200">
              {vendor.rationale}
            </p>
          )}
        </div>
      )}

      <div className="flex gap-2 mt-3 pt-3 border-t border-gray-50">
        <button
          onClick={onExclude}
          className="text-xs text-gray-400 hover:text-gray-600 border border-gray-200 rounded px-2.5 py-1 transition-colors"
        >
          Exclude
        </button>
      </div>
    </div>
  )
}
