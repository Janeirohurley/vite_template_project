import DataTable from "@/components/ui/DataTable"
import { useState, useMemo } from "react";
import { SingleSelectDropdown, type Option } from "@/components/ui/SingleSelectDropdown";
import { RotateCcw, Magnet, Filter } from "lucide-react";
import { usePopulations } from "../hooks";
import { useFaculties, useDepartments, useClasses } from "@/modules/admin/hooks/useAcademicEntities";
import type { PopulationParams } from "../types";
import { useSettings } from "@/lib";
import { withPopulationTotalRow } from "../utils/withPopulationTotalRow";

// État initial des filtres
interface Filters {
    faculty: string;
    department: string;
    className: string;
    sexe: string;
    ageRange: string;
}

const initialFilters: Filters = {
    faculty: '',
    department: '',
    className: '',
    sexe: '',
    ageRange: '',
};

// Options pour le filtre de sexe
const sexeOptions: Option[] = [
    { id: 'M', label: 'Masculin' },
    { id: 'F', label: 'Féminin' },
];

// Options pour le filtre de tranche d'âge
const ageRangeOptions: Option[] = [
    { id: 'less_than_nineteen', label: 'Moins de 19 ans' },
    { id: 'nineteen_to_twenty_two', label: '19-22 ans' },
    { id: 'twenty_three_to_twenty_six', label: '23-26 ans' },
    { id: 'twenty_seven_to_thirty', label: '27-30 ans' },
    { id: 'greater_than_thirty', label: 'Plus de 30 ans' },
];

