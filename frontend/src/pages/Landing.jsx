import { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'

const Logo = ({ size = 30 }) => (
  <img src="/favicon.svg" width={size} height={size} alt="EchoCadence" style={{ display: 'block', flexShrink: 0 }} />
)
const Sun = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
  </svg>
)
const Moon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)

const useCases = [
  {
    emoji: '📚',
    title: 'Already know a language?',
    subtitle: 'Go deeper.',
    body: 'You speak English but want to expand to advanced vocabulary, idioms, and nuanced phrases. Add them, study them, and actually retain them - not just look them up and forget.',
  },
  {
    emoji: '🌍',
    title: 'Learning something new?',
    subtitle: 'Build from scratch.',
    body: 'Starting French, Japanese, or Arabic from zero. Add every new word you encounter. EchoCadence turns your growing list into a structured review system that keeps pace with you.',
  },
  {
    emoji: '🎯',
    title: 'Preparing for something?',
    subtitle: 'Study with purpose.',
    body: 'Exam vocabulary, business terminology, travel phrases. Organise by category, drill what matters, and track exactly what you know and what still needs work.',
  },
]

const features = [
  {
    icon: '🗂',
    title: 'Organised by category',
    body: '6 built-in categories per language: Words, Synonyms, Antonyms, Phrases, Slangs, Grammar Rules. Add up to 3 custom ones with any field labels you define.',
  },
  {
    icon: '🃏',
    title: 'Flashcard sessions',
    body: 'Learn mode shows only new cards. Revise mode shows only cards due today. Flip, answer, move on. No clutter.',
  },
  {
    icon: '🧠',
    title: 'SM-2 spaced repetition',
    body: 'The same algorithm behind Anki. Hard cards come back sooner. Easy ones give you breathing room. You never waste time reviewing what you already know.',
  },
  {
    icon: '🏷',
    title: 'Difficulty tags',
    body: 'Rate each card Easy, Medium, or Hard after your first correct answer. Change it anytime from your vocabulary list. Your tags shape the review schedule.',
  },
  {
    icon: '📊',
    title: 'Progress tracking',
    body: 'Weekly stats, per-card next review dates, first-attempt success rate. Filter your full vocabulary by difficulty. See exactly where you stand.',
  },
  {
    icon: '🌐',
    title: 'Up to 7 languages',
    body: 'Switch between languages without losing context. Each language has its own isolated workspace, categories, cards, and schedule.',
  },
]

const steps = [
  {
    n: '01',
    title: 'Pick your language',
    desc: 'Choose from 40 languages. Each gets its own dedicated workspace.',
  },
  {
    n: '02',
    title: 'Add your vocabulary',
    desc: 'Type in words, meanings, phrases, idioms - whatever you\'re learning. Organise them into categories.',
  },
  {
    n: '03',
    title: 'Study with flashcards',
    desc: 'Hit Learn to go through new cards. Flip, answer, rate the difficulty. Done in minutes.',
  },
  {
    n: '04',
    title: 'Come back to revise',
    desc: 'The algorithm decides what\'s due. Open Revise, go through today\'s cards, close the app. That\'s it.',
  },
  {
    n: '05',
    title: 'Watch your progress',
    desc: 'Check your weekly stats, see which words are locked in, and spot what still needs work.',
  },
]

