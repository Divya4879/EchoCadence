import { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'

const Logo = ({ size = 32 }) => (
  <img src="/favicon.svg" width={size} height={size} alt="EchoCadence" style={{ display: 'block', flexShrink: 0 }} />
)

const Sun = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
  </svg>
)
const Moon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)

const features = [
  { tag: 'Multi-language', title: 'Seven languages. One workspace.', body: 'Track up to 7 languages simultaneously. Each gets its own isolated space - vocabulary, categories, and progress kept cleanly separate.' },
  { tag: 'Categories', title: 'Beyond words and meanings.', body: 'Built-in categories for vocabulary, synonyms, antonyms, phrases, and slangs. Add up to 3 custom categories with any fields you define.' },
  { tag: 'Flashcards', title: 'Cards built from your own entries.', body: 'Every word and phrase you add becomes a reviewable flashcard. Rate a card only after answering correctly.' },
  { tag: 'Spaced Repetition', title: 'The science of not forgetting.', body: 'Powered by the SM-2 algorithm - the same method behind Anki. Hard cards resurface sooner. Easy ones give you breathing room.' },
  { tag: 'Difficulty Tracking', title: 'Easy, medium, hard - per card.', body: "Every card carries its difficulty history. See exactly which words you've mastered and which need more work." },
  { tag: 'Progress', title: 'A clear picture of where you stand.', body: "Weekly stats, per-card review dates, first-attempt tracking. Honest progress, no vanity metrics." },
]

const steps = [
  { n: '01', title: 'Add your languages', desc: "Choose up to 7 languages you're actively learning." },
  { n: '02', title: 'Build your vocabulary', desc: 'Enter words, meanings, synonyms, phrases - or define custom categories.' },
  { n: '03', title: 'Review with flashcards', desc: 'Answer, then rate each card. Your rating shapes when it comes back.' },
  { n: '04', title: 'Let the algorithm work', desc: 'Spaced repetition schedules every card at the optimal interval.' },
]

