import { useEffect, useRef } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

const TIMEOUT_MS = 15 * 60 * 1000

export default function useInactivityLogout() {
  const { logout, isAuthenticated } = useAuth0()
  const timer = useRef(null)

  useEffect(() => {
    if (!isAuthenticated) return

    const reset = () => {
      clearTimeout(timer.current)
      timer.current = setTimeout(() => {
        localStorage.removeItem('ec_token')
        logout({ logoutParams: { returnTo: window.location.origin } })
      }, TIMEOUT_MS)
    }

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']
    events.forEach(e => window.addEventListener(e, reset, { passive: true }))
    reset()

    return () => {
      clearTimeout(timer.current)
      events.forEach(e => window.removeEventListener(e, reset))
    }
  }, [isAuthenticated])
}