export default function Landing() {
  const { loginWithRedirect, isAuthenticated } = useAuth0()
  const { dark, toggle } = useTheme()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true })
  }, [isAuthenticated])

  const signup = () => loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } })
  const signin = () => loginWithRedirect()

  return (
    <div className="min-h-screen bg-white dark:bg-[#070f1c] text-gray-900 dark:text-gray-100">

      {/* Nav */}
      <header className="fixed top-0 inset-x-0 z-50 h-[60px] flex items-center justify-between px-4 md:px-12 backdrop-blur-xl bg-white/90 dark:bg-[#070f1c]/90 border-b border-gray-200 dark:border-white/[0.08]">
        <div className="flex items-center gap-2 min-w-0">
          <Logo size={28} />
          <span className="text-[16px] font-bold tracking-tight text-gray-900 dark:text-white truncate">Echo<span className="gradient-text">Cadence</span></span>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <button onClick={toggle} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
            {dark ? <Sun /> : <Moon />}
          </button>
          <button onClick={signin} className="text-sm font-medium text-gray-700 dark:text-gray-200 px-3 py-1.5 hover:text-gray-900 dark:hover:text-white transition-colors">Sign in</button>
          <button onClick={signup} className="text-sm font-semibold px-4 py-2 rounded-lg bg-brand-gradient text-white hover:opacity-90 glow">Get started free</button>
        </div>
        <button onClick={() => setMenuOpen(o => !o)} className="sm:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 flex-shrink-0" aria-label="Menu">
          <span className={`block w-5 h-0.5 bg-gray-700 dark:bg-gray-200 transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-gray-700 dark:bg-gray-200 transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-gray-700 dark:bg-gray-200 transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </header>

      {menuOpen && (
        <div className="sm:hidden fixed inset-0 z-40 pt-[60px]" onClick={() => setMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/20 dark:bg-black/40" />
          <div className="relative bg-white dark:bg-[#0c1a2e] border-b border-gray-200 dark:border-white/10 px-4 py-4 flex flex-col gap-2" onClick={e => e.stopPropagation()}>
            <button onClick={() => { setMenuOpen(false); signin() }} className="px-3 py-3 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 text-left">Sign in</button>
            <button onClick={() => { setMenuOpen(false); signup() }} className="px-3 py-3 rounded-xl text-sm font-semibold bg-brand-gradient text-white text-center">Get started free</button>
            <button onClick={toggle} className="px-3 py-3 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 text-left flex items-center gap-2">
              {dark ? <Sun /> : <Moon />}{dark ? 'Light mode' : 'Dark mode'}
            </button>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-4 pt-[60px] min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] rounded-full blur-[100px] bg-gradient-to-br from-sky-400/10 to-teal-400/10 dark:from-sky-500/20 dark:to-teal-500/20" />
        </div>
        <div className="w-full max-w-2xl">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-medium leading-[1.15] tracking-tight text-gray-900 dark:text-white">
            Stop looking up the same words twice.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-lg mx-auto leading-relaxed">
            EchoCadence turns your vocabulary into flashcards and schedules reviews at exactly the right time - so what you learn today stays with you.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
            <button onClick={signup} className="px-7 py-3 rounded-xl font-semibold bg-brand-gradient text-white hover:opacity-90 glow text-sm">Start learning for free</button>
            <button onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })} className="px-7 py-3 rounded-xl font-semibold border border-gray-300 dark:border-white/20 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-white/5 text-sm">See how it works</button>
          </div>
          <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">Works for beginners and advanced learners. Up to 7 languages.</p>
        </div>
      </section>

      {/* Who is it for */}
      <section className="px-4 md:px-12 py-20 bg-gray-50 dark:bg-[#0a1525]/60 border-t border-gray-200 dark:border-white/[0.07]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-3">Who it's for</p>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-gray-900 dark:text-white">Whether you're starting out or going deeper.</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {useCases.map(u => (
              <div key={u.title} className="p-6 rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#0c1a2e]/60">
                <div className="text-3xl mb-4">{u.emoji}</div>
                <p className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-1">{u.subtitle}</p>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">{u.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{u.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-4 md:px-12 py-20 border-t border-gray-200 dark:border-white/[0.07]">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-3">How it works</p>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-gray-900 dark:text-white">Five steps. Then it runs itself.</h2>
          </div>
          <div className="flex flex-col gap-0">
            {steps.map((s, i) => (
              <div key={s.n} className={`flex gap-5 items-start py-6 ${i < steps.length - 1 ? 'border-b border-gray-100 dark:border-white/[0.06]' : ''}`}>
                <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center text-white text-xs font-bold">{s.n}</span>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white mb-1 text-sm">{s.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <button onClick={signup} className="px-7 py-3 rounded-xl font-semibold bg-brand-gradient text-white hover:opacity-90 glow text-sm w-full sm:w-auto">Try it now, it's free</button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 md:px-12 py-20 bg-gray-50 dark:bg-[#0a1525]/60 border-t border-gray-200 dark:border-white/[0.07]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-3">Features</p>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-gray-900 dark:text-white">Built for how memory actually works.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(f => (
              <div key={f.title} className="p-5 rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#0c1a2e]/60">
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">{f.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flashcard preview */}
      <section className="px-4 md:px-12 py-20 border-t border-gray-200 dark:border-white/[0.07]">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-3">In practice</p>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-gray-900 dark:text-white mb-4">A session takes minutes. The retention lasts months.</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">Open the app, go through today's due cards, close it. The algorithm handles the scheduling. You just show up.</p>
            <ul className="flex flex-col gap-3">
              {['Flip to reveal the answer', 'Mark it right or wrong', 'Rate the difficulty once', 'Come back when it\'s due'].map(t => (
                <li key={t} className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <span className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center text-teal-600 dark:text-teal-400 text-xs flex-shrink-0">✓</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full max-w-[280px] flex-shrink-0">
            <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1a2e] p-5 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">French · Idioms</span>
                <span className="text-xs text-gray-400">4 / 18</span>
              </div>
              <p className="text-xl font-serif text-gray-900 dark:text-white mb-1">avoir le cafard</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">to feel down / to have the blues</p>
              <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-white/[0.08]">
                <button className="flex-1 py-2 rounded-lg text-xs font-semibold bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-200">Easy</button>
                <button className="flex-1 py-2 rounded-lg text-xs font-semibold bg-sky-100 dark:bg-sky-900/40 text-sky-800 dark:text-sky-200">Medium</button>
                <button className="flex-1 py-2 rounded-lg text-xs font-semibold bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-200">Hard</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-20 bg-gray-50 dark:bg-[#0a1525]/60 border-t border-gray-200 dark:border-white/[0.07]">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl sm:text-4xl font-serif font-medium text-gray-900 dark:text-white mb-4 leading-tight">
            The words you learn today should still be there in six months.
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 text-sm leading-relaxed">Free. No credit card. Works for any language you're learning or deepening.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={signup} className="px-8 py-3.5 rounded-xl font-semibold bg-brand-gradient text-white hover:opacity-90 glow text-sm">Create your free account</button>
            <button onClick={signin} className="px-8 py-3.5 rounded-xl font-semibold border border-gray-300 dark:border-white/20 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-white/5 text-sm">Sign in</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-white/[0.07] bg-white dark:bg-[#070f1c]">
        <div className="max-w-5xl mx-auto px-4 md:px-12 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Logo size={26} />
              <span className="text-sm font-bold text-gray-900 dark:text-white">Echo<span className="gradient-text">Cadence</span></span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs">Vocabulary built on the science of spaced repetition. Remember more, forget less.</p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-2">
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Contact</a>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500">© {new Date().getFullYear()} EchoCadence. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  )
}
