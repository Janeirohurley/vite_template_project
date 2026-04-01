import { changeLanguage } from "i18next";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AcademicYear, DeanProfile } from "@/modules/admin/types/academicTypes";
import {
    getDeanProfile,
    saveDeanProfile,
    deleteDeanProfile
} from "./database";

export type Theme = "light" | "dark";
export type Language = "en" | "fr" | "rn";

interface SettingsState {
    theme: Theme;
    language: Language;
    selectedAcademicYear: AcademicYear | null;
    selectedDeanProfile: DeanProfile | null;

    sidebarCollapsed: boolean;
    toggleSidebar: () => void;
    setSidebarCollapsed: (v: boolean) => void;
    // setters
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
    setLanguage: (lang: Language) => void;
    setSelectedAcademicYear: (year: AcademicYear | null) => void;
    syncSelectedAcademicYear: (academicYears: AcademicYear[]) => void;
    // Dean profile setters
    setSelectedDeanProfile: (profile: DeanProfile | null) => void;
    syncSelectedDeanProfile: (profiles: DeanProfile[]) => void;
    loadDeanProfileFromDB: () => Promise<void>;
    // helpers
    _applyThemeToDOM: (theme: Theme) => void;
    loadFromStorage: () => void;
    syncWithSystem: () => void; // Maintenu pour la structure, mais sa logique est déplacée/fusionnée
    listenToSystemPreference: () => void; // Nouvelle fonction d'écoute
}

