
import { cn } from "@/lib/utils";
export interface SectionItem {
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
    active?: boolean;
    onClick?: () => void;
}

interface SidebarSectionsProps {
    sections: SectionItem[];
    className?: string;
}

export function SidebarSections({ sections, className }: SidebarSectionsProps) {
    return (
        <div className={cn("w-64 flex-shrink-0 min-h-0 h-full overflow-y-auto", className)}>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Sections
                </h3>
                <nav className="space-y-2">
                    {sections.map((section, index) => {
                        const Icon = section.icon;
                        return (
                            <button
                                key={index}
                                onClick={section.onClick}
                                className={cn(
                                    "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors cursor-pointer text-sm font-medium",
                                    section.active
                                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-700"
                                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                                )}
                            >
                                {Icon && <Icon className="h-4 w-4" />}
                                <span>{section.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
