import React from 'react';
import Card from '../ui/Card';

const StatCard = ({ title, value, icon, trend }) => {
  return (
    <Card className="flex items-center p-6 bg-white dark:bg-dark-800 border border-gray-100 dark:border-dark-700 shadow-sm rounded-2xl">
      <div className="p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-500 mr-4">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
        {trend && (
          <p className="text-xs text-green-500 mt-1 font-medium">{trend}</p>
        )}
      </div>
    </Card>
  );
};

export default StatCard;
