// src/admin/configs/ConfigurationPage.tsx
import { configSections } from "../../admin/constants";
import { GeneralSettings } from "../components/config/GeneralSettings";
import { InterfaceSettings } from "../components/config/InterfaceSettings";
import { SecuritySettings } from "../components/config/SecuritySettings";
import { NotificationsSettings } from "../components/config/NotificationsSettings";
import { Construction } from "lucide-react";
import Masonry from "react-masonry-css";
import SettingsHeader from "../components/SettingsHeader";

export function ConfigurationPage() {
    const availableSections: Record<string, React.FC> = {
        general: GeneralSettings,
        interface: InterfaceSettings,
        security: SecuritySettings,
        notifications: NotificationsSettings,
    };

    // Points de rupture pour le masonry (super fluide)
    const breakpointColumns = {
        default: 2,
        1536: 3,
        1280: 2,
        1024: 3,
        768: 2,
        640: 1,
    };

    return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
                <div className="max-w-full mx-auto">

                    {/* VRAI MASONRY */}
                    <Masonry
                        breakpointCols={breakpointColumns}
                        className="flex -ml-2 w-auto"   // important pour le vrai masonry
                        columnClassName="bg-clip-padding"
                    >
                        {configSections.map((section) => {
                            const Icon = section.icon;
                            const SectionComponent = availableSections[section.key];

                            return (
                                <div
                                    key={section.key}
                                    className="m-1 bg-white dark:bg-gray-900 
                           transition-all duration-300 overflow-hidden rounded-2xl
                           group shadow"
                                >
                                    {/* Header */}

                                    <SettingsHeader
                                        title={section.label}
                                        icon={<Icon className="w-5 h-5 text-primary" />}
                                    />

                                    {/* Contenu */}
                                    <div className="p-3">
                                        {SectionComponent ? (
                                            <SectionComponent />
                                        ) : (
                                            <div className="text-center py-20">
                                                <Construction className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                                <p className="font-medium text-gray-600 dark:text-gray-400">
                                                    En cours de développement
                                                </p>
                                                <p className="text-sm text-gray-500 mt-2">
                                                    Arrive très bientôt
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </Masonry>
                </div>
            </div>
       
    );
}