export function PopulationsPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState<Filters>(initialFilters);
    const [showFilters, setShowFilters] = useState(true);
    const { selectedAcademicYear } = useSettings()
    const [sommeCumuler, setSommeCumuler] = useState(false);
    const [isCalculating, setIsCalculating] = useState(false);





    // Construire les paramètres de requête API
    const queryParams: PopulationParams = useMemo(() => ({
        page: currentPage,
        page_size: itemsPerPage,
        search: searchTerm || undefined,
        faculty: filters.faculty || undefined,
        department: filters.department || undefined,
        class_name: filters.className || undefined,
        sexe: (filters.sexe as 'M' | 'F' | '') || undefined,
        age_range: (filters.ageRange as PopulationParams['age_range']) || undefined,
        academic_year_id: selectedAcademicYear?.id
    }), [currentPage, itemsPerPage, searchTerm, filters, selectedAcademicYear]);

    // Hook pour récupérer les données paginées
    const {
        data: populationData,
        isLoading,
        error,
    } = usePopulations(queryParams);

    const changedData = useMemo(() => {
        if (!sommeCumuler || !populationData) return undefined;
        return { ...populationData, results: withPopulationTotalRow(populationData.results || []) };
    }, [sommeCumuler, populationData]);

    const handleToggleSommeCumuler = () => {
        if (!sommeCumuler) {
            setIsCalculating(true);
            setTimeout(() => {
                setSommeCumuler(true);
                setIsCalculating(false);
            }, 500);
        } else {
            setSommeCumuler(false);
        }
    };


    // Hooks pour récupérer les options de filtres (cascade)
    const { data: facultiesData } = useFaculties({ page_size: 100 });
    const { data: departmentsData } = useDepartments(
        filters.faculty ? { faculty: filters.faculty, page_size: 100 } : { page_size: 100 }
    );
    const { data: classesData } = useClasses(
        filters.department ? { department: filters.department, page_size: 100 } : { page_size: 100 }
    );


    // Transformer les options de filtres pour les dropdowns
    const facultyOptions: Option[] = useMemo(() => {
        return facultiesData?.results?.map(f => ({ id: f.id, label: f.faculty_abreviation })) || [];
    }, [facultiesData?.results]);

    const departmentOptions: Option[] = useMemo(() => {
        const departments = departmentsData?.results || [];
        // Filtrer par faculté si sélectionnée
        const filtered = filters.faculty
            ? departments.filter(d => d.faculty?.id === filters.faculty || d.faculty_id === filters.faculty)
            : departments;
        return filtered.map(d => ({ id: d.id, label: d.department_name }));
    }, [departmentsData?.results, filters.faculty]);

    const classOptions: Option[] = useMemo(() => {
        const classes = classesData?.results || [];
        // Filtrer par département si sélectionné
        const filtered = filters.department
            ? classes.filter(c => c.department?.id === filters.department || c.department_id === filters.department)
            : classes;
        return filtered.map(c => ({ id: c.id, label: c.class_name }));
    }, [classesData?.results, filters.department]);

    // Réinitialiser tous les filtres
    const resetFilters = () => {
        setFilters(initialFilters);
        setCurrentPage(1);
    };

    // Mettre à jour un filtre spécifique
    const updateFilter = (key: keyof Filters, value: string) => {
        setFilters(prev => {
            const newFilters = { ...prev, [key]: value };

            // Réinitialiser les filtres dépendants (cascade)
            if (key === 'faculty') {
                newFilters.department = '';
                newFilters.className = '';
            } else if (key === 'department') {
                newFilters.className = '';
            }

            return newFilters;
        });
        setCurrentPage(1);
    };

    // Compter les filtres actifs
    const activeFiltersCount = Object.values(filters).filter(v => v !== '').length;


    const columns = [
        {
            key: 'faculty_abreviation',
            label: 'Faculté',
            sortable: true,
            searchable: false,
            type: 'text' as const,
        },
        {
            key: 'departement_name',
            label: 'Département',
            sortable: true,
            searchable: false,
            type: 'text' as const,
        },
        {
            key: 'class_name',
            label: 'Classe',
            sortable: true,
            searchable: false,
            type: 'text' as const,
        },
        {
            key: 'sexe',
            label: 'Sexe',
            sortable: true,
            searchable: false,
            type: 'select' as const,
            options: [
                { value: 'M', label: 'Masculin' },
                { value: 'F', label: 'Féminin' },
            ],
        },
        {
            key: 'less_than_nineteen',
            label: '<19ans',
            sortable: true,
            searchable: false,
            type: 'number' as const,
        },
        {
            key: 'nineteen',
            label: '19ans',
            sortable: true,
            searchable: false,
            type: 'number' as const,
        },
        {
            key: 'twenty',
            label: '20ans',
            sortable: true,
            searchable: false,
            type: 'number' as const,
        },
        {
            key: 'twenty_one',
            label: '21ans',
            sortable: true,
            searchable: false,
            type: 'number' as const,
        },
        {
            key: 'twenty_two',
            label: '22ans',
            sortable: true,
            searchable: false,
            type: 'number' as const,
        },
        {
            key: 'twenty_three',
            label: '23ans',
            sortable: true,
            searchable: false,
            type: 'number' as const,
        },
        {
            key: 'twenty_four',
            label: '24ans',
            sortable: true,
            searchable: false,
            type: 'number' as const,
        },
        {
            key: 'twenty_five',
            label: '25ans',
            sortable: true,
            searchable: false,
            type: 'number' as const,
        },
        {
            key: 'twenty_six',
            label: '26ans',
            sortable: true,
            searchable: false,
            type: 'number' as const,
        },
        {
            key: 'twenty_seven',
            label: '27ans',
            sortable: true,
            searchable: false,
            type: 'number' as const,
        },
        {
            key: 'twenty_eight',
            label: '28ans',
            sortable: true,
            searchable: false,
            type: 'number' as const,
        },
        {
            key: 'twenty_nine',
            label: '29ans',
            sortable: true,
            searchable: false,
            type: 'number' as const,
        },
        {
            key: 'thirty',
            label: '30ans',
            sortable: true,
            searchable: false,
            type: 'number' as const,
        },
        {
            key: 'thirty_one',
            label: '31ans',
            sortable: true,
            searchable: false,
            type: 'number' as const,
        },
        {
            key: 'greater_than_thirty_one',
            label: '>31ans',
            sortable: true,
            searchable: false,
            type: 'number' as const,
        },
        {
            key: 'student_count',
            label: 'Total',
            sortable: true,
            searchable: false,
            type: 'number' as const,
        },
    ];

    return (
        <div className="space-y-6">
            {/* En-tête */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold">Gestion des Populations Étudiantes</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                        Suivi et analyse des populations étudiantes
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {/* Bouton Export */}
                    <div className="relative group">
                        <button
                            onClick={handleToggleSommeCumuler}
                            disabled={isCalculating}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-all disabled:opacity-50"
                        >
                            {isCalculating ? (
                                <Magnet size={18} className="animate-spin" />
                            ) : (
                                <Magnet size={18} />
                            )}
                            <span>{sommeCumuler ? 'Masquer' : 'Somme'} Cumulée</span>
                        </button>

                    </div>

                    {/* Bouton Filtres */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`
                            flex items-center gap-2 px-4 py-2 rounded-lg border transition-all
                            ${showFilters
                                ? 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300'
                                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                            }
                        `}
                    >
                        <Filter size={18} />
                        <span>Filtres</span>
                        {activeFiltersCount > 0 && (
                            <span className="flex items-center justify-center w-5 h-5 text-xs font-medium bg-blue-600 text-white rounded-full">
                                {activeFiltersCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Section des filtres */}
            {showFilters && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Filtrer les données
                        </h3>
                        {activeFiltersCount > 0 && (
                            <button
                                onClick={resetFilters}
                                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                            >
                                <RotateCcw size={14} />
                                Réinitialiser
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        {/* Filtre Faculté */}
                        <SingleSelectDropdown
                            label="Faculté"
                            options={facultyOptions}
                            value={filters.faculty}
                            onChange={(value) => updateFilter('faculty', value)}
                            placeholder="Toutes les facultés"
                            searchPlaceholder="Rechercher une faculté..."
                        />

                        {/* Filtre Département */}
                        <SingleSelectDropdown
                            label="Département"
                            options={departmentOptions}
                            value={filters.department}
                            onChange={(value) => updateFilter('department', value)}
                            placeholder="Tous les départements"
                            searchPlaceholder="Rechercher un département..."
                        />

                        {/* Filtre Classe */}
                        <SingleSelectDropdown
                            label="Classe"
                            options={classOptions}
                            value={filters.className}
                            onChange={(value) => updateFilter('className', value)}
                            placeholder="Toutes les classes"
                            searchPlaceholder="Rechercher une classe..."
                        />

                        {/* Filtre Sexe */}
                        <SingleSelectDropdown
                            label="Sexe"
                            options={sexeOptions}
                            value={filters.sexe}
                            onChange={(value) => updateFilter('sexe', value)}
                            placeholder="Tous"
                        />

                        {/* Filtre Tranche d'âge */}
                        <SingleSelectDropdown
                            label="Tranche d'âge"
                            options={ageRangeOptions}
                            value={filters.ageRange}
                            onChange={(value) => updateFilter('ageRange', value)}
                            placeholder="Toutes les tranches"
                        />
                    </div>

                    {/* Résumé des filtres actifs */}
                    {activeFiltersCount > 0 && populationData && (

                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-medium">{populationData.count}</span> résultat(s) trouvé(s) avec les filtres actuels
                            </p>
                        </div>



                    )}
                </div>
            )}

            {/* Tableau de données */}
            <DataTable
                tableId="Population-etudiante"
                columns={columns}
                data={(sommeCumuler ? changedData : populationData) || { results: [], count: 0, next: null, previous: null, current_page: 1, total_pages: 0 }}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                onSearchChange={setSearchTerm}
                isLoading={isLoading}
                error={error?.message || null}
                isPaginated={true}
            />
        </div>
    );
}
