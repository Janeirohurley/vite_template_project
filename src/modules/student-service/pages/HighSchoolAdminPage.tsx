import { useEffect, useMemo, useRef, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import DataTable, { type DataTableColumn } from '@/components/ui/DataTable';
import { FormModal } from '../components/FormModal';
import { Input } from '@/components/ui/input';
import { SingleSelectDropdown } from '@/components/ui/SingleSelectDropdown';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { PaginatedResponse } from '@/types/api';
import type { Country } from '@/types';
import { useCountries } from '@/api/geo';
import {
    useHighSchools,
    useCreateHighSchool,
    useUpdateHighSchool,
    useDeleteHighSchool,
    useSections,
    useCreateSection,
    useUpdateSection,
    useDeleteSection,
    useCertificates,
    useCreateCertificate,
    useUpdateCertificate,
    useDeleteCertificate,
    useOptions,
    useCreateOption,
    useUpdateOption,
    useDeleteOption,
    useTrainingCenters,
    useCreateTrainingCenter,
    useUpdateTrainingCenter,
    useDeleteTrainingCenter,
} from '../hooks/useHighSchool';
import type {
    HighSchool,
    CreateHighSchoolData,
    Section,
    CreateSectionData,
    Certificate,
    CreateCertificateData,
    Option,
    CreateOptionData,
    TrainingCenter,
    CreateTrainingCenterData,
} from '../types';
import { PageHeader } from '@/modules/admin/components/PageHeader';
import { FormGroup } from '@/components/ui/FormGroup';

type EntityType = 'highschool' | 'section' | 'certificate' | 'option' | 'trainingcenter';
type Entity = HighSchool | Section | Certificate | Option | TrainingCenter;

type BackendFilters = Record<string, string>;

type FormMap = {
    highschool: CreateHighSchoolData;
    section: CreateSectionData;
    certificate: CreateCertificateData;
    option: CreateOptionData;
    trainingcenter: CreateTrainingCenterData;
};

type LocationState = {
    countryId: string;
    provinceId: string;
    communeId: string;
    zoneId: string;
    collineId: string;
};

type ConfirmState = {
    open: boolean;
    title: string;
    description: string;
    confirmLabel: string;
    cancelLabel: string;
};

type ConfirmOptions = {
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
};

type ErrorWithMessage = { message?: string };

type ErrorWithFormatted = {
    formattedError?: {
        message?: string;
    };
};

const EMPTY_PAGE: PaginatedResponse<Entity> = {
    results: [],
    count: 0,
    next: null,
    previous: null,
    current_page: 1,
    total_pages: 1,
};

const emptyFormState: FormMap = {
    highschool: {
        hs_name: '',
        zone_id: '',
        code: '',
    },
    section: {
        section_name: '',
    },
    certificate: {
        certificate_name: '',
        section_id: '',
    },
    option: {
        option_name: '',
        section_id: '',
    },
    trainingcenter: {
        name: '',
        commune: '',
    },
};

const emptyLocationState: LocationState = {
    countryId: '',
    provinceId: '',
    communeId: '',
    zoneId: '',
    collineId: '',
};

const isHighSchool = (item: Entity | null): item is HighSchool =>
    Boolean(item && 'hs_name' in item);

const isSection = (item: Entity | null): item is Section =>
    Boolean(item && 'section_name' in item);

const isCertificate = (item: Entity | null): item is Certificate =>
    Boolean(item && 'certificate_name' in item);

const isOption = (item: Entity | null): item is Option =>
    Boolean(item && 'option_name' in item);

const isTrainingCenter = (item: Entity | null): item is TrainingCenter =>
    Boolean(item && 'commune' in item && 'name' in item);

const getErrorMessage = (error: unknown, fallback: string) => {
    if (!error) return fallback;
    if (typeof error === 'string') return error;
    if (typeof error === 'object') {
        const maybe = error as ErrorWithMessage & ErrorWithFormatted;
        return maybe.formattedError?.message || maybe.message || fallback;
    }
    return fallback;
};

const buildGeoOptions = (countries: Country[], location: LocationState) => {
    const selectedCountry = countries.find((country) => country.id === location.countryId);
    const provinces = selectedCountry?.provinces || [];
    const selectedProvince = provinces.find((province) => province.id === location.provinceId);
    const communes = selectedProvince?.communes || [];
    const selectedCommune = communes.find((commune) => commune.id === location.communeId);
    const zones = selectedCommune?.zones || [];
    const selectedZone = zones.find((zone) => zone.id === location.zoneId);
    const collines = selectedZone?.collines || [];

    return {
        provinces,
        communes,
        zones,
        collines,
        countryOptions: countries.map((country) => ({
            id: country.id,
            label: country.country_name,
        })),
        provinceOptions: provinces.map((province) => ({
            id: province.id,
            label: province.province_name,
        })),
        communeOptions: communes.map((commune) => ({
            id: commune.id,
            label: commune.commune_name,
        })),
        zoneOptions: zones.map((zone) => ({
            id: zone.id,
            label: zone.zone_name,
        })),
        collineOptions: collines.map((colline) => ({
            id: colline.id,
            label: colline.colline_name,
        })),
    };
};

const findLocationByZoneId = (countries: Country[], zoneId: string): LocationState | null => {
    for (const country of countries) {
        for (const province of country.provinces || []) {
            for (const commune of province.communes || []) {
                for (const zone of commune.zones || []) {
                    if (zone.id === zoneId) {
                        return {
                            countryId: country.id,
                            provinceId: province.id,
                            communeId: commune.id,
                            zoneId: zone.id,
                            collineId: '',
                        };
                    }
                }
            }
        }
    }
    return null;
};

const findLocationByCommuneId = (countries: Country[], communeId: string): LocationState | null => {
    for (const country of countries) {
        for (const province of country.provinces || []) {
            for (const commune of province.communes || []) {
                if (commune.id === communeId) {
                    return {
                        countryId: country.id,
                        provinceId: province.id,
                        communeId: commune.id,
                        zoneId: '',
                        collineId: '',
                    };
                }
            }
        }
    }
    return null;
};

const findLocationByCollineId = (countries: Country[], collineId: string): LocationState | null => {
    for (const country of countries) {
        for (const province of country.provinces || []) {
            for (const commune of province.communes || []) {
                for (const zone of commune.zones || []) {
                    if ((zone.collines || []).some((colline) => colline.id === collineId)) {
                        return {
                            countryId: country.id,
                            provinceId: province.id,
                            communeId: commune.id,
                            zoneId: zone.id,
                            collineId,
                        };
                    }
                }
            }
        }
    }
    return null;
};

function useConfirmDialog() {
    const [state, setState] = useState<ConfirmState>({
        open: false,
        title: '',
        description: '',
        confirmLabel: 'Confirmer',
        cancelLabel: 'Annuler',
    });
    const actionRef = useRef<(() => void) | null>(null);

    const openConfirm = (options: ConfirmOptions) => {
        const {
            title,
            description,
            onConfirm,
            confirmLabel = 'Confirmer',
            cancelLabel = 'Annuler',
        } = options;

        actionRef.current = onConfirm;
        setState({
            open: true,
            title,
            description,
            confirmLabel,
            cancelLabel,
        });
    };

    const close = () => {
        setState((prev) => ({ ...prev, open: false }));
    };

    const confirm = () => {
        const action = actionRef.current;
        close();
        action?.();
    };

    return { state, openConfirm, close, confirm };
}

function ConfirmDialog({
    state,
    onConfirm,
    onClose,
}: {
    state: ConfirmState;
    onConfirm: () => void;
    onClose: () => void;
}) {
    return (
        <AlertDialog open={state.open} onOpenChange={(open) => (!open ? onClose() : undefined)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{state.title}</AlertDialogTitle>
                    <AlertDialogDescription>{state.description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose}>{state.cancelLabel}</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm}>{state.confirmLabel}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

function getItemLabel(entity: EntityType, item: Entity) {
    switch (entity) {
        case 'highschool':
            return isHighSchool(item) ? item.hs_name : 'element';
        case 'section':
            return isSection(item) ? item.section_name : 'element';
        case 'certificate':
            return isCertificate(item) ? item.certificate_name : 'element';
        case 'option':
            return isOption(item) ? item.option_name : 'element';
        case 'trainingcenter':
            return isTrainingCenter(item) ? item.name : 'element';
        default:
            return 'element';
    }
}

export default function HighSchoolAdminPage() {
    const [activeTab, setActiveTab] = useState<EntityType>('highschool');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [backendFilter, setBackendFilter] = useState<BackendFilters>({});
    const [backendOrdering, setBackendOrdering] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Entity | null>(null);
    const [formState, setFormState] = useState<FormMap>(emptyFormState);
    const [highschoolLocation, setHighschoolLocation] = useState<LocationState>(emptyLocationState);
    const [trainingCenterLocation, setTrainingCenterLocation] =
        useState<LocationState>(emptyLocationState);
    const confirm = useConfirmDialog();

    const { data: countries = [] } = useCountries();

    const activeParams = {
        page: currentPage,
        search: searchTerm,
        page_size: itemsPerPage,
        ordering: backendOrdering,
        ...backendFilter,
    };

    const inactiveParams = { page: 1, search: '', page_size: 10 };

    const { data: highschoolsData, isLoading: highschoolsLoading, refetch: refetchHighschools } =
        useHighSchools(activeTab === 'highschool' ? activeParams : inactiveParams);

    const createHighSchoolMutation = useCreateHighSchool();
    const updateHighSchoolMutation = useUpdateHighSchool();
    const deleteHighSchoolMutation = useDeleteHighSchool();

    const sectionListParams = activeTab === 'section' ? activeParams : { page: 1, page_size: 200 };
    const { data: sectionsData, isLoading: sectionsLoading, refetch: refetchSections } = useSections(
        sectionListParams
    );
    const sections = useMemo(() => {
        return sectionsData?.results || [];
    }, [sectionsData]); // Ne change QUE si sectionsData change

    const createSectionMutation = useCreateSection();
    const updateSectionMutation = useUpdateSection();
    const deleteSectionMutation = useDeleteSection();

    const { data: certificatesData, isLoading: certificatesLoading, refetch: refetchCertificates } =
        useCertificates(activeTab === 'certificate' ? activeParams : inactiveParams);

    const createCertificateMutation = useCreateCertificate();
    const updateCertificateMutation = useUpdateCertificate();
    const deleteCertificateMutation = useDeleteCertificate();

    const { data: optionsData, isLoading: optionsLoading, refetch: refetchOptions } = useOptions(
        activeTab === 'option' ? activeParams : inactiveParams
    );
    const createOptionMutation = useCreateOption();
    const updateOptionMutation = useUpdateOption();
    const deleteOptionMutation = useDeleteOption();

    const { data: trainingCentersData, isLoading: trainingCentersLoading, refetch: refetchTrainingCenters } =
        useTrainingCenters(activeTab === 'trainingcenter' ? activeParams : inactiveParams);

    const createTrainingCenterMutation = useCreateTrainingCenter();
    const updateTrainingCenterMutation = useUpdateTrainingCenter();
    const deleteTrainingCenterMutation = useDeleteTrainingCenter();

    const sectionOptions = useMemo(
        () =>
            sections.map((section) => ({
                id: section.id,
                label: section.section_name,
            })),
        [sections]
    );

    const sectionNameById = useMemo(() => {
        return new Map(sections.map((section) => [section.id, section.section_name]));
    }, [sections]);

    const highschoolGeo = useMemo(
        () => buildGeoOptions(countries, highschoolLocation),
        [countries, highschoolLocation]
    );

    const trainingCenterGeo = useMemo(
        () => buildGeoOptions(countries, trainingCenterLocation),
        [countries, trainingCenterLocation]
    );

    const entityState = {
        highschool: {
            label: 'Lycees',
            data: highschoolsData || EMPTY_PAGE,
            count: highschoolsData?.count || 0,
            isLoading:
                highschoolsLoading ||
                createHighSchoolMutation.isPending ||
                updateHighSchoolMutation.isPending ||
                deleteHighSchoolMutation.isPending,
            refetch: refetchHighschools,
            deleteMutation: deleteHighSchoolMutation,
        },
        section: {
            label: 'Sections',
            data: sectionsData || EMPTY_PAGE,
            count: sectionsData?.count || 0,
            isLoading:
                sectionsLoading ||
                createSectionMutation.isPending ||
                updateSectionMutation.isPending ||
                deleteSectionMutation.isPending,
            refetch: refetchSections,
            deleteMutation: deleteSectionMutation,
        },
        certificate: {
            label: 'Certificats',
            data: certificatesData || EMPTY_PAGE,
            count: certificatesData?.count || 0,
            isLoading:
                certificatesLoading ||
                createCertificateMutation.isPending ||
                updateCertificateMutation.isPending ||
                deleteCertificateMutation.isPending,
            refetch: refetchCertificates,
            deleteMutation: deleteCertificateMutation,
        },
        option: {
            label: 'Options',
            data: optionsData || EMPTY_PAGE,
            count: optionsData?.count || 0,
            isLoading:
                optionsLoading ||
                createOptionMutation.isPending ||
                updateOptionMutation.isPending ||
                deleteOptionMutation.isPending,
            refetch: refetchOptions,
            deleteMutation: deleteOptionMutation,
        },
        trainingcenter: {
            label: 'Centres de formation',
            data: trainingCentersData || EMPTY_PAGE,
            count: trainingCentersData?.count || 0,
            isLoading:
                trainingCentersLoading ||
                createTrainingCenterMutation.isPending ||
                updateTrainingCenterMutation.isPending ||
                deleteTrainingCenterMutation.isPending,
            refetch: refetchTrainingCenters,
            deleteMutation: deleteTrainingCenterMutation,
        },
    } satisfies Record<
        EntityType,
        {
            label: string;
            data: PaginatedResponse<Entity>;
            count: number;
            isLoading: boolean;
            refetch: () => void;
            deleteMutation: { mutate: (id: string, options?: { onError?: (error: unknown) => void }) => void };
        }
    >;

    const columnsByEntity = useMemo<Record<EntityType, DataTableColumn<Entity>[]>>(
        () => ({
            highschool: [
                {
                    key: 'hs_name',
                    label: 'Nom du lycee',
                    sortable: true,
                    render: (row) => (isHighSchool(row) ? row.hs_name : '-'),
                },
                {
                    key: 'zone__zone_name',
                    label: 'Zone',
                    sortable: true,
                    render: (row) => (isHighSchool(row) ? row.zone?.zone_name || '-' : '-'),
                },
                {
                    key: 'code',
                    label: 'Code',
                    sortable: true,
                    render: (row) => (isHighSchool(row) ? row.code || '-' : '-'),
                },
            ],
            section: [
                {
                    key: 'section_name',
                    label: 'Nom de la section',
                    sortable: true,
                    render: (row) => (isSection(row) ? row.section_name : '-'),
                },
            ],
            certificate: [
                {
                    key: 'certificate_name',
                    label: 'Nom du certificat',
                    sortable: true,
                    render: (row) => (isCertificate(row) ? row.certificate_name : '-'),
                },
                {
                    key: 'section__section_name',
                    label: 'Section',
                    sortable: true,
                    render: (row) => {
                        if (!isCertificate(row)) return '-';
                        const section = row.section;
                        if (section && typeof section === 'object') {
                            return section.section_name || '-';
                        }
                        if (section) {
                            return sectionNameById.get(String(section)) || String(section);
                        }
                        return '-';
                    },
                },
            ],
            option: [
                {
                    key: 'option_name',
                    label: "Nom de l'option",
                    sortable: true,
                    render: (row) => (isOption(row) ? row.option_name : '-'),
                },
                {
                    key: 'section__section_name',
                    label: 'Section',
                    sortable: true,
                    render: (row) => {
                        if (!isOption(row)) return '-';
                        const section = row.section;
                        if (section && typeof section === 'object') {
                            return section.section_name || '-';
                        }
                        if (section) {
                            return sectionNameById.get(String(section)) || String(section);
                        }
                        return '-';
                    },
                },
            ],
            trainingcenter: [
                {
                    key: 'name',
                    label: 'Nom du centre',
                    sortable: true,
                    render: (row) => (isTrainingCenter(row) ? row.name : '-'),
                },
                {
                    key: 'commune',
                    label: 'Commune',
                    sortable: true,
                    render: (row) => (isTrainingCenter(row) ? row.commune || '-' : '-'),
                },
            ],
        }),
        [sectionNameById]
    );

    const updateFormState = <K extends EntityType>(entity: K, nextValue: FormMap[K]) => {
        setFormState((prev) => ({
            ...prev,
            [entity]: nextValue,
        } as FormMap));
    };

    const handleRefresh = () => {
        entityState[activeTab].refetch();
    };

    const handleCreate = () => {
        setEditingItem(null);
        updateFormState(activeTab, emptyFormState[activeTab]);
        if (activeTab === 'highschool') {
            setHighschoolLocation(emptyLocationState);
        }
        if (activeTab === 'trainingcenter') {
            setTrainingCenterLocation(emptyLocationState);
        }
        setIsModalOpen(true);
    };

    const handleEdit = (item: Entity) => {
        setEditingItem(item);

        switch (activeTab) {
            case 'highschool':
                if (isHighSchool(item)) {
                    updateFormState('highschool', {
                        hs_name: item.hs_name || '',
                        zone_id: item.zone?.id || '',
                        code: item.code || '',
                    });
                    if (item.zone?.id) {
                        const location = findLocationByZoneId(countries, item.zone.id);
                        if (location) {
                            setHighschoolLocation(location);
                        }
                    }
                }
                break;
            case 'section':
                if (isSection(item)) {
                    updateFormState('section', {
                        section_name: item.section_name || '',
                    });
                }
                break;
            case 'certificate':
                if (isCertificate(item)) {
                    const sectionId =
                        item.section && typeof item.section === 'object' ? item.section.id : item.section || '';
                    updateFormState('certificate', {
                        certificate_name: item.certificate_name || '',
                        section_id: String(sectionId),
                    });
                }
                break;
            case 'option':
                if (isOption(item)) {
                    const sectionId =
                        item.section && typeof item.section === 'object' ? item.section.id : item.section || '';
                    updateFormState('option', {
                        option_name: item.option_name || '',
                        section_id: String(sectionId),
                    });
                }
                break;
            case 'trainingcenter':
                if (isTrainingCenter(item)) {
                    updateFormState('trainingcenter', {
                        name: item.name || '',
                        commune: item.commune || '',
                    });
                    if (item.commune) {
                        const location = findLocationByCommuneId(countries, item.commune);
                        if (location) {
                            setTrainingCenterLocation(location);
                        }
                    }
                }
                break;
        }

        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const handleSubmit = () => {
        switch (activeTab) {
            case 'highschool':
                if (isHighSchool(editingItem)) {
                    updateHighSchoolMutation.mutate(
                        { id: editingItem.id, data: formState.highschool },
                        {
                            onSuccess: () => {
                                handleCloseModal();
                                entityState.highschool.refetch();
                            },
                            onError: (error) =>
                                setError(getErrorMessage(error, 'Erreur lors de la modification')),
                        }
                    );
                    return;
                }

                createHighSchoolMutation.mutate(formState.highschool, {
                    onSuccess: () => {
                        handleCloseModal();
                        entityState.highschool.refetch();
                    },
                    onError: (error) => setError(getErrorMessage(error, 'Erreur lors de la creation')),
                });
                return;
            case 'section':
                if (isSection(editingItem)) {
                    updateSectionMutation.mutate(
                        { id: editingItem.id, data: formState.section },
                        {
                            onSuccess: () => {
                                handleCloseModal();
                                entityState.section.refetch();
                            },
                            onError: (error) =>
                                setError(getErrorMessage(error, 'Erreur lors de la modification')),
                        }
                    );
                    return;
                }

                createSectionMutation.mutate(formState.section, {
                    onSuccess: () => {
                        handleCloseModal();
                        entityState.section.refetch();
                    },
                    onError: (error) => setError(getErrorMessage(error, 'Erreur lors de la creation')),
                });
                return;
            case 'certificate':
                if (isCertificate(editingItem)) {
                    updateCertificateMutation.mutate(
                        { id: editingItem.id, data: formState.certificate },
                        {
                            onSuccess: () => {
                                handleCloseModal();
                                entityState.certificate.refetch();
                            },
                            onError: (error) =>
                                setError(getErrorMessage(error, 'Erreur lors de la modification')),
                        }
                    );
                    return;
                }

                createCertificateMutation.mutate(formState.certificate, {
                    onSuccess: () => {
                        handleCloseModal();
                        entityState.certificate.refetch();
                    },
                    onError: (error) => setError(getErrorMessage(error, 'Erreur lors de la creation')),
                });
                return;
            case 'option':
                if (isOption(editingItem)) {
                    updateOptionMutation.mutate(
                        { id: editingItem.id, data: formState.option },
                        {
                            onSuccess: () => {
                                handleCloseModal();
                                entityState.option.refetch();
                            },
                            onError: (error) =>
                                setError(getErrorMessage(error, 'Erreur lors de la modification')),
                        }
                    );
                    return;
                }

                createOptionMutation.mutate(formState.option, {
                    onSuccess: () => {
                        handleCloseModal();
                        entityState.option.refetch();
                    },
                    onError: (error) => setError(getErrorMessage(error, 'Erreur lors de la creation')),
                });
                return;
            case 'trainingcenter':
                if (isTrainingCenter(editingItem)) {
                    updateTrainingCenterMutation.mutate(
                        { id: editingItem.id, data: formState.trainingcenter },
                        {
                            onSuccess: () => {
                                handleCloseModal();
                                entityState.trainingcenter.refetch();
                            },
                            onError: (error) =>
                                setError(getErrorMessage(error, 'Erreur lors de la modification')),
                        }
                    );
                    return;
                }

                createTrainingCenterMutation.mutate(formState.trainingcenter, {
                    onSuccess: () => {
                        handleCloseModal();
                        entityState.trainingcenter.refetch();
                    },
                    onError: (error) => setError(getErrorMessage(error, 'Erreur lors de la creation')),
                });
                return;
        }
    };

    const handleDelete = (item: Entity) => {
        const label = getItemLabel(activeTab, item);
        confirm.openConfirm({
            title: 'Supprimer',
            description: `Voulez-vous vraiment supprimer ${label} ?`,
            confirmLabel: 'Supprimer',
            onConfirm: () => {
                entityState[activeTab].deleteMutation.mutate(item.id, {
                    onError: (error) => setError(getErrorMessage(error, 'Erreur lors de la suppression')),
                });
            },
        });
    };

    const handleBulkAction = (action: string, selectedIds: Set<string>) => {
        if (action !== 'delete' || selectedIds.size === 0) return;
        const ids = Array.from(selectedIds);

        confirm.openConfirm({
            title: 'Supprimer',
            description: `Voulez-vous vraiment supprimer ${ids.length} elements ?`,
            confirmLabel: 'Supprimer',
            onConfirm: () => {
                ids.forEach((id) => {
                    entityState[activeTab].deleteMutation.mutate(id, {
                        onError: (error) =>
                            setError(getErrorMessage(error, 'Erreur lors de la suppression')),
                    });
                });
            },
        });
    };

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const handleBackendFiltersChange = (filters: BackendFilters) => {
        setBackendFilter(filters);
        setCurrentPage(1);
    };

    const handleBackendOrderingChange = (ordering: string) => {
        setBackendOrdering(ordering);
        setCurrentPage(1);
    };

    useEffect(() => {
        if (activeTab !== 'highschool') return;
        if (!isHighSchool(editingItem)) return;
        if (!editingItem.zone?.id) return;
        const location = findLocationByZoneId(countries, editingItem.zone.id);
        if (location) {
            setHighschoolLocation(location);
        }
    }, [activeTab, countries, editingItem]);

    useEffect(() => {
        if (activeTab !== 'trainingcenter') return;
        if (!isTrainingCenter(editingItem)) return;
        if (!editingItem.commune) return;
        const location = findLocationByCommuneId(countries, editingItem.commune);
        if (location) {
            setTrainingCenterLocation(location);
        }
    }, [activeTab, countries, editingItem]);

    const tabs = [
        { id: 'highschool' as EntityType, label: 'Lycees' },
        { id: 'section' as EntityType, label: 'Sections' },
        { id: 'certificate' as EntityType, label: 'Certificats' },
        { id: 'option' as EntityType, label: 'Options' },
        { id: 'trainingcenter' as EntityType, label: 'Centres de formation' },
    ];

    const getModalTitle = () => {
        const action = editingItem ? 'Modifier' : 'Creer';
        return `${action} ${entityState[activeTab].label.toLowerCase()}`;
    };

    const renderForm = () => {
        switch (activeTab) {
            case 'highschool': {
                const form = formState.highschool;
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium">Nom du lycee</label>
                            <Input
                                name="hs_name"
                                value={form.hs_name}
                                onChange={(e) =>
                                    updateFormState('highschool', { ...form, hs_name: e.target.value })
                                }
                                required
                            />
                        </div>
                        <FormGroup>
                            <SingleSelectDropdown
                                label="Pays"
                                options={highschoolGeo.countryOptions}
                                value={highschoolLocation.countryId}
                                onChange={(value) => {
                                    setHighschoolLocation({
                                        countryId: value,
                                        provinceId: '',
                                        communeId: '',
                                        zoneId: '',
                                        collineId: '',
                                    });
                                    updateFormState('highschool', { ...form, zone_id: '' });
                                }}
                                placeholder="Selectionner un pays"
                                searchPlaceholder="Rechercher un pays..."
                                required
                            />
                            <SingleSelectDropdown
                                label="Province"
                                options={highschoolGeo.provinceOptions}
                                value={highschoolLocation.provinceId}
                                onChange={(value) => {
                                    setHighschoolLocation((prev) => ({
                                        ...prev,
                                        provinceId: value,
                                        communeId: '',
                                        zoneId: '',
                                        collineId: '',
                                    }));
                                    updateFormState('highschool', { ...form, zone_id: '' });
                                }}
                                placeholder="Selectionner une province"
                                searchPlaceholder="Rechercher une province..."
                                disabled={!highschoolLocation.countryId}
                                required
                            />
                        </FormGroup>

                        <SingleSelectDropdown
                            label="Commune"
                            options={highschoolGeo.communeOptions}
                            value={highschoolLocation.communeId}
                            onChange={(value) => {
                                setHighschoolLocation((prev) => ({
                                    ...prev,
                                    communeId: value,
                                    zoneId: '',
                                    collineId: '',
                                }));
                                updateFormState('highschool', { ...form, zone_id: '' });
                            }}
                            placeholder="Selectionner une commune"
                            searchPlaceholder="Rechercher une commune..."
                            disabled={!highschoolLocation.provinceId}
                            required
                        />
                        <SingleSelectDropdown
                            label="Zone"
                            options={highschoolGeo.zoneOptions}
                            value={highschoolLocation.zoneId}
                            onChange={(value) => {
                                setHighschoolLocation((prev) => ({
                                    ...prev,
                                    zoneId: value,
                                    collineId: '',
                                }));
                                updateFormState('highschool', { ...form, zone_id: value });
                            }}
                            placeholder="Selectionner une zone"
                            searchPlaceholder="Rechercher une zone..."
                            disabled={!highschoolLocation.communeId}
                            required
                        />
                        <SingleSelectDropdown
                            label="Colline (optionnel)"
                            options={highschoolGeo.collineOptions}
                            value={highschoolLocation.collineId}
                            onChange={(value) => {
                                const resolved = findLocationByCollineId(countries, value);
                                if (resolved) {
                                    setHighschoolLocation(resolved);
                                    updateFormState('highschool', { ...form, zone_id: resolved.zoneId });
                                } else {
                                    setHighschoolLocation((prev) => ({ ...prev, collineId: value }));
                                }
                            }}
                            placeholder="Selectionner une colline"
                            searchPlaceholder="Rechercher une colline..."
                            disabled={!highschoolLocation.zoneId}
                        />
                        <div>
                            <label className="block text-sm font-medium">Code</label>
                            <Input
                                name="code"
                                value={form.code || ''}
                                onChange={(e) =>
                                    updateFormState('highschool', { ...form, code: e.target.value })
                                }
                            />
                        </div>
                    </>
                );
            }
            case 'section': {
                const form = formState.section;
                return (
                    <div>
                        <label className="block text-sm font-medium">Nom de la section</label>
                        <Input
                            name="section_name"
                            value={form.section_name}
                            onChange={(e) =>
                                updateFormState('section', { ...form, section_name: e.target.value })
                            }
                            required
                        />
                    </div>
                );
            }
            case 'certificate': {
                const form = formState.certificate;
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium">Nom du certificat</label>
                            <Input
                                name="certificate_name"
                                value={form.certificate_name}
                                onChange={(e) =>
                                    updateFormState('certificate', {
                                        ...form,
                                        certificate_name: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>
                        <SingleSelectDropdown
                            label="Section"
                            options={sectionOptions}
                            value={form.section_id}
                            onChange={(value) =>
                                updateFormState('certificate', {
                                    ...form,
                                    section_id: value,
                                })
                            }
                            placeholder="Selectionner..."
                            searchPlaceholder="Rechercher..."
                            required
                        />
                    </>
                );
            }
            case 'option': {
                const form = formState.option;
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium">Nom de l'option</label>
                            <Input
                                name="option_name"
                                value={form.option_name}
                                onChange={(e) =>
                                    updateFormState('option', { ...form, option_name: e.target.value })
                                }
                                required
                            />
                        </div>
                        <SingleSelectDropdown
                            label="Section"
                            options={sectionOptions}
                            value={form.section_id}
                            onChange={(value) =>
                                updateFormState('option', {
                                    ...form,
                                    section_id: value,
                                })
                            }
                            placeholder="Selectionner..."
                            searchPlaceholder="Rechercher..."
                            required
                        />
                    </>
                );
            }
            case 'trainingcenter': {
                const form = formState.trainingcenter;
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium">Nom du centre</label>
                            <Input
                                name="name"
                                value={form.name}
                                onChange={(e) =>
                                    updateFormState('trainingcenter', { ...form, name: e.target.value })
                                }
                                required
                            />
                        </div>
                        <FormGroup>
                            <SingleSelectDropdown
                                label="Pays"
                                options={trainingCenterGeo.countryOptions}
                                value={trainingCenterLocation.countryId}
                                onChange={(value) => {
                                    setTrainingCenterLocation({
                                        countryId: value,
                                        provinceId: '',
                                        communeId: '',
                                        zoneId: '',
                                        collineId: '',
                                    });
                                    updateFormState('trainingcenter', { ...form, commune: '' });
                                }}
                                placeholder="Selectionner un pays"
                                searchPlaceholder="Rechercher un pays..."
                                required
                            />
                            <SingleSelectDropdown
                                label="Province"
                                options={trainingCenterGeo.provinceOptions}
                                value={trainingCenterLocation.provinceId}
                                onChange={(value) => {
                                    setTrainingCenterLocation((prev) => ({
                                        ...prev,
                                        provinceId: value,
                                        communeId: '',
                                        zoneId: '',
                                        collineId: '',
                                    }));
                                    updateFormState('trainingcenter', { ...form, commune: '' });
                                }}
                                placeholder="Selectionner une province"
                                searchPlaceholder="Rechercher une province..."
                                disabled={!trainingCenterLocation.countryId}
                                required
                            />
                        </FormGroup>

                        <SingleSelectDropdown
                            label="Commune"
                            options={trainingCenterGeo.communeOptions}
                            value={trainingCenterLocation.communeId}
                            onChange={(value) => {
                                setTrainingCenterLocation((prev) => ({
                                    ...prev,
                                    communeId: value,
                                    zoneId: '',
                                    collineId: '',
                                }));
                                updateFormState('trainingcenter', { ...form, commune: value });
                            }}
                            placeholder="Selectionner une commune"
                            searchPlaceholder="Rechercher une commune..."
                            disabled={!trainingCenterLocation.provinceId}
                            required
                        />
                        <SingleSelectDropdown
                            label="Zone (optionnel)"
                            options={trainingCenterGeo.zoneOptions}
                            value={trainingCenterLocation.zoneId}
                            onChange={(value) => {
                                setTrainingCenterLocation((prev) => ({
                                    ...prev,
                                    zoneId: value,
                                    collineId: '',
                                }));
                            }}
                            placeholder="Selectionner une zone"
                            searchPlaceholder="Rechercher une zone..."
                            disabled={!trainingCenterLocation.communeId}
                        />
                        <SingleSelectDropdown
                            label="Colline (optionnel)"
                            options={trainingCenterGeo.collineOptions}
                            value={trainingCenterLocation.collineId}
                            onChange={(value) => {
                                const resolved = findLocationByCollineId(countries, value);
                                if (resolved) {
                                    setTrainingCenterLocation(resolved);
                                } else {
                                    setTrainingCenterLocation((prev) => ({ ...prev, collineId: value }));
                                }
                            }}
                            placeholder="Selectionner une colline"
                            searchPlaceholder="Rechercher une colline..."
                            disabled={!trainingCenterLocation.zoneId}
                        />
                    </>
                );
            }
        }
    };

    return (
        <div className="w-full max-w-full overflow-hidden">
            <PageHeader
                title=' Gestion des etablissements secondaires'
                rightElement={
                    <div className="mb-4 flex gap-2 flex-wrap">
                        <button
                            onClick={handleCreate}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        >
                            Creer
                        </button>
                        <button
                            onClick={handleRefresh}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Actualiser
                        </button>
                        {error && (
                            <button
                                onClick={() => setError(null)}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                            >
                                Effacer l'erreur
                            </button>
                        )}
                    </div>
                }
            />

            <Tabs
                value={activeTab}
                onValueChange={(value) => {
                    const nextTab = value as EntityType;
                    setActiveTab(nextTab);
                    setCurrentPage(1);
                    setSearchTerm('');
                    setBackendFilter({});
                    setBackendOrdering('');
                }}
            >
                <TabsList className="mb-4">
                    {tabs.map((tab) => (
                        <TabsTrigger key={tab.id} value={tab.id}>
                            <span>{tab.label}</span>
                            <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                                {entityState[tab.id].count}
                            </span>
                        </TabsTrigger>
                    ))}
                </TabsList>
                {tabs.map((tab) => (
                    <TabsContent key={tab.id} value={tab.id}>


                        <DataTable
                            tableId={`highschool-admin-${tab.id}`}
                            columns={columnsByEntity[tab.id]}
                            data={entityState[tab.id].data}
                            isPaginated
                            getRowId={(row: Entity) => row.id}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            itemsPerPage={itemsPerPage}
                            setItemsPerPage={setItemsPerPage}
                            onSearchChange={handleSearchChange}
                            isLoading={entityState[tab.id].isLoading}
                            error={error}
                            onBackendFiltersChange={handleBackendFiltersChange}
                            onBackendOrderingChange={handleBackendOrderingChange}
                            onBulkAction={handleBulkAction}
                            onDeleteRow={handleDelete}
                            onEditRow={handleEdit}
                            enableDragDrop={false}
                        />
                    </TabsContent>
                ))}
            </Tabs>

            <FormModal
                isOpen={isModalOpen}
                title={getModalTitle()}
                onClose={handleCloseModal}
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
                submitText={editingItem ? 'Mettre a jour' : 'Creer'}
            >
                {renderForm()}
            </FormModal>

            <ConfirmDialog state={confirm.state} onConfirm={confirm.confirm} onClose={confirm.close} />
        </div>
    );
}
