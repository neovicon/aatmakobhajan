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
          <Card className="h-full flex items-center p-3 gap-3 overflow-hidden group relative">
            <img
              src="https://res.cloudinary.com/dlf3ixlw6/image/upload/v1779773579/519070531_1790024805723604_1260567920847134899_n_dp9inh.jpg"
              alt="Artist"
              className="w-12 h-12 rounded-full object-cover flex-shrink-0"
            />
            
            <div className="flex-1 min-w-0">
              <h3 className="font-devanagari font-bold text-sm text-gray-900 dark:text-white line-clamp-1">
                {song.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                {song.artist}
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 shrink-0">
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" /> {song.viewCount || 0}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5" /> {song.favoriteCount || 0}
              </span>
            </div>

            {/* Admin Quick Controls */}
            {isAdmin && (
              <div className="flex gap-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <button
                  onClick={handleEditClick}
                  className="p-1.5 text-gray-400 hover:text-primary-500 rounded-lg transition-colors"
                  title="Edit Song"
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                  title="Delete Song"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
            
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
