import { useEffect, useState } from 'react';
import { songsApi } from '../api/songs.api';
import { getSyncTimestamp, setSyncTimestamp, saveSongsToLocal, deleteSongsFromLocal } from '../db/database';

export const useSync = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState(null);

  const sync = async () => {
    if (!navigator.onLine) return; // Only sync if online
    
    setIsSyncing(true);
    setError(null);
    try {
      const lastSync = await getSyncTimestamp();
      const syncData = await songsApi.syncSongs(lastSync);
      
      const { newSongs, updatedSongs, deletedIds, timestamp } = syncData;
      
      const songsToSave = [...newSongs, ...updatedSongs];
      
      if (songsToSave.length > 0) {
        await saveSongsToLocal(songsToSave);
      }
      
      if (deletedIds && deletedIds.length > 0) {
        await deleteSongsFromLocal(deletedIds);
      }
      
      if (timestamp) {
        await setSyncTimestamp(timestamp);
      }
    } catch (err) {
      console.error('Failed to sync songs:', err);
      setError(err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    // Initial sync
    sync();

    // Listen for online event to trigger sync
    const handleOnline = () => {
      sync();
    };

    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return { isSyncing, error, forceSync: sync };
};
