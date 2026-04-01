import { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function KeywordInput() {
    const [keywords, setKeywords] = useState<string[]>(["Gestion", "Université", "Système", "Moderne"]);
    const [inputValue, setInputValue] = useState("");

    const handleAddKeyword = () => {
        const trimmed = inputValue.trim();
        if (trimmed && !keywords.includes(trimmed)) {
            setKeywords([...keywords, trimmed]);
            setInputValue("");
        }
    };

    const handleRemoveKeyword = (keyword: string) => {
        setKeywords(keywords.filter((k) => k !== keyword));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddKeyword();
        }
    };

    return (
        <div className="space-y-2">
            {/* Input + Bouton Ajouter */}
            <div className="flex gap-2 items-end">
                <div className="flex-1">
                    <Label className="text-sm font-medium">Mots clés</Label>
                    <Input
                        placeholder="Ajouter un mot clé"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="h-9" // Même hauteur que le bouton
                    />
                </div>
                <button
                    onClick={handleAddKeyword}
                    className="h-9 px-4 bg-blue-700 text-white rounded-md hover:bg-blue-600 transition"
                >
                    Ajouter
                </button>
            </div>

            {/* Liste des mots-clés avec animation */}
            <div className="mt-2 p-3 rounded-lg border bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 flex flex-wrap gap-2">
                <AnimatePresence>
                    {keywords.map((keyword) => (
                        <motion.div
                            key={keyword}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center gap-1 px-2 py-1 relative bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md text-xs"
                        >
                            <span>{keyword}</span>
                            <button
                                type="button"
                                onClick={() => handleRemoveKeyword(keyword)}
                                className="p-0.5 cursor-pointer rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition absolute -top-2 -right-2"
                            >
                                <X className="w-3 h-3 text-red-800 dark:text-red-200" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
