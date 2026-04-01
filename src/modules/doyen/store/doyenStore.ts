import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DoyenState {
  selectedAcademicYear: string | null;
  setSelectedAcademicYear: (year: string | null) => void;

  selectedClass: string | null;
  setSelectedClass: (classId: string | null) => void;

  selectedSemester: 1 | 2 | null;
  setSelectedSemester: (semester: 1 | 2 | null) => void;

  filters: {
    search?: string;
    teacher_type?: 'Permanent' | 'Visiteur';
    status?: string;
  };
  setFilters: (filters: DoyenState['filters']) => void;
  resetFilters: () => void;

  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
}

export const useDoyenStore = create<DoyenState>()(
  persist(
    (set) => ({
      selectedAcademicYear: null,
      setSelectedAcademicYear: (year) => set({ selectedAcademicYear: year }),

      selectedClass: null,
      setSelectedClass: (classId) => set({ selectedClass: classId }),

      selectedSemester: null,
      setSelectedSemester: (semester) => set({ selectedSemester: semester }),

      filters: {},
      setFilters: (filters) => set({ filters }),
      resetFilters: () => set({ filters: {} }),

      viewMode: 'grid',
      setViewMode: (mode) => set({ viewMode: mode }),
    }),
    {
      name: 'doyen-store',
    }
  )
);
