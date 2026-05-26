import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Eye, Heart, Edit, Trash2 } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { truncate } from '../../utils/truncate';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { songsApi } from '../../api/songs.api';
import toast from 'react-hot-toast';
import ConfirmDialog from '../admin/ConfirmDialog';

const SongCard = ({ song, onDelete }) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isAdmin = user?.role === 'admin';

  const handleEditClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/admin/songs/edit/${song._id}`);
  };

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await songsApi.deleteSong(song._id);
      toast.success('Song deleted successfully');
      setDeleteOpen(false);
      if (onDelete) {
        onDelete(song._id);
      }
    } catch (error) {
      toast.error('Failed to delete song');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
      >
        <Link to={`/song/${song.slug}`} className="block h-full">
          <Card className="h-full flex flex-row p-0 overflow-hidden group">
            <div className="relative w-20 h-20 md:w-32 md:h-32 flex-shrink-0 overflow-hidden bg-gray-200 dark:bg-dark-700">
              <img 
                src={song.coverImage !== 'default-cover.jpg' ? song.coverImage : 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=600'} 
                alt={song.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="bg-primary-500 rounded-full p-3 text-white transform scale-50 group-hover:scale-100 transition-transform duration-300">
                  <Play className="w-6 h-6 ml-1" />
                </div>
              </div>

              {/* Admin Quick Controls */}
              {isAdmin && (
                <div className="absolute top-2 right-2 flex gap-1.5 z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={handleEditClick}
                    className="p-1.5 bg-white/95 dark:bg-dark-800/95 text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-white dark:hover:bg-dark-700 rounded-lg shadow-md transition-all hover:scale-105"
                    title="Edit Song"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={handleDeleteClick}
                    className="p-1.5 bg-white/95 dark:bg-dark-800/95 text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-white dark:hover:bg-dark-700 rounded-lg shadow-md transition-all hover:scale-105"
                    title="Delete Song"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>
            
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-devanagari font-bold text-lg text-gray-900 dark:text-white line-clamp-1">
                  {song.title}
                </h3>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {song.artist}
              </p>
              
              <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100 dark:border-dark-700">
                <Badge variant="secondary" className="capitalize">{song.category}</Badge>
                
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" /> {song.viewCount || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5" /> {song.favoriteCount || 0}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </Link>
      </motion.div>

      {/* Wrapping Modal to prevent event bubbling inside portal */}
      {isAdmin && (
        <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
          <ConfirmDialog
            isOpen={deleteOpen}
            onClose={() => setDeleteOpen(false)}
            onConfirm={handleConfirmDelete}
            title="Delete Song"
            message={`Are you sure you want to delete "${song.title}"?`}
            confirmText="Delete"
            isLoading={deleting}
          />
        </div>
      )}
    </>
  );
};

export default SongCard;
