import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import router from './routes/router';
import { useThemeStore } from './store/themeStore';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import { useSync } from './hooks/useSync';

function App() {
  const { theme, initTheme } = useThemeStore();
  const { checkAuth } = useAuthStore();
  
  // Initialize sync in background
  useSync();

  useEffect(() => {
    initTheme();
    checkAuth();
  }, [initTheme, checkAuth]);

  // Apply dark class to html tag based on theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: theme === 'dark' ? '#1e293b' : '#fff',
            color: theme === 'dark' ? '#f8fafc' : '#0f172a',
            border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0',
          }
        }}
      />
    </>
  );
}

export default App;
