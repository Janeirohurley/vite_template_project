import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface StudentServiceState {
  selectedAcademicYear: string | null;
  setSelectedAcademicYear: (year: string | null) => void;
  filters: {
    search?: string;
    colline?: string;
    regist_status?: 'Active' | 'Inactive' | 'Suspended';
  };
  setFilters: (filters: StudentServiceState['filters']) => void;
  resetFilters: () => void;
}

export const useStudentServiceStore = create<StudentServiceState>()(
  persist(
    (set) => ({
      selectedAcademicYear: null,
      setSelectedAcademicYear: (year) => set({ selectedAcademicYear: year }),
      filters: {},
      setFilters: (filters) => set({ filters }),
      resetFilters: () => set({ filters: {} }),
    }),
    {
      name: 'student-service-store',
    }
  )
);
