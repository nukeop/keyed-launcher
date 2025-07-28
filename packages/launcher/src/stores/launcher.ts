import { invoke } from '@tauri-apps/api/core';
import { create } from 'zustand';

interface LauncherState {
  isVisible: boolean;
  isAnimating: boolean;
  setIsVisible: (visible: boolean) => void;
  setIsAnimating: (animating: boolean) => void;
  showWindow: () => void;
  hideWindow: () => Promise<void>;
}

export const useLauncherStore = create<LauncherState>((set, get) => ({
  isVisible: false,
  isAnimating: false,
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
