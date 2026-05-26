import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Share2, Copy, Heart, User, Clock, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

import { songsApi } from '../api/songs.api';
import { getLocalSongBySlug } from '../db/database';
import { usersApi } from '../api/users.api';
import { useAuthStore } from '../store/authStore';
import { useFavoriteStore } from '../store/favoriteStore';
import { shareContent } from '../utils/share';

import AudioPlayer from '../components/song/AudioPlayer';
import VideoPlayer from '../components/song/VideoPlayer';
import LyricsView from '../components/song/LyricsView';
import FontSwitcher from '../components/song/FontSwitcher';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';

const SongDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showRomanized, setShowRomanized] = useState(false);

  useEffect(() => {
    const fetchSong = async () => {
      try {
        let data;
        if (!navigator.onLine) {
          data = await getLocalSongBySlug(slug);
          if (!data) throw new Error('Not found offline');
        } else {
          data = await songsApi.getSongBySlug(slug);
        }
        setSong(data);
        
        // If user logged in, check favorites
        if (isAuthenticated && user?.favorites) {
           // We might need to fetch user's full favorites list to check ID
           // In this simplified setup, we check if the song ID is in user's favorites array
           // If user object has populated favorites or just IDs
           const isFav = user.favorites.some(fav => 
             typeof fav === 'object' ? fav._id === data._id : fav === data._id
           );
           setIsFavorite(isFav);
        }
      } catch (error) {
        if (error.response?.status === 404) {
          navigate('/not-found', { replace: true });
        } else {
          toast.error('Failed to load song');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchSong();
  }, [slug, isAuthenticated, navigate, user]);

  const handleCopy = () => {
    const textToCopy = `${song.title}\n\n${showRomanized ? song.romanizedLyrics : song.nepaliLyrics}\n\nVia आत्मा को भजन`;
    navigator.clipboard.writeText(textToCopy)
      .then(() => toast.success('Lyrics copied to clipboard!'))
      .catch(() => toast.error('Failed to copy'));
  };

  const handleShare = () => {
    shareContent(song.title, `Check out the lyrics for ${song.title}`, window.location.href);
  };

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to save favorites');
      navigate('/login');
      return;
    }
    
    const newIsFavorite = !isFavorite;
    
    // Optimistic update
    setIsFavorite(newIsFavorite);
    setSong(prev => ({ 
      ...prev, 
      favoriteCount: newIsFavorite ? prev.favoriteCount + 1 : Math.max(0, prev.favoriteCount - 1) 
    }));

    if (!navigator.onLine) {
      // Offline fallback queue
      toast.success('Saved offline. Will sync when connected.');
      useFavoriteStore.getState().queueFavoriteAction(song._id, newIsFavorite ? 'add' : 'remove');
      return;
    }

    try {
      await usersApi.toggleFavorite(song._id);
    } catch (error) {
      // Revert on failure
      setIsFavorite(!newIsFavorite);
      setSong(prev => ({ 
        ...prev, 
        favoriteCount: !newIsFavorite ? prev.favoriteCount + 1 : Math.max(0, prev.favoriteCount - 1) 
      }));
      toast.error('Failed to update favorites');
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-64 bg-gray-200 dark:bg-dark-700 rounded-2xl w-full"></div>
        <div className="space-y-4 max-w-3xl mx-auto">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <div className="space-y-2 mt-8">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!song) return null;

  return (
    <>
      <Helmet>
        <title>{song.title} Lyrics - आत्मा को भजन</title>
        <meta name="description" content={`Lyrics for ${song.title} by ${song.artist}`} />
      </Helmet>

      <button onClick={() => navigate(-1)} className="mb-6 flex items-center text-sm text-gray-500 hover:text-primary-500 transition-colors">
        <ArrowLeft size={16} className="mr-1" /> Back
      </button>

      {/* Media Header Section */}
      <div className="bg-white dark:bg-dark-800 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-dark-700 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Media Player */}
          <div className="bg-black relative">
            {song.videoUrl ? (
              <VideoPlayer url={song.videoUrl} />
            ) : (
              <div className="aspect-video w-full">
                <img 
                  src={song.coverImage !== 'default-cover.jpg' ? song.coverImage : 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=1200'} 
                  alt={song.title} 
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
            )}
          </div>
          
          {/* Info */}
          <div className="p-6 md:p-8 flex flex-col justify-center">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="primary" className="capitalize">{song.category}</Badge>
              {song.tags?.map(tag => (
                <Badge key={tag} variant="secondary">#{tag}</Badge>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold font-devanagari text-gray-900 dark:text-white mb-2">
              {song.title}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 font-medium flex items-center gap-2">
              <User size={20} /> {song.artist}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <Button 
                variant={isFavorite ? "primary" : "outline"} 
                onClick={handleFavorite}
                className="rounded-full shadow-sm"
              >
                <Heart size={18} className={`mr-2 ${isFavorite ? "fill-white" : ""}`} /> 
                {isFavorite ? 'Saved' : 'Save'} ({song.favoriteCount})
              </Button>
              <Button variant="outline" onClick={handleShare} className="rounded-full shadow-sm">
                <Share2 size={18} className="mr-2" /> Share
              </Button>
            </div>

            {song.audioUrl && (
              <div className="mt-auto pt-6 border-t border-gray-100 dark:border-dark-700">
                <h4 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">Listen Audio</h4>
                <AudioPlayer url={song.audioUrl} title={song.title} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lyrics Section */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-dark-800 rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100 dark:border-dark-700">
        
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-100 dark:border-dark-700 mb-8 sticky top-[72px] bg-white dark:bg-dark-800 z-10 p-2">
          <div className="flex bg-gray-100 dark:bg-dark-700 p-1 rounded-lg">
            <button 
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${!showRomanized ? 'bg-white dark:bg-dark-600 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
              onClick={() => setShowRomanized(false)}
            >
              नेपाली
            </button>
            <button 
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${showRomanized ? 'bg-white dark:bg-dark-600 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
              onClick={() => setShowRomanized(true)}
            >
              Roman
            </button>
          </div>
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            {!showRomanized && <FontSwitcher />}
            <button 
              onClick={handleCopy}
              className="p-2 text-gray-500 hover:text-primary-500 bg-gray-100 dark:bg-dark-700 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors ml-auto sm:ml-0"
              title="Copy Lyrics"
            >
              <Copy size={20} />
            </button>
          </div>
        </div>

        {/* Lyrics Content */}
        <div className="min-h-[400px]">
          <LyricsView 
            lyrics={showRomanized ? song.romanizedLyrics : song.nepaliLyrics} 
            title={song.title} 
          />
        </div>
        
        {/* Footer Info */}
        <div className="mt-12 pt-6 border-t border-gray-100 dark:border-dark-700 flex flex-wrap gap-x-8 gap-y-4 text-sm text-gray-500 dark:text-gray-400">
          {song.writer !== 'Unknown' && (
            <p><strong>Writer:</strong> {song.writer}</p>
          )}
          {song.album && (
            <p><strong>Album:</strong> {song.album}</p>
          )}
          <p className="flex items-center gap-1"><Clock size={14} /> Added: {new Date(song.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </>
  );
};

export default SongDetail;
