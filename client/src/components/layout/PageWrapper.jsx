import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const PageWrapper = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-dark-900 transition-colors duration-200">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PageWrapper;
