import { invoke } from '@tauri-apps/api/core';
import { create } from 'zustand';

interface LauncherState {
  searchQuery: string;
  isVisible: boolean;
  isAnimating: boolean;
  setSearchQuery: (query: string) => void;
  setIsVisible: (visible: boolean) => void;
  setIsAnimating: (animating: boolean) => void;
  showWindow: () => void;
  hideWindow: () => Promise<void>;
}

export const useLauncherStore = create<LauncherState>((set, get) => ({
  searchQuery: '',
  isVisible: false,
  isAnimating: false,
  setSearchQuery: (query) => set({ searchQuery: query }),
  setIsVisible: (visible) => set({ isVisible: visible }),
  setIsAnimating: (animating) => set({ isAnimating: animating }),

  showWindow: () => {
    set({ isVisible: true, isAnimating: false });
  },

  hideWindow: async () => {
    const { isAnimating } = get();
    if (isAnimating) return;

    set({ isAnimating: true, isVisible: false });

    return new Promise((resolve) => {
      setTimeout(async () => {
        try {
          await invoke('hide_window');
        } catch (error) {
          console.error('Failed to hide window:', error);
        }
        set({ isAnimating: false });
        resolve();
      }, 200);
    });
  },
}));
