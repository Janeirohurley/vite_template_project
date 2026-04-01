// src/components/ui/Header.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, LogIn, UserPlus, ChevronDown, Shield, Moon, Sun } from 'lucide-react';

// 🎨 Styles
const PRIMARY_ACCENT = "text-indigo-600 dark:text-cyan-400"; 
const SECONDARY_ACCENT_BG = "bg-indigo-600 hover:bg-indigo-700 dark:bg-cyan-500 dark:hover:bg-cyan-600"; 
const HOVER_TEXT = "hover:text-indigo-600 dark:hover:text-cyan-400";

// 🌙 Hook thème
const useTheme = () => {
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() =>
        (localStorage.getItem('theme') as any) || 'system'
    );

    useEffect(() => {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDark = theme === 'dark' || (theme === 'system' && prefersDark);
        document.documentElement.classList.toggle('dark', isDark);

        if (theme === 'system') localStorage.removeItem('theme');
        else localStorage.setItem('theme', theme);
    }, [theme]);

    return { theme, setTheme };
};

// 📱 Menu mobile animé avec fermeture au clic dehors
const CollapsibleMenu = ({ isOpen, children, onClose }: { isOpen: boolean; children: React.ReactNode; onClose: () => void }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState<number | 'auto'>(isOpen ? 'auto' : 0);

    useEffect(() => {
        if (!ref.current) return;

        if (isOpen) {
            setHeight(ref.current.scrollHeight);
            const timer = setTimeout(() => setHeight('auto'), 300);
            return () => clearTimeout(timer);
        }

        setHeight(ref.current.scrollHeight);
        requestAnimationFrame(() => setHeight(0));
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    return (
        <div ref={ref} style={{ height, overflow: 'hidden' }} className="transition-all duration-300 ease-in-out">
            {children}
        </div>
    );
};

// 🌗 Bouton thème
const ThemeSwitcher = ({ theme, setTheme }: any) => (
    <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className={`p-2 rounded-full transition-all shadow-sm hover:shadow-md ${
            theme === 'dark' ? 'bg-gray-800 text-cyan-400' : 'bg-gray-100 text-indigo-600'
        }`}
    >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
);

// 🔽 Dropdown Portails Desktop (ferme au clic dehors)
const PortalsDropdown = ({ portalLinks }: any) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onMouseEnter={() => setIsDropdownOpen(true)}
                className={`flex items-center space-x-1 font-medium text-gray-700 dark:text-gray-300 ${HOVER_TEXT}`}
            >
                Portails
                <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                />
            </button>

            <div
                className={`absolute right-0 mt-3 w-56 rounded-lg shadow-xl bg-white dark:bg-gray-900 ring-1 ring-gray-300 dark:ring-gray-700 transition-all duration-200 ${
                    isDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                }`}
            >
                <div className="py-2">
                    {portalLinks.map((portal: any) => (
                        <a
                            key={portal.name}
                            href={portal.href}
                            className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                        >
                            {portal.name}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

// ⭐ Header complet
export const Header: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { theme, setTheme } = useTheme();

    const navLinks = [
        { name: "Acceuil", href: "/" },
        { name: "Fonctionnalités", href: "/featurespage" },
        { name: "Support", href: "/support" },
        { name: "Contact", href: "/contact" },
    ];

    const portalLinks = [
        { name: "Portail Étudiant", href: "/studentportal" },
        { name: "Portail Enseignant", href: "/teacherportal" },
        { name: "Portail Administration", href: "/admin-portal" },
    ];

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) setIsMobileMenuOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md shadow-md">
            <div className="max-w-7xl mx-auto px-5">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <a href="/" className="flex items-center space-x-2 text-2xl font-bold text-gray-900 dark:text-white">
                    
                        <span>UMS</span>
                    </a>

                    {/* Menu Desktop */}
                    <nav className="hidden lg:flex items-center space-x-6">
                        {navLinks.map(link => (
                            <a key={link.name} href={link.href} className={`text-gray-700 dark:text-gray-300 font-medium ${HOVER_TEXT}`}>
                                {link.name}
                            </a>
                        ))}
                        <PortalsDropdown portalLinks={portalLinks} />
                    </nav>

                    {/* Actions Desktop */}
                    <div className="hidden lg:flex items-center space-x-4">
                        <ThemeSwitcher theme={theme} setTheme={setTheme} />
                        <a
                            href="/auth/login"
                            className={`flex items-center text-white font-bold py-2 px-6 rounded-full shadow-md ${SECONDARY_ACCENT_BG}`}
                        >
                            <LogIn size={18} className="mr-2" /> Connexion
                        </a>
                        <a
                            href="/auth/register"
                            className="flex items-center text-white font-bold py-2 px-6 rounded-full shadow-md bg-gray-700 hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500"
                        >
                            <UserPlus size={18} className="mr-2" /> Inscription
                        </a>
                    </div>

                    {/* Mobile */}
                    <div className="lg:hidden flex items-center space-x-2">
                        <ThemeSwitcher theme={theme} setTheme={setTheme} />
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                            {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Menu Mobile */}
            <CollapsibleMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
                <div className="lg:hidden px-4 pt-3 pb-5 bg-white dark:bg-gray-950 border-t dark:border-gray-800">
                    {navLinks.map(link => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="block py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 rounded-lg"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.name}
                        </a>
                    ))}

                    <div className="mt-5 border-t pt-3 dark:border-gray-700">
                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Portails</p>
                        {portalLinks.map(portal => (
                            <a
                                key={portal.name}
                                href={portal.href}
                                className="block py-2 px-3 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {portal.name}
                            </a>
                        ))}
                    </div>

                    <div className="mt-5 space-y-2">
                        <a
                            href="/auth/login"
                            className={`block w-full text-center text-white font-bold py-2 rounded-full ${SECONDARY_ACCENT_BG}`}
                        >
                            <LogIn size={18} className="inline mr-2" />
                            Connexion
                        </a>
                        <a
                            href="/auth/register"
                            className="block w-full text-center text-white font-bold py-2 rounded-full bg-gray-700 hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500"
                        >
                            <UserPlus size={18} className="inline mr-2" />
                            Inscription
                        </a>
                    </div>
                </div>
            </CollapsibleMenu>
        </header>
    );
};
