// lib/axios/academicAxios.ts
import { createModuleAxios } from "@/lib/createModuleAxios";
import { useAppStore } from "@/lib/store";

const BASE_URL = 'dashboard/doyen';

const deanAxios = createModuleAxios(BASE_URL);
deanAxios.interceptors.request.use((config) => {
    if (config.method === 'get') {
        // Récupérer le profil doyen depuis le store
        const deanProfile = useAppStore.getState().selectedDeanProfile;

        config.params = {
            ...(config.params || {}),
            faculty_id: deanProfile?.faculty || undefined,
        };
    }

    return config;
});
export default deanAxios;
