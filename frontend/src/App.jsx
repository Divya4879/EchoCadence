import { useAuth0 } from '@auth0/auth0-react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import ErrorBoundary from './components/ErrorBoundary'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Language from './pages/Language'
import Learn from './pages/Learn'
import Revise from './pages/Revise'
import Progress from './pages/Progress'
import './App.css'

export default function App() {
  const { isAuthenticated, isLoading } = useAuth0()

  if (isLoading) return (
    <div className="min-h-screen bg-white dark:bg-[#070f1c] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
    </div>
  )

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<ErrorBoundary><Dashboard /></ErrorBoundary>} />
        <Route path="/language/:id" element={<ErrorBoundary><Language /></ErrorBoundary>} />
        <Route path="/learn" element={<ErrorBoundary><Learn /></ErrorBoundary>} />
        <Route path="/revise" element={<ErrorBoundary><Revise /></ErrorBoundary>} />
        <Route path="/progress" element={<ErrorBoundary><Progress /></ErrorBoundary>} />
      </Route>
      <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/'} />} />
    </Routes>
  )
}
