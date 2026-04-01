import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sun, CircleDot } from "lucide-react";

const SHADOWS = [
    { id: "none", label: "None", class: "shadow-none" },
    { id: "sm", label: "Small", class: "shadow-sm" },
    { id: "md", label: "Medium", class: "shadow-md" },
    { id: "xl", label: "Extra", class: "shadow-2xl" },
];

export function ShadowSelector() {
    const [selected, setSelected] = useState<string>("md");

    return (
        <div className="space-y-4">

            {/* Grid de sélection */}
            <div className="grid grid-cols-4 gap-3 text-sm text-gray-600 dark:text-gray-300">

                {SHADOWS.map((s) => {
                    const active = selected === s.id;

                    return (
                        <button
                            key={s.id}
                            onClick={() => setSelected(s.id)}
                            className={cn(
                                "p-3 rounded-xl border transition cursor-pointer h-20 w-full flex flex-col items-center justify-center gap-2",
                                "hover:bg-gray-100 dark:hover:bg-gray-800",
                                "border-gray-300 dark:border-gray-700",
                                active ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20" : "",
                                s.class
                            )}
                        >
                            {/* Icône lucide */}
                            <CircleDot
                                className={cn(
                                    "w-5 h-5 transition",
                                    active ? "text-blue-600" : "text-gray-400"
                                )}
                            />
                            <span className={cn(active ? "text-blue-600 font-medium" : "")}>
                                {s.label}
                            </span>
                        </button>
                    );
                })}

            </div>

            {/* Résultat */}
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 space-y-2">
                <p className="text-gray-700 dark:text-gray-300 font-medium">Shadow sélectionné :</p>

                <div
                    className={cn(
                        "p-4 rounded-lg border bg-white dark:bg-gray-800 flex items-center gap-3",
                        SHADOWS.find((s) => s.id === selected)?.class
                    )}
                >
                    <Sun className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                        {SHADOWS.find((s) => s.id === selected)?.label}
                    </span>
                </div>
            </div>
        </div>
    );
}
