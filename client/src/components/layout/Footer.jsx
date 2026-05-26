import React from 'react';
import { Link } from 'react-router-dom';
import { Music, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-dark-800 border-t border-gray-200 dark:border-dark-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-primary-500">
            <Music size={24} />
            <span className="font-devanagari font-bold text-xl tracking-tight text-gray-900 dark:text-white">
              आत्मा को भजन
            </span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            Made with <Heart size={16} className="text-red-500 mx-1 animate-pulse" /> for Nepali music lovers
          </div>
          
          <div className="flex gap-6 text-sm font-medium">
            <Link to="/about" className="text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
              About Us
            </Link>
            <a href="mailto:contact@example.com" className="text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
              Contact
            </a>
          </div>
        </div>
        
        <div className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500">
          &copy; {new Date().getFullYear()} आत्मा को भजन. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
