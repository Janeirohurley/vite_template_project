import { useEffect, useRef, useState } from "react";
import { Building2, Check } from "lucide-react";
import { useDeanProfile } from "@/modules/doyen/hooks/useDeanProfile";
import { useAppStore } from "@/lib/store";

const DeanProfileSelector = () => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const { selectedDeanProfile, setSelectedDeanProfile } = useAppStore();
    const { data: deanProfiles, isLoading } = useDeanProfile();

    // 👉 Click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (isLoading) {
        return (
            <div className="px-4 py-2">
                <span className="text-sm text-gray-500">Chargement...</span>
            </div>
        );
    }

    if (!deanProfiles || deanProfiles.length === 0) {
        return null;
    }

    const handleSelectProfile = (profileId: string) => {
        const profile = deanProfiles.find(p => p.id === profileId);
        if (profile) {
            setSelectedDeanProfile(profile);
            setOpen(false);
            // Recharger la page pour appliquer le nouveau profil
            window.location.reload();
        }
    };

    return (
        <div ref={ref} className="relative">
            {/* Affichage du profil doyen sélectionné */}
            <button
                onClick={() => setOpen((o) => !o)}
                className="
                    flex items-center gap-2 w-full
                    px-4 py-2 text-sm rounded-lg
                    hover:bg-gray-100 dark:hover:bg-gray-700
                    transition-colors
                "
            >
                <Building2 className="w-4 h-4 text-gray-500" />
                <div className="flex flex-col items-start flex-1 min-w-0">
                    <span className="font-medium truncate">
                        {selectedDeanProfile?.faculty_abreviation || "Aucune faculté"}
                    </span>
                    <span className="text-xs text-gray-500 truncate">
                        {selectedDeanProfile?.position || "Position non définie"}
                    </span>
                </div>
                {deanProfiles.length > 1 && (
                    <span className="text-xs text-gray-400">
                        {deanProfiles.length} profils
                    </span>
                )}
            </button>

            {/* Dropdown pour sélectionner un profil */}
            {open && deanProfiles.length > 1 && (
                <div
                    className="
                        absolute left-0 right-0 mt-3
                        bg-white dark:bg-gray-800
                       
                         z-50
                        w-full
                        max-h-64 overflow-y-auto
                    "
                >
                    <div className="px-3 py-2 text-xs text-gray-500 font-medium">
                        Sélectionner un profil
                    </div>
                    {deanProfiles.map((profile) => (
                        <button
                            key={profile.id}
                            onClick={() => handleSelectProfile(profile.id)}
                            className={`
                                w-full px-3 py-2 mb-1 rounded-md text-left
                                hover:bg-gray-100 dark:hover:bg-gray-700
                                transition-colors
                                ${selectedDeanProfile?.id === profile.id
                                    ? 'bg-gray-50 dark:bg-gray-700/50'
                                    : ''
                                }
                            `}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium flex items-center gap-2">
                                        {profile.faculty_abreviation}
                                        {selectedDeanProfile?.id === profile.id && (
                                            <Check className="w-4 h-4 text-green-500" />
                                        )}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {profile.position}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {profile.start_date} - {profile.end_date}
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DeanProfileSelector;
