import { Link, useLocation, useMatches } from 'react-router-dom'

const labels = {
  '/dashboard': 'Languages',
  '/revise': 'Learn & Revise',
  '/progress': 'Progress',
}

export default function Breadcrumbs({ extra }) {
  const { pathname } = useLocation()
  const base = labels[pathname]

  if (!base && !extra) return null

  return (
    <nav className="flex items-center gap-1.5 text-sm mb-6">
      <Link to="/dashboard" className="text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Languages</Link>
      {extra && (
        <>
          <span className="text-gray-300 dark:text-gray-600">/</span>
          <span className="text-gray-700 dark:text-gray-200 font-medium">{extra}</span>
        </>
      )}
      {!extra && base && base !== 'Languages' && (
        <>
          <span className="text-gray-300 dark:text-gray-600">/</span>
          <span className="text-gray-700 dark:text-gray-200 font-medium">{base}</span>
        </>
      )}
    </nav>
  )
}
