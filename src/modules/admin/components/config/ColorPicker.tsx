import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/lib/themeStore";

interface ColorPickerProps {
    colorPalettes: Record<string, string[]>;
}

export function ColorPicker({ colorPalettes }: ColorPickerProps) {
    const tokens = useThemeStore((s) => s.tokens);
    const setToken = useThemeStore((s) => s.setToken);

    // State local pour suivre la couleur sélectionnée par token
    const [selectedColors, setSelectedColors] = useState<Record<string, string>>({});

    useEffect(() => {
        // Initialiser avec les tokens actuels ou première couleur
        const initial: Record<string, string> = {};
        for (const key in colorPalettes) {
            initial[key] = tokens?.[key] || colorPalettes[key][0];
        }
        setSelectedColors(initial);
    }, [tokens, colorPalettes]);

    const handleSelectColor = (token: string, color: string) => {
        setToken(token, color);
        setSelectedColors((prev) => ({ ...prev, [token]: color }));
    };

    return (
        <div className="space-y-4">
            {Object.entries(colorPalettes).map(([token, colors]) => (
                <div key={token}>
                    <div className="my-1 text-[12px] font-medium text-gray-700 dark:text-gray-200">
                        {token.replace("--color-", "").replaceAll("-", " ")}
                    </div>
                    <div className="grid grid-cols-9 gap-1">
                        {colors.map((color) => (
                            <button
                                key={color}
                                onClick={() => handleSelectColor(token, color)}
                                className={cn(
                                    "w-10 h-10 rounded-2xl transition border cursor-pointer",
                                    selectedColors[token] === color
                                        ? "border-2 border-black ring-2 ring-white"
                                        : "border border-transparent"
                                )}
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>
                </div>
            ))}

            {/* Aperçu des couleurs sélectionnées */}
            <div className="mt-4 p-3 rounded-lg border bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                    Couleurs sélectionnées :
                </p>
                <div className="flex flex-wrap gap-2">
                    {Object.entries(selectedColors).map(([token, color]) => (
                        <div key={token} className="flex items-center gap-1">
                            <span
                                className="w-6 h-6 rounded-full border"
                                style={{ backgroundColor: color }}
                            />
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                                {token.replace("--color-", "").replaceAll("-", " ")}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
