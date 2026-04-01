import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AppHeader } from '../components';
import { useSettings } from '@/store/settings';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { studentServiceNavItems } from '../../../components/constants/navItems';
import { Sidebar } from '@/components/ui/Sidebar';

interface StudentServiceLayoutProps {
  children: ReactNode;
}

export function StudentServiceLayout({ children }: StudentServiceLayoutProps) {
  const { sidebarCollapsed } = useSettings();

  return (
    <ProtectedRoute requiredRole="student_service">
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar title='S des Etudiants' navItems={studentServiceNavItems} />

        <div
          className={`
            flex-1
            transition-all duration-300
            dark:bg-gray-950
            overflow-hidden
            ${sidebarCollapsed ? 'ml-20' : 'ml-60'}
          `}
        >
          <AppHeader
            navItems={studentServiceNavItems}
          />

          <main className="w-full max-w-full mx-auto px-6 py-8 overflow-x-hidden">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
