import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  X,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  FileText,
  ChevronRight,
} from 'lucide-react';
import type { GuestNotification } from '../types';
import { formatRelativeDate } from '../common';

interface NotificationPopoverProps {
  notifications: GuestNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export function NotificationPopover({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
}: NotificationPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<GuestNotification | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Fermer le popover en cliquant à l'extérieur
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedNotification(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotificationIcon = (type: GuestNotification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case 'action_required':
        return <FileText className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getNotificationBgColor = (type: GuestNotification['type'], read: boolean) => {
    if (read) return 'bg-white dark:bg-gray-900';
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/30';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/30';
      case 'warning':
        return 'bg-amber-50 dark:bg-amber-900/30';
      case 'action_required':
        return 'bg-blue-50 dark:bg-blue-900/30';
      default:
        return 'bg-blue-50 dark:bg-blue-900/30';
    }
  };

  const handleNotificationClick = (notification: GuestNotification) => {
    setSelectedNotification(notification);
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <div className="relative" ref={popoverRef}>
      {/* Bouton de notification */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-96 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllAsRead}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    Tout marquer comme lu
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Contenu */}
            <div className="max-h-96 overflow-y-auto">
              {selectedNotification ? (
                /* Vue détaillée d'une notification */
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4"
                >
                  <button
                    onClick={() => setSelectedNotification(null)}
                    className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mb-4"
                  >
                    <ChevronRight className="w-4 h-4 rotate-180" />
                    Retour aux notifications
                  </button>

                  <div className="flex items-start gap-3">
                    {getNotificationIcon(selectedNotification.type)}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        {selectedNotification.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {selectedNotification.message}
                      </p>
                      <span className="text-xs text-gray-400 dark:text-gray-500 mt-2 block">
                        {formatRelativeDate(new Date(selectedNotification.created_at))}
                      </span>

                      {/* Détails supplémentaires */}
                      {selectedNotification.details && (
                        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          {selectedNotification.details.document_id && (
                            <p className="text-sm">
                              <span className="font-medium">Document :</span>{' '}
                              {selectedNotification.details.document_name}
                            </p>
                          )}
                          {selectedNotification.details.rejection_reason && (
                            <div className="mt-2">
                              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                                Motif du refus :
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {selectedNotification.details.rejection_reason}
                              </p>
                            </div>
                          )}
                          {selectedNotification.details.approved_by && (
                            <p className="text-sm mt-2">
                              <span className="font-medium">Validé par :</span>{' '}
                              {selectedNotification.details.approved_by}
                            </p>
                          )}
                          {selectedNotification.details.next_steps && (
                            <div className="mt-3">
                              <p className="text-sm font-medium">Prochaines étapes :</p>
                              <ul className="mt-1 space-y-1">
                                {selectedNotification.details.next_steps.map((step, idx) => (
                                  <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full" />
                                    {step}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : notifications.length > 0 ? (
                /* Liste des notifications */
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {notifications.map((notification) => (
                    <button
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${getNotificationBgColor(notification.type, notification.read)}`}
                    >
                      <div className="flex items-start gap-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className={`text-sm truncate ${!notification.read ? 'font-semibold text-gray-900 dark:text-gray-100' : 'font-medium text-gray-700 dark:text-gray-300'}`}>
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">
                            {notification.message}
                          </p>
                          <span className="text-xs text-gray-400 dark:text-gray-500 mt-1 block">
                            {formatRelativeDate(new Date(notification.created_at))}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                /* État vide */
                <div className="py-12 px-4 text-center">
                  <div className="mx-auto w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
                    <Bell className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-gray-500 text-sm">
                    Aucune notification pour le moment
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Vous serez notifié des mises à jour importantes
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
