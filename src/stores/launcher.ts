import { create } from 'zustand'

interface LauncherState {
  isVisible: boolean
  searchQuery: string
  setVisible: (visible: boolean) => void
  setSearchQuery: (query: string) => void
}

export const useLauncherStore = create<LauncherState>((set) => ({
  isVisible: false,
  searchQuery: '',
  setVisible: (visible) => set({ isVisible: visible }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}))
