import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, Sun, Moon, Music } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';
import Button from '../ui/Button';
import InstallPrompt from '../pwa/InstallPrompt';
import { WifiOff } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, toggleTheme } = useThemeStore();
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isOffline, setIsOffline] = React.useState(!navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Trending', path: '/search?sort=trending' },
    { name: 'About', path: '/about' },
    { name: 'Download App', path: '/download' },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary-500 p-2 rounded-lg text-white">
              <Music size={20} />
            </div>
            <span className="font-devanagari font-bold text-xl tracking-tight hidden sm:block text-gray-900 dark:text-white">
              आत्मा को भजन
            </span>
          </Link>



          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4">
            {isOffline && (
              <span className="flex items-center gap-1 text-xs font-medium bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 px-2 py-1 rounded-full mr-2">
                <WifiOff size={14} /> Offline Mode
              </span>
            )}
            
            <InstallPrompt />

            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} className="text-sm font-medium text-gray-600 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-400 transition-colors">
                {link.name}
              </Link>
            ))}

            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors">
              {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-600" />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to={user.role === 'admin' ? '/admin' : '/profile'}>
                  <img src={user.profileImage !== 'default.jpg' ? user.profileImage : `https://ui-avatars.com/api/?name=${user.username}&background=0D8ABC&color=fff`} alt="Profile" className="w-8 h-8 rounded-full border border-primary-500" />
                </Link>
                <Button variant="ghost" size="sm" onClick={logout}>Logout</Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login"><Button variant="ghost" size="sm">Log in</Button></Link>
                <Link to="/register"><Button size="sm">Sign up</Button></Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            {isOffline && (
              <span className="text-red-500 mr-2">
                <WifiOff size={20} />
              </span>
            )}
            <button onClick={toggleTheme} className="p-2 rounded-full">
              {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-600" />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md text-gray-600 dark:text-gray-300 focus:outline-none">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-dark-800 border-t border-gray-200 dark:border-dark-700">
          <div className="px-4 pt-2 pb-4 space-y-3">
            <div className="flex flex-col space-y-2 mt-4">
              {navLinks.map((link) => (
                <Link key={link.name} to={link.path} onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-700">
                  {link.name}
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  <Link to={user.role === 'admin' ? '/admin' : '/profile'} onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-700">
                    Dashboard
                  </Link>
                  <button onClick={() => { logout(); setIsOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-100 dark:hover:bg-dark-700">
                    Logout
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2 mt-4 px-3">
                  <Link to="/login" onClick={() => setIsOpen(false)}><Button variant="outline" className="w-full">Log in</Button></Link>
                  <Link to="/register" onClick={() => setIsOpen(false)}><Button className="w-full">Sign up</Button></Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
