
import { useMemo, useRef, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DataTable, { type DataTableColumn } from '@/components/ui/DataTable';
import { FormModal } from '@/modules/student-service/components/FormModal';
import { Input } from '@/components/ui/input';
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';
import { SingleSelectDropdown } from '@/components/ui/SingleSelectDropdown';
import { Toggle } from '@/components/ui/Toggle';
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
import { useUsers, useUniversities } from '@/api/inscription';
import type { QueryParams } from '@/types';
import type {
    Building,
    CreateBuildingData,
    UpdateBuildingData,
    Room,
    CreateRoomData,
    UpdateRoomData,
    EquipmentType,
    CreateEquipmentTypeData,
    UpdateEquipmentTypeData,
    Equipment,
    CreateEquipmentData,
    UpdateEquipmentData,
    EquipmentAllocation,
    CreateEquipmentAllocationData,
    UpdateEquipmentAllocationData,
    EquipmentMaintenance,
    CreateEquipmentMaintenanceData,
    UpdateEquipmentMaintenanceData,
} from '../types/infrastructureTypes';
import {
    useBuildings,
    useCreateBuilding,
    useUpdateBuilding,
    useDeleteBuilding,
    useRooms,
    useCreateRoom,
    useUpdateRoom,
    useDeleteRoom,
    useEquipmentTypes,
    useCreateEquipmentType,
    useUpdateEquipmentType,
    useDeleteEquipmentType,
    useEquipments,
    useCreateEquipment,
    useUpdateEquipment,
    useDeleteEquipment,
    useEquipmentAllocations,
    useCreateEquipmentAllocation,
    useUpdateEquipmentAllocation,
    useDeleteEquipmentAllocation,
    useEquipmentMaintenances,
    useCreateEquipmentMaintenance,
    useUpdateEquipmentMaintenance,
    useDeleteEquipmentMaintenance,
} from '../hooks/useInfrastructureEntities';
import { PageHeader } from '../components/PageHeader';

type EntityType =
    | 'building'
    | 'room'
    | 'equipmentType'
    | 'equipment'
    | 'allocation'
    | 'maintenance';

type Entity =
    | Building
    | Room
    | EquipmentType
    | Equipment
    | EquipmentAllocation
    | EquipmentMaintenance;

type FormMap = {
    building: CreateBuildingData;
    room: CreateRoomData;
    equipmentType: CreateEquipmentTypeData;
    equipment: CreateEquipmentData;
    allocation: CreateEquipmentAllocationData;
    maintenance: CreateEquipmentMaintenanceData;
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

const ROOM_TYPE_OPTIONS = [
    { id: 'classroom', label: 'Salle de classe' },
    { id: 'laboratory', label: 'Laboratoire' },
    { id: 'amphi', label: 'Amphi' },
    { id: 'office', label: 'Bureau' },
    { id: 'meeting', label: 'Salle de reunion' },
];

const EQUIPMENT_STATUS_OPTIONS = [
    { id: 'working', label: 'Fonctionnel' },
    { id: 'available', label: 'Disponible' },
    { id: 'under_maintenance', label: 'En maintenance' },
    { id: 'out_of_order', label: 'Hors service' },
    { id: 'disposed', label: 'Mis au rebut' },
];

const ALLOCATION_STATUS_OPTIONS = [
    { id: 'active', label: 'Active' },
    { id: 'returned', label: 'Retournee' },
    { id: 'lost', label: 'Perdue' },
];

const emptyFormState: FormMap = {
    building: {
        university: '',
        building_name: '',
        building_code: '',
        location: '',
    },
    room: {
        building: '',
        room_name: '',
        capacity: 0,
        room_type: 'classroom',
        is_available: true,
    },
    equipmentType: {
        name: '',
    },
    equipment: {
        equipment_name: '',
        equipment_type: '',
        serial_number: '',
        equipment_number: '',
        purchase_date: '',
        status: 'available',
    },
    allocation: {
        equipment: '',
        room: '',
        allocated_to: '',
        allocation_date: '',
        return_date: '',
        status: 'active',
    },
    maintenance: {
        equipment: '',
        maintenance_date: '',
        return_date: '',
        description: '',
        performed_by: '',
        cost: 0,
    },
};
const isBuilding = (item: Entity | null): item is Building =>
    Boolean(item && 'building_name' in item);

const isRoom = (item: Entity | null): item is Room =>
    Boolean(item && 'room_name' in item && 'capacity' in item);

const isEquipmentType = (item: Entity | null): item is EquipmentType =>
    Boolean(item && 'name' in item && !('equipment_name' in item));

const isEquipment = (item: Entity | null): item is Equipment =>
    Boolean(item && 'equipment_name' in item);

const isAllocation = (item: Entity | null): item is EquipmentAllocation =>
    Boolean(item && 'allocation_date' in item);

const isMaintenance = (item: Entity | null): item is EquipmentMaintenance =>
    Boolean(item && 'maintenance_date' in item && 'description' in item);

const getErrorMessage = (error: unknown, fallback: string) => {
    if (!error) return fallback;
    if (typeof error === 'string') return error;
    if (typeof error === 'object') {
        const maybe = error as ErrorWithMessage & ErrorWithFormatted;
        return maybe.formattedError?.message || maybe.message || fallback;
    }
    return fallback;
};

const emptyToNull = (value?: string | null) => {
    if (!value) return null;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
};

const emptyToUndefined = (value?: string | null) => {
    if (!value) return undefined;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
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
        case 'building':
            return isBuilding(item) ? item.building_name : 'element';
        case 'room':
            return isRoom(item) ? item.room_name : 'element';
        case 'equipmentType':
            return isEquipmentType(item) ? item.name : 'element';
        case 'equipment':
            return isEquipment(item) ? item.equipment_name : 'element';
        case 'allocation':
            return isAllocation(item) ? item.equipment_name || 'allocation' : 'allocation';
        case 'maintenance':
            return isMaintenance(item) ? item.equipment_name || 'maintenance' : 'maintenance';
        default:
            return 'element';
    }
}
function InfrastructurePage() {
    const [activeTab, setActiveTab] = useState<EntityType>('building');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Entity | null>(null);
    const [formState, setFormState] = useState<FormMap>(emptyFormState);
    const confirm = useConfirmDialog();

    const listParams: QueryParams = { pagination: 'false' };

    const { data: buildingsData, isLoading: buildingsLoading, refetch: refetchBuildings } =
        useBuildings(listParams);
    const { data: roomsData, isLoading: roomsLoading, refetch: refetchRooms } = useRooms(
        listParams
    );
    const {
        data: equipmentTypesData,
        isLoading: equipmentTypesLoading,
        refetch: refetchEquipmentTypes,
    } = useEquipmentTypes(listParams);
    const { data: equipmentsData, isLoading: equipmentsLoading, refetch: refetchEquipments } =
        useEquipments(listParams);
    const {
        data: allocationsData,
        isLoading: allocationsLoading,
        refetch: refetchAllocations,
    } = useEquipmentAllocations(listParams);
    const {
        data: maintenancesData,
        isLoading: maintenancesLoading,
        refetch: refetchMaintenances,
    } = useEquipmentMaintenances(listParams);

    const createBuildingMutation = useCreateBuilding();
    const updateBuildingMutation = useUpdateBuilding();
    const deleteBuildingMutation = useDeleteBuilding();

    const createRoomMutation = useCreateRoom();
    const updateRoomMutation = useUpdateRoom();
    const deleteRoomMutation = useDeleteRoom();

    const createEquipmentTypeMutation = useCreateEquipmentType();
    const updateEquipmentTypeMutation = useUpdateEquipmentType();
    const deleteEquipmentTypeMutation = useDeleteEquipmentType();

    const createEquipmentMutation = useCreateEquipment();
    const updateEquipmentMutation = useUpdateEquipment();
    const deleteEquipmentMutation = useDeleteEquipment();

    const createAllocationMutation = useCreateEquipmentAllocation();
    const updateAllocationMutation = useUpdateEquipmentAllocation();
    const deleteAllocationMutation = useDeleteEquipmentAllocation();

    const createMaintenanceMutation = useCreateEquipmentMaintenance();
    const updateMaintenanceMutation = useUpdateEquipmentMaintenance();
    const deleteMaintenanceMutation = useDeleteEquipmentMaintenance();

    const { data: users = [] } = useUsers({ pagination: 'false' });
    const { data: universities = [] } = useUniversities();

    const buildings = useMemo(() => buildingsData?.results || [], [buildingsData]);
    const rooms = useMemo(() => roomsData?.results || [], [roomsData]);
    const equipmentTypes = useMemo(() => equipmentTypesData?.results || [], [equipmentTypesData]);
    const equipments = useMemo(() => equipmentsData?.results || [], [equipmentsData]);
    const allocations = useMemo(() => allocationsData?.results || [], [allocationsData]);
    const maintenances = useMemo(() => maintenancesData?.results || [], [maintenancesData]);

    const universityOptions = useMemo(
        () =>
            universities.map((university) => ({
                id: university.id,
                label: university.university_name,
            })),
        [universities]
    );

    const buildingOptions = useMemo(
        () =>
            buildings.map((building) => ({
                id: building.id,
                label: building.building_name,
            })),
        [buildings]
    );

    const roomOptions = useMemo(
        () =>
            rooms.map((room) => ({
                id: room.id,
                label: room.building_name
                    ? `${room.room_name} (${room.building_name})`
                    : room.room_name,
            })),
        [rooms]
    );

    const equipmentTypeOptions = useMemo(
        () =>
            equipmentTypes.map((type) => ({
                id: type.id,
                label: type.name,
            })),
        [equipmentTypes]
    );

    const equipmentOptions = useMemo(
        () =>
            equipments.map((equipment) => ({
                id: equipment.id,
                label: `${equipment.equipment_name} (${equipment.equipment_number})`,
            })),
        [equipments]
    );

    const userOptions = useMemo(
        () =>
            users.map((user) => ({
                id: user.id,
                label: `${user.first_name} ${user.last_name}`.trim() || user.email,
            })),
        [users]
    );

    const normalizedSearch = searchTerm.trim().toLowerCase();

    const filteredDataByEntity = useMemo(() => {
        const matchesSearch = (values: Array<string | null | undefined>) => {
            if (!normalizedSearch) return true;
            return values.some((value) => value?.toLowerCase().includes(normalizedSearch));
        };

        return {
            building: buildings.filter((item) =>
                matchesSearch([item.building_name, item.building_code, item.location, item.university_name])
            ),
            room: rooms.filter((item) =>
                matchesSearch([item.room_name, item.building_name, item.room_type])
            ),
            equipmentType: equipmentTypes.filter((item) => matchesSearch([item.name])),
            equipment: equipments.filter((item) =>
                matchesSearch([
                    item.equipment_name,
                    item.equipment_type_name,
                    item.equipment_number,
                    item.serial_number,
                    item.status,
                ])
            ),
            allocation: allocations.filter((item) =>
                matchesSearch([item.equipment_name, item.room_name, item.user_name, item.status])
            ),
            maintenance: maintenances.filter((item) =>
                matchesSearch([item.equipment_name, item.performed_by, item.description])
            ),
        };
    }, [
        allocations,
        buildings,
        equipmentTypes,
        equipments,
        maintenances,
        normalizedSearch,
        rooms,
    ]);

    const updateFormState = <K extends EntityType>(entity: K, nextValue: FormMap[K]) => {
        setFormState((prev) => ({
            ...prev,
            [entity]: nextValue,
        } as FormMap));
    };
    const entityState = {
        building: {
            label: 'Batiments',
            data: filteredDataByEntity.building,
            count: buildings.length,
            isLoading:
                buildingsLoading ||
                createBuildingMutation.isPending ||
                updateBuildingMutation.isPending ||
                deleteBuildingMutation.isPending,
            refetch: refetchBuildings,
            deleteMutation: deleteBuildingMutation,
        },
        room: {
            label: 'Salles',
            data: filteredDataByEntity.room,
            count: rooms.length,
            isLoading:
                roomsLoading ||
                createRoomMutation.isPending ||
                updateRoomMutation.isPending ||
                deleteRoomMutation.isPending,
            refetch: refetchRooms,
            deleteMutation: deleteRoomMutation,
        },
        equipmentType: {
            label: "Types d'equipement",
            data: filteredDataByEntity.equipmentType,
            count: equipmentTypes.length,
            isLoading:
                equipmentTypesLoading ||
                createEquipmentTypeMutation.isPending ||
                updateEquipmentTypeMutation.isPending ||
                deleteEquipmentTypeMutation.isPending,
            refetch: refetchEquipmentTypes,
            deleteMutation: deleteEquipmentTypeMutation,
        },
        equipment: {
            label: 'Equipements',
            data: filteredDataByEntity.equipment,
            count: equipments.length,
            isLoading:
                equipmentsLoading ||
                createEquipmentMutation.isPending ||
                updateEquipmentMutation.isPending ||
                deleteEquipmentMutation.isPending,
            refetch: refetchEquipments,
            deleteMutation: deleteEquipmentMutation,
        },
        allocation: {
            label: 'Allocations',
            data: filteredDataByEntity.allocation,
            count: allocations.length,
            isLoading:
                allocationsLoading ||
                createAllocationMutation.isPending ||
                updateAllocationMutation.isPending ||
                deleteAllocationMutation.isPending,
            refetch: refetchAllocations,
            deleteMutation: deleteAllocationMutation,
        },
        maintenance: {
            label: 'Maintenances',
            data: filteredDataByEntity.maintenance,
            count: maintenances.length,
            isLoading:
                maintenancesLoading ||
                createMaintenanceMutation.isPending ||
                updateMaintenanceMutation.isPending ||
                deleteMaintenanceMutation.isPending,
            refetch: refetchMaintenances,
            deleteMutation: deleteMaintenanceMutation,
        },
    } satisfies Record<
        EntityType,
        {
            label: string;
            data: Entity[];
            count: number;
            isLoading: boolean;
            refetch: () => void;
            deleteMutation: {
                mutate: (id: string, options?: { onError?: (error: unknown) => void }) => void;
            };
        }
    >;

    const columnsByEntity = useMemo<Record<EntityType, DataTableColumn<Entity>[]>>(
        () => ({
            building: [
                {
                    key: 'building_name',
                    label: 'Batiment',
                    sortable: true,
                    render: (row) => (isBuilding(row) ? row.building_name : '-'),
                },
                {
                    key: 'building_code',
                    label: 'Code',
                    sortable: true,
                    render: (row) => (isBuilding(row) ? row.building_code || '-' : '-'),
                },
                {
                    key: 'location',
                    label: 'Localisation',
                    sortable: true,
                    render: (row) => (isBuilding(row) ? row.location || '-' : '-'),
                },
                {
                    key: 'university_name',
                    label: 'Universite',
                    sortable: true,
                    render: (row) => (isBuilding(row) ? row.university_name || '-' : '-'),
                },
            ],
            room: [
                {
                    key: 'room_name',
                    label: 'Salle',
                    sortable: true,
                    render: (row) => (isRoom(row) ? row.room_name : '-'),
                },
                {
                    key: 'building_name',
                    label: 'Batiment',
                    sortable: true,
                    render: (row) => (isRoom(row) ? row.building_name || '-' : '-'),
                },
                {
                    key: 'capacity',
                    label: 'Capacite',
                    sortable: true,
                    render: (row) => (isRoom(row) ? row.capacity : '-'),
                },
                {
                    key: 'room_type',
                    label: 'Type',
                    sortable: true,
                    render: (row) => (isRoom(row) ? row.room_type : '-'),
                },
                {
                    key: 'is_available',
                    label: 'Disponible',
                    sortable: true,
                    render: (row) => (isRoom(row) ? (row.is_available ? 'Oui' : 'Non') : '-'),
                },
            ],
            equipmentType: [
                {
                    key: 'name',
                    label: 'Type',
                    sortable: true,
                    render: (row) => (isEquipmentType(row) ? row.name : '-'),
                },
            ],
            equipment: [
                {
                    key: 'equipment_name',
                    label: 'Equipement',
                    sortable: true,
                    render: (row) => (isEquipment(row) ? row.equipment_name : '-'),
                },
                {
                    key: 'equipment_type_name',
                    label: 'Type',
                    sortable: true,
                    render: (row) => (isEquipment(row) ? row.equipment_type_name || '-' : '-'),
                },
                {
                    key: 'equipment_number',
                    label: 'Numero',
                    sortable: true,
                    render: (row) => (isEquipment(row) ? row.equipment_number : '-'),
                },
                {
                    key: 'serial_number',
                    label: 'Serie',
                    sortable: true,
                    render: (row) => (isEquipment(row) ? row.serial_number || '-' : '-'),
                },
                {
                    key: 'status',
                    label: 'Statut',
                    sortable: true,
                    render: (row) => (isEquipment(row) ? row.status : '-'),
                },
            ],
            allocation: [
                {
                    key: 'equipment_name',
                    label: 'Equipement',
                    sortable: true,
                    render: (row) => (isAllocation(row) ? row.equipment_name || '-' : '-'),
                },
                {
                    key: 'room_name',
                    label: 'Salle',
                    sortable: true,
                    render: (row) => (isAllocation(row) ? row.room_name || '-' : '-'),
                },
                {
                    key: 'user_name',
                    label: 'Utilisateur',
                    sortable: true,
                    render: (row) => (isAllocation(row) ? row.user_name || '-' : '-'),
                },
                {
                    key: 'allocation_date',
                    label: 'Date allocation',
                    sortable: true,
                    render: (row) => (isAllocation(row) ? row.allocation_date : '-'),
                },
                {
                    key: 'status',
                    label: 'Statut',
                    sortable: true,
                    render: (row) => (isAllocation(row) ? row.status : '-'),
                },
            ],
            maintenance: [
                {
                    key: 'equipment_name',
                    label: 'Equipement',
                    sortable: true,
                    render: (row) => (isMaintenance(row) ? row.equipment_name || '-' : '-'),
                },
                {
                    key: 'maintenance_date',
                    label: 'Date',
                    sortable: true,
                    render: (row) => (isMaintenance(row) ? row.maintenance_date : '-'),
                },
                {
                    key: 'performed_by',
                    label: 'Par',
                    sortable: true,
                    render: (row) => (isMaintenance(row) ? row.performed_by || '-' : '-'),
                },
                {
                    key: 'cost',
                    label: 'Cout',
                    sortable: true,
                    render: (row) => (isMaintenance(row) ? row.cost : '-'),
                },
            ],
        }),
        []
    );

    const updateIsAvailable = (value: boolean) => value;

    const handleRefresh = () => {
        entityState[activeTab].refetch();
    };

    const handleCreate = () => {
        setEditingItem(null);
        updateFormState(activeTab, emptyFormState[activeTab]);
        setIsModalOpen(true);
    };

    const handleEdit = (item: Entity) => {
        setEditingItem(item);

        switch (activeTab) {
            case 'building':
                if (isBuilding(item)) {
                    updateFormState('building', {
                        university: '',
                        building_name: item.building_name || '',
                        building_code: item.building_code || '',
                        location: item.location || '',
                    });
                }
                break;
            case 'room':
                if (isRoom(item)) {
                    updateFormState('room', {
                        building: '',
                        room_name: item.room_name || '',
                        capacity: item.capacity || 0,
                        room_type: item.room_type || 'classroom',
                        is_available: updateIsAvailable(item.is_available),
                    });
                }
                break;
            case 'equipmentType':
                if (isEquipmentType(item)) {
                    updateFormState('equipmentType', {
                        name: item.name || '',
                    });
                }
                break;
            case 'equipment':
                if (isEquipment(item)) {
                    updateFormState('equipment', {
                        equipment_name: item.equipment_name || '',
                        equipment_type: '',
                        serial_number: item.serial_number || '',
                        equipment_number: item.equipment_number || '',
                        purchase_date: item.purchase_date || '',
                        status: item.status || 'available',
                    });
                }
                break;
            case 'allocation':
                if (isAllocation(item)) {
                    updateFormState('allocation', {
                        equipment: '',
                        room: '',
                        allocated_to: '',
                        allocation_date: item.allocation_date || '',
                        return_date: item.return_date || '',
                        status: item.status || 'active',
                    });
                }
                break;
            case 'maintenance':
                if (isMaintenance(item)) {
                    updateFormState('maintenance', {
                        equipment: '',
                        maintenance_date: item.maintenance_date || '',
                        return_date: item.return_date || '',
                        description: item.description || '',
                        performed_by: item.performed_by || '',
                        cost: item.cost || 0,
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
            case 'building': {
                const form = formState.building;
                const payload: UpdateBuildingData = {
                    building_name: form.building_name,
                    building_code: emptyToNull(form.building_code),
                    location: emptyToNull(form.location),
                };

                if (form.university.trim()) {
                    payload.university = form.university;
                }

                if (isBuilding(editingItem)) {
                    updateBuildingMutation.mutate(
                        { id: editingItem.id, data: payload },
                        {
                            onSuccess: handleCloseModal,
                            onError: (err) =>
                                setError(getErrorMessage(err, 'Erreur lors de la modification')),
                        }
                    );
                    return;
                }

                createBuildingMutation.mutate(
                    {
                        university: form.university,
                        building_name: form.building_name,
                        building_code: emptyToNull(form.building_code),
                        location: emptyToNull(form.location),
                    },
                    {
                        onSuccess: handleCloseModal,
                        onError: (err) => setError(getErrorMessage(err, 'Erreur lors de la creation')),
                    }
                );
                return;
            }
            case 'room': {
                const form = formState.room;
                const payload: UpdateRoomData = {
                    room_name: form.room_name,
                    capacity: form.capacity,
                    room_type: form.room_type,
                    is_available: form.is_available,
                };

                if (form.building.trim()) {
                    payload.building = form.building;
                }

                if (isRoom(editingItem)) {
                    updateRoomMutation.mutate(
                        { id: editingItem.id, data: payload },
                        {
                            onSuccess: handleCloseModal,
                            onError: (err) =>
                                setError(getErrorMessage(err, 'Erreur lors de la modification')),
                        }
                    );
                    return;
                }

                createRoomMutation.mutate(
                    {
                        building: form.building,
                        room_name: form.room_name,
                        capacity: form.capacity,
                        room_type: form.room_type,
                        is_available: form.is_available,
                    },
                    {
                        onSuccess: handleCloseModal,
                        onError: (err) => setError(getErrorMessage(err, 'Erreur lors de la creation')),
                    }
                );
                return;
            }
            case 'equipmentType': {
                const form = formState.equipmentType;
                const payload: UpdateEquipmentTypeData = { name: form.name };

                if (isEquipmentType(editingItem)) {
                    updateEquipmentTypeMutation.mutate(
                        { id: editingItem.id, data: payload },
                        {
                            onSuccess: handleCloseModal,
                            onError: (err) =>
                                setError(getErrorMessage(err, 'Erreur lors de la modification')),
                        }
                    );
                    return;
                }

                createEquipmentTypeMutation.mutate(
                    { name: form.name },
                    {
                        onSuccess: handleCloseModal,
                        onError: (err) => setError(getErrorMessage(err, 'Erreur lors de la creation')),
                    }
                );
                return;
            }
            case 'equipment': {
                const form = formState.equipment;
                const payload: UpdateEquipmentData = {
                    equipment_name: form.equipment_name,
                    serial_number: emptyToNull(form.serial_number),
                    equipment_number: form.equipment_number,
                    purchase_date: emptyToNull(form.purchase_date),
                    status: form.status,
                };

                if (form.equipment_type.trim()) {
                    payload.equipment_type = form.equipment_type;
                }

                if (isEquipment(editingItem)) {
                    updateEquipmentMutation.mutate(
                        { id: editingItem.id, data: payload },
                        {
                            onSuccess: handleCloseModal,
                            onError: (err) =>
                                setError(getErrorMessage(err, 'Erreur lors de la modification')),
                        }
                    );
                    return;
                }

                createEquipmentMutation.mutate(
                    {
                        equipment_name: form.equipment_name,
                        equipment_type: form.equipment_type,
                        serial_number: emptyToNull(form.serial_number),
                        equipment_number: form.equipment_number,
                        purchase_date: emptyToNull(form.purchase_date),
                        status: form.status,
                    },
                    {
                        onSuccess: handleCloseModal,
                        onError: (err) => setError(getErrorMessage(err, 'Erreur lors de la creation')),
                    }
                );
                return;
            }
            case 'allocation': {
                const form = formState.allocation;
                const payload: UpdateEquipmentAllocationData = {
                    allocation_date: form.allocation_date,
                    return_date: emptyToNull(form.return_date),
                    status: form.status,
                    allocated_to: emptyToUndefined(form.allocated_to) ?? null,
                };

                if (form.equipment.trim()) {
                    payload.equipment = form.equipment;
                }
                if (form.room.trim()) {
                    payload.room = form.room;
                }

                if (isAllocation(editingItem)) {
                    updateAllocationMutation.mutate(
                        { id: editingItem.id, data: payload },
                        {
                            onSuccess: handleCloseModal,
                            onError: (err) =>
                                setError(getErrorMessage(err, 'Erreur lors de la modification')),
                        }
                    );
                    return;
                }

                createAllocationMutation.mutate(
                    {
                        equipment: form.equipment,
                        room: form.room,
                        allocated_to: emptyToUndefined(form.allocated_to) ?? null,
                        allocation_date: form.allocation_date,
                        return_date: emptyToNull(form.return_date),
                        status: form.status,
                    },
                    {
                        onSuccess: handleCloseModal,
                        onError: (err) => setError(getErrorMessage(err, 'Erreur lors de la creation')),
                    }
                );
                return;
            }
            case 'maintenance': {
                const form = formState.maintenance;
                const payload: UpdateEquipmentMaintenanceData = {
                    maintenance_date: form.maintenance_date,
                    return_date: emptyToNull(form.return_date),
                    description: form.description,
                    performed_by: emptyToNull(form.performed_by),
                    cost: form.cost,
                };

                if (form.equipment.trim()) {
                    payload.equipment = form.equipment;
                }

                if (isMaintenance(editingItem)) {
                    updateMaintenanceMutation.mutate(
                        { id: editingItem.id, data: payload },
                        {
                            onSuccess: handleCloseModal,
                            onError: (err) =>
                                setError(getErrorMessage(err, 'Erreur lors de la modification')),
                        }
                    );
                    return;
                }

                createMaintenanceMutation.mutate(
                    {
                        equipment: form.equipment,
                        maintenance_date: form.maintenance_date,
                        return_date: emptyToNull(form.return_date),
                        description: form.description,
                        performed_by: emptyToNull(form.performed_by),
                        cost: form.cost,
                    },
                    {
                        onSuccess: handleCloseModal,
                        onError: (err) => setError(getErrorMessage(err, 'Erreur lors de la creation')),
                    }
                );
                return;
            }
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
                    onError: (err) => setError(getErrorMessage(err, 'Erreur lors de la suppression')),
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
                        onError: (err) => setError(getErrorMessage(err, 'Erreur lors de la suppression')),
                    });
                });
            },
        });
    };

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const tabs = [
        { id: 'building' as EntityType, label: 'Batiments' },
        { id: 'room' as EntityType, label: 'Salles' },
        { id: 'equipmentType' as EntityType, label: "Types d'equipement" },
        { id: 'equipment' as EntityType, label: 'Equipements' },
        { id: 'allocation' as EntityType, label: 'Allocations' },
        { id: 'maintenance' as EntityType, label: 'Maintenances' },
    ];

    const getModalTitle = () => {
        const action = editingItem ? 'Modifier' : 'Creer';
        return `${action} ${entityState[activeTab].label.toLowerCase()}`;
    };

    const renderForm = () => {
        switch (activeTab) {
            case 'building': {
                const form = formState.building;
                const currentLabel = isBuilding(editingItem) ? editingItem.university_name : '';
                return (
                    <>
                        <SingleSelectDropdown
                            label="Universite"
                            options={universityOptions}
                            value={form.university}
                            onChange={(value) => updateFormState('building', { ...form, university: value })}
                            placeholder={currentLabel ? `Actuel: ${currentLabel}` : 'Selectionner une universite'}
                            searchPlaceholder="Rechercher une universite..."
                            required={!editingItem}
                        />
                        <div>
                            <label className="block text-sm font-medium">Nom du batiment</label>
                            <Input
                                name="building_name"
                                value={form.building_name}
                                onChange={(e) =>
                                    updateFormState('building', { ...form, building_name: e.target.value })
                                }
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Code</label>
                            <Input
                                name="building_code"
                                value={form.building_code || ''}
                                onChange={(e) =>
                                    updateFormState('building', { ...form, building_code: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Localisation</label>
                            <Input
                                name="location"
                                value={form.location || ''}
                                onChange={(e) =>
                                    updateFormState('building', { ...form, location: e.target.value })
                                }
                            />
                        </div>
                    </>
                );
            }
            case 'room': {
                const form = formState.room;
                const currentLabel = isRoom(editingItem) ? editingItem.building_name : '';
                return (
                    <>
                        <SingleSelectDropdown
                            label="Batiment"
                            options={buildingOptions}
                            value={form.building}
                            onChange={(value) => updateFormState('room', { ...form, building: value })}
                            placeholder={currentLabel ? `Actuel: ${currentLabel}` : 'Selectionner un batiment'}
                            searchPlaceholder="Rechercher un batiment..."
                            required={!editingItem}
                        />
                        <div>
                            <label className="block text-sm font-medium">Nom de la salle</label>
                            <Input
                                name="room_name"
                                value={form.room_name}
                                onChange={(e) =>
                                    updateFormState('room', { ...form, room_name: e.target.value })
                                }
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Capacite</label>
                            <Input
                                type="number"
                                name="capacity"
                                value={String(form.capacity)}
                                onChange={(e) =>
                                    updateFormState('room', {
                                        ...form,
                                        capacity: Number(e.target.value) || 0,
                                    })
                                }
                                required
                            />
                        </div>
                        <SingleSelectDropdown
                            label="Type"
                            options={ROOM_TYPE_OPTIONS}
                            value={form.room_type}
                            onChange={(value) => updateFormState('room', { ...form, room_type: value })}
                            placeholder="Selectionner un type"
                            searchPlaceholder="Rechercher un type..."
                            required
                        />
                        <div>
                            <label className="block text-sm font-medium">Disponible</label>
                            <Toggle
                                checked={form.is_available ?? true}
                                onChange={(checked) =>
                                    updateFormState('room', { ...form, is_available: checked })
                                }
                            />
                        </div>
                    </>
                );
            }
            case 'equipmentType': {
                const form = formState.equipmentType;
                return (
                    <div>
                        <label className="block text-sm font-medium">Type d'equipement</label>
                        <Input
                            name="name"
                            value={form.name}
                            onChange={(e) => updateFormState('equipmentType', { ...form, name: e.target.value })}
                            required
                        />
                    </div>
                );
            }
            case 'equipment': {
                const form = formState.equipment;
                const currentLabel = isEquipment(editingItem) ? editingItem.equipment_type_name : '';
                return (
                    <>
                        <SingleSelectDropdown
                            label="Type d'equipement"
                            options={equipmentTypeOptions}
                            value={form.equipment_type}
                            onChange={(value) => updateFormState('equipment', { ...form, equipment_type: value })}
                            placeholder={currentLabel ? `Actuel: ${currentLabel}` : 'Selectionner un type'}
                            searchPlaceholder="Rechercher un type..."
                            required={!editingItem}
                        />
                        <div>
                            <label className="block text-sm font-medium">Nom</label>
                            <Input
                                name="equipment_name"
                                value={form.equipment_name}
                                onChange={(e) =>
                                    updateFormState('equipment', { ...form, equipment_name: e.target.value })
                                }
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Numero</label>
                            <Input
                                name="equipment_number"
                                value={form.equipment_number}
                                onChange={(e) =>
                                    updateFormState('equipment', { ...form, equipment_number: e.target.value })
                                }
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Numero de serie</label>
                            <Input
                                name="serial_number"
                                value={form.serial_number || ''}
                                onChange={(e) =>
                                    updateFormState('equipment', { ...form, serial_number: e.target.value })
                                }
                            />
                        </div>
                        <CustomDatePicker
                            label="Date d'achat"
                            value={form.purchase_date || ''}
                            onChange={(value) =>
                                updateFormState('equipment', { ...form, purchase_date: value })
                            }
                            placeholder="Selectionner une date"
                        />
                        <SingleSelectDropdown
                            label="Statut"
                            options={EQUIPMENT_STATUS_OPTIONS}
                            value={form.status || 'available'}
                            onChange={(value) => updateFormState('equipment', { ...form, status: value })}
                            placeholder="Selectionner un statut"
                            searchPlaceholder="Rechercher un statut..."
                            required
                        />
                    </>
                );
            }
            case 'allocation': {
                const form = formState.allocation;
                const currentEquipment = isAllocation(editingItem) ? editingItem.equipment_name : '';
                const currentRoom = isAllocation(editingItem) ? editingItem.room_name : '';
                const currentUser = isAllocation(editingItem) ? editingItem.user_name : '';
                return (
                    <>
                        <SingleSelectDropdown
                            label="Equipement"
                            options={equipmentOptions}
                            value={form.equipment}
                            onChange={(value) => updateFormState('allocation', { ...form, equipment: value })}
                            placeholder={
                                currentEquipment ? `Actuel: ${currentEquipment}` : 'Selectionner un equipement'
                            }
                            searchPlaceholder="Rechercher un equipement..."
                            required={!editingItem}
                        />
                        <SingleSelectDropdown
                            label="Salle"
                            options={roomOptions}
                            value={form.room}
                            onChange={(value) => updateFormState('allocation', { ...form, room: value })}
                            placeholder={currentRoom ? `Actuel: ${currentRoom}` : 'Selectionner une salle'}
                            searchPlaceholder="Rechercher une salle..."
                            required={!editingItem}
                        />
                        <SingleSelectDropdown
                            label="Attribue a"
                            options={userOptions}
                            value={form.allocated_to || ''}
                            onChange={(value) =>
                                updateFormState('allocation', { ...form, allocated_to: value })
                            }
                            placeholder={currentUser ? `Actuel: ${currentUser}` : 'Selectionner un utilisateur'}
                            searchPlaceholder="Rechercher un utilisateur..."
                        />
                        <CustomDatePicker
                            label="Date d'allocation"
                            value={form.allocation_date}
                            onChange={(value) =>
                                updateFormState('allocation', { ...form, allocation_date: value })
                            }
                            placeholder="Selectionner une date"
                            required
                        />
                        <CustomDatePicker
                            label="Date de retour"
                            value={form.return_date || ''}
                            onChange={(value) =>
                                updateFormState('allocation', { ...form, return_date: value })
                            }
                            placeholder="Selectionner une date"
                        />
                        <SingleSelectDropdown
                            label="Statut"
                            options={ALLOCATION_STATUS_OPTIONS}
                            value={form.status || 'active'}
                            onChange={(value) => updateFormState('allocation', { ...form, status: value })}
                            placeholder="Selectionner un statut"
                            searchPlaceholder="Rechercher un statut..."
                            required
                        />
                    </>
                );
            }
            case 'maintenance': {
                const form = formState.maintenance;
                const currentEquipment = isMaintenance(editingItem) ? editingItem.equipment_name : '';
                return (
                    <>
                        <SingleSelectDropdown
                            label="Equipement"
                            options={equipmentOptions}
                            value={form.equipment}
                            onChange={(value) => updateFormState('maintenance', { ...form, equipment: value })}
                            placeholder={
                                currentEquipment ? `Actuel: ${currentEquipment}` : 'Selectionner un equipement'
                            }
                            searchPlaceholder="Rechercher un equipement..."
                            required={!editingItem}
                        />
                        <CustomDatePicker
                            label="Date de maintenance"
                            value={form.maintenance_date}
                            onChange={(value) =>
                                updateFormState('maintenance', { ...form, maintenance_date: value })
                            }
                            placeholder="Selectionner une date"
                            required
                        />
                        <CustomDatePicker
                            label="Date de retour"
                            value={form.return_date || ''}
                            onChange={(value) =>
                                updateFormState('maintenance', { ...form, return_date: value })
                            }
                            placeholder="Selectionner une date"
                        />
                        <div>
                            <label className="block text-sm font-medium">Description</label>
                            <Input
                                name="description"
                                value={form.description}
                                onChange={(e) =>
                                    updateFormState('maintenance', { ...form, description: e.target.value })
                                }
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Effectue par</label>
                            <Input
                                name="performed_by"
                                value={form.performed_by || ''}
                                onChange={(e) =>
                                    updateFormState('maintenance', { ...form, performed_by: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Cout</label>
                            <Input
                                type="number"
                                step="0.01"
                                name="cost"
                                value={String(form.cost)}
                                onChange={(e) =>
                                    updateFormState('maintenance', {
                                        ...form,
                                        cost: Number(e.target.value) || 0,
                                    })
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
                title=' Gestion des infrastructures'
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
                            tableId={`infrastructure-admin-${tab.id}`}
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
}

export default InfrastructurePage;
