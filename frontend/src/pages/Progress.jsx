import { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import api from '../lib/api'
import Breadcrumbs from '../components/Breadcrumbs'

const DIFF = {
  easy:   { bg: 'bg-teal-100 dark:bg-teal-900/30', text: 'text-teal-800 dark:text-teal-200', dot: 'bg-teal-500' },
  medium: { bg: 'bg-sky-100 dark:bg-sky-900/30',   text: 'text-sky-800 dark:text-sky-200',   dot: 'bg-sky-500'  },
  hard:   { bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-800 dark:text-rose-200', dot: 'bg-rose-500' },
  unseen: { bg: 'bg-gray-100 dark:bg-white/5',     text: 'text-gray-700 dark:text-gray-300', dot: 'bg-gray-400' },
}

function nextReviewLabel(nextReview) {
  if (!nextReview) return null
  const diff = new Date(nextReview) - Date.now()
  const hours = Math.round(diff / 3600000)
  const days = Math.round(diff / 86400000)
  if (diff < 0) return 'Due now'
  if (hours < 24) return `In ${hours}h`
  if (days === 1) return 'Tomorrow'
  if (days < 7) return `In ${days} days`
  if (days < 31) return `In ${Math.round(days / 7)}w`
  return `In ${Math.round(days / 30)}mo`
}

const DEFAULT_SR = { same_day_hours: 4, end_of_day_hours: 12, week_days: 7, month_days: 30 }

export default function Progress() {
  const { getIdTokenClaims } = useAuth0()
  const [languages, setLanguages] = useState([])
  const [selectedLang, setSelectedLang] = useState(null)
  const [cards, setCards] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(false)
  const [sr, setSr] = useState(DEFAULT_SR)
  const [editSr, setEditSr] = useState(false)
  const [srDraft, setSrDraft] = useState(DEFAULT_SR)
  const [weekStats, setWeekStats] = useState(null)

  useEffect(() => {
    getIdTokenClaims().then(claims => {
      api.defaults.headers.common['Authorization'] = `Bearer ${claims.__raw}`
      api.get('/api/languages').then(r => {
        setLanguages(r.data)
        if (r.data.length) setSelectedLang(r.data[0].id)
      })
      api.get('/api/cards?stats=true').then(r => setWeekStats(r.data))
    })
  }, [])

  useEffect(() => {
    if (!selectedLang) return
    setLoading(true)
    api.get(`/api/cards?languageId=${selectedLang}&limit=200&all=true`).then(r => {
      setCards(r.data.cards || r.data)
      if (r.data.settings) { setSr(r.data.settings); setSrDraft(r.data.settings) }
      setLoading(false)
    })
  }, [selectedLang])

  async function saveSr() {
    await api.patch('/api/cards', srDraft)
    setSr(srDraft); setEditSr(false)
  }

  const attempted = cards.filter(c => parseInt(c.review_count) > 0 || parseInt(c.first_attempt_correct) > 0)
  const counts = {
    all:    attempted.length,
    easy:   attempted.filter(c => c.difficulty === 'easy').length,
    medium: attempted.filter(c => c.difficulty === 'medium').length,
    hard:   attempted.filter(c => c.difficulty === 'hard').length,
    unseen: attempted.filter(c => !c.difficulty).length,
  }
  const firstAttemptCount = attempted.filter(c => parseInt(c.first_attempt_correct) > 0).length

  const filtered = filter === 'all' ? attempted
    : filter === 'unseen' ? attempted.filter(c => !c.difficulty)
    : attempted.filter(c => c.difficulty === filter)

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#f8fafc] dark:bg-[#070f1c] px-6 md:px-10 py-12">
      <div className="max-w-4xl mx-auto">
        <Breadcrumbs />
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-2">Your stats</p>
            <h1 className="text-3xl font-serif font-medium text-gray-900 dark:text-white">Progress</h1>
          </div>
          {languages.length > 1 && (
            <div className="flex gap-2">
              {languages.map(l => (
                <button key={l.id} onClick={() => setSelectedLang(l.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${selectedLang === l.id ? 'bg-sky-100 dark:bg-sky-900/30 text-sky-900 dark:text-sky-100' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/8'}`}>
                  {l.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Weekly summary */}
        {weekStats && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { value: weekStats.learned_this_week, label: 'Learned this week' },
              { value: weekStats.reviews_this_week, label: 'Reviews this week' },
              { value: `${weekStats.total_learned} / ${weekStats.total_cards}`, label: 'Total mastered' },
            ].map(({ value, label }) => (
              <div key={label} className="p-4 rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#0c1a2e]/60 text-center">
                <p className="text-2xl font-bold gradient-text">{value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* First-attempt highlight */}
        {firstAttemptCount > 0 && (
          <div className="mb-6 p-4 rounded-2xl bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700/40">
            <p className="text-sm font-semibold text-teal-800 dark:text-teal-200">
              ✦ You nailed {firstAttemptCount} card{firstAttemptCount !== 1 ? 's' : ''} on the first try - those are locked in.
            </p>
          </div>
        )}

        {/* Summary tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { key: 'easy', label: 'Easy' },
            { key: 'medium', label: 'Medium' },
            { key: 'hard', label: 'Hard' },
            { key: 'unseen', label: 'Not rated' },
          ].map(({ key, label }) => (
            <button key={key} onClick={() => setFilter(filter === key ? 'all' : key)}
              className={`p-4 rounded-2xl border text-left transition-all ${filter === key ? `${DIFF[key].bg} border-transparent` : 'border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#0c1a2e]/60 hover:border-gray-300 dark:hover:border-white/15'}`}>
              <div className={`w-2 h-2 rounded-full ${DIFF[key].dot} mb-3`} />
              <p className={`text-2xl font-bold ${filter === key ? DIFF[key].text : 'text-gray-900 dark:text-white'}`}>{counts[key]}</p>
              <p className={`text-xs font-semibold mt-0.5 ${filter === key ? DIFF[key].text : 'text-gray-600 dark:text-gray-300'}`}>{label}</p>
            </button>
          ))}
        </div>

        {/* Spaced repetition schedule */}
        <div className="mb-8 p-5 rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#0c1a2e]/60">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Review schedule</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">When completed cards come back for revision</p>
            </div>
            <button onClick={() => { setEditSr(!editSr); setSrDraft(sr) }}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              {editSr ? 'Cancel' : 'Customize'}
            </button>
          </div>
          {editSr ? (
            <div className="space-y-3">
              {[
                { key: 'same_day_hours', label: 'Same day (hours)', max: 23 },
                { key: 'end_of_day_hours', label: 'End of day (hours)', max: 48 },
                { key: 'week_days', label: 'Weekly review (days)', max: 14 },
                { key: 'month_days', label: 'Monthly review (days)', max: 60 },
              ].map(({ key, label, max }) => (
                <div key={key} className="flex items-center justify-between gap-4">
                  <label className="text-sm text-gray-700 dark:text-gray-200 flex-1">{label}</label>
                  <input type="number" min={1} max={max} value={srDraft[key]}
                    onChange={e => setSrDraft(p => ({ ...p, [key]: parseInt(e.target.value) || 1 }))}
                    className="w-20 input-field text-center" />
                </div>
              ))}
              <button onClick={saveSr} className="w-full py-2.5 rounded-xl bg-brand-gradient text-white text-sm font-semibold hover:opacity-90 mt-2">
                Save schedule
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Same day', value: `${sr.same_day_hours}h` },
                { label: 'End of day', value: `${sr.end_of_day_hours}h` },
                { label: 'Weekly', value: `${sr.week_days}d` },
                { label: 'Monthly', value: `${sr.month_days}d` },
              ].map(({ label, value }) => (
                <div key={label} className="text-center p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                  <p className="text-lg font-bold gradient-text">{value}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 mb-5 flex-wrap">
          {['all', 'easy', 'medium', 'hard', 'unseen'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold capitalize transition-colors ${filter === f ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/8'}`}>
              {f === 'unseen' ? 'Not rated' : f}{f !== 'all' ? ` (${counts[f]})` : ''}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-7 h-7 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
            <p className="text-gray-600 dark:text-gray-300 font-medium">Nothing here yet.</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Complete some flashcard sessions to see your progress.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 dark:border-white/[0.08] overflow-hidden bg-white dark:bg-[#0c1a2e]/40">
            <div className="grid grid-cols-4 px-5 py-3 bg-gray-50 dark:bg-white/[0.03] border-b border-gray-200 dark:border-white/[0.08]">
              {['Term', 'Answer', 'Difficulty', 'Next review'].map(h => (
                <p key={h} className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">{h}</p>
              ))}
            </div>
            {filtered.map(c => (
              <div key={c.id} className="grid grid-cols-4 px-5 py-3.5 border-b border-gray-100 dark:border-white/[0.05] last:border-0 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate pr-3">{c.field1}</p>
                  {parseInt(c.first_attempt_correct) > 0 && (
                    <p className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold mt-0.5">✦ 1st try</p>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 truncate pr-3">{c.field2}</p>
                <div>
                  {c.difficulty ? (
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold capitalize ${DIFF[c.difficulty].bg} ${DIFF[c.difficulty].text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${DIFF[c.difficulty].dot}`} />
                      {c.difficulty}
                    </span>
                  ) : <span className="text-xs text-gray-400 dark:text-gray-500">-</span>}
                </div>
                <p className={`text-xs font-medium ${c.next_review && new Date(c.next_review) <= new Date() ? 'text-rose-600 dark:text-rose-400' : 'text-gray-600 dark:text-gray-300'}`}>
                  {nextReviewLabel(c.next_review) || '-'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
