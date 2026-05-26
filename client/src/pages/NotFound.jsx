import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Home } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found</title>
      </Helmet>
      
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-9xl font-bold text-gray-200 dark:text-dark-700">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-4 mb-2">Page not found</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been removed or the URL is incorrect.
        </p>
        <Link to="/">
          <Button className="flex items-center gap-2 rounded-full">
            <Home size={18} /> Back to Home
          </Button>
        </Link>
      </div>
    </>
  );
};

export default NotFound;
