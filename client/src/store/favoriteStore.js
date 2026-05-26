import { create } from 'zustand';
import { db } from '../db/database';
import { usersApi } from '../api/users.api';

export const useFavoriteStore = create((set, get) => ({
  isSyncing: false,

  // Queue a favorite action locally
  queueFavoriteAction: async (songId, action) => {
    await db.favorites.put({
      songId,
      action, // 'add' or 'remove'
      timestamp: new Date().toISOString()
    });
  },

  // Sync queued actions
  syncOfflineFavorites: async () => {
    if (get().isSyncing || !navigator.onLine) return;
    
    set({ isSyncing: true });
    
    try {
      const pending = await db.favorites.toArray();
      if (pending.length === 0) {
        set({ isSyncing: false });
        return;
      }

      // Sort by timestamp to apply in order
      pending.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      for (const item of pending) {
        try {
          await usersApi.toggleFavorite(item.songId);
          await db.favorites.delete(item.songId);
        } catch (err) {
          console.error(`Failed to sync favorite action for ${item.songId}:`, err);
          // Keep it in queue if failed (unless it's a 4xx error indicating it's no longer valid)
          if (err.response && err.response.status >= 400 && err.response.status < 500) {
             await db.favorites.delete(item.songId);
          }
        }
      }
    } finally {
      set({ isSyncing: false });
    }
  }
}));

// Set up online listener outside the store to trigger sync
window.addEventListener('online', () => {
  useFavoriteStore.getState().syncOfflineFavorites();
});
