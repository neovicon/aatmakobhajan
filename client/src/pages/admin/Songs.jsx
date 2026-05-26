import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Plus, Edit, Trash2, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import { songsApi } from '../../api/songs.api';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import Skeleton from '../../components/ui/Skeleton';

const Songs = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchSongs(1);
  }, []);

  const fetchSongs = async (pageNum) => {
    setLoading(true);
    try {
      const data = await songsApi.getSongs({ page: pageNum, limit: 20 });
      setSongs(data.songs);
      setTotalPages(data.pages);
      setPage(pageNum);
    } catch (error) {
      toast.error('Failed to load songs');
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (song) => {
    setSelectedSong(song);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await songsApi.deleteSong(selectedSong._id);
      toast.success('Song deleted successfully');
      setDeleteModalOpen(false);
      fetchSongs(page);
    } catch (error) {
      toast.error('Failed to delete song');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Manage Songs - Admin Dashboard</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Songs</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage all bhajans in the platform.</p>
          </div>
          <Link to="/admin/songs/new">
            <Button className="flex items-center gap-2">
              <Plus size={18} /> Add New Song
            </Button>
          </Link>
        </div>
        
        {loading ? (
          <Skeleton className="h-96 w-full rounded-2xl" />
        ) : (
          <div className="overflow-x-auto bg-white dark:bg-dark-800 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-700">
            <table className="w-full whitespace-nowrap text-left">
              <thead className="bg-gray-50 dark:bg-dark-700 border-b border-gray-100 dark:border-dark-600">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Song</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stats</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-dark-600">
                {songs.map((song) => (
                  <tr key={song._id} className="hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={song.coverImage !== 'default-cover.jpg' ? song.coverImage : 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=150'} 
                          alt="" 
                          className="w-12 h-12 rounded-lg object-cover" 
                        />
                        <div>
                          <p className="font-medium font-devanagari text-gray-900 dark:text-white line-clamp-1">{song.title}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{song.artist}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary" className="capitalize">{song.category}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col gap-1">
                        <span>{song.viewCount} Views</span>
                        <span>{song.favoriteCount} Favs</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link to={`/admin/songs/edit/${song._id}`}>
                          <button className="p-2 text-gray-400 hover:text-primary-500 bg-gray-100 dark:bg-dark-700 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors">
                            <Edit size={16} />
                          </button>
                        </Link>
                        <button 
                          onClick={() => openDeleteModal(song)}
                          className="p-2 text-gray-400 hover:text-red-500 bg-gray-100 dark:bg-dark-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-100 dark:border-dark-600 flex justify-between items-center">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => fetchSongs(page - 1)} 
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Page {page} of {totalPages}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => fetchSongs(page + 1)} 
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Song"
        message={`Are you sure you want to delete "${selectedSong?.title}"? This action can be reversed via database by removing the isDeleted flag, but it will be hidden from the app immediately.`}
        confirmText="Delete"
        isLoading={isDeleting}
      />
    </>
  );
};

export default Songs;
