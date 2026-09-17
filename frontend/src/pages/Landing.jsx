import { useAuth0 } from '@auth0/auth0-react'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'

const Logo = ({ size = 40 }) => (
  <img src="/favicon.svg" width={size} height={size} alt="EchoCadence" style={{ display: 'block' }} />
)

const Sun = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
  </svg>
)

const Moon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)

const features = [
  { tag: 'Multi-language', title: 'Five languages. One workspace.', body: 'Track up to 5 languages simultaneously. Each gets its own isolated space — vocabulary, categories, and progress kept cleanly separate.' },
  { tag: 'Categories', title: 'Beyond words and meanings.', body: 'Built-in categories for vocabulary, synonyms, antonyms, common phrases, advanced phrases, and slangs. Add up to 3 custom categories with any two fields you define.' },
  { tag: 'Flashcards', title: 'Cards built from your own entries.', body: 'Every word and phrase you add becomes a reviewable flashcard. Filter by category, difficulty, or go random. Rate a card only after answering correctly.' },
  { tag: 'Spaced Repetition', title: 'The science of not forgetting.', body: 'Powered by the SM-2 algorithm — the same method behind Anki. Hard cards resurface sooner. Easy ones give you breathing room.' },
  { tag: 'Difficulty Tracking', title: 'Easy, medium, hard — per card.', body: "Every card carries its difficulty history. See exactly which words you've mastered, which need work, and which you've never gotten right on the first try." },
  { tag: 'Progress', title: 'A clear picture of where you stand.', body: "Review completed cards, revisit ones you struggled with, and track retention over time. No vanity metrics — just honest progress." },
]

const steps = [
  { n: '01', title: 'Add your languages', desc: "Choose up to 5 languages you're actively learning. Each gets its own dedicated space." },
  { n: '02', title: 'Build your vocabulary', desc: 'Enter words, meanings, synonyms, antonyms, idioms, phrases — or define your own categories with custom fields.' },
  { n: '03', title: 'Review with flashcards', desc: 'Cards are generated from your entries. Answer, then rate each one. Your rating shapes when it comes back.' },
  { n: '04', title: 'Let the algorithm work', desc: 'Spaced repetition schedules every card at the optimal interval. Show up consistently and retention compounds.' },
]

