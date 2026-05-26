import { create } from 'zustand';

// Available fonts: 'inter', 'devanagari', 'mukta', 'poppins', 'roboto'
export const useFontStore = create((set) => ({
  fontSize: 'text-lg', // Default size
  
  initFont: () => {
    const stored = localStorage.getItem('lyrics-font-size');
    if (stored) {
      set({ fontSize: stored });
    }
  },
  
  setFontSize: (fontSize) => {
    localStorage.setItem('lyrics-font-size', fontSize);
    set({ fontSize });
  }
}));
