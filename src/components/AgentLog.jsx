import { useState } from 'react'

export default function AgentLog({ steps, isStreaming, vendorCount }) {
  const [collapsed, setCollapsed] = useState(false)

  const total = parseInt(vendorCount?.split('-')[1] || vendorCount) || 10
  const progress = Math.min(Math.round((vendorCount / total) * 100), 100)

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isStreaming && (
            <span className="w-2 h-2 bg-gray-900 rounded-full animate-pulse" />
          )}
          <span className="text-sm font-semibold text-gray-700">
            {isStreaming ? 'Agent research in progress…' : 'Research complete'}
          </span>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          {collapsed ? 'Show' : 'Hide'}
        </button>
      </div>

      {!collapsed && (
        <div className="space-y-2">
          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-gray-500">
              <span className={`mt-0.5 w-3.5 h-3.5 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-bold
                ${step.status === 'done' ? 'bg-gray-900 text-white' : step.status === 'active' ? 'border-2 border-gray-900' : 'bg-gray-200'}`}>
                {step.status === 'done' ? '✓' : ''}
              </span>
              <span className={step.status === 'active' ? 'text-gray-700 font-medium' : ''}>
                {step.message}
              </span>
            </div>
          ))}
          {isStreaming && steps.length === 0 && (
            <div className="text-xs text-gray-400 italic">Starting agent…</div>
          )}
        </div>
      )}
    </div>
  )
}
