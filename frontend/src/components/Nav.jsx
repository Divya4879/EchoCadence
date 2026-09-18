import { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

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

const links = [
  { to: '/dashboard', label: 'Languages' },
  { to: '/progress', label: 'Progress' },
]

export default function Nav({ username, picture, email }) {
  const { logout } = useAuth0()
  const { pathname } = useLocation()
  const { dark, toggle } = useTheme()
  const [open, setOpen] = useState(false)

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 h-[60px] flex items-center justify-between px-4 md:px-10 backdrop-blur-xl bg-white/90 dark:bg-[#070f1c]/90 border-b border-gray-200 dark:border-white/[0.09]">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 min-w-0" onClick={() => setOpen(false)}>
          <img src="/favicon.svg" width={30} height={30} alt="EchoCadence" className="flex-shrink-0" />
          <span className="text-[16px] font-bold tracking-tight text-gray-900 dark:text-white truncate">
            Echo<span className="gradient-text">Cadence</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1">
          {links.map(l => (
            <Link key={l.to} to={l.to}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${pathname === l.to ? 'bg-sky-100 dark:bg-sky-900/40 text-sky-900 dark:text-sky-100' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10'}`}>
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Desktop right */}
        <div className="hidden sm:flex items-center gap-2">
          <button onClick={toggle} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors" aria-label="Toggle theme">
            {dark ? <Sun /> : <Moon />}
          </button>
          {picture && <img src={picture} alt="" className="w-7 h-7 rounded-full object-cover ring-2 ring-gray-200 dark:ring-white/15" />}
          <span className="text-sm font-medium text-gray-800 dark:text-gray-100 max-w-[130px] truncate">{username || email}</span>
          <button onClick={() => { localStorage.removeItem('ec_token'); logout({ logoutParams: { returnTo: window.location.origin } }) }}
            className="text-sm font-semibold px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/20 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/15 transition-colors">
            Sign out
          </button>
        </div>

        {/* Mobile right: hamburger only */}
        <div className="flex sm:hidden items-center">
          <button onClick={() => setOpen(o => !o)} className="w-9 h-9 rounded-lg flex flex-col items-center justify-center gap-1.5" aria-label="Menu">
            <span className={`block w-5 h-0.5 bg-gray-700 dark:bg-gray-200 transition-all duration-200 ${open ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-gray-700 dark:bg-gray-200 transition-all duration-200 ${open ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-gray-700 dark:bg-gray-200 transition-all duration-200 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </header>

      {/* Mobile menu drawer */}
      {open && (
        <div className="sm:hidden fixed inset-0 z-40 pt-[60px]" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/20 dark:bg-black/40" />
          <div className="relative bg-white dark:bg-[#0c1a2e] border-b border-gray-200 dark:border-white/10 px-4 py-4 flex flex-col gap-1" onClick={e => e.stopPropagation()}>
            {/* User info */}
            <div className="flex items-center gap-3 px-3 py-3 mb-2 border-b border-gray-100 dark:border-white/10">
              {picture && <img src={picture} alt="" className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-200 dark:ring-white/15" />}
              <span className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{username || email}</span>
            </div>
            {links.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
                className={`px-3 py-3 rounded-xl text-sm font-semibold transition-colors ${pathname === l.to ? 'bg-sky-100 dark:bg-sky-900/30 text-sky-900 dark:text-sky-100' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5'}`}>
                {l.label}
              </Link>
            ))}
            <button onClick={() => { localStorage.removeItem('ec_token'); logout({ logoutParams: { returnTo: window.location.origin } }) }}
              className="mt-2 px-3 py-3 rounded-xl text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-left transition-colors">
              Sign out
            </button>
            <button onClick={toggle} className="px-3 py-3 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 text-left transition-colors flex items-center gap-2">
              {dark ? <Sun /> : <Moon />}
              {dark ? 'Light mode' : 'Dark mode'}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
