import React, { useEffect } from 'react'
import { useLauncherStore } from './stores/launcher'
import { invoke } from '@tauri-apps/api/core'

function App() {
  const { searchQuery, setSearchQuery } = useLauncherStore()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        invoke('hide_window').catch(console.error)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-white">Based Launcher v3</h1>
        <p className="text-gray-400 text-sm">High-performance multiplatform launcher</p>
      </div>
      
      <div className="w-full max-w-md">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Type to search..."
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          autoFocus
        />
      </div>
      
      <div className="text-xs text-gray-500 space-y-1 text-center">
        <div>Press Escape to hide</div>
        <div>Cmd+Shift+Space (macOS) / Ctrl+Shift+Space to toggle</div>
      </div>
    </div>
  )
}

export default App
