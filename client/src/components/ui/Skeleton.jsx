import React from 'react';

const Skeleton = ({ className = '', variant = 'rectangular' }) => {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-dark-700';
  
  const variants = {
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
    text: 'rounded-md h-4'
  };

  return (
    <div className={`${baseClasses} ${variants[variant]} ${className}`} />
  );
};

export default Skeleton;
