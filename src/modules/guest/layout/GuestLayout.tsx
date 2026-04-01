import { useState } from 'react';
import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import {
  LayoutDashboard,
  User,
  LogOut,
  Menu,
  X,
  GraduationCap,
  Clock,
  Search,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuthStore } from '@/modules/auth';
import { NotificationPopover } from '../components';
import { useGuestStore } from '../store';
import { useGuestNotifications } from '../hooks';
import { GUEST_STATUS_CONFIG } from '../constants';

interface GuestLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Tableau de bord', href: '/guest', icon: LayoutDashboard },
  { name: 'Mon profil', href: '/guest/profile', icon: User },
];

const statusIconMap = {
  pending: Clock,
  under_review: Search,
  approved: CheckCircle,
  rejected: XCircle,
};

export function GuestLayout({ children }: GuestLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();
  const { status } = useGuestStore();
  const { notifications, markAsRead, markAllAsRead } = useGuestNotifications();

  const statusConfig = GUEST_STATUS_CONFIG[status] || GUEST_STATUS_CONFIG.pending;
  const StatusIcon = statusIconMap[status] || Clock;

  const isActive = (href: string) => {
    if (href === '/guest') {
      return location.pathname === '/guest';
    }
    return location.pathname.startsWith(href);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate({ to: '/auth/login' });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['guest']}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Sidebar mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-gray-900/50 dark:bg-gray-950/80"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-900 shadow-xl">
              <div className="flex items-center justify-between p-4 border-b dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  <span className="font-bold text-gray-900 dark:text-gray-100">UMS</span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="w-5 h-5 text-gray-900 dark:text-gray-100" />
                </button>
              </div>

              {/* Badge statut mobile */}
              <div className={`mx-4 mt-4 p-3 rounded-lg border ${statusConfig.bgColor} ${statusConfig.borderColor}`}>
                <div className="flex items-center gap-2">
                  <StatusIcon className={`w-4 h-4 ${statusConfig.textColor}`} />
                  <span className={`text-xs font-medium ${statusConfig.textColor}`}>
                    {statusConfig.label}
                  </span>
                </div>
              </div>

              <nav className="p-4 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isActive(item.href)
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                ))}
              </nav>

              {/* User info et déconnexion mobile */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t dark:border-gray-800">
                {user && (
                  <div className="flex items-center gap-3 mb-3 px-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {user.first_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                    </div>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LogOut className="w-5 h-5" />
                  {isLoggingOut ? 'Déconnexion...' : 'Se déconnecter'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sidebar desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-64 lg:bg-white dark:lg:bg-gray-900 lg:border-r lg:border-gray-200 dark:lg:border-gray-800">
          <div className="flex items-center gap-2 p-4 border-b dark:border-gray-800">
            <GraduationCap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <div>
              <span className="font-bold text-gray-900 dark:text-gray-100">UMS</span>
              <span className="block text-xs text-gray-500 dark:text-gray-400">University Management</span>
            </div>
          </div>

          {/* Badge statut dynamique */}
          <div className={`mx-4 mt-4 p-3 rounded-lg border ${statusConfig.bgColor} ${statusConfig.borderColor}`}>
            <div className="flex items-center gap-2">
              {status === 'pending' || status === 'under_review' ? (
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${status === 'pending' ? 'bg-amber-400' : 'bg-blue-400'}`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${status === 'pending' ? 'bg-amber-500' : 'bg-blue-500'}`}></span>
                </span>
              ) : (
                <StatusIcon className={`w-4 h-4 ${statusConfig.textColor}`} />
              )}
              <span className={`text-xs font-medium ${statusConfig.textColor}`}>
                {statusConfig.label}
              </span>
            </div>
          </div>

          <nav className="p-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${isActive(item.href)
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User info et déconnexion en bas */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t dark:border-gray-800">
            {user && (
              <div className="flex items-center gap-3 mb-3 px-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {user.first_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogOut className="w-5 h-5" />
              {isLoggingOut ? 'Déconnexion...' : 'Se déconnecter'}
            </button>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="lg:pl-64">
          {/* Header mobile */}
          <header className="sticky top-0 z-40 flex items-center justify-between bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 lg:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Menu className="w-5 h-5 text-gray-900 dark:text-gray-100" />
            </button>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <span className="font-bold text-gray-900 dark:text-gray-100">UMS</span>
            </div>
            <NotificationPopover
              notifications={notifications}
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
            />
          </header>

          {/* Page content */}
          <main className="p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
