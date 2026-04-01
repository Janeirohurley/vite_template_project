"use client";

import React, { useRef } from "react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    ChevronDown,
    UserRoundCog,
    Menu,
    X,
    ChevronLeft,
    ChevronRight,
    LogOut,
} from "lucide-react";
import { useModal } from "@/hooks/useModal";

export interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
    active?: boolean;
}

export interface NavbarProps {
    logoText?: string;
    title?: string;
    subtitle?: string;
    navItems: NavItem[];
    profileName: string;
    profileRole?: string;
    profileEmail?: string;
    onLogout?: () => void;
    className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
    logoText = "UPG",
    title = "Université Polytechnique",
    subtitle = "de Gitega",
    navItems,
    profileName,
    profileRole = "Étudiant",
    profileEmail,
    onLogout,
    className,
}) => {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const { isOpen  ,toggle} =  useModal()
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollNav = (direction: "left" | "right") => {
        if (!scrollRef.current) return;
        const amount = direction === "left" ? -160 : 160;
        scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    };

    return (
        <>
            {/* Mobile Navbar */}
            <nav className="lg:hidden bg-white/95 dark:bg-gray-900/80 backdrop-blur-md border-b border-blue-100 dark:border-gray-700 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-lg">{logoText}</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">{title}</h1>
                                <p className="text-xs text-blue-600 dark:text-blue-400">{subtitle}</p>
                            </div>
                        </div>
                        <button
                            className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    <AnimatePresence>
                        {mobileMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="pb-4"
                            >
                                <div className="flex flex-col space-y-2">
                                    {navItems.map((item, idx) => (
                                        <a
                                            key={idx}
                                            href={item.href}
                                            className={clsx(
                                                "px-4 py-2 rounded-lg flex items-center space-x-2 transition-all",
                                                item.active
                                                    ? "text-blue-600 bg-blue-50 dark:bg-blue-900"
                                                    : "text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-800"
                                            )}
                                        >
                                            {item.icon}
                                            <span className="font-medium">{item.label}</span>
                                        </a>
                                    ))}
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                    <div className="flex items-center space-x-3 p-2">
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                            <span className="text-white text-sm font-bold">
                                                {profileName.split(" ").map((n) => n[0]).join("")}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{profileName}</p>
                                            <p className="text-xs text-blue-600 dark:text-blue-400">{profileRole}</p>
                                        </div>
                                    </div>
                                    <div className="mt-2 space-y-2">
                                        <a
                                            href="#"
                                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                        >
                                            <User size={14} className="text-gray-400 dark:text-gray-300" />
                                            <span>Mon Profil</span>
                                        </a>
                                        {onLogout && (
                                            <button
                                                onClick={onLogout}
                                                className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-800 transition-colors"
                                            >
                                                <LogOut size={14} className="text-red-400 dark:text-red-300" />
                                                <span>Déconnexion</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </nav>

            {/* Desktop Navbar */}
            <nav
                className={clsx(
                    "hidden lg:block bg-white/95 dark:bg-gray-900/80 backdrop-blur-md border-b border-blue-100 dark:border-gray-700 sticky top-0 z-50",
                    className
                )}
            >
                <div className="max-w-5/6 mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 gap-4">
                        {/* Logo */}
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-lg">{logoText}</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">{title}</h1>
                                <p className="text-xs text-blue-600 dark:text-blue-400">{subtitle}</p>
                            </div>
                        </div>

                        {/* Navigation avec chevrons */}
                        <div className="relative flex-1 w-1/3 mx-8">
                            <button
                                onClick={() => scrollNav("left")}
                                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full    hover:bg-white dark:hover:bg-gray-700 transition-all"
                            >
                                <ChevronLeft size={16} className="text-gray-600 dark:text-gray-300" />
                            </button>

                            <div
                                ref={scrollRef}
                                className="flex items-center gap-1 overflow-x-auto scrollbar-hide scroll-smooth mx-8"
                            >
                                {navItems.map((item, idx) => (
                                    <a
                                        key={idx}
                                        href={item.href}
                                        className={clsx(
                                            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all shrink-0",
                                            item.active
                                                ? "bg-blue-50 text-blue-600 dark:bg-blue-900"
                                                : "text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-300 dark:hover:bg-gray-800"
                                        )}
                                    >
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </a>
                                ))}
                            </div>

                            <button
                                onClick={() => scrollNav("right")}
                                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full   hover:bg-white dark:hover:bg-gray-700 transition-all"
                            >
                                <ChevronRight size={16} className="text-gray-600 dark:text-gray-300" />
                            </button>
                        </div>

                        {/* Profil */}
                        <div className="relative">
                            <button
                                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors"
                                onClick={toggle}
                            >
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">
                                        {profileName.split(" ").map((n) => n[0]).join("")}
                                    </span>
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{profileName}</p>
                                    <p className="text-xs text-blue-600 dark:text-blue-400">{profileRole}</p>
                                </div>
                                <ChevronDown size={14} className="text-gray-400 dark:text-gray-300" />
                            </button>

                            <AnimatePresence>
                                {isOpen && (
                                    <motion.div
                                        className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-50"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                                            <p className="font-medium text-gray-800 dark:text-gray-100">{profileName}</p>
                                            {profileEmail && (
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{profileEmail}</p>
                                            )}
                                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">{profileRole}</p>
                                        </div>

                                        <div className="px-4 py-2">
                                            <button className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                                <div className="flex items-center space-x-2">
                                                    <UserRoundCog size={14} className="text-gray-400 dark:text-gray-300" />
                                                    <span className="text-sm text-gray-700 dark:text-gray-200">Changer de rôle</span>
                                                </div>
                                                <ChevronDown size={14} className="text-gray-400 dark:text-gray-300" />
                                            </button>
                                        </div>

                                        <div className="border-t border-gray-100 dark:border-gray-700 pt-2">
                                            <a
                                                href="#"
                                                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                            >
                                                <User size={14} className="text-gray-400 dark:text-gray-300" />
                                                <span>Mon Profil</span>
                                            </a>
                                            {onLogout && (
                                                <button
                                                    onClick={onLogout}
                                                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-800 transition-colors"
                                                >
                                                    <LogOut size={14} className="text-red-400 dark:text-red-300" />
                                                    <span>Déconnexion</span>
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;