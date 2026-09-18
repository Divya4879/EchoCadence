import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Nav from './Nav'
import SetUsername from './SetUsername'
import api from '../lib/api'
import useInactivityLogout from '../hooks/useInactivityLogout'

export default function AppLayout() {
  const { isAuthenticated, isLoading, getIdTokenClaims, user } = useAuth0()
  const navigate = useNavigate()
  const [appUser, setAppUser] = useState(null)
  const [synced, setSynced] = useState(false)
  useInactivityLogout()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) navigate('/', { replace: true })
  }, [isLoading, isAuthenticated])

  useEffect(() => {
    if (!isAuthenticated) return
    getIdTokenClaims().then(async claims => {
      api.defaults.headers.common['Authorization'] = `Bearer ${claims.__raw}`
      const { data } = await api.post('/api/users/sync', { email: user?.email })
      setAppUser(data)
      setSynced(true)
    })
  }, [isAuthenticated])

  if (isLoading || !isAuthenticated || !synced) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#070f1c]">
      <div className="w-8 h-8 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
    </div>
  )

  if (!appUser?.username) return (
    <SetUsername onDone={updated => setAppUser(updated)} />
  )

  return (
    <>
      <Nav username={appUser.username} picture={user?.picture} email={user?.email} />
      <main className="pt-[64px] pb-14 sm:pb-0">
        <Outlet />
      </main>
    </>
  )
}
