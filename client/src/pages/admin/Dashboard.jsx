import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Music, Users, Eye, Heart, Plus, ArrowLeft } from 'lucide-react';
import { adminApi } from '../../api/admin.api';
import StatCard from '../../components/admin/StatCard';
import Skeleton from '../../components/ui/Skeleton';
import Button from '../../components/ui/Button';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminApi.getAnalytics();
        setStats(data);
      } catch (error) {
        console.error('Failed to load stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - आत्मा को भजन</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center text-primary-500 hover:underline">
            <ArrowLeft size={20} className="mr-1" /> Back to Home
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
          <Link to="/admin/songs/new">
            <Button className="flex items-center gap-2">
              <Plus size={18} /> Add New Song
            </Button>
          </Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array(4).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full" />
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/admin/songs" className="block">
              <StatCard 
                title="Total Songs" 
                value={stats.totalSongs} 
                icon={<Music size={24} />} 
                trend={`+${stats.recentUploadsCount} this month`} 
              />
            </Link>
            <Link to="/admin/users" className="block">
              <StatCard 
                title="Total Users" 
                value={stats.totalUsers} 
                icon={<Users size={24} />} 
              />
            </Link>
            <Link to="/admin/views" className="block">
              <StatCard 
                title="Total Views" 
                value={stats.totalViews} 
                icon={<Eye size={24} />} 
              />
            </Link>
            <Link to="/admin/favorites" className="block">
              <StatCard 
                title="Total Favorites" 
                value={stats.totalFavorites} 
                icon={<Heart size={24} />} 
              />
            </Link>
          </div>
        ) : (
          <div className="text-red-500">Failed to load statistics.</div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
