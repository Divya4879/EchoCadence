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

export default function Nav({ username, picture, email }) {
  const { logout } = useAuth0()
  const { pathname } = useLocation()
  const { dark, toggle } = useTheme()

  const links = [
    { to: '/dashboard', label: 'Languages' },
    { to: '/progress', label: 'Progress' },
  ]

  return (
    <>
      {/* Top nav */}
      <header className="fixed top-0 inset-x-0 z-50 h-[64px] flex items-center justify-between px-4 md:px-10 backdrop-blur-xl bg-white/90 dark:bg-[#070f1c]/90 border-b border-gray-200 dark:border-white/[0.09]">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <img src="/favicon.svg" width={36} height={36} alt="EchoCadence" style={{ display: 'block' }} />
            <span className="text-[18px] font-bold tracking-tight text-gray-900 dark:text-white">
              Echo<span className="gradient-text">Cadence</span>
            </span>
          </Link>
          <nav className="hidden sm:flex items-center gap-1">
            {links.map((l) => (
              <Link key={l.to} to={l.to}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                  pathname === l.to
                    ? 'bg-sky-100 dark:bg-sky-900/40 text-sky-900 dark:text-sky-100'
                    : 'text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10'
                }`}>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggle}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            aria-label="Toggle theme">
            {dark ? <Sun /> : <Moon />}
          </button>
          <div className="hidden sm:flex items-center gap-2">
            {picture && <img src={picture} alt="" className="w-7 h-7 rounded-full object-cover ring-2 ring-gray-200 dark:ring-white/15" />}
            <span className="text-sm font-medium text-gray-800 dark:text-gray-100 max-w-[140px] truncate">{username || email}</span>
          </div>
          <button
            onClick={() => { localStorage.removeItem('ec_token'); logout({ logoutParams: { returnTo: window.location.origin } }) }}
            className="text-sm font-semibold px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/20 text-gray-700 dark:text-white bg-transparent hover:bg-gray-100 dark:hover:bg-white/15 transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 z-50 h-14 flex items-center justify-around bg-white/95 dark:bg-[#070f1c]/95 backdrop-blur-xl border-t border-gray-200 dark:border-white/[0.09]">
        {links.map(l => (
          <Link key={l.to} to={l.to}
            className={`flex-1 flex flex-col items-center justify-center h-full text-xs font-semibold transition-colors ${
              pathname === l.to ? 'text-sky-600 dark:text-sky-400' : 'text-gray-500 dark:text-gray-400'
            }`}>
            {l.label}
          </Link>
        ))}
      </nav>
    </>
  )
}
