import React from 'react';
import { Helmet } from 'react-helmet-async';
import SongForm from '../../components/admin/SongForm';

const CreateSong = () => {
  return (
    <>
      <Helmet>
        <title>Add New Song - Admin Dashboard</title>
      </Helmet>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Song</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Create a new bhajan entry.</p>
        </div>
        
        <div className="bg-white dark:bg-dark-800 rounded-3xl shadow-sm border border-gray-100 dark:border-dark-700 p-6 md:p-8">
          <SongForm />
        </div>
      </div>
    </>
  );
};

export default CreateSong;
