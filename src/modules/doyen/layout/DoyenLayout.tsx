import { deanNavListSimple } from "@/components/constants/navItems";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppHeader } from "@/components/ui/AppHeader";
import { Sidebar } from "@/components/ui/Sidebar";
import { useSettings } from "@/store/settings";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface DoyenLayoutProps {
    children: ReactNode;
}
export function DoyenLayout({ children }: DoyenLayoutProps) {
    const { sidebarCollapsed } = useSettings();
    return (
        <ProtectedRoute requiredRole={"dean"}>
            <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
                {/* SIDEBAR GAUCHE */}
                <Sidebar title='Dean' navItems={deanNavListSimple} />
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
                        navItems={deanNavListSimple}
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

    )




}