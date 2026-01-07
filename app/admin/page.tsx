import React from 'react'
import { ACTIVE_NODE_USERS, EXIT_TRACKING, getDropOffRate } from '@/lib/admin-analytics'
import { ACTIVE_MEMES } from '@/lib/character-complex' // Assuming we export this to visualize D-018

export const dynamic = 'force-dynamic'

export default function AdminDashboard() {
  // Convert Maps to Arrays for rendering
  const activeUsers = Array.from(ACTIVE_NODE_USERS.entries()).map(([nodeId, users]) => ({
    nodeId,
    count: users.size,
    userIds: Array.from(users).slice(0, 5) // Show first 5 user IDs
  }))

  const dropOffs = Array.from(EXIT_TRACKING.entries()).map(([nodeId, data]) => ({
    nodeId,
    visits: data.visits,
    exits: data.exits,
    rate: getDropOffRate(nodeId)
  })).sort((a, b) => b.rate - a.rate) // Sort by highest drop-off

  const memes = Array.from(ACTIVE_MEMES.values())

  return (
    <div className="p-8 bg-slate-950 min-h-screen text-slate-200 font-mono">
      <h1 className="text-3xl mb-8 font-bold text-amber-500">Lux Story Admin</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* D-011: Real-Time Flow */}
        <section className="border border-slate-800 p-6 rounded-lg bg-slate-900/50">
          <h2 className="text-xl mb-4 text-emerald-400 flex justify-between">
            <span>Real-Time Flow (D-011)</span>
            <span className="text-sm bg-emerald-900/50 px-2 py-1 rounded">
              {activeUsers.reduce((acc, curr) => acc + curr.count, 0)} Active Users
            </span>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-slate-800 text-slate-400">
                <tr>
                  <th className="px-4 py-2">Node ID</th>
                  <th className="px-4 py-2">Active</th>
                  <th className="px-4 py-2">Sample Users</th>
                </tr>
              </thead>
              <tbody>
                {activeUsers.length === 0 ? (
                  <tr><td colSpan={3} className="px-4 py-4 text-center text-slate-500">No active users currently.</td></tr>
                ) : (
                  activeUsers.map((stat) => (
                    <tr key={stat.nodeId} className="border-b border-slate-800 hover:bg-slate-800/30">
                      <td className="px-4 py-2 font-mono text-emerald-300">{stat.nodeId}</td>
                      <td className="px-4 py-2">{stat.count}</td>
                      <td className="px-4 py-2 text-xs text-slate-500">{stat.userIds.join(', ')}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* D-012: Drop-off Heatmap */}
        <section className="border border-slate-800 p-6 rounded-lg bg-slate-900/50">
          <h2 className="text-xl mb-4 text-rose-400">Drop-off Heatmap (D-012)</h2>
          <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-slate-800 text-slate-400 sticky top-0">
                <tr>
                  <th className="px-4 py-2">Node ID</th>
                  <th className="px-4 py-2">Visits</th>
                  <th className="px-4 py-2">Exits</th>
                  <th className="px-4 py-2">Rate</th>
                </tr>
              </thead>
              <tbody>
                {dropOffs.length === 0 ? (
                  <tr><td colSpan={4} className="px-4 py-4 text-center text-slate-500">No traffic recorded yet.</td></tr>
                ) : (
                  dropOffs.map((stat) => (
                    <tr key={stat.nodeId} className="border-b border-slate-800 hover:bg-slate-800/30">
                      <td className="px-4 py-2 font-mono">{stat.nodeId}</td>
                      <td className="px-4 py-2">{stat.visits}</td>
                      <td className="px-4 py-2">{stat.exits}</td>
                      <td className={`px-4 py-2 font-bold ${stat.rate > 0.5 ? 'text-rose-500' : 'text-slate-400'}`}>
                        {(stat.rate * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* D-018: Active Memes */}
        <section className="border border-slate-800 p-6 rounded-lg bg-slate-900/50 md:col-span-2">
          <h2 className="text-xl mb-4 text-violet-400">Viral Memes (D-018)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {memes.length === 0 ? (
              <div className="col-span-3 text-center text-slate-500 py-4">No active memes circulating.</div>
            ) : (
              memes.map(meme => (
                <div key={meme.id} className="bg-slate-800/40 p-4 rounded border border-slate-700">
                  <h3 className="font-bold text-violet-300">{meme.name}</h3>
                  <div className="text-xs text-slate-400 mt-1">Origin: {meme.originCharacterId}</div>
                  <div className="mt-2 flex justify-between items-end">
                    <span className="text-xs uppercase tracking-wider text-slate-500">Potency</span>
                    <span className="text-lg font-mono text-violet-200">{(meme.potency * 100).toFixed(0)}%</span>
                  </div>
                  <div className="mt-2 text-xs text-slate-400">
                    {meme.infectedCharacters.size} Carriers
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
