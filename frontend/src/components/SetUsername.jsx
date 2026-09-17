import { useState } from 'react'
import api from '../lib/api'

export default function SetUsername({ onDone }) {
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    const val = username.trim()
    if (!val) return
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(val)) {
      setError('3–20 characters, letters, numbers and underscores only')
      return
    }
    setLoading(true)
    try {
      const { data } = await api.post('/api/users/sync', { username: val })
      onDone(data)
    } catch (e) {
      setError(e.response?.data?.error || 'Something went wrong')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#070f1c] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src="/favicon.svg" width={56} height={56} alt="" className="mx-auto mb-4" />
          <h1 className="text-2xl font-serif font-medium text-gray-900 dark:text-white mb-2">Pick a username</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">This is how you'll appear on EchoCadence.</p>
        </div>
        <form onSubmit={submit} className="p-6 rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#0c1a2e] space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Username</label>
            <input
              autoFocus
              value={username}
              onChange={e => { setUsername(e.target.value); setError('') }}
              placeholder="e.g. divya_learns"
              className="input-field"
              maxLength={20}
            />
            {error && <p className="text-xs text-rose-500 mt-1.5">{error}</p>}
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">Letters, numbers, underscores. 3–20 characters.</p>
          </div>
          <button type="submit" disabled={loading || !username.trim()}
            className="w-full py-3 rounded-xl font-semibold bg-brand-gradient text-white hover:opacity-90 glow disabled:opacity-40 disabled:cursor-not-allowed transition-opacity">
            {loading ? 'Saving...' : 'Continue →'}
          </button>
        </form>
      </div>
    </div>
  )
}
