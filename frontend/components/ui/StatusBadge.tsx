import React from 'react';

export interface StatusBadgeProps {
  status: 'APPLIED' | 'SANCTIONED' | 'DISBURSED' | 'REJECTED' | 'CLOSED';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getBadgeStyles = () => {
    switch (status) {
      case 'APPLIED':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'SANCTIONED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'DISBURSED':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'CLOSED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getBadgeStyles()}`}>
      {status}
    </span>
  );
};
