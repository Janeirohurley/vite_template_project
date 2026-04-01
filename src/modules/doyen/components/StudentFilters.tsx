import { useState, useEffect, useMemo } from 'react';
import { X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDeanClasses, useStudentGroups } from '../hooks';
import { useAppStore } from '@/lib';
import { SingleSelectDropdown } from '@/components/ui/SingleSelectDropdown';

interface StudentFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
  onClearFilters: () => void;
}

export interface FilterValues {
  department_id?: string;
  class_id?: string;
  group_id?: string;
  regist_status?: 'Active' | 'Inactive' | 'Suspended' | '';
  search?: string;
}

type FilterConfig = {
  key: keyof FilterValues;
  label: string;
  placeholder: string;
  options: Array<{ id: string; value: string; label: string }>;
  disabled?: boolean;
  required?: boolean;
  loading?: boolean;
};

export function StudentFilters({ onFilterChange, onClearFilters }: StudentFiltersProps) {
  const { selectedAcademicYear } = useAppStore();
  const [filters, setFilters] = useState<FilterValues>({});
  const [isExpanded, setIsExpanded] = useState(false);

  // Fetch data
  const { data: classesData, isLoading: loadingClass } = useDeanClasses({
    pagination: false,
    department_id: filters.department_id,
  });

  const { data: groupsData, isLoading: loadingGroups } = useStudentGroups({
    pagination: false,
    academic_year_id: selectedAcademicYear?.id,
    class_id: filters.class_id,
  });

  // Memoized data
  const classes = useMemo(() => classesData?.results || [], [classesData]);
  const groups = useMemo(() => groupsData?.results || [], [groupsData]);

  // Status options
  const statusOptions = useMemo(() => [
    { id: '', label: 'Tous les statuts' },
    { id: 'Active', label: 'Actif' },
    { id: 'Inactive', label: 'Inactif' },
    { id: 'Suspended', label: 'Suspendu' },
  ], []);

  // Dependencies map for cascading filters
  const filterDependencies: Record<keyof FilterValues, Array<keyof FilterValues>> = {
    department_id: ['class_id', 'group_id'],
    class_id: ['group_id'],
    group_id: [],
    regist_status: [],
    search: [],
  };

  // Filter configurations
  const filterConfigs: FilterConfig[] = useMemo(() => [
    {
      key: 'class_id',
      label: 'Classe',
      placeholder: loadingClass ? 'Chargement...' : 'Sélectionner une classe',
      options: classes.map(c => ({
        id: c.id,
        value: c.id,
        label: `${c.class_name} - ${c.department_name}`,
      })),
      disabled: loadingClass,
      required: true,
      loading: loadingClass,
    },
    {
      key: 'group_id',
      label: 'Groupe',
      placeholder: loadingGroups ? 'Chargement...' : 'Sélectionner un groupe',
      options: groups.map(g => ({
        id: g.id,
        value: g.id,
        label: `${g.group_name} (${g.class_name})`,
      })),
      disabled: loadingGroups || !filters.class_id,
      required: true,
      loading: loadingGroups,
    },
    {
      key: 'regist_status',
      label: 'Statut',
      placeholder: 'Sélectionner un statut',
      options: statusOptions.map(s => ({
        id: s.id,
        value: s.id,
        label: s.label,
      })),
      required: false,
    },
  ], [classes, groups, statusOptions, loadingClass, loadingGroups, filters.class_id]);

  // Update filters on change
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  // Generic filter change handler
  const handleFilterChange = (key: keyof FilterValues, value: string) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value || undefined };

      // Reset dependent filters based on dependency map
      const dependents = filterDependencies[key] || [];
      dependents.forEach(dependent => {
        delete newFilters[dependent];
      });

      return newFilters;
    });
  };

  const handleClearFilters = () => {
    setFilters({});
    onClearFilters();
  };

  const hasActiveFilters = useMemo(
    () => Object.values(filters).some(value => value !== undefined && value !== ''),
    [filters]
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Filtres
          </h3>
          {hasActiveFilters && (
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
              Actifs
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              className="text-sm"
            >
              <X size={16} className="mr-1" />
              Effacer
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm"
          >
            {isExpanded ? 'Masquer' : 'Afficher'}
          </Button>
        </div>
      </div>

      {/* Filter dropdowns */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filterConfigs.map(config => (
            <SingleSelectDropdown
              className='flex-1'
              key={config.key}
              label={config.label}
              options={config.options}
              value={filters[config.key] as string}
              required={config.required}
              disabled={config.disabled}
              placeholder={config.placeholder}
              onChange={(value) => handleFilterChange(config.key, value)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
