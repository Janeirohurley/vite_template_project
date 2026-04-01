import { Info, CheckCircle, AlertTriangle, Bell, ArrowRight } from 'lucide-react';
import type { GuestNotification } from '../types';

interface NotificationCardProps {
  notification: GuestNotification;
  onClick?: () => void;
}

const iconMap = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertTriangle,
  action_required: Bell,
};

const styleMap = {
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'text-blue-600',
    title: 'text-blue-900',
  },
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: 'text-green-600',
    title: 'text-green-900',
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: 'text-amber-600',
    title: 'text-amber-900',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: 'text-red-600',
    title: 'text-red-900',
  },
  action_required: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: 'text-red-600',
    title: 'text-red-900',
  },
};

export function NotificationCard({ notification, onClick }: NotificationCardProps) {
  const Icon = iconMap[notification.type];
  const styles = styleMap[notification.type];

  const formattedDate = new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(notification.createdAt);

  return (
    <div
      className={`${styles.bg} ${styles.border} border rounded-lg p-4 transition-all
        ${onClick ? 'cursor-pointer hover:shadow-md' : ''}
        ${!notification.read ? 'ring-2 ring-blue-300 ring-offset-1' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
    >
      <div className="flex items-start gap-3">
        <div className={`${styles.icon} mt-0.5`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className={`font-medium ${styles.title}`}>
              {notification.title}
            </h4>
            {!notification.read && (
              <span className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500" />
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {notification.message}
          </p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400 dark:text-gray-500">{formattedDate}</span>
            {notification.actionUrl && (
              <span className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
                Voir plus <ArrowRight className="w-3 h-3" />
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
