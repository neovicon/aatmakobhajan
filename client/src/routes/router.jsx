import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Layouts
import PageWrapper from '../components/layout/PageWrapper';
import DashboardLayout from '../components/layout/DashboardLayout';

// Routes
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';

// Loading Fallback
const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-dark-900">
    <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
  </div>
);

// Lazy load pages
const Home = lazy(() => import('../pages/Home'));
const Search = lazy(() => import('../pages/Search'));
const SongDetail = lazy(() => import('../pages/SongDetail'));
const About = lazy(() => import('../pages/About'));
const NotFound = lazy(() => import('../pages/NotFound'));
const DownloadApp = lazy(() => import('../pages/DownloadApp'));

// Auth
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));

// Profile
const Profile = lazy(() => import('../pages/profile/Profile'));
const Favorites = lazy(() => import('../pages/profile/Favorites'));

// Admin
const Dashboard = lazy(() => import('../pages/admin/Dashboard'));
const Songs = lazy(() => import('../pages/admin/Songs'));
const CreateSong = lazy(() => import('../pages/admin/CreateSong'));
const EditSong = lazy(() => import('../pages/admin/EditSong'));
const Users = lazy(() => import('../pages/admin/Users'));
const AboutEditor = lazy(() => import('../pages/admin/AboutEditor'));
const Analytics = lazy(() => import('../pages/admin/Analytics'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <PageWrapper />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Suspense fallback={<LoadingFallback />}><Search /></Suspense>,
      },
      {
        path: 'search',
        element: <Suspense fallback={<LoadingFallback />}><Search /></Suspense>,
      },
      {
        path: 'song/:slug',
        element: <Suspense fallback={<LoadingFallback />}><SongDetail /></Suspense>,
      },
      {
        path: 'about',
        element: <Suspense fallback={<LoadingFallback />}><About /></Suspense>,
      },
      {
        path: 'download',
        element: <Suspense fallback={<LoadingFallback />}><DownloadApp /></Suspense>,
      },
      {
        path: 'login',
        element: <Suspense fallback={<LoadingFallback />}><Login /></Suspense>,
      },
      {
        path: 'register',
        element: <Suspense fallback={<LoadingFallback />}><Register /></Suspense>,
      },
      // Protected User Routes
      {
        element: <PrivateRoute />,
        children: [
          {
            path: 'profile',
            element: <Suspense fallback={<LoadingFallback />}><Profile /></Suspense>,
          },
          {
            path: 'favorites',
            element: <Suspense fallback={<LoadingFallback />}><Favorites /></Suspense>,
          },
        ]
      }
    ],
  },
  // Admin Routes
  {
    path: '/admin',
    element: <AdminRoute />,
    children: [
      {
        element: <Suspense fallback={<LoadingFallback />}><DashboardLayout /></Suspense>,
        children: [
          {
            index: true,
            element: <Suspense fallback={<LoadingFallback />}><Dashboard /></Suspense>,
          },
          {
            path: 'songs',
            element: <Suspense fallback={<LoadingFallback />}><Songs /></Suspense>,
          },
          {
            path: 'songs/new',
            element: <Suspense fallback={<LoadingFallback />}><CreateSong /></Suspense>,
          },
          {
            path: 'songs/edit/:id',
            element: <Suspense fallback={<LoadingFallback />}><EditSong /></Suspense>,
          },
          {
            path: 'users',
            element: <Suspense fallback={<LoadingFallback />}><Users /></Suspense>,
          },
          {
            path: 'about',
            element: <Suspense fallback={<LoadingFallback />}><AboutEditor /></Suspense>,
          },
          {
            path: 'analytics',
            element: <Suspense fallback={<LoadingFallback />}><Analytics /></Suspense>,
          }
        ]
      }
    ]
  },
  {
    path: '*',
    element: <NotFound />
  }
]);

export default router;
