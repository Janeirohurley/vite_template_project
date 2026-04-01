
import { useCallback, useMemo, useRef, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DataTable, { type DataTableColumn } from '@/components/ui/DataTable';
import { FormModal } from '@/modules/student-service/components/FormModal';
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
import type { Country, Province, Commune, Zone, Colline } from '@/types';
import { useCountries } from '@/api/geo';
import type {
    CreateCountryData,
    CreateProvinceData,
    CreateCommuneData,
    CreateZoneData,
    CreateCollineData,
} from '../types/geoTypes';
import {
    useCreateCountry,
    useUpdateCountry,
    useDeleteCountry,
    useCreateProvince,
    useUpdateProvince,
    useDeleteProvince,
    useCreateCommune,
    useUpdateCommune,
    useDeleteCommune,
    useCreateZone,
    useUpdateZone,
    useDeleteZone,
    useCreateColline,
    useUpdateColline,
    useDeleteColline,
} from '../hooks/useGeoEntities';
import { PageHeader } from '../components/PageHeader';

type EntityType = 'country' | 'province' | 'commune' | 'zone' | 'colline';
type Entity = Country | Province | Commune | Zone | Colline;

type CountryRow = Country;
type ProvinceRow = Province & { countryId: string; countryName: string };
type CommuneRow = Commune & {
    countryId: string;
    countryName: string;
    provinceId: string;
    provinceName: string;
};
type ZoneRow = Zone & {
    countryId: string;
    countryName: string;
    provinceId: string;
    provinceName: string;
    communeId: string;
    communeName: string;
};
type CollineRow = Colline & {
    countryId: string;
    countryName: string;
    provinceId: string;
    provinceName: string;
    communeId: string;
    communeName: string;
    zoneId: string;
    zoneName: string;
};

type FormMap = {
    country: CreateCountryData;
    province: CreateProvinceData;
    commune: CreateCommuneData;
    zone: CreateZoneData;
    colline: CreateCollineData;
};

type GeoSelectionState = {
    countryId: string;
    provinceId: string;
    communeId: string;
    zoneId: string;
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

const emptyFormState: FormMap = {
    country: {
        country_name: '',
        code: '',
    },
    province: {
        province_name: '',
        country_id: '',
    },
    commune: {
        commune_name: '',
        province_id: '',
    },
    zone: {
        zone_name: '',
        commune_id: '',
    },
    colline: {
        colline_name: '',
        zone_id: '',
    },
};

const emptySelection: GeoSelectionState = {
    countryId: '',
    provinceId: '',
    communeId: '',
    zoneId: '',
};

const isCountry = (item: Entity | null): item is Country =>
    Boolean(item && 'country_name' in item);

const isProvince = (item: Entity | null): item is Province =>
    Boolean(item && 'province_name' in item);

const isCommune = (item: Entity | null): item is Commune =>
    Boolean(item && 'commune_name' in item);

const isZone = (item: Entity | null): item is Zone => Boolean(item && 'zone_name' in item);

const isColline = (item: Entity | null): item is Colline =>
    Boolean(item && 'colline_name' in item);

const getErrorMessage = (error: unknown, fallback: string) => {
    if (!error) return fallback;
    if (typeof error === 'string') return error;
    if (typeof error === 'object') {
        const maybe = error as ErrorWithMessage & ErrorWithFormatted;
        return maybe.formattedError?.message || maybe.message || fallback;
    }
    return fallback;
};

const ensureRequired = (value: string, message: string, setError: (msg: string) => void) => {
    if (!value.trim()) {
        setError(message);
        return false;
    }
    return true;
};

const buildGeoOptions = (countries: Country[], selection: GeoSelectionState) => {
    const selectedCountry = countries.find((country) => country.id === selection.countryId);
    const provinces = selectedCountry?.provinces || [];
    const selectedProvince = provinces.find((province) => province.id === selection.provinceId);
    const communes = selectedProvince?.communes || [];
    const selectedCommune = communes.find((commune) => commune.id === selection.communeId);
    const zones = selectedCommune?.zones || [];

    return {
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
    };
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
        case 'country':
            return isCountry(item) ? item.country_name : 'element';
        case 'province':
            return isProvince(item) ? item.province_name : 'element';
        case 'commune':
            return isCommune(item) ? item.commune_name : 'element';
        case 'zone':
            return isZone(item) ? item.zone_name : 'element';
        case 'colline':
            return isColline(item) ? item.colline_name : 'element';
        default:
            return 'element';
    }
}

export const GeographieManagment = () => {
    const [activeTab, setActiveTab] = useState<EntityType>('country');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Entity | null>(null);
    const [formState, setFormState] = useState<FormMap>(emptyFormState);
    const [geoSelection, setGeoSelection] = useState<GeoSelectionState>(emptySelection);
    const confirm = useConfirmDialog();

    const { data: countries = [], isLoading: countriesLoading, refetch } = useCountries();

    const createCountryMutation = useCreateCountry();
    const updateCountryMutation = useUpdateCountry();
    const deleteCountryMutation = useDeleteCountry();

    const createProvinceMutation = useCreateProvince();
    const updateProvinceMutation = useUpdateProvince();
    const deleteProvinceMutation = useDeleteProvince();

    const createCommuneMutation = useCreateCommune();
    const updateCommuneMutation = useUpdateCommune();
    const deleteCommuneMutation = useDeleteCommune();

    const createZoneMutation = useCreateZone();
    const updateZoneMutation = useUpdateZone();
    const deleteZoneMutation = useDeleteZone();

    const createCollineMutation = useCreateColline();
    const updateCollineMutation = useUpdateColline();
    const deleteCollineMutation = useDeleteColline();

    const countriesList = useMemo<CountryRow[]>(() => countries, [countries]);

    const provincesList = useMemo<ProvinceRow[]>(
        () =>
            countries.flatMap((country) =>
                (country.provinces || []).map((province) => ({
                    ...province,
                    countryId: country.id,
                    countryName: country.country_name,
                }))
            ),
        [countries]
    );
    const communesList = useMemo<CommuneRow[]>(
        () =>
            countries.flatMap((country) =>
                (country.provinces || []).flatMap((province) =>
                    (province.communes || []).map((commune) => ({
                        ...commune,
                        countryId: country.id,
                        countryName: country.country_name,
                        provinceId: province.id,
                        provinceName: province.province_name,
                    }))
                )
            ),
        [countries]
    );

    const zonesList = useMemo<ZoneRow[]>(
        () =>
            countries.flatMap((country) =>
                (country.provinces || []).flatMap((province) =>
                    (province.communes || []).flatMap((commune) =>
                        (commune.zones || []).map((zone) => ({
                            ...zone,
                            countryId: country.id,
                            countryName: country.country_name,
                            provinceId: province.id,
                            provinceName: province.province_name,
                            communeId: commune.id,
                            communeName: commune.commune_name,
                        }))
                    )
                )
            ),
        [countries]
    );

    const collinesList = useMemo<CollineRow[]>(
        () =>
            countries.flatMap((country) =>
                (country.provinces || []).flatMap((province) =>
                    (province.communes || []).flatMap((commune) =>
                        (commune.zones || []).flatMap((zone) =>
                            (zone.collines || []).map((colline) => ({
                                ...colline,
                                countryId: country.id,
                                countryName: country.country_name,
                                provinceId: province.id,
                                provinceName: province.province_name,
                                communeId: commune.id,
                                communeName: commune.commune_name,
                                zoneId: zone.id,
                                zoneName: zone.zone_name,
                            }))
                        )
                    )
                )
            ),
        [countries]
    );

    const geoOptions = useMemo(
        () => buildGeoOptions(countries, geoSelection),
        [countries, geoSelection]
    );

    const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredDataByEntity = useMemo(
    () => {
      const matchesSearch = (values: Array<string | null | undefined>) => {
        if (!normalizedSearch) return true;
        return values.some((value) => value?.toLowerCase().includes(normalizedSearch));
      };

      return {
        country: countriesList.filter((item) =>
          matchesSearch([item.country_name, item.code || ''])
        ),
        province: provincesList.filter((item) =>
          matchesSearch([item.province_name, item.countryName])
        ),
        commune: communesList.filter((item) =>
          matchesSearch([item.commune_name, item.provinceName, item.countryName])
        ),
        zone: zonesList.filter((item) =>
          matchesSearch([item.zone_name, item.communeName, item.provinceName, item.countryName])
        ),
        colline: collinesList.filter((item) =>
          matchesSearch([
            item.colline_name,
            item.zoneName,
            item.communeName,
            item.provinceName,
            item.countryName,
          ])
        ),
      };
    },
        [
            countriesList,
            provincesList,
            communesList,
            zonesList,
            collinesList,
            normalizedSearch
        ]
    );

    const updateFormState = <K extends EntityType>(entity: K, nextValue: FormMap[K]) => {
        setFormState((prev) => ({
            ...prev,
            [entity]: nextValue,
        } as FormMap));
    };

    const entityState = {
        country: {
            label: 'Pays',
            data: filteredDataByEntity.country,
            count: countriesList.length,
            isLoading:
                countriesLoading ||
                createCountryMutation.isPending ||
                updateCountryMutation.isPending ||
                deleteCountryMutation.isPending,
            deleteMutation: deleteCountryMutation,
        },
        province: {
            label: 'Provinces',
            data: filteredDataByEntity.province,
            count: provincesList.length,
            isLoading:
                countriesLoading ||
                createProvinceMutation.isPending ||
                updateProvinceMutation.isPending ||
                deleteProvinceMutation.isPending,
            deleteMutation: deleteProvinceMutation,
        },
        commune: {
            label: 'Communes',
            data: filteredDataByEntity.commune,
            count: communesList.length,
            isLoading:
                countriesLoading ||
                createCommuneMutation.isPending ||
                updateCommuneMutation.isPending ||
                deleteCommuneMutation.isPending,
            deleteMutation: deleteCommuneMutation,
        },
        zone: {
            label: 'Zones',
            data: filteredDataByEntity.zone,
            count: zonesList.length,
            isLoading:
                countriesLoading ||
                createZoneMutation.isPending ||
                updateZoneMutation.isPending ||
                deleteZoneMutation.isPending,
            deleteMutation: deleteZoneMutation,
        },
        colline: {
            label: 'Collines',
            data: filteredDataByEntity.colline,
            count: collinesList.length,
            isLoading:
                countriesLoading ||
                createCollineMutation.isPending ||
                updateCollineMutation.isPending ||
                deleteCollineMutation.isPending,
            deleteMutation: deleteCollineMutation,
        },
    } satisfies Record<
        EntityType,
        {
            label: string;
            data: Entity[];
            count: number;
            isLoading: boolean;
            deleteMutation: {
                mutate: (id: string, options?: { onError?: (error: unknown) => void }) => void;
            };
        }
    >;

    const columnsByEntity = useMemo<Record<EntityType, DataTableColumn<Entity>[]>>(
        () => ({
            country: [
                {
                    key: 'country_name',
                    label: 'Pays',
                    sortable: true,
                    render: (row) => (isCountry(row) ? row.country_name : '-'),
                },
                {
                    key: 'code',
                    label: 'Code',
                    sortable: true,
                    render: (row) => (isCountry(row) ? row.code || '-' : '-'),
                },
            ],
            province: [
                {
                    key: 'province_name',
                    label: 'Province',
                    sortable: true,
                    render: (row) => (isProvince(row) ? row.province_name : '-'),
                },
                {
                    key: 'countryName',
                    label: 'Pays',
                    sortable: true,
                    render: (row) => (isProvince(row) ? (row as ProvinceRow).countryName : '-'),
                },
            ],
            commune: [
                {
                    key: 'commune_name',
                    label: 'Commune',
                    sortable: true,
                    render: (row) => (isCommune(row) ? row.commune_name : '-'),
                },
                {
                    key: 'provinceName',
                    label: 'Province',
                    sortable: true,
                    render: (row) => (isCommune(row) ? (row as CommuneRow).provinceName : '-'),
                },
                {
                    key: 'countryName',
                    label: 'Pays',
                    sortable: true,
                    render: (row) => (isCommune(row) ? (row as CommuneRow).countryName : '-'),
                },
            ],
            zone: [
                {
                    key: 'zone_name',
                    label: 'Zone',
                    sortable: true,
                    render: (row) => (isZone(row) ? row.zone_name : '-'),
                },
                {
                    key: 'communeName',
                    label: 'Commune',
                    sortable: true,
                    render: (row) => (isZone(row) ? (row as ZoneRow).communeName : '-'),
                },
                {
                    key: 'provinceName',
                    label: 'Province',
                    sortable: true,
                    render: (row) => (isZone(row) ? (row as ZoneRow).provinceName : '-'),
                },
                {
                    key: 'countryName',
                    label: 'Pays',
                    sortable: true,
                    render: (row) => (isZone(row) ? (row as ZoneRow).countryName : '-'),
                },
            ],
            colline: [
                {
                    key: 'colline_name',
                    label: 'Colline',
                    sortable: true,
                    render: (row) => (isColline(row) ? row.colline_name : '-'),
                },
                {
                    key: 'zoneName',
                    label: 'Zone',
                    sortable: true,
                    render: (row) => (isColline(row) ? (row as CollineRow).zoneName : '-'),
                },
                {
                    key: 'communeName',
                    label: 'Commune',
                    sortable: true,
                    render: (row) => (isColline(row) ? (row as CollineRow).communeName : '-'),
                },
                {
                    key: 'provinceName',
                    label: 'Province',
                    sortable: true,
                    render: (row) => (isColline(row) ? (row as CollineRow).provinceName : '-'),
                },
                {
                    key: 'countryName',
                    label: 'Pays',
                    sortable: true,
                    render: (row) => (isColline(row) ? (row as CollineRow).countryName : '-'),
                },
            ],
        }),
        []
    );
    const handleCreate = () => {
        setEditingItem(null);
        updateFormState(activeTab, emptyFormState[activeTab]);
        setGeoSelection(emptySelection);
        setIsModalOpen(true);
    };

    const handleEdit = (item: Entity) => {
        setEditingItem(item);

        switch (activeTab) {
            case 'country':
                if (isCountry(item)) {
                    updateFormState('country', {
                        country_name: item.country_name || '',
                        code: item.code || '',
                    });
                }
                setGeoSelection(emptySelection);
                break;
            case 'province':
                if (isProvince(item)) {
                    const province = item as ProvinceRow;
                    updateFormState('province', {
                        province_name: province.province_name || '',
                        country_id: province.countryId || '',
                    });
                    setGeoSelection({
                        countryId: province.countryId || '',
                        provinceId: province.id,
                        communeId: '',
                        zoneId: '',
                    });
                }
                break;
            case 'commune':
                if (isCommune(item)) {
                    const commune = item as CommuneRow;
                    updateFormState('commune', {
                        commune_name: commune.commune_name || '',
                        province_id: commune.provinceId || '',
                    });
                    setGeoSelection({
                        countryId: commune.countryId || '',
                        provinceId: commune.provinceId || '',
                        communeId: commune.id,
                        zoneId: '',
                    });
                }
                break;
            case 'zone':
                if (isZone(item)) {
                    const zone = item as ZoneRow;
                    updateFormState('zone', {
                        zone_name: zone.zone_name || '',
                        commune_id: zone.communeId || '',
                    });
                    setGeoSelection({
                        countryId: zone.countryId || '',
                        provinceId: zone.provinceId || '',
                        communeId: zone.communeId || '',
                        zoneId: zone.id,
                    });
                }
                break;
            case 'colline':
                if (isColline(item)) {
                    const colline = item as CollineRow;
                    updateFormState('colline', {
                        colline_name: colline.colline_name || '',
                        zone_id: colline.zoneId || '',
                    });
                    setGeoSelection({
                        countryId: colline.countryId || '',
                        provinceId: colline.provinceId || '',
                        communeId: colline.communeId || '',
                        zoneId: colline.zoneId || '',
                    });
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
            case 'country':
                if (isCountry(editingItem)) {
                    updateCountryMutation.mutate(
                        { id: editingItem.id, data: formState.country },
                        {
                            onSuccess: handleCloseModal,
                            onError: (err) =>
                                setError(getErrorMessage(err, 'Erreur lors de la modification')),
                        }
                    );
                    return;
                }
                createCountryMutation.mutate(formState.country, {
                    onSuccess: handleCloseModal,
                    onError: (err) => setError(getErrorMessage(err, 'Erreur lors de la creation')),
                });
                return;
            case 'province':
                if (
                    !ensureRequired(
                        formState.province.country_id,
                        "Veuillez selectionner un pays.",
                        setError
                    )
                ) {
                    return;
                }
                if (isProvince(editingItem)) {
                    updateProvinceMutation.mutate(
                        { id: editingItem.id, data: formState.province },
                        {
                            onSuccess: handleCloseModal,
                            onError: (err) =>
                                setError(getErrorMessage(err, 'Erreur lors de la modification')),
                        }
                    );
                    return;
                }
                createProvinceMutation.mutate(formState.province, {
                    onSuccess: handleCloseModal,
                    onError: (err) => setError(getErrorMessage(err, 'Erreur lors de la creation')),
                });
                return;
            case 'commune':
                if (
                    !ensureRequired(
                        formState.commune.province_id,
                        "Veuillez selectionner une province.",
                        setError
                    )
                ) {
                    return;
                }
                if (isCommune(editingItem)) {
                    updateCommuneMutation.mutate(
                        { id: editingItem.id, data: formState.commune },
                        {
                            onSuccess: handleCloseModal,
                            onError: (err) =>
                                setError(getErrorMessage(err, 'Erreur lors de la modification')),
                        }
                    );
                    return;
                }
                createCommuneMutation.mutate(formState.commune, {
                    onSuccess: handleCloseModal,
                    onError: (err) => setError(getErrorMessage(err, 'Erreur lors de la creation')),
                });
                return;
            case 'zone':
                if (
                    !ensureRequired(
                        formState.zone.commune_id,
                        "Veuillez selectionner une commune.",
                        setError
                    )
                ) {
                    return;
                }
                if (isZone(editingItem)) {
                    updateZoneMutation.mutate(
                        { id: editingItem.id, data: formState.zone },
                        {
                            onSuccess: handleCloseModal,
                            onError: (err) =>
                                setError(getErrorMessage(err, 'Erreur lors de la modification')),
                        }
                    );
                    return;
                }
                createZoneMutation.mutate(formState.zone, {
                    onSuccess: handleCloseModal,
                    onError: (err) => setError(getErrorMessage(err, 'Erreur lors de la creation')),
                });
                return;
            case 'colline':
                if (
                    !ensureRequired(
                        formState.colline.zone_id,
                        "Veuillez selectionner une zone.",
                        setError
                    )
                ) {
                    return;
                }
                if (isColline(editingItem)) {
                    updateCollineMutation.mutate(
                        { id: editingItem.id, data: formState.colline },
                        {
                            onSuccess: handleCloseModal,
                            onError: (err) =>
                                setError(getErrorMessage(err, 'Erreur lors de la modification')),
                        }
                    );
                    return;
                }
                createCollineMutation.mutate(formState.colline, {
                    onSuccess: handleCloseModal,
                    onError: (err) => setError(getErrorMessage(err, 'Erreur lors de la creation')),
                });
                return;
        }
    };

    const handleDelete = (item: Entity) => {
        const entity = activeTab;
        const label = getItemLabel(entity, item);
        confirm.openConfirm({
            title: 'Supprimer',
            description: `Voulez-vous vraiment supprimer ${label} ?`,
            confirmLabel: 'Supprimer',
            onConfirm: () => {
                entityState[entity].deleteMutation.mutate(item.id, {
                    onError: (err) => setError(getErrorMessage(err, 'Erreur lors de la suppression')),
                });
            },
        });
    };

    const handleBulkAction = (action: string, selectedIds: Set<string>) => {
        if (action !== 'delete' || selectedIds.size === 0) return;
        const entity = activeTab;
        const ids = Array.from(selectedIds);

        confirm.openConfirm({
            title: 'Supprimer',
            description: `Voulez-vous vraiment supprimer ${ids.length} elements ?`,
            confirmLabel: 'Supprimer',
            onConfirm: () => {
                ids.forEach((id) => {
                    entityState[entity].deleteMutation.mutate(id, {
                        onError: (err) => setError(getErrorMessage(err, 'Erreur lors de la suppression')),
                    });
                });
            },
        });
    };

    const handleSearchChange = useCallback((value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    }, []);

    const tabs = [
        { id: 'country' as EntityType, label: 'Pays' },
        { id: 'province' as EntityType, label: 'Provinces' },
        { id: 'commune' as EntityType, label: 'Communes' },
        { id: 'zone' as EntityType, label: 'Zones' },
        { id: 'colline' as EntityType, label: 'Collines' },
    ];

    const getModalTitle = () => {
        const action = editingItem ? 'Modifier' : 'Creer';
        return `${action} ${entityState[activeTab].label.toLowerCase()}`;
    };

    const renderForm = () => {
        switch (activeTab) {
            case 'country': {
                const form = formState.country;
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium">Nom du pays</label>
                            <Input
                                name="country_name"
                                value={form.country_name}
                                onChange={(e) =>
                                    updateFormState('country', { ...form, country_name: e.target.value })
                                }
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Code</label>
                            <Input
                                name="code"
                                value={form.code || ''}
                                onChange={(e) =>
                                    updateFormState('country', { ...form, code: e.target.value })
                                }
                            />
                        </div>
                    </>
                );
            }
            case 'province': {
                const form = formState.province;
                return (
                    <>
                        <SingleSelectDropdown
                            label="Pays"
                            options={geoOptions.countryOptions}
                            value={geoSelection.countryId}
                            onChange={(value) => {
                                setGeoSelection({ countryId: value, provinceId: '', communeId: '', zoneId: '' });
                                updateFormState('province', { ...form, country_id: value });
                            }}
                            placeholder="Selectionner un pays"
                            searchPlaceholder="Rechercher un pays..."
                            required
                        />
                        <div>
                            <label className="block text-sm font-medium">Nom de la province</label>
                            <Input
                                name="province_name"
                                value={form.province_name}
                                onChange={(e) =>
                                    updateFormState('province', { ...form, province_name: e.target.value })
                                }
                                required
                            />
                        </div>
                    </>
                );
            }
            case 'commune': {
                const form = formState.commune;
                return (
                    <>
                        <SingleSelectDropdown
                            label="Pays"
                            options={geoOptions.countryOptions}
                            value={geoSelection.countryId}
                            onChange={(value) => {
                                setGeoSelection({ countryId: value, provinceId: '', communeId: '', zoneId: '' });
                                updateFormState('commune', { ...form, province_id: '' });
                            }}
                            placeholder="Selectionner un pays"
                            searchPlaceholder="Rechercher un pays..."
                            required
                        />
                        <SingleSelectDropdown
                            label="Province"
                            options={geoOptions.provinceOptions}
                            value={geoSelection.provinceId}
                            onChange={(value) => {
                                setGeoSelection((prev) => ({
                                    ...prev,
                                    provinceId: value,
                                    communeId: '',
                                    zoneId: '',
                                }));
                                updateFormState('commune', { ...form, province_id: value });
                            }}
                            placeholder="Selectionner une province"
                            searchPlaceholder="Rechercher une province..."
                            disabled={!geoSelection.countryId}
                            required
                        />
                        <div>
                            <label className="block text-sm font-medium">Nom de la commune</label>
                            <Input
                                name="commune_name"
                                value={form.commune_name}
                                onChange={(e) =>
                                    updateFormState('commune', { ...form, commune_name: e.target.value })
                                }
                                required
                            />
                        </div>
                    </>
                );
            }
            case 'zone': {
                const form = formState.zone;
                return (
                    <>
                        <SingleSelectDropdown
                            label="Pays"
                            options={geoOptions.countryOptions}
                            value={geoSelection.countryId}
                            onChange={(value) => {
                                setGeoSelection({ countryId: value, provinceId: '', communeId: '', zoneId: '' });
                                updateFormState('zone', { ...form, commune_id: '' });
                            }}
                            placeholder="Selectionner un pays"
                            searchPlaceholder="Rechercher un pays..."
                            required
                        />
                        <SingleSelectDropdown
                            label="Province"
                            options={geoOptions.provinceOptions}
                            value={geoSelection.provinceId}
                            onChange={(value) => {
                                setGeoSelection((prev) => ({
                                    ...prev,
                                    provinceId: value,
                                    communeId: '',
                                    zoneId: '',
                                }));
                                updateFormState('zone', { ...form, commune_id: '' });
                            }}
                            placeholder="Selectionner une province"
                            searchPlaceholder="Rechercher une province..."
                            disabled={!geoSelection.countryId}
                            required
                        />
                        <SingleSelectDropdown
                            label="Commune"
                            options={geoOptions.communeOptions}
                            value={geoSelection.communeId}
                            onChange={(value) => {
                                setGeoSelection((prev) => ({
                                    ...prev,
                                    communeId: value,
                                    zoneId: '',
                                }));
                                updateFormState('zone', { ...form, commune_id: value });
                            }}
                            placeholder="Selectionner une commune"
                            searchPlaceholder="Rechercher une commune..."
                            disabled={!geoSelection.provinceId}
                            required
                        />
                        <div>
                            <label className="block text-sm font-medium">Nom de la zone</label>
                            <Input
                                name="zone_name"
                                value={form.zone_name}
                                onChange={(e) => updateFormState('zone', { ...form, zone_name: e.target.value })}
                                required
                            />
                        </div>
                    </>
                );
            }
            case 'colline': {
                const form = formState.colline;
                return (
                    <>
                        <SingleSelectDropdown
                            label="Pays"
                            options={geoOptions.countryOptions}
                            value={geoSelection.countryId}
                            onChange={(value) => {
                                setGeoSelection({ countryId: value, provinceId: '', communeId: '', zoneId: '' });
                                updateFormState('colline', { ...form, zone_id: '' });
                            }}
                            placeholder="Selectionner un pays"
                            searchPlaceholder="Rechercher un pays..."
                            required
                        />
                        <SingleSelectDropdown
                            label="Province"
                            options={geoOptions.provinceOptions}
                            value={geoSelection.provinceId}
                            onChange={(value) => {
                                setGeoSelection((prev) => ({
                                    ...prev,
                                    provinceId: value,
                                    communeId: '',
                                    zoneId: '',
                                }));
                                updateFormState('colline', { ...form, zone_id: '' });
                            }}
                            placeholder="Selectionner une province"
                            searchPlaceholder="Rechercher une province..."
                            disabled={!geoSelection.countryId}
                            required
                        />
                        <SingleSelectDropdown
                            label="Commune"
                            options={geoOptions.communeOptions}
                            value={geoSelection.communeId}
                            onChange={(value) => {
                                setGeoSelection((prev) => ({
                                    ...prev,
                                    communeId: value,
                                    zoneId: '',
                                }));
                                updateFormState('colline', { ...form, zone_id: '' });
                            }}
                            placeholder="Selectionner une commune"
                            searchPlaceholder="Rechercher une commune..."
                            disabled={!geoSelection.provinceId}
                            required
                        />
                        <SingleSelectDropdown
                            label="Zone"
                            options={geoOptions.zoneOptions}
                            value={geoSelection.zoneId}
                            onChange={(value) => {
                                setGeoSelection((prev) => ({
                                    ...prev,
                                    zoneId: value,
                                }));
                                updateFormState('colline', { ...form, zone_id: value });
                            }}
                            placeholder="Selectionner une zone"
                            searchPlaceholder="Rechercher une zone..."
                            disabled={!geoSelection.communeId}
                            required
                        />
                        <div>
                            <label className="block text-sm font-medium">Nom de la colline</label>
                            <Input
                                name="colline_name"
                                value={form.colline_name}
                                onChange={(e) =>
                                    updateFormState('colline', { ...form, colline_name: e.target.value })
                                }
                                required
                            />
                        </div>
                    </>
                );
            }
        }
    };
    return (
        <div className="w-full max-w-full overflow-hidden">
           
            <PageHeader
                title='Gestion geographique'
                rightElement={
                    <div className="mb-4 flex gap-2 flex-wrap">
                        <button
                            onClick={handleCreate}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        >
                            Creer
                        </button>
                        <button
                            onClick={() => refetch()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Actualiser
                        </button>
                       
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
                    setGeoSelection(emptySelection);
                    setError(null);
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
                        {error && (
                            <button
                                onClick={() => setError(null)}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                            >
                                Effacer l'erreur
                            </button>
                        )}

                        <DataTable
                            tableId={`geo-admin-${tab.id}`}
                            columns={columnsByEntity[tab.id]}
                            data={entityState[tab.id].data}
                            getRowId={(row: Entity) => row.id}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            itemsPerPage={itemsPerPage}
                            setItemsPerPage={setItemsPerPage}
                            onSearchChange={handleSearchChange}
                            isLoading={entityState[tab.id].isLoading}
                            error={error}
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
};
