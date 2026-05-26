import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuthStore } from '../../store/authStore';
import { User, Mail, Shield, Calendar } from 'lucide-react';
import Card from '../../components/ui/Card';
import { formatDate } from '../../utils/formatDate';
import Favorites from './Favorites';

const Profile = () => {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <>
      <Helmet>
        <title>My Profile - आत्मा को भजन</title>
      </Helmet>

      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
        
        <Card className="relative overflow-hidden p-8">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary-500 to-primary-600 opacity-20"></div>
          
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 mt-8 sm:mt-12">
            <img 
              src={user.profileImage !== 'default.jpg' ? user.profileImage : `https://ui-avatars.com/api/?name=${user.username}&background=0D8ABC&color=fff&size=128`} 
              alt={user.username} 
              className="w-32 h-32 rounded-full border-4 border-white dark:border-dark-800 shadow-lg bg-white"
            />
            
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.username}</h2>
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-medium border border-primary-100 dark:border-primary-800">
                <Shield size={14} />
                <span className="capitalize">{user.role}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12 pt-8 border-t border-gray-100 dark:border-dark-700">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-dark-700 text-gray-500 dark:text-gray-400">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</p>
                <p className="text-base text-gray-900 dark:text-white mt-1">{user.email}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-dark-700 text-gray-500 dark:text-gray-400">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Member Since</p>
                <p className="text-base text-gray-900 dark:text-white mt-1">
                  {user.createdAt ? formatDate(user.createdAt) : 'Unknown'}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Since user can also view favorites here or separate, we can just embed Favorites here or leave it separate. I'll embed a quick link or just show it below. */}
        <div className="mt-12">
           <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Favorites</h2>
           <Favorites inline={true} />
        </div>
      </div>
    </>
  );
};

export default Profile;
