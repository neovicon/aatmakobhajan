import { create } from 'zustand';

export const useThemeStore = create((set) => ({
  theme: 'dark', // Default to dark as per spec
  
  initTheme: () => {
    const stored = localStorage.getItem('theme');
    if (stored) {
      set({ theme: stored });
    }
  },
  
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    return { theme: newTheme };
  }),
  
  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    set({ theme });
  }
}));
