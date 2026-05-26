import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { usersApi } from '../../api/users.api';
import SongCard from '../../components/song/SongCard';
import Skeleton from '../../components/ui/Skeleton';
import { Heart } from 'lucide-react';

const Favorites = ({ inline = false }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await usersApi.getFavorites();
        setFavorites(data);
      } catch (error) {
        console.error('Failed to load favorites', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  const content = (
    <div className="space-y-6">
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="w-full aspect-video" />
              <Skeleton className="w-3/4 h-5" />
              <Skeleton className="w-1/2 h-4" />
            </div>
          ))}
        </div>
      ) : favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map(song => (
            <SongCard 
              key={song._id} 
              song={song} 
              onDelete={(deletedId) => {
                setFavorites(prev => prev.filter(s => s._id !== deletedId));
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-dark-800 rounded-2xl border border-gray-100 dark:border-dark-700">
          <Heart size={48} className="mx-auto text-gray-300 dark:text-dark-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No favorites yet</h3>
          <p className="text-gray-500 dark:text-gray-400">Save songs you love to find them easily later.</p>
        </div>
      )}
    </div>
  );

  if (inline) return content;

  return (
    <>
      <Helmet>
        <title>My Favorites - आत्मा को भजन</title>
      </Helmet>
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Saved Bhajans</h1>
        {content}
      </div>
    </>
  );
};

export default Favorites;
