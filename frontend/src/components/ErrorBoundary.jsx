import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) return (
      <div className="min-h-[calc(100vh-72px)] flex items-center justify-center bg-[#f8fafc] dark:bg-[#070f1c]">
        <div className="text-center max-w-sm px-6">
          <p className="text-3xl mb-4">⚠️</p>
          <p className="font-semibold text-gray-800 dark:text-white mb-2">Something went wrong</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{this.state.error.message}</p>
          <button onClick={() => this.setState({ error: null })}
            className="px-5 py-2 rounded-lg bg-brand-gradient text-white text-sm font-semibold hover:opacity-90">
            Try again
          </button>
        </div>
      </div>
    )
    return this.props.children
  }
}
