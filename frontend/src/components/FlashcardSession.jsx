import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import Breadcrumbs from '../components/Breadcrumbs'

const DIFFICULTY_STYLES = {
  easy:   'bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-200 border-teal-200 dark:border-teal-700/50',
  medium: 'bg-sky-100 dark:bg-sky-900/40 text-sky-800 dark:text-sky-200 border-sky-200 dark:border-sky-700/50',
  hard:   'bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-200 border-rose-200 dark:border-rose-700/50',
}

const RIGHT_MESSAGES = ["Locked in.", "That's the one.", "Clean.", "Solid memory.", "You knew that."]
const RETRY_MESSAGES = ["One more look.", "Almost there.", "You've got this."]
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }

export default function FlashcardSession({ mode, languageId: propLangId }) {
  const navigate = useNavigate()
  const isLearn = mode === 'learn'
  const [languages, setLanguages] = useState([])
  const [selectedLang, setSelectedLang] = useState(propLangId || null)
  const [sessionSize, setSessionSize] = useState(10)
  const [availableCount, setAvailableCount] = useState(0)
  const [queue, setQueue] = useState([])
  const [retrySet, setRetrySet] = useState([])
  const [idx, setIdx] = useState(0)
  const [isRetryRound, setIsRetryRound] = useState(false)
  const [flipped, setFlipped] = useState(false)
  const [gotRight, setGotRight] = useState(false)
  const [isFirstAttempt, setIsFirstAttempt] = useState(true)
  const [rated, setRated] = useState(false)
  const [message, setMessage] = useState('')
  const [celebrate, setCelebrate] = useState(false)
  const [stage, setStage] = useState('setup')

  useEffect(() => {
    if (!propLangId) api.get('/api/languages').then(r => setLanguages(r.data))
  }, [])

  useEffect(() => {
    if (!selectedLang) return
    api.get(`/api/cards?languageId=${selectedLang}&limit=200&mode=${mode}`).then(r => {
      const count = (r.data.cards || r.data).length
      setAvailableCount(count)
      if (propLangId) setSessionSize(Math.min(10, count))
    })
  }, [selectedLang, mode])

  async function startSession() {
    const { data } = await api.get(`/api/cards?languageId=${selectedLang}&limit=200&mode=${mode}`)
    const list = data.cards || data
    if (!list.length) return
    const capped = list.slice(0, Math.min(sessionSize, list.length))
    setQueue(capped); setRetrySet([])
    setIdx(0); setFlipped(false); setGotRight(false); setIsFirstAttempt(true)
    setRated(false); setMessage(''); setCelebrate(false); setIsRetryRound(false)
    setStage('session')
  }

  async function markCorrect() {
    const card = queue[idx]
    await api.post('/api/cards', { cardId: card.id, correct: true, attemptNumber: isFirstAttempt ? 1 : 2 })
    setGotRight(true)
    setMessage(pick(RIGHT_MESSAGES))
    if (isFirstAttempt && !isRetryRound) {
      setCelebrate(true)
      setTimeout(() => setCelebrate(false), 2000)
    }
  }

  async function markWrong() {
    const card = queue[idx]
    await api.post('/api/cards', { cardId: card.id, correct: false, attemptNumber: 1 })
    if (!isRetryRound) setRetrySet(prev => [...prev, card])
    advanceCard()
  }

  async function rateDifficulty(rating) {
    const card = queue[idx]
    await api.post('/api/cards', { cardId: card.id, correct: true, attemptNumber: isFirstAttempt ? 1 : 2, rating, forceRating: !isLearn })
    setRated(true)
    setTimeout(() => advanceCard(), 400)
  }

  function advanceCard() {
    const nextIdx = idx + 1
    if (nextIdx < queue.length) {
      setIdx(nextIdx)
      setFlipped(false); setGotRight(false); setIsFirstAttempt(true)
      setRated(false); setMessage(''); setCelebrate(false)
    } else if (!isRetryRound && retrySet.length > 0) {
      setQueue(retrySet); setRetrySet([])
      setIdx(0); setIsRetryRound(true)
      setFlipped(false); setGotRight(false); setIsFirstAttempt(false)
      setRated(false); setMessage(''); setCelebrate(false)
    } else {
      setStage('done')
    }
  }

  const card = queue[idx]
  const progress = queue.length ? ((idx + 1) / queue.length) * 100 : 0

  if (stage === 'setup') return (
    <div className="min-h-[calc(100vh-72px)] bg-[#f8fafc] dark:bg-[#070f1c] px-6 md:px-10 py-12">
      <div className="max-w-lg mx-auto">
        <Breadcrumbs />
        <p className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-2">
          {isLearn ? 'New vocabulary' : 'Spaced repetition'}
        </p>
        <h1 className="text-3xl font-serif font-medium text-gray-900 dark:text-white mb-10">
          {isLearn ? 'Learn' : 'Revise'}
        </h1>
        <div className="p-7 rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#0c1a2e] shadow-sm space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Language</label>
            <div className="grid grid-cols-2 gap-2">
              {languages.map(l => (
                <button key={l.id} onClick={() => setSelectedLang(l.id)}
                  className={`py-2.5 px-4 rounded-xl border text-sm font-medium transition-all ${selectedLang === l.id ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200' : 'border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-white/20'}`}>
                  {l.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Cards per session
              {selectedLang && availableCount > 0 && (
                <span className="ml-2 font-normal text-gray-400 dark:text-gray-500">({availableCount} available)</span>
              )}
            </label>
            <div className="flex gap-2">
              {[5, 10, 20, 30, 50].map(n => (
                <button key={n} onClick={() => setSessionSize(n)}
                  disabled={selectedLang && n > availableCount}
                  className={`flex-1 py-2 rounded-xl border text-sm font-medium transition-all
                    ${sessionSize === n ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200' : 'border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-white/20'}
                    ${selectedLang && n > availableCount ? 'opacity-30 cursor-not-allowed' : ''}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>
          {selectedLang && availableCount === 0 && (
            <p className="text-sm text-center text-gray-500 dark:text-gray-400 py-1">
              {isLearn ? 'No new cards — add more vocabulary first.' : 'Nothing due for revision yet — check back later.'}
            </p>
          )}
          <button onClick={startSession} disabled={!selectedLang || availableCount === 0}
            className="w-full py-3.5 rounded-xl font-semibold bg-brand-gradient text-white hover:opacity-90 transition-opacity glow disabled:opacity-40 disabled:cursor-not-allowed">
            Start {isLearn ? 'learning' : 'revision'} →
          </button>
        </div>
      </div>
    </div>
  )

  if (stage === 'done') return (
    <div className="min-h-[calc(100vh-72px)] bg-[#f8fafc] dark:bg-[#070f1c] flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <p className="text-5xl mb-6">✦</p>
        <h2 className="text-2xl font-serif font-medium text-gray-900 dark:text-white mb-2">Session complete.</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          {isLearn ? 'Missed cards will appear in your next revision session.' : 'Missed cards are rescheduled for later.'}
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => setStage('setup')} className="px-6 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
            New session
          </button>
          <button onClick={() => navigate('/progress')} className="px-6 py-2.5 rounded-xl bg-brand-gradient text-white text-sm font-semibold hover:opacity-90 glow">
            View progress →
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#f8fafc] dark:bg-[#070f1c] px-6 py-10">
      {celebrate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <span className="text-[120px] animate-fade-up select-none">🥳</span>
        </div>
      )}
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {isRetryRound ? `Retry · ${idx + 1}/${queue.length}` : `${idx + 1} / ${queue.length}`}
          </span>
          <div className="flex-1 mx-4 h-1.5 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
            <div className="h-full rounded-full bg-brand-gradient transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide max-w-[100px] truncate">{card.category_name}</span>
        </div>

        <div style={{ perspective: '1200px' }}>
          <div onClick={() => !gotRight && setFlipped(f => !f)}
            className={`relative w-full cursor-pointer ${celebrate ? 'scale-[1.02]' : ''}`}
            style={{ transformStyle: 'preserve-3d', transition: 'transform 0.55s cubic-bezier(0.4,0,0.2,1)', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)', minHeight: '260px' }}>
            <div className="absolute inset-0 rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#0c1a2e] shadow-xl flex flex-col items-center justify-center p-10 text-center"
              style={{ backfaceVisibility: 'hidden' }}>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">{card.field1_label}</p>
              <p className="text-4xl font-serif font-medium text-gray-900 dark:text-white leading-tight">{card.field1}</p>
              {!flipped && <p className="mt-8 text-xs text-gray-300 dark:text-gray-600">tap to flip</p>}
            </div>
            <div className={`absolute inset-0 rounded-2xl border bg-white dark:bg-[#0c1a2e] shadow-xl flex flex-col items-center justify-center p-10 text-center ${celebrate ? 'border-teal-400 dark:border-teal-500/60' : 'border-teal-200 dark:border-teal-700/40'}`}
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
              <p className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-4">{card.field2_label}</p>
              <p className="text-3xl font-serif font-medium text-gray-900 dark:text-white leading-snug">{card.field2}</p>
              {celebrate && <p className="mt-6 text-sm font-medium text-teal-600 dark:text-teal-400 animate-fade-up">✦ First try</p>}
            </div>
          </div>
        </div>

        {message && (
          <p className={`mt-4 text-center text-sm font-medium animate-fade-up ${gotRight ? 'text-teal-600 dark:text-teal-400' : 'text-gray-500 dark:text-gray-400'}`}>
            {message}
          </p>
        )}

        <div className="mt-5 space-y-3">
          {flipped && !gotRight && (
            <div className="flex gap-3">
              <button onClick={markWrong} className="flex-1 py-3 rounded-xl border border-rose-200 dark:border-rose-700/40 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 font-semibold text-sm hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors">
                Not quite
              </button>
              <button onClick={markCorrect} className="flex-1 py-3 rounded-xl border border-teal-200 dark:border-teal-700/40 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 font-semibold text-sm hover:bg-teal-100 dark:hover:bg-teal-900/30 transition-colors">
                Got it ✓
              </button>
            </div>
          )}
          {gotRight && !rated && isLearn && !card.difficulty && (
            <div className="space-y-2">
              <p className="text-center text-sm font-medium text-gray-600 dark:text-gray-300">How hard was this?</p>
              <div className="flex gap-2">
                {['easy', 'medium', 'hard'].map(d => (
                  <button key={d} onClick={() => rateDifficulty(d)}
                    className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold capitalize transition-all ${DIFFICULTY_STYLES[d]}`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}
          {gotRight && (card.difficulty || rated || !isLearn) && (
            <button onClick={advanceCard} className="w-full py-3 rounded-xl bg-brand-gradient text-white font-semibold text-sm hover:opacity-90 glow">
              Next →
            </button>
          )}
          {!flipped && !gotRight && (
            <p className="text-center text-xs text-gray-400 dark:text-gray-500">
              {isRetryRound ? pick(RETRY_MESSAGES) : 'Tap the card to reveal the answer'}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
