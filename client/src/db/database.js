import Dexie from 'dexie';

export const db = new Dexie('AtmaKoBhajanDB');

db.version(1).stores({
  songs: '_id, slug, title, artist, writer, category, nepaliLyrics, romanizedLyrics, *tags', // Primary key and indexed props
  favorites: 'songId, action, timestamp', // For offline queue
  settings: 'key, value', // For local settings
  syncMeta: 'key, value' // For tracking lastSync timestamp
});

export const saveSongsToLocal = async (songs) => {
  if (!songs || songs.length === 0) return;
  await db.songs.bulkPut(songs);
};

export const deleteSongsFromLocal = async (ids) => {
  if (!ids || ids.length === 0) return;
  await db.songs.bulkDelete(ids);
};

export const getLocalSongs = async () => {
  return await db.songs.toArray();
};

export const getLocalSongBySlug = async (slug) => {
  return await db.songs.get({ slug });
};

export const searchLocalSongs = async (query) => {
  if (!query) return [];
  const lowerQuery = query.toLowerCase();
  
  return await db.songs.filter(song => {
    return (
      (song.title && song.title.toLowerCase().includes(lowerQuery)) ||
      (song.artist && song.artist.toLowerCase().includes(lowerQuery)) ||
      (song.writer && song.writer.toLowerCase().includes(lowerQuery)) ||
      (song.nepaliLyrics && song.nepaliLyrics.toLowerCase().includes(lowerQuery)) ||
      (song.romanizedLyrics && song.romanizedLyrics.toLowerCase().includes(lowerQuery)) ||
      (song.tags && song.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
    );
  }).toArray();
};

export const getSyncTimestamp = async () => {
  const meta = await db.syncMeta.get('lastSync');
  return meta ? meta.value : null;
};

export const setSyncTimestamp = async (timestamp) => {
  await db.syncMeta.put({ key: 'lastSync', value: timestamp });
};
