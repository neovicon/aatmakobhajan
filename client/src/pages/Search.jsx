import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Filter, X, Plus, Search as SearchIcon } from 'lucide-react';
import { songsApi } from '../api/songs.api';
import { searchLocalSongs, getLocalSongs } from '../db/database';
import { useDebounce } from '../hooks/useDebounce';
import SongCard from '../components/song/SongCard';
import Skeleton from '../components/ui/Skeleton';
import Button from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';

const Search = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || '';
const initialTags = searchParams.get('tags') ? searchParams.get('tags').split(',') : [];
  
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 500);
  const [category, setCategory] = useState(initialCategory);
const [tags, setTags] = useState(initialTags);
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
  const params = {};
  if (debouncedQuery) params.q = debouncedQuery;
  if (category) params.category = category;
  if (tags.length > 0) params.tags = tags.join(',');
  setSearchParams(params, { replace: true });
  fetchResults(debouncedQuery, category, tags, 1);
}, [debouncedQuery, category, tags]);


  const fetchResults = async (q, cat, tagsParam = [], pageNum) => {
  setLoading(true);
  try {
    let data;
    if (!navigator.onLine) {
      // Offline fallback
      let localResults = q ? await searchLocalSongs(q) : await getLocalSongs();
      if (cat) {
        localResults = localResults.filter(s => s.category === cat);
      }
      if (tagsParam.length > 0) {
        localResults = localResults.filter(s => tagsParam.every(t => s.tags?.includes(t)));
      }
      data = {
        songs: localResults.slice((pageNum - 1) * 12, pageNum * 12),
        pages: Math.ceil(localResults.length / 12),
        total: localResults.length
      };
    } else {
      if (q) {
        data = await songsApi.searchSongs(q, {
          page: pageNum,
          limit: 12,
          category: cat,
          tags: tagsParam,
        });
      } else {
        data = await songsApi.getSongs({
          page: pageNum,
          limit: 12,
          category: cat,
          tags: tagsParam,
        });
      }
    }

    if (pageNum === 1) {
      setResults(data.songs);
    } else {
      setResults(prev => [...prev, ...data.songs]);
    }
    setTotalPages(data.pages);
    setPage(pageNum);
  } catch (error) {
    console.error('Search error:', error);
  } finally {
    setLoading(false);
  }
};

  const handleLoadMore = () => {
  if (page < totalPages) {
    fetchResults(debouncedQuery, category, tags, page + 1);
  }
};

  const clearFilters = () => {
  setQuery('');
  setCategory('');
  setTags([]);
};

  const categories = ['bhajan', 'chorus', 'others'];

  const handleSongDeleted = (deletedId) => {
    setResults(prev => prev.filter(song => song._id !== deletedId));
  };

  return (
    <>
      <Helmet>
        <title>Search - आत्मा को भजन</title>
      </Helmet>

      <div className="space-y-6">
        {isAdmin && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-900/20 px-6 py-4 rounded-2xl gap-4">
            <div>
              <h2 className="font-semibold text-primary-900 dark:text-primary-100">Admin Mode Active</h2>
              <p className="text-sm text-primary-700 dark:text-primary-300">You can manage, edit, and delete songs directly from the library.</p>
            </div>
            <Link to="/admin/songs/new">
              <Button size="sm" className="flex items-center gap-2">
                <Plus size={16} /> Add Songs
              </Button>
            </Link>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Filters */}
          <div className={`md:w-64 shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white dark:bg-dark-800 rounded-2xl p-5 border border-gray-100 dark:border-dark-700 sticky top-24">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Filter size={18} /> Filters
                </h3>
                {(query || category) && (
                  <button onClick={clearFilters} className="text-xs text-primary-500 hover:underline">
                    Clear all
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="cat-all"
                        checked={category === ''}
                        onChange={() => setCategory('')}
                        className="text-primary-500 focus:ring-primary-500 h-4 w-4"
                      />
                      <label htmlFor="cat-all" className="ml-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                        All Categories
                      </label>
                    </div>
                    {categories.map(cat => (
                      <div key={cat} className="flex items-center">
                        <input
                          type="radio"
                          id={`cat-${cat}`}
                          checked={category === cat}
                          onChange={() => setCategory(cat)}
                          className="text-primary-500 focus:ring-primary-500 h-4 w-4"
                        />
                        <label htmlFor={`cat-${cat}`} className="ml-2 text-sm text-gray-600 dark:text-gray-400 capitalize cursor-pointer">
                          {cat}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-6 flex gap-2">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search lyrics, titles, artists..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-white shadow-sm"
                />
                {query && (
                  <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <X size={16} />
                  </button>
                )}
              </div>
              <Button variant="outline" className="md:hidden" onClick={() => setShowFilters(!showFilters)}>
                <Filter size={20} />
              </Button>
            </div>

            {/* Results Grid */}
            {loading && page === 1 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="w-full aspect-video" />
                    <Skeleton className="w-3/4 h-5" />
                    <Skeleton className="w-1/2 h-4" />
                  </div>
                ))}
              </div>
            ) : results.length > 0 ? (
              <>
                <div className="space-y-4 mb-8">
                  {results.map(song => (
                    <SongCard key={song._id} song={song} onDelete={handleSongDeleted} />
                  ))}
                </div>
                
                {page < totalPages && (
                  <div className="text-center">
                    <Button onClick={handleLoadMore} isLoading={loading} variant="outline" className="px-8">
                      Load More
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-white dark:bg-dark-800 rounded-2xl border border-gray-100 dark:border-dark-700">
                <SearchIcon size={48} className="mx-auto text-gray-300 dark:text-dark-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No results found</h3>
                <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filters to find what you're looking for.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;
