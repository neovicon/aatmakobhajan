import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-dark-900 transition-colors duration-200">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      <main className="flex-1 overflow-x-hidden">
        {/* Mobile header placeholder if needed later, but spec says dashboard is mostly desktop focused. 
            We can add a simple mobile menu button here if required, but for now just the content area. */}
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
