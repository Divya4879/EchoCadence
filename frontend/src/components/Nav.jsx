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

export default function Nav() {
  const { logout, user } = useAuth0()
  const { pathname } = useLocation()
  const { dark, toggle } = useTheme()

  const links = [
    { to: '/dashboard', label: 'Languages' },
    { to: '/progress', label: 'Progress' },
    { to: '/revise', label: 'Learn & Revise' },
  ]

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-[72px] flex items-center justify-between px-6 md:px-10 backdrop-blur-xl bg-white/90 dark:bg-[#070f1c]/90 border-b border-gray-200 dark:border-white/[0.09]">
      <div className="flex items-center gap-6">
        <Link to="/dashboard" className="flex items-center gap-3">
          <img src="/favicon.svg" width={52} height={52} alt="EchoCadence" style={{ borderRadius: '11px', display: 'block' }} />
          <span className="text-[20px] font-bold tracking-tight text-gray-900 dark:text-white">
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
      <div className="flex items-center gap-3">
        <button onClick={toggle}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          aria-label="Toggle theme">
          {dark ? <Sun /> : <Moon />}
        </button>
        <div className="hidden sm:flex items-center gap-2.5">
          {user?.picture && (
            <img src={user.picture} alt="" className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-200 dark:ring-white/15" />
          )}
          <span className="text-sm font-medium text-gray-800 dark:text-gray-100 max-w-[180px] truncate">{user?.email}</span>
        </div>
        <button
          onClick={() => { localStorage.removeItem('ec_token'); logout({ logoutParams: { returnTo: window.location.origin } }) }}
          className="text-sm font-semibold px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/15 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/8 transition-colors"
        >
          Sign out
        </button>
      </div>
    </header>
  )
}
