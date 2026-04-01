import { motion } from "framer-motion";
import { Link, useMatchRoute } from "@tanstack/react-router";
import {
    LayoutDashboard,
    Users,
    Settings,
    GraduationCap,
    Shield,
    FileText,
    Database,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import clsx from "clsx";
import { useSettings } from "@/store/settings";

const navItems = [
    { label: "Tableau de bord", to: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Utilisateurs", to: "/admin/users", icon: Users },
    { label: "Programmes", to: "/admin/programs", icon: GraduationCap },
    { label: "Configuration", to: "/admin/configs", icon: Settings },
    { label: "Sécurité", to: "/admin/security", icon: Shield },
    { label: "Audit", to: "/admin/logs", icon: FileText },
    { label: "Sauvegarde", to: "/admin/backup", icon: Database },
];

export function Sidebar() {
    const { sidebarCollapsed, toggleSidebar } = useSettings();

    const matchRoute = useMatchRoute();

    return (
        <motion.aside
            animate={{ width: sidebarCollapsed ? 80 : 240 }}
            className="
        h-screen fixed top-0 left-0 
        bg-white dark:bg-gray-950 
        border-r border-gray-200 dark:border-gray-800
        flex flex-col z-50
      "
        >
            {/* HEADER SIDEBAR */}
            <div className="p-4 flex justify-between items-center">
                <span className={clsx(
                    "text-xl font-bold transition-all",
                    sidebarCollapsed && "hidden"
                )}>
                    Admin
                </span>

                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded  hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                    {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            {/* NAVIGATION LIST */}
            <nav className="flex flex-col mt-4 space-y-1 px-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = matchRoute({ to: item.to, fuzzy: true });

                    return (
                        <Link
                            key={item.to}
                            to={item.to}
                            preload="intent"
                            className={clsx(
                                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
                                isActive
                                    ? "bg-blue-600 text-white shadow"
                                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                                    sidebarCollapsed && "justify-center px-2"

                            )}
                        >
                            <Icon size={20} />

                            {!sidebarCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-sm font-medium"
                                >
                                    {item.label}
                                </motion.span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto p-4 text-center text-xs text-gray-500 dark:text-gray-600">
                {!sidebarCollapsed && "© 2025 — Admin System"}
            </div>
        </motion.aside>
    );
}