export const useAppStore = create<SettingsState>()(
    persist(
        (set, get) => ({
            theme: "light",
            language: "en",
            selectedAcademicYear: null,
            selectedDeanProfile: null,
            // Sidebar
            sidebarCollapsed: false,
            toggleSidebar: () => {
                set((state) => {
                    const newValue = !state.sidebarCollapsed;
                    localStorage.setItem("sidebarCollapsed", JSON.stringify(newValue));
                    return { sidebarCollapsed: newValue };
                });
            },
            setSidebarCollapsed: (v) => {
                localStorage.setItem("sidebarCollapsed", JSON.stringify(v));
                set({ sidebarCollapsed: v });
            },

            _applyThemeToDOM: (theme) => {
                if (typeof document !== "undefined") {
                    if (theme === 'dark') {
                        document.documentElement.classList.add('dark');
                    } else {
                        document.documentElement.classList.remove('dark');
                    }
                }
            },

            setTheme: (theme) => {
                // Quand l'utilisateur clique manuellement, on met à jour localStorage
                try {
                    localStorage.setItem("theme", theme);
                } catch { /* ignore */ }
                get()._applyThemeToDOM(theme);
                set({ theme });
            },

            toggleTheme: () => {
                const current = get().theme;
                const newTheme: Theme = current === "light" ? "dark" : "light";
                get().setTheme(newTheme); // Utilise setTheme pour gérer localStorage et DOM
            },

            setLanguage: (lang: Language) => {
                try {
                    localStorage.setItem("language", lang);
                    changeLanguage(lang)
                } catch { /* ignore */ }
                set({ language: lang });
            },

            setSelectedAcademicYear: (year: AcademicYear | null) => {
                try {
                    if (year) {
                        localStorage.setItem("selectedAcademicYear", JSON.stringify(year));
                    } else {
                        localStorage.removeItem("selectedAcademicYear");
                    }
                } catch { /* ignore */ }
                set({ selectedAcademicYear: year });
            },

            syncSelectedAcademicYear: (academicYears: AcademicYear[]) => {
                const currentSelected = get().selectedAcademicYear;

                if (!currentSelected) {
                    // Si aucune année n'est sélectionnée, prendre l'année courante ou la première
                    const currentYear = academicYears.find(year => year.is_current) || academicYears[0];
                    if (currentYear) {
                        get().setSelectedAcademicYear(currentYear);
                    }
                } else {
                    // Vérifier si l'année sélectionnée existe toujours dans les données du backend
                    const updatedYear = academicYears.find(year => year.id === currentSelected.id);
                    if (updatedYear) {
                        // Mettre à jour avec les nouvelles données du backend
                        get().setSelectedAcademicYear(updatedYear);
                    } else {
                        // L'année sélectionnée n'existe plus, prendre l'année courante ou la première
                        const fallbackYear = academicYears.find(year => year.is_current) || academicYears[0];
                        if (fallbackYear) {
                            get().setSelectedAcademicYear(fallbackYear);
                        }
                    }
                }
            },

            // Dean Profile Methods
            setSelectedDeanProfile: async (profile: DeanProfile | null) => {
                try {
                    if (profile) {
                        await saveDeanProfile(profile);
                    } else {
                        await deleteDeanProfile();
                    }
                } catch (error) {
                    console.error("Error saving dean profile to IndexedDB:", error);
                }
                set({ selectedDeanProfile: profile });
            },

            syncSelectedDeanProfile: async (profiles: DeanProfile[]) => {
                const currentSelected = get().selectedDeanProfile;

                if (!currentSelected) {
                    // Si aucun profil n'est sélectionné, prendre le premier disponible
                    if (profiles.length > 0) {
                        await get().setSelectedDeanProfile(profiles[0]);
                    }
                } else {
                    // Vérifier si le profil sélectionné existe toujours dans les données du backend
                    const updatedProfile = profiles.find(profile => profile.id === currentSelected.id);
                    if (updatedProfile) {
                        // Mettre à jour avec les nouvelles données du backend
                        await get().setSelectedDeanProfile(updatedProfile);
                    } else {
                        // Le profil sélectionné n'existe plus, prendre le premier disponible
                        if (profiles.length > 0) {
                            await get().setSelectedDeanProfile(profiles[0]);
                        } else {
                            await get().setSelectedDeanProfile(null);
                        }
                    }
                }
            },

            loadDeanProfileFromDB: async () => {
                try {
                    const profile = await getDeanProfile();
                    if (profile) {
                        set({ selectedDeanProfile: profile });
                    }
                } catch (error) {
                    console.error("Error loading dean profile from IndexedDB:", error);
                }
            },

            loadFromStorage: () => {
                // Logique inchangée : priorité au localStorage, sinon préférence système
                let finalTheme: Theme = "light";
                let finalLang: Language = "en";
                let finalAcademicYear: AcademicYear | null = null;

                try {
                    const storedTheme = localStorage.getItem("theme") as Theme | null;
                    const storedLang = localStorage.getItem("language") as Language | null;
                    const storedAcademicYear = localStorage.getItem("selectedAcademicYear");

                    if (storedTheme === "light" || storedTheme === "dark") {
                        finalTheme = storedTheme;
                    } else if (typeof window !== "undefined") {
                        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                        finalTheme = systemPrefersDark ? "dark" : "light";
                    }

                    if (storedLang) {
                        finalLang = storedLang;
                    }

                    if (storedAcademicYear) {
                        finalAcademicYear = JSON.parse(storedAcademicYear);
                    }

                    get()._applyThemeToDOM(finalTheme);
                    set({ theme: finalTheme, language: finalLang, selectedAcademicYear: finalAcademicYear });
                    changeLanguage(finalLang);

                    // Charger le profil doyen depuis IndexedDB
                    get().loadDeanProfileFromDB();
                } catch { /* ignore */ }
            },

            syncWithSystem: () => {
                // Cette fonction est désormais gérée par l'écouteur d'événement ci-dessous
            },

            // NOUVELLE FONCTION : Écoute les changements du système en temps réel
            listenToSystemPreference: () => {
                if (typeof window === "undefined") return;

                const systemPreferenceQuery = window.matchMedia("(prefers-color-scheme: dark)");

                const handleSystemChange = (event: MediaQueryListEvent) => {
                    // Ne met à jour automatiquement QUE si l'utilisateur n'a PAS de préférence manuelle stockée
                    const storedTheme = localStorage.getItem("theme") as Theme | null;

                    if (!storedTheme) {
                        const newSystemTheme: Theme = event.matches ? "dark" : "light";
                        get()._applyThemeToDOM(newSystemTheme);
                        set({ theme: newSystemTheme });
                    }
                };

                // Ajoute l'écouteur d'événement
                systemPreferenceQuery.addEventListener('change', handleSystemChange);

                // Optionnel: Nettoyage si votre store est démonté (rare pour un store global)
                /*
                return () => {
                    systemPreferenceQuery.removeEventListener('change', handleSystemChange);
                };
                */
            }
        }),
        {
            name: "app-storage",
            onRehydrateStorage: (state) => {
                state?.loadFromStorage();
                // Important: Commencez l'écoute juste après le chargement initial
                state?.listenToSystemPreference();
            }
        }
    )
);

export const useSettings = useAppStore;
