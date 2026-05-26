import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Music, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { songsApi } from '../api/songs.api';
import { getLocalSongs } from '../db/database';
import SongCard from '../components/song/SongCard';
import Skeleton from '../components/ui/Skeleton';
import Button from '../components/ui/Button';

const Home = () => {
  const [trending, setTrending] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        if (!navigator.onLine) {
          const localSongs = await getLocalSongs();
          // basic mock trending/recent logic for offline
          setTrending(localSongs.slice(0, 4));
          setRecent(localSongs.slice(0, 8));
        } else {
          const [trendingData, recentData] = await Promise.all([
            songsApi.getTrendingSongs(),
            songsApi.getRecentSongs()
          ]);
          setTrending(trendingData.slice(0, 4));
          setRecent(recentData.slice(0, 8));
        }
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      <Helmet>
        <title>आत्मा को भजन - Home</title>
        <meta name="description" content="Discover and read Nepali song lyrics with transliteration." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-primary-900 mb-12">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-800/80 mix-blend-multiply" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-30" />
        </div>
        
        <div className="relative z-10 px-6 py-24 sm:py-32 lg:px-8 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-800/50 border border-primary-500/30 text-primary-200 text-sm font-medium mb-6">
              <Music size={16} /> Welcome to Abhishek Ko Bhajan
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-6 font-devanagari">
              तपाईंको मनपर्ने भजन र गीतहरू
            </h1>
            <p className="text-lg leading-8 text-primary-100 mb-10 max-w-2xl mx-auto">
              Find authentic Nepali lyrics with automatic Roman transliteration. Listen, read, and sing along to your favorite spiritual and cultural songs.
            </p>
            
            <form onSubmit={handleSearch} className="flex max-w-md mx-auto relative group">
              <input
                type="text"
                placeholder="Search by title, artist, or lyrics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-300 rounded-full py-4 pl-6 pr-32 focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all shadow-lg"
              />
              <Button type="submit" className="absolute right-2 top-2 bottom-2 rounded-full px-6">
                Search
              </Button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
            <TrendingUp className="text-primary-500" /> Trending Now
          </h2>
          <Link to="/search?sort=trending" className="text-primary-500 font-medium hover:text-primary-600 flex items-center gap-1 group">
            View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="space-y-4">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="w-full aspect-video" />
                <Skeleton className="w-3/4 h-5" />
                <Skeleton className="w-1/2 h-4" />
              </div>
            ))
          ) : trending.length > 0 ? (
            trending.map(song => (
              <SongCard 
                key={song._id} 
                song={song} 
                onDelete={(deletedId) => {
                  setTrending(prev => prev.filter(s => s._id !== deletedId));
                  setRecent(prev => prev.filter(s => s._id !== deletedId));
                }} 
              />
            ))
          ) : (
            <p className="col-span-full text-gray-500 dark:text-gray-400 text-center py-8 bg-white dark:bg-dark-800 rounded-2xl border border-gray-100 dark:border-dark-700">No trending songs yet.</p>
          )}
        </div>
      </section>

      {/* Recent Uploads Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
            <Clock className="text-primary-500" /> Recently Added
          </h2>
          <Link to="/search" className="text-primary-500 font-medium hover:text-primary-600 flex items-center gap-1 group">
            Browse Library <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="space-y-4">
          {loading ? (
            Array(8).fill(0).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="w-full aspect-video" />
                <Skeleton className="w-3/4 h-5" />
                <Skeleton className="w-1/2 h-4" />
              </div>
            ))
          ) : recent.length > 0 ? (
            recent.map(song => (
              <SongCard 
                key={song._id} 
                song={song} 
                onDelete={(deletedId) => {
                  setTrending(prev => prev.filter(s => s._id !== deletedId));
                  setRecent(prev => prev.filter(s => s._id !== deletedId));
                }} 
              />
            ))
          ) : (
            <p className="col-span-full text-gray-500 dark:text-gray-400 text-center py-8 bg-white dark:bg-dark-800 rounded-2xl border border-gray-100 dark:border-dark-700">No recent songs yet.</p>
          )}
        </div>
      </section>
    </>
  );
};

export default Home;
