import { useEffect, useRef } from "react";
import { Languages } from "lucide-react";
import { Toggle } from "./Toggle";
import DeanProfileSelector from "./DeanProfileSelector";

type UserMenuProps = {
    open: boolean;
    onClose: () => void;
    onLogout: () => void;
    onSettings: () => void;
    onLanguageChange: () => void;
    currentLanguage: string;
    theme: string;
    toggleTheme: () => void;
};

export function UserMenu({
    open,
    onClose,
    onLogout,
    onSettings,
    onLanguageChange,
    currentLanguage,
    theme,
    toggleTheme,
}: UserMenuProps) {
    const ref = useRef<HTMLDivElement>(null);

    // 👉 Click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                onClose();
            }
        };

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [open, onClose]);


    const langLabel =
        currentLanguage === "fr"
            ? "fr"
            : currentLanguage === "en"
                ? "en"
                : "rn";

    return (
        <div
            ref={ref}
            className={`
        absolute right-0 top-10 mt-2 w-56
        bg-white dark:bg-gray-800
        rounded-lg shadow-xl
        border border-gray-200 dark:border-gray-700
        p-2 z-50
        origin-top-right
        transition-all duration-200
        ${open
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95 pointer-events-none"
                }
      `}
        >

            {/* Dean Profile Selector */}
            <DeanProfileSelector />
            <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
            {/* Settings */}
            <button
                onClick={() => {
                    onSettings();
                    onClose();
                }}
                className="block w-full text-left px-4 py-2 text-sm rounded-lg
          hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
                Paramètres
            </button>

            {/* Theme */}
            <div className="flex items-center justify-between px-4 py-2">
                <span className="text-sm">Thème</span>

                <Toggle checked={theme === "dark"} onChange={toggleTheme} />
            </div>

            {/* Language */}
            <div className="flex items-center justify-between px-4 py-2">
                <span className="text-sm flex items-center gap-1">
                    <Languages className="w-4 h-4" />
                    Langue
                </span>

                <button
                    onClick={onLanguageChange}
                    className="
            px-2 py-0.5 rounded-md border
            bg-gray-100 dark:bg-gray-700
            text-gray-800 dark:text-gray-100
            border-gray-300 dark:border-gray-600
            text-xs font-semibold
            hover:scale-105 transition-transform
          "
                >
                    {langLabel}
                </button>
            </div>

           

            <div className="border-t border-gray-200 dark:border-gray-700 my-1" />

            {/* Logout */}
            <button
                onClick={() => {
                    onLogout();
                    onClose();
                }}
                className="
          block w-full text-left px-4 py-2 text-sm rounded-lg
          text-red-600
          hover:bg-gray-100 dark:hover:bg-gray-700
          transition-colors
        "
            >
                Déconnexion
            </button>
        </div>
    );
}
