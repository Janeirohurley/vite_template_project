// src/modules/finance/layouts/FinanceLayout.tsx
import React from 'react';
import { motion } from "framer-motion"
import { AppHeader } from '@/components/ui/AppHeader';
import { FinanceNavItems } from '@/components/constants/navItems';
import { Sidebar } from '@/components/ui/Sidebar';
import { useSettings } from '@/lib';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// NOTE: J'assume que FinanceLayout reçoit des enfants pour envelopper le contenu (Outlet)

export default function FinanceLayout({ children }: { children: React.ReactNode }) {
    const { sidebarCollapsed } = useSettings()
    return (
        <ProtectedRoute requiredRole="finance_service">
            <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
                {/* Sidebar (repliable) */}
                <Sidebar title='Finance' navItems={FinanceNavItems} />

                <div className={`flex-1 transition-all duration-300 dark:bg-gray-950 overflow-hidden ${sidebarCollapsed ? "ml-20" : "ml-60"}`}>
                    <AppHeader navItems={FinanceNavItems} />


                    {/* Contenu de la page (Dashboard, Banks, etc.) */}
                    <main className="w-full max-w-full mx-auto px-6 py-8 overflow-x-auto">
                        {/* Affiche le contenu si utilisé comme Layout enveloppant */}
                        <motion.div>
                            {children}
                        </motion.div>
                    </main>
                </div>
            </div>
        </ProtectedRoute>

    );
}