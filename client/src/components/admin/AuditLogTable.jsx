import React from 'react';
import Badge from '../ui/Badge';
import { formatDate } from '../../utils/formatDate';

const AuditLogTable = ({ logs }) => {
  const getActionColor = (action) => {
    switch(action) {
      case 'CREATE': return 'success';
      case 'UPDATE': return 'primary';
      case 'DELETE': return 'danger';
      case 'RESTORE': return 'warning';
      case 'UPLOAD': return 'secondary';
      case 'LOGIN_FAILED': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div className="overflow-x-auto bg-white dark:bg-dark-800 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-700">
      <table className="w-full whitespace-nowrap text-left">
        <thead className="bg-gray-50 dark:bg-dark-700 border-b border-gray-100 dark:border-dark-600">
          <tr>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Admin</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Target</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">IP Address</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-dark-600">
          {logs.map((log) => (
            <tr key={log._id} className="hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors">
              <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {new Date(log.timestamp).toLocaleString()}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                {log.admin?.username || 'Unknown'}
              </td>
              <td className="px-6 py-4">
                <Badge variant={getActionColor(log.action)}>{log.action}</Badge>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {log.targetType} {log.targetId ? `(${log.targetId.substring(0, 8)}...)` : ''}
              </td>
              <td className="px-6 py-4 text-sm font-mono text-gray-500 dark:text-gray-400">
                {log.ipAddress || '-'}
              </td>
            </tr>
          ))}
          {logs.length === 0 && (
            <tr>
              <td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                No audit logs found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AuditLogTable;
