import React from 'react';

const Input = React.forwardRef(({ 
  label, 
  error, 
  className = '', 
  id, 
  type = 'text',
  ...props 
}, ref) => {
  const inputId = id || Math.random().toString(36).substring(7);
  
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        type={type}
        className={`w-full rounded-lg border bg-white dark:bg-dark-800 px-4 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-dark-600 focus:border-primary-500'
        }`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
