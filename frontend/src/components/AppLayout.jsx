import { useAuth0 } from '@auth0/auth0-react'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Nav from './Nav'

export default function AppLayout() {
  const { isAuthenticated, isLoading, getIdTokenClaims } = useAuth0()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) navigate('/', { replace: true })
  }, [isLoading, isAuthenticated])

  useEffect(() => {
    if (isAuthenticated) {
      getIdTokenClaims().then(claims => {
        if (claims?.__raw) localStorage.setItem('ec_token', claims.__raw)
      })
    }
  }, [isAuthenticated])

  if (isLoading || !isAuthenticated) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#070f1c]">
      <div className="w-8 h-8 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
    </div>
  )

  return (
    <>
      <Nav />
      <main className="pt-[72px]">
        <Outlet />
      </main>
    </>
  )
}
