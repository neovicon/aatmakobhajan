import React from 'react';
import Badge from '../ui/Badge';
import { formatDate } from '../../utils/formatDate';

const UserTable = ({ users }) => {
  return (
    <div className="overflow-x-auto bg-white dark:bg-dark-800 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-700">
      <table className="w-full whitespace-nowrap text-left">
        <thead className="bg-gray-50 dark:bg-dark-700 border-b border-gray-100 dark:border-dark-600">
          <tr>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Joined</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-dark-600">
          {users.map((user) => (
            <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <img src={user.profileImage !== 'default.jpg' ? user.profileImage : `https://ui-avatars.com/api/?name=${user.username}&background=random`} alt="" className="w-8 h-8 rounded-full" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{user.username}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <Badge variant={user.role === 'admin' ? 'primary' : 'secondary'}>
                  {user.role}
                </Badge>
              </td>
              <td className="px-6 py-4">
                {user.lockUntil && new Date(user.lockUntil) > new Date() ? (
                  <Badge variant="danger">Locked</Badge>
                ) : (
                  <Badge variant="success">Active</Badge>
                )}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {formatDate(user.createdAt)}
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan="4" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
