import { useState } from "react";
import { cn } from "@/lib/utils";
import { FlagIcon, type FlagIconCode } from "react-flag-kit";
import { Check, Star } from "lucide-react";

interface LangItem {
    code: string;
    label: string;
    flag: FlagIconCode;
}

const LANGUAGES: LangItem[] = [
    { code: "rn", label: "Kirundi", flag: "BI" },
    { code: "en", label: "English", flag: "US" },
    { code: "fr", label: "Français", flag: "FR" },
    { code: "sw", label: "Swahili", flag: "TZ" },
    { code: "es", label: "Español", flag: "ES" },
    { code: "de", label: "Deutsch", flag: "DE" },
    { code: "ar", label: "العربية", flag: "AE" },
    { code: "zh", label: "中文", flag: "CN" },
];

export function LanguageSelector() {
    const [selected, setSelected] = useState<string[]>(["rn"]);
    const [defaultLang, setDefaultLang] = useState<string>("rn");

    const toggleLanguage = (code: string) => {
        setSelected((prev) =>
            prev.includes(code)
                ? prev.filter((c) => c !== code)
                : [...prev, code]
        );

        // si on retire la langue qui était par défaut
        if (code === defaultLang) setDefaultLang("");
    };

    return (
        <div className="space-y-4">

            {/* Sélection principale */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm text-gray-700 dark:text-gray-300">

                {LANGUAGES.map((lang) => {
                    const isSelected = selected.includes(lang.code);
                    return (
                        <label
                            key={lang.code}
                            className={cn(
                                "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition border",
                                "hover:bg-gray-100 dark:hover:bg-gray-800",
                                isSelected
                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                    : "border-gray-300 dark:border-gray-700"
                            )}
                        >
                            {/* Checkbox custom */}
                            <input
                                type="checkbox"
                                className="peer hidden"
                                checked={isSelected}
                                onChange={() => toggleLanguage(lang.code)}
                            />

                            <div
                                className={cn(
                                    "w-5 h-5 rounded-md border flex items-center justify-center transition",
                                    isSelected
                                        ? "bg-blue-600 border-blue-600 text-white"
                                        : "bg-white dark:bg-gray-900 border-gray-400 text-transparent"
                                )}
                            >
                                <Check className="w-4 h-4" />
                            </div>

                            {/* Flag + label */}
                            <span className="flex items-center gap-2">
                                <FlagIcon code={lang.flag} size={16} />
                                {lang.label}
                            </span>
                        </label>
                    );
                })}
            </div>

            {/* Résultats */}
            {selected.length > 0 && (
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 space-y-3">
                    <h4 className="font-medium text-gray-800 dark:text-gray-200">
                        Langues sélectionnées :
                    </h4>

                    <div className="flex flex-wrap gap-2">
                        {selected.map((code) => {
                            const item = LANGUAGES.find((l) => l.code === code);
                            if (!item) return null;

                            const isDefault = code === defaultLang;

                            return (
                                <button
                                    key={code}
                                    onClick={() => setDefaultLang(code)}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-1 rounded-sm border transition relative",
                                        "hover:scale-105 active:scale-95 cursor-pointer",
                                        isDefault
                                            ? "bg-blue-600 text-white border-blue-600"
                                            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700"
                                    )}
                                >
                                    {isDefault && (
                                        <Star className="w-4 h-4 absolute -top-1 -right-1 text-yellow-400 drop-shadow" />
                                    )}

                                    <FlagIcon code={item.flag} size={15} />
                                   <span className="text-sm">{item.label}</span> 
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
