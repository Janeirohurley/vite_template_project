import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getDeanProfileApi } from '@/modules/admin/api/users';
import { useAppStore } from '@/lib/store';

/**
 * Hook pour récupérer et gérer les profils du doyen
 * Un doyen peut avoir plusieurs profils (plusieurs facultés)
 * Sélectionne automatiquement le premier profil par défaut si aucun n'est sélectionné
 * Synchronise avec le store et IndexedDB
 */
export const useDeanProfile = () => {
    const { setSelectedDeanProfile, selectedDeanProfile } = useAppStore();

    const query = useQuery({
        queryKey: ['deanProfiles'],
        queryFn: getDeanProfileApi,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });


    // Synchroniser avec le store et IndexedDB quand les données changent
    useEffect(() => {
        if (query.data && query.data.length > 0) {
            // Si aucun profil n'est sélectionné, sélectionner le premier par défaut
            if (!selectedDeanProfile) {
                console.log('Selecting first profile by default:', query.data[0]);
                setSelectedDeanProfile(query.data[0]);
            } else {
                // Vérifier si le profil sélectionné existe toujours dans la liste
                const stillExists = query.data.find(p => p.id === selectedDeanProfile.id);
                if (!stillExists) {
                    // Si le profil sélectionné n'existe plus, sélectionner le premier
                    console.log('Selected profile no longer exists, selecting first:', query.data[0]);
                    setSelectedDeanProfile(query.data[0]);
                }
            }
        }
    }, [query.data, selectedDeanProfile, setSelectedDeanProfile]);

    return query;
};
