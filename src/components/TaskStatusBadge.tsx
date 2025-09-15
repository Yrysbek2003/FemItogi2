import React from 'react';
import { Clock, Play, CheckCircle } from 'lucide-react';

interface TaskStatusBadgeProps {
  status: 'pending' | 'in_progress' | 'completed';
  onClick?: () => void;
}

export const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = ({ status, onClick }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          label: 'Ожидает',
          className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
        };
      case 'in_progress':
        return {
          icon: Play,
          label: 'В работе',
          className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
        };
      case 'completed':
        return {
          icon: CheckCircle,
          label: 'Завершено',
          className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        };
    }
  };

  const { icon: Icon, label, className } = getStatusConfig();

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full transition-colors hover:opacity-80 ${className}`}
    >
      <Icon className="w-3 h-3" />
      {label}
    </button>
  );
};