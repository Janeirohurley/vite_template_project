import { useSettings } from "@/store/settings";
import { Moon, Sun, Laptop, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export function SettingsMenu() {
    const { theme, toggleTheme, language, setLanguage } = useSettings();
    const { t } = useTranslation();

    
const themeIcon = theme === "dark" ? (
    <Moon className="w-5 h-5" />
) : theme === "light" ? (
    <Sun className="w-5 h-5" />
) : (
    <Laptop className="w-5 h-5" />
);

const themeLabel =
    theme === "dark"
        ? t("ui_keys.darkMode")
        : theme === "light"
        ? t("ui_keys.lightMode")
        : t("ui_keys.system"); // ajoute "system" dans tes fichiers de traduction si nécessaire

return (
    <motion.div
        className="flex flex-wrap gap-3 items-center justify-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
    >
        {/* THEME SELECTOR */}
        <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 rounded-xl 
               bg-blue-600 text-white hover:bg-blue-700 
               dark:bg-blue-500 dark:hover:bg-blue-600 
               transition-all duration-200 shadow-sm"
        >
            {themeIcon}
            <span className="font-medium">{themeLabel}</span>
        </button>

        {/* LANGUAGE SELECTOR */}
        <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as "fr" | "en" | "rn")}
                className="rounded-xl px-3 py-2 border border-gray-300 dark:border-gray-600 
                 bg-white dark:bg-gray-800 
                 text-gray-900 dark:text-gray-100 
                 hover:border-blue-400 focus:ring-2 focus:ring-blue-400 
                 outline-none transition-all duration-200 shadow-sm"
            >
                <option value="rn">{t("ui_keys.kirundi")}</option>
                <option value="en">{t("ui_keys.english")}</option>
                <option value="fr">{t("ui_keys.french")}</option>
            </select>
        </div>
    </motion.div>
);

}
