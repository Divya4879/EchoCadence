import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import api from '../lib/api'
import Breadcrumbs from '../components/Breadcrumbs'

export default function Dashboard() {
  const { user, getIdTokenClaims } = useAuth0()
  const navigate = useNavigate()
  const [languages, setLanguages] = useState([])
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getIdTokenClaims().then(async claims => {
      api.defaults.headers.common['Authorization'] = `Bearer ${claims.__raw}`
      try {
        const r = await api.get('/api/languages')
        setLanguages(r.data)
      } catch (e) {
        console.error(e.response?.data || e.message)
      }
      setLoading(false)
    })
  }, [])

  async function addLanguage(e) {
    e.preventDefault()
    if (!name.trim()) return
    try {
      const { data } = await api.post('/api/languages', { name: name.trim() })
      setLanguages(prev => [...prev, data])
      setName(''); setAdding(false); setError('')
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to add language')
    }
  }

  async function deleteLanguage(id) {
    if (!confirm('Delete this language and all its data?')) return
    await api.delete(`/api/languages?id=${id}`)
    setLanguages(prev => prev.filter(l => l.id !== id))
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[calc(100vh-72px)] bg-[#f8fafc] dark:bg-[#070f1c]">
      <div className="w-7 h-7 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
    </div>
  )

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#f8fafc] dark:bg-[#070f1c] px-6 md:px-10 py-12">
      <div className="max-w-4xl mx-auto">
        <Breadcrumbs />
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-2">Your workspace</p>
            <h1 className="text-3xl font-serif font-medium text-gray-900 dark:text-white">Languages</h1>
          </div>
          <div className="flex items-center gap-3">
            {languages.length > 0 && (
              <button onClick={() => navigate('/revise')} className="px-4 py-2 rounded-lg border border-gray-200 dark:border-white/10 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                Revise cards →
              </button>
            )}
            {languages.length < 7 && (
              <button onClick={() => setAdding(true)} className="px-4 py-2 rounded-lg bg-brand-gradient text-white text-sm font-semibold hover:opacity-90 transition-opacity glow">
                + Add language
              </button>
            )}
          </div>
        </div>

        {adding && (
          <form onSubmit={addLanguage} className="mb-8 p-5 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1a2e] flex gap-3 items-center shadow-sm">
            <input
              autoFocus value={name} onChange={e => setName(e.target.value)}
              placeholder="e.g. French, Japanese, Spanish..."
              className="input-field flex-1"
            />
            <button type="submit" className="px-4 py-2 rounded-lg bg-brand-gradient text-white text-sm font-semibold hover:opacity-90">Add</button>
            <button type="button" onClick={() => { setAdding(false); setName(''); setError('') }} className="px-4 py-2 rounded-lg border border-gray-200 dark:border-white/10 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5">Cancel</button>
          </form>
        )}
        {error && <p className="text-sm text-rose-500 mb-4">{error}</p>}

        {languages.length === 0 ? (
          <div className="text-center py-24 rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
            <p className="text-4xl mb-4">🌍</p>
            <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1">No languages yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">Add your first language to start building vocabulary.</p>
            <button onClick={() => setAdding(true)} className="px-5 py-2.5 rounded-lg bg-brand-gradient text-white text-sm font-semibold hover:opacity-90 glow">
              + Add your first language
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {languages.map(l => (
              <div
                key={l.id}
                onClick={() => navigate(`/language/${l.id}`)}
                className="group relative p-6 rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#0c1a2e]/60 hover:border-sky-300 dark:hover:border-sky-700/40 hover:shadow-lg hover:shadow-sky-500/5 transition-all duration-200 cursor-pointer"
              >
                <div className="w-11 h-11 rounded-xl bg-brand-gradient flex items-center justify-center text-white font-bold text-xl mb-5 shadow-md shadow-sky-500/20">
                  {l.name[0].toUpperCase()}
                </div>
                <p className="font-semibold text-gray-900 dark:text-white text-lg">{l.name}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Open →</p>
                <button
                  onClick={e => { e.stopPropagation(); deleteLanguage(l.id) }}
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 dark:text-gray-600 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all text-sm"
                >✕</button>
              </div>
            ))}
            {languages.length < 7 && (
              <button onClick={() => setAdding(true)} className="p-6 rounded-2xl border border-dashed border-gray-200 dark:border-white/10 hover:border-sky-300 dark:hover:border-sky-700/40 transition-colors flex flex-col items-center justify-center gap-2 text-gray-400 dark:text-gray-500 hover:text-sky-500 dark:hover:text-sky-400 min-h-[140px]">
                <span className="text-2xl">+</span>
                <span className="text-sm font-medium">Add language</span>
              </button>
            )}
          </div>
        )}

        <p className="text-xs text-gray-400 dark:text-gray-600 mt-8 text-center">{languages.length}/7 languages used</p>
      </div>
    </div>
  )
}
