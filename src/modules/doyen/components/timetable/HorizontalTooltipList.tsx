import { type ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface TooltipItem {
    id: string;
    label: string;
    tooltip: string;
    icon?: ReactNode;
}

interface AnimatedTooltipListProps {
    items: TooltipItem[];
    gap?: number;
    /** Permet la sélection multiple ou un seul (défaut: un seul) */
    multiple?: boolean;
    /** Items pré-sélectionnés au chargement */
    defaultSelectedIds?: string[];
    /** Callback quand la sélection change */
    onChange?: (selectedIds: string[]) => void;
}

export function AnimatedTooltipList({
    items,
    gap = 3,
    multiple = false,
    defaultSelectedIds = [],
    onChange,
}: AnimatedTooltipListProps) {
    const [activeId, setActiveId] = useState<string | null>(null); // pour le hover tooltip
    const [selectedIds, setSelectedIds] = useState<string[]>(
        defaultSelectedIds
    );

    const toggleSelection = (id: string) => {
        let newSelected: string[];

        if (multiple) {
            if (selectedIds.includes(id)) {
                newSelected = selectedIds.filter((sid) => sid !== id);
            } else {
                newSelected = [...selectedIds, id];
            }
        } else {
            // Mode single select
            newSelected = selectedIds.includes(id) && selectedIds.length === 1
                ? [] // désélectionner si on re-clique sur le même
                : [id];
        }

        setSelectedIds(newSelected);
        onChange?.(newSelected);
    };

    const isSelected = (id: string) => selectedIds.includes(id);

    return (
        <div className={`flex items-center gap-${gap}`}>
            {items.map((item) => {
                const selected = isSelected(item.id);

                return (
                    <div
                        key={item.id}
                        className="relative"
                        onMouseEnter={() => setActiveId(item.id)}
                        onMouseLeave={() => setActiveId(null)}
                    >
                        {/* Badge cliquable */}
                        <button
                            type="button"
                            onClick={() => toggleSelection(item.id)}
                            className={`
                flex items-center gap-2
                px-3 py-1.5 rounded-md
                text-sm font-medium
                transition-all duration-200
                cursor-pointer
                outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                ${selected
                                    ? "bg-blue-600 text-white ring-2 ring-blue-500"
                                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                }
              `}
                            aria-pressed={selected}
                        >
                            {item.icon && (
                                <span className={selected ? "text-white" : "text-blue-600"}>
                                    {item.icon}
                                </span>
                            )}
                            <span>{item.label}</span>
                        </button>

                        {/* Tooltip au hover */}
                        <AnimatePresence>
                            {activeId === item.id && (
                                <motion.div
                                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                                    transition={{ duration: 0.18, ease: "easeOut" }}
                                    className="
                    absolute left-1/2 top-full mt-2
                    -translate-x-1/2
                    z-50 pointer-events-none
                  "
                                >
                                    <div
                                        className="
                      relative rounded-md
                      bg-gray-900 text-white
                      text-xs px-3 py-2
                      shadow-lg whitespace-nowrap
                    "
                                    >
                                        {item.tooltip}

                                        {/* Flèche */}
                                        <span
                                            className="
                        absolute -top-1 left-1/2
                        -translate-x-1/2
                        w-2 h-2
                        bg-gray-900
                        rotate-45
                      "
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );
}