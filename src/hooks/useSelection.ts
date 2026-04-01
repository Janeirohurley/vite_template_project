import { useCallback, useState } from 'react';

function useSelection<T extends string | number>(initial?: Iterable<T>) {
    const [selected, setSelected] = useState<Set<T>>(() => new Set(initial ?? []));

    const toggle = useCallback((id: T) => {
        setSelected(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }, []);

    const selectAll = useCallback((ids: T[]) => {
        setSelected(new Set(ids));
    }, []);

    const clear = useCallback(() => setSelected(new Set()), []);

    const isSelected = useCallback((id: T) => selected.has(id), [selected]);

    const getSelected = useCallback(() => Array.from(selected), [selected]);

    return { selected, toggle, selectAll, clear, isSelected, getSelected, setSelected } as const;
}

export default useSelection;
