import { PageHeader } from "@/modules/admin/components/PageHeader";
import { useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Filter, Plus, RotateCcw } from "lucide-react";
import DataTable from "@/components/ui/DataTable";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription } from '@/components/ui/alert-dialog';
import { FormGroup } from '@/components/ui/FormGroup';
import { Input } from '@/components/ui/input';
import { notify } from "@/lib";
import { useCountries } from "@/api/geo";
import { SingleSelectDropdown, type Option } from "@/components/ui/SingleSelectDropdown";
import {
    useCreateHighSchool,
    useDeleteHighSchool,
    useHighSchools,
    useUpdateHighSchool,
} from "../hooks/useStudentService";
import type { HighSchool } from "../types";

function HighSchoolInfoPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [search, setSearch] = useState("");
    const [ordering, setOrdering] = useState("");
    const [selectedCountryId, setSelectedCountryId] = useState("");
    const [selectedProvinceId, setSelectedProvinceId] = useState("");
    const [selectedCommuneId, setSelectedCommuneId] = useState("");
    const [selectedZoneId, setSelectedZoneId] = useState("");
    const [selectedCollineId, setSelectedCollineId] = useState("");
    const [showFilters, setShowFilters] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        id: "",
        hs_name: "",
        zone_id: "",
        code: "",
    });

    const { data: highSchoolsData, isLoading } = useHighSchools({
        search,
        page: currentPage,
        page_size: itemsPerPage,
        ordering,
        ...(selectedZoneId ? { zone_id: selectedZoneId } : {}),
    });

    const createHighSchool = useCreateHighSchool();
    const updateHighSchool = useUpdateHighSchool();
    const deleteHighSchool = useDeleteHighSchool();

    const { data: countries = [] } = useCountries();
    const selectedCountry = useMemo(
        () => countries.find((country) => country.id === selectedCountryId),
        [countries, selectedCountryId]
    );
    const provinceOptions = useMemo(
        () => selectedCountry?.provinces || [],
        [selectedCountry]
    );
    const selectedProvince = useMemo(
        () => provinceOptions.find((province) => province.id === selectedProvinceId),
        [provinceOptions, selectedProvinceId]
    );
    const communeOptions = useMemo(
        () => selectedProvince?.communes || [],
        [selectedProvince]
    );
    const selectedCommune = useMemo(
        () => communeOptions.find((commune) => commune.id === selectedCommuneId),
        [communeOptions, selectedCommuneId]
    );
    const zoneGeoOptions = useMemo(
        () => selectedCommune?.zones || [],
        [selectedCommune]
    );
    const collineOptions = useMemo(() => {
        if (!selectedZoneId) return [];
        const zone = zoneGeoOptions.find((item) => item.id === selectedZoneId);
        return zone?.collines || [];
    }, [zoneGeoOptions, selectedZoneId]);


    const countryOptions: Option[] = useMemo(
        () => countries.map((country) => ({ id: country.id, label: country.country_name })),
        [countries]
    );
    const provinceDropdownOptions: Option[] = useMemo(
        () => provinceOptions.map((province) => ({ id: province.id, label: province.province_name })),
        [provinceOptions]
    );
    const communeDropdownOptions: Option[] = useMemo(
        () => communeOptions.map((commune) => ({ id: commune.id, label: commune.commune_name })),
        [communeOptions]
    );
    const zoneDropdownOptions: Option[] = useMemo(
        () => zoneGeoOptions.map((zone) => ({ id: zone.id, label: zone.zone_name })),
        [zoneGeoOptions]
    );
    const collineDropdownOptions: Option[] = useMemo(
        () => collineOptions.map((colline) => ({ id: colline.id, label: colline.colline_name })),
        [collineOptions]
    );

    const filteredHighSchoolsData = useMemo(() => {
        if (!highSchoolsData?.results) return highSchoolsData || [];
        if (!selectedCollineId) return highSchoolsData;

        const allowedZoneIds = new Set<string>();
        countries.forEach((country) => {
            (country.provinces || []).forEach((province) => {
                (province.communes || []).forEach((commune) => {
                    (commune.zones || []).forEach((zone) => {
                        if ((zone.collines || []).some((colline) => colline.id === selectedCollineId)) {
                            allowedZoneIds.add(zone.id);
                        }
                    });
                });
            });
        });

        const results = highSchoolsData.results.filter((school) => allowedZoneIds.has(school.zone?.id || ""));

        return {
            ...highSchoolsData,
            results,
            count: results.length,
            current_page: 1,
            total_pages: 1,
            next: null,
            previous: null,
        };
    }, [highSchoolsData, selectedCollineId, countries]);

    const handleCountryChange = (countryId: string) => {
        setSelectedCountryId(countryId);
        setSelectedProvinceId("");
        setSelectedCommuneId("");
        setSelectedZoneId("");
        setSelectedCollineId("");
        setCurrentPage(1);
    };

    const handleProvinceChange = (provinceId: string) => {
        setSelectedProvinceId(provinceId);
        setSelectedCommuneId("");
        setSelectedZoneId("");
        setSelectedCollineId("");
        setCurrentPage(1);
    };

    const handleCommuneChange = (communeId: string) => {
        setSelectedCommuneId(communeId);
        setSelectedZoneId("");
        setSelectedCollineId("");
        setCurrentPage(1);
    };

    const handleZoneChange = (zoneId: string) => {
        setSelectedZoneId(zoneId);
        setSelectedCollineId("");
        setCurrentPage(1);
    };

    const handleCollineChange = (collineId: string) => {
        setSelectedCollineId(collineId);
        setCurrentPage(1);
    };

    const resetFilters = () => {
        setSelectedCountryId("");
        setSelectedProvinceId("");
        setSelectedCommuneId("");
        setSelectedZoneId("");
        setSelectedCollineId("");
        setCurrentPage(1);
    };

    const activeFiltersCount = [
        selectedCountryId,
        selectedProvinceId,
        selectedCommuneId,
        selectedZoneId,
        selectedCollineId,
    ].filter(Boolean).length;

    const openCreateModal = () => {
        setIsEditing(false);
        setFormData({ id: "", hs_name: "", zone_id: "", code: "" });
        setIsModalOpen(true);
    };

    const openEditModal = (row: HighSchool) => {
        setIsEditing(true);
        setFormData({
            id: row.id,
            hs_name: row.hs_name,
            zone_id: row.zone?.id || "",
            code: row.code || "",
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await updateHighSchool.mutateAsync({
                    id: formData.id,
                    data: {
                        hs_name: formData.hs_name,
                        zone_id: formData.zone_id,
                        code: formData.code || null,
                    },
                });
                notify.success("Lycée mis à jour avec succès");
            } else {
                await createHighSchool.mutateAsync({
                    hs_name: formData.hs_name,
                    zone_id: formData.zone_id,
                    code: formData.code || null,
                });
                notify.success("Lycée créé avec succès");
            }
            setIsModalOpen(false);
        } catch {
            notify.error("Échec de l'opération");
        }
    };

    const handleDelete = async (row: HighSchool) => {
        const confirmed = confirm(`Supprimer le lycée ${row.hs_name} ?`);
        if (!confirmed) return;

        try {
            await deleteHighSchool.mutateAsync(row.id);
            notify.success("Lycée supprimé avec succès");
        } catch {
            notify.error("Suppression impossible");
        }
    };

    return (
        <div>
            <PageHeader
                title="Référentiel des Lycées"
                description="Gestion des établissements secondaires"
                rightElement={
                    <Button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus size={16} className="mr-2" /> Nouveau lycée
                    </Button>
                }
            />

            <div className="flex items-center justify-end mb-4">
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${showFilters
                        ? 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                        }`}
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

            {showFilters && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Filtrer les lycées
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
                        <SingleSelectDropdown
                            label="Pays"
                            options={countryOptions}
                            value={selectedCountryId}
                            onChange={handleCountryChange}
                            placeholder="Tous les pays"
                            searchPlaceholder="Rechercher un pays..."
                        />
                        <SingleSelectDropdown
                            label="Province"
                            options={provinceDropdownOptions}
                            value={selectedProvinceId}
                            onChange={handleProvinceChange}
                            placeholder="Toutes les provinces"
                            searchPlaceholder="Rechercher une province..."
                            disabled={!selectedCountryId}
                        />
                        <SingleSelectDropdown
                            label="Commune"
                            options={communeDropdownOptions}
                            value={selectedCommuneId}
                            onChange={handleCommuneChange}
                            placeholder="Toutes les communes"
                            searchPlaceholder="Rechercher une commune..."
                            disabled={!selectedProvinceId}
                        />
                        <SingleSelectDropdown
                            label="Zone"
                            options={zoneDropdownOptions}
                            value={selectedZoneId}
                            onChange={handleZoneChange}
                            placeholder="Toutes les zones"
                            searchPlaceholder="Rechercher une zone..."
                            disabled={!selectedCommuneId}
                        />
                        <SingleSelectDropdown
                            label="Colline"
                            options={collineDropdownOptions}
                            value={selectedCollineId}
                            onChange={handleCollineChange}
                            placeholder="Toutes les collines"
                            searchPlaceholder="Rechercher une colline..."
                            disabled={!selectedZoneId}
                        />
                    </div>
                </div>
            )}

            <DataTable
                tableId="highschools-table"
                data={filteredHighSchoolsData || []}
                columns={[
                    { key: "hs_name", label: "Nom du Lycée", sortable: true, searchable: true },
                    {
                        key: "zone_name",
                        label: "Zone",
                        accessor: "zone.zone_name",
                        sortable: true,
                        searchable: true,
                    },
                    {
                        key: "code",
                        label: "Code",
                        render: (row: HighSchool) => row.code || "-",
                    },
                ]}
                getRowId={(row) => row.id}
                isLoading={isLoading}
                isPaginated={true}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                onBackendOrderingChange={setOrdering}
                onSearchChange={setSearch}
                onEditRow={openEditModal}
                onDeleteRow={handleDelete}
            />

            <AlertDialog open={isModalOpen} onOpenChange={(open) => { if (!open) setIsModalOpen(false); }}>
                <AlertDialogContent className="max-w-xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>{isEditing ? "Modifier le lycée" : "Nouveau lycée"}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {isEditing ? "Modifier les informations du lycée." : "Créer un nouvel établissement secondaire."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <FormGroup columns={1} gap="md">
                            <div>
                                <label className="block text-sm font-medium mb-1">Nom du lycée</label>
                                <Input
                                    type="text"
                                    value={formData.hs_name}
                                    onChange={e => setFormData(prev => ({ ...prev, hs_name: e.target.value }))}
                                    required
                                />
                            </div>
                        </FormGroup>
                        <FormGroup columns={2} gap="md">
                            <SingleSelectDropdown
                                label="Pays"
                                options={countryOptions}
                                value={selectedCountryId}
                                onChange={countryId => {
                                    setSelectedCountryId(countryId);
                                    setSelectedProvinceId("");
                                    setSelectedCommuneId("");
                                    setSelectedZoneId("");
                                    setSelectedCollineId("");
                                }}
                                placeholder="Sélectionner un pays"
                                required
                            />
                            <SingleSelectDropdown
                                label="Province"
                                options={provinceDropdownOptions}
                                value={selectedProvinceId}
                                onChange={provinceId => {
                                    setSelectedProvinceId(provinceId);
                                    setSelectedCommuneId("");
                                    setSelectedZoneId("");
                                    setSelectedCollineId("");
                                }}
                                placeholder="Sélectionner une province"
                                disabled={!selectedCountryId}
                                required
                            />
                        </FormGroup>
                        <FormGroup columns={2} gap="md">
                            <SingleSelectDropdown
                                label="Commune"
                                options={communeDropdownOptions}
                                value={selectedCommuneId}
                                onChange={communeId => {
                                    setSelectedCommuneId(communeId);
                                    setSelectedZoneId("");
                                    setSelectedCollineId("");
                                }}
                                placeholder="Sélectionner une commune"
                                disabled={!selectedProvinceId}
                                required
                            />
                            <SingleSelectDropdown
                                label="Zone"
                                options={zoneDropdownOptions}
                                value={selectedZoneId}
                                onChange={zoneId => {
                                    setSelectedZoneId(zoneId);
                                    setFormData(prev => ({ ...prev, zone_id: zoneId }));
                                    setSelectedCollineId("");
                                }}
                                placeholder="Sélectionner une zone"
                                disabled={!selectedCommuneId}
                                required
                            />
                        </FormGroup>
                        <FormGroup columns={2} gap="md">
                            <SingleSelectDropdown
                                label="Colline (optionnel)"
                                options={collineDropdownOptions}
                                value={selectedCollineId}
                                onChange={collineId => setSelectedCollineId(collineId)}
                                placeholder="Sélectionner une colline"
                                disabled={!selectedZoneId}
                            />
                            <div>
                                <label className="block text-sm font-medium mb-1">Code (optionnel)</label>
                                <Input
                                    type="text"
                                    value={formData.code}
                                    onChange={e => setFormData(prev => ({ ...prev, code: e.target.value }))}
                                    maxLength={10}
                                />
                            </div>
                        </FormGroup>
                        <AlertDialogFooter>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                {isEditing ? "Mettre à jour" : "Créer"}
                            </button>
                        </AlertDialogFooter>
                    </form>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default HighSchoolInfoPage