import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "../store/authStore";
import { getUserApi } from "../api";

export function useUser() {
    const setUser = useAuthStore((s) => s.setUser);

    return useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const user = await getUserApi();
            setUser(user); // sync Zustand
            return user;
        },
        staleTime: 1000 * 60 * 5,
        retry: false,
    });
}