export default function Landing() {
  const { loginWithRedirect, isAuthenticated } = useAuth0()
  const { dark, toggle } = useTheme()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true })
  }, [isAuthenticated])

  return (
    <div className="min-h-screen bg-white dark:bg-[#070f1c] text-gray-900 dark:text-gray-100 transition-colors duration-300">

      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 h-[60px] flex items-center justify-between px-4 md:px-12 backdrop-blur-xl bg-white/90 dark:bg-[#070f1c]/90 border-b border-gray-200 dark:border-white/[0.08]">
        <div className="flex items-center gap-2 min-w-0">
          <Logo size={30} />
          <span className="text-[16px] font-bold tracking-tight text-gray-900 dark:text-white truncate">Echo<span className="gradient-text">Cadence</span></span>
        </div>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-3">
          <button onClick={toggle} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
            {dark ? <Sun /> : <Moon />}
          </button>
          {isAuthenticated ? (
            <Link to="/dashboard" className="text-sm font-semibold px-4 py-2 rounded-lg bg-brand-gradient text-white hover:opacity-90 glow">Dashboard</Link>
          ) : (
            <>
              <button onClick={() => loginWithRedirect()} className="text-sm font-medium text-gray-700 dark:text-gray-200 px-3 py-1.5">Sign in</button>
              <button onClick={() => loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } })} className="text-sm font-semibold px-4 py-2 rounded-lg bg-brand-gradient text-white hover:opacity-90 glow">Get started free</button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(o => !o)} className="sm:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 flex-shrink-0" aria-label="Menu">
          <span className={`block w-5 h-0.5 bg-gray-700 dark:bg-gray-200 transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-gray-700 dark:bg-gray-200 transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-gray-700 dark:bg-gray-200 transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden fixed inset-0 z-40 pt-[60px]" onClick={() => setMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/20 dark:bg-black/40" />
          <div className="relative bg-white dark:bg-[#0c1a2e] border-b border-gray-200 dark:border-white/10 px-4 py-4 flex flex-col gap-2" onClick={e => e.stopPropagation()}>
            {isAuthenticated ? (
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="px-3 py-3 rounded-xl text-sm font-semibold bg-brand-gradient text-white text-center">Go to dashboard</Link>
            ) : (
              <>
                <button onClick={() => { setMenuOpen(false); loginWithRedirect() }} className="px-3 py-3 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 text-left">Sign in</button>
                <button onClick={() => { setMenuOpen(false); loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } }) }} className="px-3 py-3 rounded-xl text-sm font-semibold bg-brand-gradient text-white text-center">Get started free</button>
              </>
            )}
            <button onClick={toggle} className="px-3 py-3 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 text-left flex items-center gap-2">
              {dark ? <Sun /> : <Moon />}{dark ? 'Light mode' : 'Dark mode'}
            </button>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-4 overflow-hidden pt-[60px]" style={{ minHeight: '100svh' }}>
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[100px] bg-gradient-to-br from-sky-400/10 to-teal-400/10 dark:from-sky-500/15 dark:to-teal-500/15" />
        </div>
        <div className="w-full max-w-2xl">
          <h1 className="text-3xl sm:text-5xl md:text-[4rem] font-serif font-medium leading-[1.15] tracking-tight text-gray-900 dark:text-white">
            Learn languages.<br /><span className="gradient-text italic">Remember everything.</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-sm mx-auto leading-relaxed font-light">
            Build vocabulary across multiple languages, retain it for life.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
            <button onClick={() => loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } })} className="px-6 py-3 rounded-xl font-semibold bg-brand-gradient text-white hover:opacity-90 glow text-sm">Start for free</button>
            <button onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })} className="px-6 py-3 rounded-xl font-semibold border border-gray-300 dark:border-white/20 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-white/5 text-sm">See how it works</button>
          </div>
        </div>
      </section>

      {/* Flashcard mockup */}
      <section className="flex justify-center px-4 py-16 bg-gray-50 dark:bg-[#0a1525]/60 border-t border-gray-200 dark:border-white/[0.07]">
        <div className="w-full max-w-sm">
          <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1a2e] p-5 shadow-xl text-left">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gradient-to-br from-sky-400 to-teal-400" />
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">French · Idioms</span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">4 / 18</span>
            </div>
            <p className="text-2xl font-serif text-gray-900 dark:text-white mb-1">avoir le cafard</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">What does this idiom mean?</p>
            <div className="grid grid-cols-2 gap-2">
              {['to feel homesick', 'to feel down', 'to be confused', 'to be fearless'].map((opt, i) => (
                <button key={i} className={`text-xs py-2 px-2 rounded-xl border font-medium text-left ${i === 1 ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200' : 'border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300'}`}>{opt}</button>
              ))}
            </div>
            <div className="mt-4 flex gap-2 pt-3 border-t border-gray-100 dark:border-white/[0.08]">
              <button className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-200">Easy</button>
              <button className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-sky-100 dark:bg-sky-900/40 text-sky-800 dark:text-sky-200">Medium</button>
              <button className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-200">Hard</button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 md:px-12 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-3">Features</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-medium text-gray-900 dark:text-white">Everything a serious language learner needs.</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div key={f.tag} className="p-5 rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-[#0c1a2e]/60">
              <p className="text-xs font-bold uppercase tracking-widest gradient-text mb-3">{f.tag}</p>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 leading-snug">{f.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-4 md:px-12 py-20 border-t border-gray-200 dark:border-white/[0.07] bg-gray-50 dark:bg-[#0a1525]/60">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-3">How it works</p>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-gray-900 dark:text-white">Up and running in minutes.</h2>
          </div>
          <div className="flex flex-col gap-8">
            {steps.map((s) => (
              <div key={s.n} className="flex gap-5 items-start">
                <span className="flex-shrink-0 text-xl font-serif font-medium gradient-text">{s.n}</span>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white mb-1 text-sm">{s.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl sm:text-4xl font-serif font-medium text-gray-900 dark:text-white mb-4 leading-tight">
            The words you learn today should still be there tomorrow.
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 text-base font-light">Free, across every language you're learning.</p>
          <button onClick={() => loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } })} className="px-8 py-3.5 rounded-xl font-semibold bg-brand-gradient text-white hover:opacity-90 glow text-sm w-full sm:w-auto">
            Create your free account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-white/[0.07] bg-gray-50 dark:bg-[#070f1c]">
        <div className="max-w-6xl mx-auto px-4 md:px-12 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Logo size={28} />
              <span className="text-base font-bold text-gray-900 dark:text-white">Echo<span className="gradient-text">Cadence</span></span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs leading-relaxed">Vocabulary built on the science of spaced repetition.</p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-2">
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Contact</a>
            </div>
            <p className="text-xs text-gray-500">© {new Date().getFullYear()} EchoCadence.</p>
          </div>
        </div>
      </footer>

    </div>
  )
}
