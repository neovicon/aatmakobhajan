import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { adminApi } from '../../api/admin.api';
import UserTable from '../../components/admin/UserTable';
import Skeleton from '../../components/ui/Skeleton';
import Button from '../../components/ui/Button';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers(1);
  }, []);

  const fetchUsers = async (pageNum) => {
    setLoading(true);
    try {
      const data = await adminApi.getUsers({ page: pageNum, limit: 10 });
      setUsers(data.users);
      setTotalPages(data.pages);
      setPage(pageNum);
    } catch (error) {
      console.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Manage Users - Admin Dashboard</title>
      </Helmet>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage platform members.</p>
        </div>
        
        {loading ? (
          <Skeleton className="h-96 w-full rounded-2xl" />
        ) : (
          <div>
            <UserTable users={users} />
            
            {totalPages > 1 && (
              <div className="mt-4 flex justify-between items-center px-4 py-2 bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => fetchUsers(page - 1)} 
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Page {page} of {totalPages}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => fetchUsers(page + 1)} 
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Users;
