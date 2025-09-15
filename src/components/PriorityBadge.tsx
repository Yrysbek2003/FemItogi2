import React from 'react';
import { AlertTriangle, Minus, ArrowUp } from 'lucide-react';

interface PriorityBadgeProps {
  priority: 'low' | 'medium' | 'high';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const getPriorityConfig = () => {
    switch (priority) {
      case 'low':
        return {
          icon: Minus,
          label: 'Низкий',
          className: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
        };
      case 'medium':
        return {
          icon: Minus,
          label: 'Средний',
          className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
        };
      case 'high':
        return {
          icon: AlertTriangle,
          label: 'Высокий',
          className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        };
    }
  };

  const { icon: Icon, label, className } = getPriorityConfig();

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${className}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
};