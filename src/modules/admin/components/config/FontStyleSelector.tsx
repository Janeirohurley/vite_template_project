import { useState } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface FontItem {
    id: string;
    label: string;
    className: string;
    exampleClass: string;
}

const FONTS: FontItem[] = [
    { id: "sans", label: "Sans Serif", className: "font-sans", exampleClass: "text-base" },
    { id: "serif", label: "Serif", className: "font-serif", exampleClass: "text-base" },
    { id: "mono", label: "Monospace", className: "font-mono", exampleClass: "text-base" },
    { id: "display", label: "Display", className: "font-sans", exampleClass: "text-xl tracking-tight" },
    { id: "poppins", label: "Poppins", className: "font-poppins", exampleClass: "text-base" },
];

export function FontStyleSelector() {
    const [selected, setSelected] = useState<string>("sans");

    return (
        <div className="space-y-4">

            {/* Grid de sélection */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-gray-700 dark:text-gray-300">

                {FONTS.map((font) => {
                    const isSelected = selected === font.id;

                    return (
                        <button
                            key={font.id}
                            onClick={() => setSelected(font.id)}
                            className={cn(
                                "p-3 rounded-xl border transition cursor-pointer flex flex-col items-center gap-2",
                                "hover:bg-gray-100 dark:hover:bg-gray-800",
                                isSelected ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-300 dark:border-gray-700"
                            )}
                        >
                            {/* Aperçu de la font */}
                            <span className={cn(font.className, font.exampleClass)}>
                                Ag
                            </span>

                            {/* Label */}
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                                {font.label}
                            </span>

                            {/* Icône Check si sélectionné */}
                            {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                        </button>
                    );
                })}

            </div>

            {/* Aperçu du style sélectionné */}
            <div className="p-3 rounded-lg border bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                <p className="text-gray-700 dark:text-gray-300 font-medium text-sm mb-2">Style sélectionné :</p>
                <span className={cn(
                    FONTS.find(f => f.id === selected)?.className,
                    FONTS.find(f => f.id === selected)?.exampleClass,
                    "text-sm"
                )}>
                    The quick brown fox jumps over the lazy dog
                </span>
            </div>
        </div>
    );
}
