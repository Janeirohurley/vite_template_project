// store/themeStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
    tokens: Record<string, string>;
    setToken: (name: string, value: string) => void;
    applyTokens: () => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set, get) => ({
            tokens: {
                "--color-brand-primary": "#3b82f6",
                "--color-brand-secondary": "#9333ea",
                "--color-brand-accent": "#f59e0b",
            },

            setToken: (name, value) => {
                set((state) => ({
                    tokens: {
                        ...state.tokens,
                        [name]: value,
                    },
                }));

                // appliquer directement
                document.documentElement.style.setProperty(name, value);
            },

            applyTokens: () => {
                const { tokens } = get();
                Object.entries(tokens).forEach(([key, value]) => {
                    document.documentElement.style.setProperty(key, value);
                });
            },
        }),
        {
            name: "theme-settings",
        }
    )
);
