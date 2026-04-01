/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "@tanstack/react-query";
import axios from "@/lib/axios";

export function useMutate<TResponse, TBody = any>(
    url: string,
    method: "POST" | "PUT" | "DELETE" | "PATCH" = "POST"
) {
    return useMutation<TResponse, Error, TBody>({
        mutationFn: async (body: TBody) => {
            const { data } = await axios({
                method,
                url,
                data: body,
            });

            return data as TResponse;
        },
    });
}

