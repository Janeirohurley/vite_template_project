import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

import { useSettings } from '@/store/settings';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminNavItems } from '@/components/constants/navItems';
import { AppHeader } from '@/components/ui/AppHeader';
import { Sidebar } from '@/components/ui/Sidebar';

interface AdminLayoutProps {
    children: ReactNode;
}


export function AdminLayout({ children }: AdminLayoutProps) {
    const { sidebarCollapsed } = useSettings();

    return (
        <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 relative">

            {/* SIDEBAR GAUCHE */}
                <Sidebar title='Admin' navItems={AdminNavItems} />
            {/* CONTENU PRINCIPAL */}
            <div
                className={`
                    flex-1
                    transition-all duration-300
                    dark:bg-gray-950
                    overflow-hidden
                    
                    ${sidebarCollapsed ? "ml-20" : "ml-60"}
                `}
            >
                    <AppHeader
                        navItems={AdminNavItems}
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
