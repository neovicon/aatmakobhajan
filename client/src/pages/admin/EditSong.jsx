import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { songsApi } from '../../api/songs.api';
import SongForm from '../../components/admin/SongForm';
import Skeleton from '../../components/ui/Skeleton';

const EditSong = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSong = async () => {
      try {
        // We use search or specific API, but currently getSongBySlug exists, 
        // We need a way to fetch by ID or we assume the admin list already gave us the data, 
        // actually we can fetch all and filter or add getSongById to API.
        // Let's use getSongs with ID if API doesn't have it, wait our API only has /:slug
        // I will add a small workaround or assume we can search by ID in getSongs
        // Wait, the backend route GET /api/songs/:slug handles slug. I'll just use search query with title or fetch all.
        // Or wait! Express route is GET /:slug. 
        // Let's just fetch all and find it since it's an admin panel.
        const data = await songsApi.getSongs({ limit: 1000 });
        const found = data.songs.find(s => s._id === id);
        if (found) {
          setSong(found);
        } else {
          toast.error('Song not found');
          navigate('/admin/songs');
        }
      } catch (error) {
        toast.error('Failed to fetch song');
      } finally {
        setLoading(false);
      }
    };
    fetchSong();
  }, [id, navigate]);

  return (
    <>
      <Helmet>
        <title>Edit Song - Admin Dashboard</title>
      </Helmet>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Song</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Update details for "{song?.title}".</p>
        </div>
        
        <div className="bg-white dark:bg-dark-800 rounded-3xl shadow-sm border border-gray-100 dark:border-dark-700 p-6 md:p-8">
          {loading ? (
            <div className="space-y-6">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : song ? (
            <SongForm initialData={song} isEdit={true} />
          ) : null}
        </div>
      </div>
    </>
  );
};

export default EditSong;
