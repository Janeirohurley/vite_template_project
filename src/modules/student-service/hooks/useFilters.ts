import { useState, useCallback } from 'react';

export function useFilters<T extends Record<string, any>>(initialFilters: T = {} as T) {
  const [filters, setFilters] = useState<T>(initialFilters);

  const updateFilter = useCallback((key: keyof T, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const removeFilter = useCallback((key: keyof T) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const hasFilters = Object.keys(filters).length > 0;

  return {
    filters,
    updateFilter,
    removeFilter,
    clearFilters,
    hasFilters,
  };
}
