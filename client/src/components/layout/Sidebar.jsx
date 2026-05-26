import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Music, Users, Settings, LogOut, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const Sidebar = () => {
  const { logout } = useAuthStore();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} />, exact: true },
    { name: 'Songs', path: '/admin/songs', icon: <Music size={20} /> },
    { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'About Page', path: '/admin/about', icon: <Settings size={20} /> },
  ];

  return (
    <div className="w-64 h-screen bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-dark-700 flex flex-col sticky top-0">
      <div className="p-6">
        <h2 className="text-xl font-bold font-devanagari text-primary-500 flex items-center gap-2">
          <Music size={24} />
          Admin Panel
        </h2>
      </div>

      <div className="flex-1 px-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.exact}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 font-medium'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-700'
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-dark-700 space-y-2">
        <NavLink
          to="/"
          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Site
        </NavLink>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-left"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
