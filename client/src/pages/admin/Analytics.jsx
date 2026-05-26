import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { adminApi } from '../../api/admin.api';
import AuditLogTable from '../../components/admin/AuditLogTable';
import Skeleton from '../../components/ui/Skeleton';
import Button from '../../components/ui/Button';

const Analytics = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchLogs(1);
  }, []);

  const fetchLogs = async (pageNum) => {
    setLoading(true);
    try {
      const data = await adminApi.getAuditLogs({ page: pageNum, limit: 15 });
      setLogs(data.logs);
      setTotalPages(data.pages);
      setPage(pageNum);
    } catch (error) {
      console.error('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Audit Logs & Analytics - Admin Dashboard</title>
      </Helmet>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Audit Logs</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track admin actions and security events.</p>
        </div>
        
        {loading ? (
          <Skeleton className="h-96 w-full rounded-2xl" />
        ) : (
          <div>
            <AuditLogTable logs={logs} />
            
            {totalPages > 1 && (
              <div className="mt-4 flex justify-between items-center px-4 py-2 bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => fetchLogs(page - 1)} 
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
                  onClick={() => fetchLogs(page + 1)} 
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

export default Analytics;
