import CollapsibleComponent from "@/components/ui/CollapsibleComponent";
import { useThemeStore } from "@/lib/themeStore";
import { LanguageSelector } from "./LanguageSelector";
import { ShadowSelector } from "./ShadowSelector";
import { FontStyleSelector } from "./FontStyleSelector";
import { FontSizeSelector } from "./FontSizeSelector";
import { ColorPicker } from "./ColorPicker";
import { useEffect } from "react";

export function InterfaceSettings() {
    const applyTokens = useThemeStore((s) => s.applyTokens);

    useEffect(() => {
        applyTokens();
    }, []);

    /* ----- Définition des palettes pour chaque token ----- */
    const colorPalettes: Record<string, string[]> = {
        "--color-brand-primary": [
            "#EF4444", "#F97316", "#F59E0B", "#10B981", "#06B6D4",
            "#3B82F6", "#6366F1", "#8B5CF6", "#EC4899", "#F43F5E",
            "#14B8A6", "#0EA5E9", "#7C3AED", "#A855F7", "#D946EF"
        ],
        "--color-brand-secondary": [
            "#1E293B", "#334155", "#475569", "#64748B", "#94A3B8", "#CBD5E1", "#E2E8F0"
        ],
        "--color-bg-body": [
            "#ffffff", "#f8fafc", "#f1f5f9", "#e2e8f0", "#cbd5e1", "#64748b", "#0f172a"
        ],
        "--color-text-primary": [
            "#0f172a", "#1e293b", "#334155", "#475569", "#64748b", "#94a3b8", "#f1f5f9"
        ],
        "--color-success-bg": ["#ecfdf5", "#d1fae5", "#10b981", "#047857"],
        "--color-warning-bg": ["#fffbeb", "#fef3c7", "#f59e0b", "#b45309"],
        "--color-error-bg": ["#fef2f2", "#fee2e2", "#ef4444", "#b91c1c"],
        "--color-info-bg": ["#eff6ff", "#dbeafe", "#3b82f6", "#1d4ed8"],
    };


    return (
        <div className="space-y-3  bg-gray-50 dark:bg-gray-900">
            <CollapsibleComponent
                title="Personnalisation des couleurs"
                defaultCollapsed={true}
                className="w-full"
                contentClassName="px-2 pb-2"
                headerClassName="p-2"
            >
                <ColorPicker colorPalettes={colorPalettes} />
            </CollapsibleComponent>

            <CollapsibleComponent
                title="Personnalisation des font size"
                defaultCollapsed={true}
                className="w-full"
                contentClassName="px-2 pb-2 space-y-6"
                headerClassName="p-2"
            >
                <FontSizeSelector />

            </CollapsibleComponent>



            <CollapsibleComponent
                title="Personnalisation des font style"
                defaultCollapsed={true}
                className="w-full"
                contentClassName="px-2 pb-2"
                headerClassName="p-2"
            >
                <FontStyleSelector />
            </CollapsibleComponent>


            <CollapsibleComponent
                title="Selectionner des langues disponibles"
                defaultCollapsed={true}
                className="w-full"
                contentClassName="px-2 pb-2"
                headerClassName="p-2"
            >
                <LanguageSelector />
            </CollapsibleComponent>
            <CollapsibleComponent
                title="Selectionner des langues disponibles"
                defaultCollapsed={true}
                className="w-full"
                contentClassName="px-2 pb-2"
                headerClassName="p-2"
            >

                <ShadowSelector />
            </CollapsibleComponent>

        </div>
    );
}
