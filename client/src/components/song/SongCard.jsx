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
          <Card className="h-full flex flex-col p-0 overflow-hidden group relative">
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
