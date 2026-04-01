import { useState } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface FontSizeItem {
    id: string;
    label: string;
    size: string;
    description?: string;
}

const HEADERS: FontSizeItem[] = [
    { id: "h1", label: "Heading 1", size: "text-4xl", description: "Titre principal" },
    { id: "h2", label: "Heading 2", size: "text-3xl", description: "Sous-titre important" },
    { id: "h3", label: "Heading 3", size: "text-2xl", description: "Titre section" },
    { id: "h4", label: "Heading 4", size: "text-xl", description: "Sous-section" },
    { id: "h5", label: "Heading 5", size: "text-lg", description: "Titre mineur" },
    { id: "h6", label: "Heading 6", size: "text-base", description: "Texte accentué" },
];

const SUBTITLES: FontSizeItem[] = [
    { id: "sub1", label: "Subtitle 1", size: "text-lg" },
    { id: "sub2", label: "Subtitle 2", size: "text-base" },
    { id: "sub3", label: "Subtitle 3", size: "text-sm" },
];

const PARAGRAPHS: FontSizeItem[] = [
    { id: "p_large", label: "Paragraphe Large", size: "text-base" },
    { id: "p_normal", label: "Paragraphe Normal", size: "text-sm" },
    { id: "p_small", label: "Paragraphe Small", size: "text-xs" },
];

export function FontSizeSelector() {
    const [selected, setSelected] = useState<string>("h1");

    const renderSection = (title: string, items: FontSizeItem[]) => (
        <section>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">{title}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {items.map((item) => {
                    const isSelected = selected === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setSelected(item.id)}
                            className={cn(
                                "p-4 border rounded-2xl text-left group transition relative",
                                "hover:shadow-md dark:hover:shadow-gray-800",
                                "hover:bg-gray-50 dark:hover:bg-gray-800/50",
                                isSelected ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-300 dark:border-gray-700"
                            )}
                        >
                            <div className="flex flex-col">
                                <span className={cn(item.size, "font-semibold leading-tight")}>{item.label}</span>
                                {item.description && (
                                    <span className="text-xs text-gray-500 mt-1">{item.description}</span>
                                )}
                                <span className="text-[11px] text-gray-400 mt-2 opacity-0 group-hover:opacity-100 transition">{item.size}</span>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-blue-600 absolute top-2 right-2" />}
                        </button>
                    );
                })}
            </div>
        </section>
    );

    const allItems = [...HEADERS, ...SUBTITLES, ...PARAGRAPHS];
    const selectedItem = allItems.find((item) => item.id === selected);

    return (
        <div className="space-y-6">
            {renderSection("Headers", HEADERS)}
            {renderSection("Subtitles", SUBTITLES)}
            {renderSection("Paragraphes", PARAGRAPHS)}

            {/* Aperçu du font size sélectionné */}
            {selectedItem && (
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">Font size sélectionné :</p>
                    <span className={cn(selectedItem.size, "font-semibold")}>
                        Aperçu : The quick brown fox jumps over the lazy dog
                    </span>
                </div>
            )}
        </div>
    );
}