export default function Landing() {
  const { loginWithRedirect, isAuthenticated } = useAuth0()
  const { dark, toggle } = useTheme()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true })
  }, [isAuthenticated])

  return (
    <div className="min-h-screen bg-white dark:bg-[#070f1c] text-gray-900 dark:text-gray-100 transition-colors duration-300">

      <header className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-12 h-16 backdrop-blur-xl bg-white/90 dark:bg-[#070f1c]/90 border-b border-gray-200 dark:border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <Logo size={52} />
          <span className="text-[20px] font-bold tracking-tight text-gray-900 dark:text-white">Echo<span className="gradient-text">Cadence</span></span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggle} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors" aria-label="Toggle theme">
            {dark ? <Sun /> : <Moon />}
          </button>
          {isAuthenticated ? (
            <Link to="/dashboard" className="text-sm font-semibold px-4 py-2 rounded-lg bg-brand-gradient text-white hover:opacity-90 transition-opacity glow">
              Go to dashboard →
            </Link>
          ) : (
            <>
              <button onClick={() => loginWithRedirect()} className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors px-3 py-1.5">Sign in</button>
              <button onClick={() => loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } })} className="text-sm font-semibold px-4 py-2 rounded-lg bg-brand-gradient text-white hover:opacity-90 transition-opacity glow">Get started free</button>
            </>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 overflow-hidden" style={{ minHeight: 'calc(100vh - 64px)', marginTop: '64px' }}>
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full blur-[120px] bg-gradient-to-br from-sky-400/10 to-teal-400/10 dark:from-sky-500/15 dark:to-teal-500/15" />
        </div>
        <div className="animate-fade-up max-w-3xl">
          <h1 className="text-5xl sm:text-6xl md:text-[4.75rem] font-serif font-medium leading-[1.1] tracking-tight text-gray-900 dark:text-white">
            Learn languages.<br /><span className="gradient-text italic">Remember everything.</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed font-light">
            Build vocabulary across multiple languages, retain it for life.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button onClick={() => loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } })} className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold bg-brand-gradient text-white hover:opacity-90 transition-opacity glow text-[15px]">Start for free</button>
            <button onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })} className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold border border-gray-300 dark:border-white/20 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-[15px]">See how it works</button>
          </div>
        </div>
      </section>

      {/* Flashcard mockup */}
      <section className="flex justify-center px-6 py-20 bg-gray-50 dark:bg-[#0a1525]/60 border-t border-gray-200 dark:border-white/[0.07]">
        <div className="w-full max-w-sm">
          <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1a2e] p-7 shadow-2xl shadow-gray-200/60 dark:shadow-black/40 text-left">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gradient-to-br from-sky-400 to-teal-400" />
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">French · Idioms</span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Card 4 of 18</span>
            </div>
            <p className="text-3xl font-serif text-gray-900 dark:text-white mb-1">avoir le cafard</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-7">What does this idiom mean?</p>
            <div className="grid grid-cols-2 gap-2.5">
              {['to feel homesick', 'to feel down', 'to be confused', 'to be fearless'].map((opt, i) => (
                <button key={i} className={`text-sm py-2.5 px-3 rounded-xl border font-medium text-left ${i === 1 ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200' : 'border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300'}`}>{opt}</button>
              ))}
            </div>
            <div className="mt-5 flex gap-2 pt-4 border-t border-gray-100 dark:border-white/[0.08]">
              <button className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-200">Easy</button>
              <button className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-sky-100 dark:bg-sky-900/40 text-sky-800 dark:text-sky-200">Medium</button>
              <button className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-200">Hard</button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 md:px-12 py-32 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-3">Features</p>
          <h2 className="text-3xl md:text-4xl font-serif font-medium text-gray-900 dark:text-white">Everything a serious language learner needs.</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.tag} className="p-7 rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-[#0c1a2e]/60 hover:border-sky-300 dark:hover:border-sky-700/50 transition-all duration-200">
              <p className="text-xs font-bold uppercase tracking-widest gradient-text mb-4">{f.tag}</p>
              <h3 className="text-[15px] font-semibold text-gray-900 dark:text-white mb-2.5 leading-snug">{f.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-6 md:px-12 py-24 border-t border-gray-200 dark:border-white/[0.07] bg-gray-50 dark:bg-[#0a1525]/60">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-3">How it works</p>
            <h2 className="text-3xl md:text-4xl font-serif font-medium text-gray-900 dark:text-white">Up and running in minutes.</h2>
          </div>
          <div className="flex flex-col gap-10">
            {steps.map((s) => (
              <div key={s.n} className="flex gap-6 items-start">
                <span className="flex-shrink-0 text-2xl font-serif font-medium gradient-text leading-none mt-0.5">{s.n}</span>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white mb-1.5">{s.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-32">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-medium text-gray-900 dark:text-white mb-5 leading-tight">
            The words you learn today<br />should still be there tomorrow.
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-10 text-lg font-light">Free, across every language you're learning.</p>
          <button onClick={() => loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } })} className="px-9 py-4 rounded-xl font-semibold bg-brand-gradient text-white hover:opacity-90 transition-opacity glow text-[15px]">
            Create your free account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-white/[0.07] bg-gray-50 dark:bg-[#070f1c]">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-3"><Logo size={60} /><span className="text-[22px] font-bold text-gray-900 dark:text-white">Echo<span className="gradient-text">Cadence</span></span></div>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs leading-relaxed">Vocabulary learning built on the science of spaced repetition. Remember more, forget less.</p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-2">
            <div className="flex items-center gap-5 text-sm text-gray-600 dark:text-gray-400">
              <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Contact</a>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500">© {new Date().getFullYear()} EchoCadence. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  )
}
