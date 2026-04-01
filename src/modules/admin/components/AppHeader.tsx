/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import { SettingsMenu } from '@/components/layout/SettingsMenu';

interface AppHeaderProps {
    title: string;
    icon?: React.ReactNode; // maintenant tu passes directement <LayoutDashboard className="w-5 h-5" />
    userName: string;
    userRole: string;
    userAvatar?: string;
    onProfileClick?: () => void;
}

export function AppHeader({
    title,
    icon,
    userName,
    userRole,
    userAvatar,
    onProfileClick,
}: AppHeaderProps) {
    return (
        <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur">
            <div className="max-w-7xl mx-auto px-4 py-2.5">
                <div className="flex items-center justify-between">

                    {/* Left: Icon + Title */}
                    <div className="flex items-center space-x-3">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-md flex items-center justify-center shadow-md"
                        >
                            {icon ? (
                                React.cloneElement(icon as any, { className: "w-4 h-4 text-white" })
                            ) : (
                                <div className="w-4 h-4 bg-white/20 rounded" />
                            )}
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-lg font-semibold text-gray-900 dark:text-white"
                        >
                            {title}
                        </motion.h1>
                    </div>
                    <SettingsMenu />

                    {/* Right: User Profile */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onProfileClick}
                        className={clsx(
                            "flex items-center gap-2 rounded-lg p-1.5 transition-all",
                            "hover:bg-gray-100 dark:hover:bg-gray-800/60"
                        )}
                    >
                        <img
                            src={
                                userAvatar ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    userName
                                )}&background=3b82f6&color=fff&bold=true`
                            }
                            alt="Avatar"
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-white dark:ring-gray-900"
                        />

                        <div className="text-left hidden sm:block">
                            <p className="text-sm mb-0.5 text-gray-900 dark:text-white leading-none">
                                {userName}
                            </p>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-none">
                                {userRole}
                            </p>
                        </div>

                        <ChevronDown className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                    </motion.button>
                </div>
            </div>
        </header>
    );
}
