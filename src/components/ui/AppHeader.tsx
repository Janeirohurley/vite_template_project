import { UserAvatar } from '@/components/common/UserAvatar';
import { useState } from 'react';
import { ChevronDown, MessageCircle } from 'lucide-react';
// Menu utilisateur déroulant

import { useAuthStore } from '@/modules/auth';
import { useSettings } from '@/store/settings';
import type { NavItem } from '@/types';
import { useLocation } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { Bell, Search } from 'lucide-react';
import AcademicYearDropdown from './AcademicYearDropdown';
import CalendarDropdown from './CalendarDropdown';
import { UserMenu } from './UserMenu';

interface AppHeaderProps {
  navItems: NavItem[]
}

export function AppHeader({ navItems }: AppHeaderProps) {
  const { user, logout } = useAuthStore();
  const { toggleTheme, setLanguage, theme, language, selectedDeanProfile } = useSettings();
  const location = useLocation();
  const currentNavItem =
    navItems.find((item) => location.pathname.startsWith(item.to as string)) ||
    navItems[0];
  const Icon = currentNavItem.icon;
  const [menuOpen, setMenuOpen] = useState(false);
  const handleSettings = () => { /* TODO: ouvrir les paramètres */ alert('Paramètres'); };
  const handleLanguageChange = () => {
    // Cycle fr -> en -> rn -> fr
    if (useSettings.getState().language === 'fr') setLanguage('en');
    else if (useSettings.getState().language === 'en') setLanguage('rn');
    else setLanguage('fr');
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-linear-to-r from-blue-600 to-blue-800 dark:from-blue-900 dark:to-blue-950 shadow-lg"
    >
      <div className="px-6 py-2.5 flex items-center justify-between">
        <div className=" items-center gap-4 hidden">
          <Icon className="p-2 size-8 text-white bg-white/20 rounded-lg" />
          <h1 className="text-2xl font-bold text-white">{currentNavItem.label}</h1>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
          <Search className="w-4 h-4 text-white/60" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="bg-transparent text-white placeholder:text-white/60 outline-none w-48"
          />
        </div>
        <div className="flex items-center gap-4">

          <AcademicYearDropdown />
          <button className="p-2 hover:bg-white/10 rounded-lg transition">
            <Bell className="w-5 h-5 text-white" />
          </button>
          <CalendarDropdown />
          <button className="p-2 hover:bg-white/10 rounded-lg transition">
            <MessageCircle className="w-5 h-5 text-white" />
          </button>

          <div className="relative flex items-center gap-3 pl-4 border-l border-white/20">
            <div className="text-right">
              <p className="text-sm font-medium text-white">
                {user?.first_name?.charAt(0).toUpperCase()}.
                {` ${user?.last_name?.charAt(0).toUpperCase()}${user?.last_name?.substring(1)}`}
              </p>
              <p className="text-xs text-white/70">{user?.role.name} {user?.role.name == "dean" && `| ${selectedDeanProfile?.faculty_abreviation}`}</p>
            </div>
            <button
              className="flex items-center gap-1 focus:outline-none"
              onClick={() => setMenuOpen((open) => !open)}
              tabIndex={0}
            >
              <UserAvatar
                fullName={`${user?.first_name} ${user?.last_name}`}
                className='w-8 h-8'
                imageUrl={user?.profile_picture}
              />
              <ChevronDown className="w-4 h-4 text-white" />
            </button>

            <UserMenu
              open={menuOpen}
              onClose={() => setMenuOpen(false)}
              onLogout={logout}
              onSettings={handleSettings}
              onLanguageChange={handleLanguageChange}
              currentLanguage={language}
              theme={theme}
              toggleTheme={toggleTheme}
            />
          </div>
        </div>
      </div>
    </motion.header>
  );
}
