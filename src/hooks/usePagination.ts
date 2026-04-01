// src/hooks/usePagination.ts
import { useState } from "react";

export function usePagination(initialPage = 1, perPage = 10) {
    const [page, setPage] = useState(initialPage);
    const next = () => setPage((p) => p + 1);
    const prev = () => setPage((p) => Math.max(1, p - 1));
    const reset = () => setPage(1);
    return { page, perPage, next, prev, reset, setPage };
}
