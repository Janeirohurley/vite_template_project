import React from 'react';
import clsx from 'clsx';
import { Link, useMatchRoute } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
    label: string;
    to: string;
    icon: LucideIcon;
    exact?: boolean;
}

interface SubNavigationProps {
    items: NavItem[];
    className?: string;
}

export const SubNavigation: React.FC<SubNavigationProps> = ({ items, className }) => {
    const matchRoute = useMatchRoute();

    return (
        <nav className={clsx(
            "sticky top-0 z-30 border-b",
            "bg-white/90 dark:bg-gray-950/90",
            "backdrop-blur-xl supports-backdrop-filter:bg-white/70 supports-backdrop-filter:dark:bg-gray-950/70",
            "border-gray-200/70 dark:border-gray-800/70",
            " dark:shadow-xl",
            className
        )}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center h-16 -mb-px">
                    <div className="flex space-x-1 sm:space-x-4 overflow-x-auto scrollbar-hide">
                        {items.map((item) => {
                            const Icon = item.icon;
                            const isActive = item.exact
                                ? matchRoute({ to: item.to, fuzzy: false })
                                : matchRoute({ to: item.to, fuzzy: true });

                            return (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    preload="intent"
                                    className={clsx(
                                        "relative flex items-center gap-2.5 px-3 sm:px-4 py-3.5",
                                        "text-sm font-medium whitespace-nowrap",
                                        "transition-all duration-300",
                                        "rounded-t-xl",
                                        isActive
                                            ? "text-blue-600 dark:text-blue-400"
                                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                                    )}
                                >
                                    {/* Contenu avec animation */}
                                    <motion.div
                                        className="flex items-center gap-2.5"
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Icon className="w-4.5 h-4.5" strokeWidth={2.3} />
                                        <span className="hidden sm:inline">{item.label}</span>
                                        <span className="sm:hidden">{item.label.slice(0, 3)}.</span>
                                    </motion.div>

                                    {/* Barre active animée (layoutId partagé) */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="subnav-active-tab"
                                            className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 dark:bg-blue-500 rounded-t-full"
                                            initial={{ opacity: 0, scaleX: 0.8 }}
                                            animate={{ opacity: 1, scaleX: 1 }}
                                            exit={{ opacity: 0, scaleX: 0.8 }}
                                            transition={{ type: "spring", stiffness: 500, damping: 35 }}
                                        />
                                    )}

                                    {/* Fond actif subtil */}
                                    {isActive && (
                                        <motion.div
                                            className="absolute inset-0 bg-blue-50/50 dark:bg-blue-500/10 rounded-t-xl -z-10"
                                            layoutId="subnav-active-bg"
                                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </nav>
    );
};