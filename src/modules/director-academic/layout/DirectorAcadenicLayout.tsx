import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Sidebar } from "@/components/ui/Sidebar";
import { useSettings } from "@/lib";
import type { ReactNode } from "react";
import {motion} from "framer-motion"
import { AppHeader } from "@/components/ui/AppHeader";
import { DirectorAcademicNavItems } from "@/components/constants/navItems";

interface DirectorAcademicProps{
    children: ReactNode;
}
export function DirectorAcadenicLayout({ children }: DirectorAcademicProps){
    const { sidebarCollapsed } = useSettings();
    return(
        <ProtectedRoute allowedRoles={["director_academic", "rector"]}>
            <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 relative">

                {/* SIDEBAR GAUCHE */}
                <Sidebar title='Director Academic' navItems={DirectorAcademicNavItems} />
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
                        navItems={DirectorAcademicNavItems}
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