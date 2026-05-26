import { create } from 'zustand';

// Available fonts: 'inter', 'devanagari', 'mukta', 'poppins', 'roboto'
export const useFontStore = create((set) => ({
  font: 'inter', // Default font
  
  initFont: () => {
    const stored = localStorage.getItem('lyrics-font');
    if (stored) {
      set({ font: stored });
    }
  },
  
  setFont: (font) => {
    localStorage.setItem('lyrics-font', font);
    set({ font });
  }
}));
