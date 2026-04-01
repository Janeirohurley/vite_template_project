/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useMemo } from "react";
import {
  Layers,
  Plus,
  TrendingUp, Wallet
} from "lucide-react";
import { useCreateFeesSheets, useDeleteFeesSheets, useFeesSheets, useFeesSheetsGroupedOptions, useUpdateFeesSheets, useWordings } from "../hooks/useFeesSheets";
import { Button } from "@/components/ui/button";
import StatsGridLoader from "@/components/ui/StatsGridLoader";
import { StatsCard } from "@/modules/doyen";
import { SingleSelectDropdown } from "@/components/ui/SingleSelectDropdown";
import { useClasses, useDepartments, useFaculties } from "@/modules/admin/hooks/useAcademicEntities";
import { Modal } from "@/modules/admin/components/academic";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { notify, useAppStore } from "@/lib";
import type { CreateFeesSheets, FeesSheet } from "../types/finance";
import type { StatsCardProps } from "@/components/ui/StatsCard";
import DataTable from "@/components/ui/DataTable";


export default function FeesSheetsPage() {
  const [filterFees, setFilterFees] = useState<{ type: 'class' | 'department' | 'faculty', id: string } | undefined>(undefined);
  const [modalOpen, setModalOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState("")
  const [filterBackend, setfilterBackend] = useState({})
  const [orderingBackend, setOrderingBackend] = useState({})
  const [edditing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    class_fk: "", department: "", faculty: "",
    academic_year: "", wording: "", base_amount: 0,
    id: "" as string
  });



  const { selectedAcademicYear } = useAppStore()

  //=============custom hooks==========================
  const {
    data: FeesSheetsData,
    isLoading: loadingFeesSheets,
    error: errorFeesSheets
  } = useFeesSheets({ academic_year_id: selectedAcademicYear?.id, pagination: true, page_size: itemsPerPage, page: currentPage, search, ...filterBackend, ordering: orderingBackend, });
  const {
    data: FeesSheetsGroupedOptions,
    isLoading: FeesSheetsGroupedOptionsloading,
    error: FeesSheetsGroupedOptionsError
  } = useFeesSheetsGroupedOptions({ academic_year_id: selectedAcademicYear?.id, pagination: false });

  const { data: wordings } = useWordings({ academic_year_id: selectedAcademicYear?.id, pagination: false })
  const { data: facultyData, isLoading: laodingFaculities } = useFaculties({
    pagination: false,
    academic_year_id: selectedAcademicYear?.id
  });
  const { data: departymentsData, isLoading: loadingDepartiments } = useDepartments({
    pagination: false,
    academic_year_id: selectedAcademicYear?.id
  });
  const { data: classesData, isLoading: loadingClasses } = useClasses({
    pagination: false,
    academic_year_id: selectedAcademicYear?.id
  });


  const createFeesSheet = useCreateFeesSheets()
  const updateFeesSheets = useUpdateFeesSheets()
  const deleteFeesSheets = useDeleteFeesSheets()




  const handleCellEdit = async (rowId: string | number, columnKey: string, newValue: string) => {
    try {
      const updateData: Partial<FeesSheet> = {
        [columnKey]: newValue,
      };

      await updateFeesSheets.mutateAsync({
        id: String(rowId),
        data: updateData,
        isPartial: true
      });
    } catch (error) {
      notify.error('Erreur lors de la mise à jour ');
      console.error('Cell edit error:', error);
      throw error; // Re-throw to let DataTable handle the error state
    }
  };





  const openModal = () => {
    setEditing(false);
    setFormData({ class_fk: "", department: "", faculty: "", academic_year: "", wording: "", base_amount: 0, id: "" });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const payload: CreateFeesSheets = {
        ...formData,
        base_amount: Number(formData.base_amount),
        academic_year: selectedAcademicYear?.id as string
      };

      if (edditing) {
        await updateFeesSheets.mutateAsync({
          id: formData.id,
          data: payload,
          isPartial: false
        });
        notify.success('Barème modifié avec succès');
      } else {
        await createFeesSheet.mutateAsync(payload);
        notify.success('Barème créé avec succès');
      }

      setModalOpen(false);
      setEditing(false);
      setFormData({ class_fk: "", department: "", faculty: "", academic_year: "", wording: "", base_amount: 0, id: "" });
    } catch (err: unknown) {
      notify.error("Erreur lors de l'opération.");
    }
  };


  const handleEdit = (item: FeesSheet) => {
    setEditing(true);
    setFormData({
      id: item.id,
      class_fk: item.class_info?.id as string,
      department: item.department_info?.id as string,
      faculty: item.faculty_info?.id as string,
      academic_year: selectedAcademicYear?.id as string,
      wording: item.wording_info?.id as string,
      base_amount: item.base_amount
    });
    setModalOpen(true);
  };

  const handleDelete = async (item: FeesSheet) => {
    try {
      await deleteFeesSheets.mutateAsync(item.id);
      notify.success('Année académique supprimée avec succès');
    } catch (error) {
      notify.error('Erreur lors de la suppression de l\'année académique');
      console.error('Delete error:', error);
    }
  };

  const statsData = useMemo<StatsCardProps[]>(() => [
    {
      label: "Volume Global",
      value: "1 250 000 000 BIF",
      icon: Wallet,
      color: "indigo",
      delay: 0,
    },
    {
      label: "Barèmes Actifs",
      value: 312,
      icon: Layers,
      color: "emerald",
      delay: 100,
    },
    {
      label: "Moyenne / Barème",
      value: "4 005 000 BIF",
      icon: TrendingUp,
      color: "orange",
      delay: 200,
    },
  ], []);






  return (
    <div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Barème des Frais</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Référentiel Financier</p>
        </div>
        <Button onClick={() => openModal()} className="bg-blue-600 hover:bg-blue-700">
          <Plus size={18} /> Paramétrer
        </Button>
      </div>

      {/* Statistiques */}
      <div className="mb-6">
        <StatsGridLoader
          isPending={loadingClasses}
          data={statsData ?? []} // évite les erreurs si undefined
          renderItem={(stat, index) => (
            <StatsCard
              key={stat.label} // tu peux garder ta clé ici si tu veux
              {...stat}
              delay={index * 0.1}
            />
          )}
        />
      </div>

      {
        FeesSheetsGroupedOptionsError ? <div>erreur de la recuperation des donnees </div> :
          <SingleSelectDropdown
            disabled={FeesSheetsGroupedOptionsloading}
            placeholder={FeesSheetsGroupedOptionsloading || loadingDepartiments || laodingFaculities ? "chargement....." : "choisir un cible"}
            value={filterFees?.id}
            options={FeesSheetsGroupedOptions?.results || []}
            onChange={(selectedId) => {
              if (!selectedId) {
                setFilterFees(undefined);
                setfilterBackend({});
                return;
              }

              const allOptions = FeesSheetsGroupedOptions?.results || [];
              let type: 'class' | 'department' | 'faculty' | undefined;

              for (const group of allOptions) {
                const found = group.options?.find(opt => opt.value === selectedId);
                if (found) {
                  if (group.group === 'Classes') type = 'class';
                  else if (group.group === 'Departements') type = 'department';
                  else if (group.group === 'Faculties') type = 'faculty';
                  break;
                }
              }

              if (type) {
                setFilterFees({ type, id: selectedId });
                const backendKey =
                  type === 'class' ? 'class_fk' : type === 'department' ? 'department' : 'faculty';
                setfilterBackend({ [backendKey]: selectedId });
              }
            }}
            className="mb-5 w-1/3"
          />
      }


      <DataTable
        data={FeesSheetsData || { results: [], count: 0, next: null, previous: null, current_page: 1, total_pages: 1 }}
        columns={[
          {
            key: "wording",
            label: "Libelle",
            accessor: "wording_info.wording_name",
            sortable: true,
            editable: true,
            type: "select",
            options: wordings?.results?.map(w => ({
              id: w.id,
              label: w.wording_name,
              value: w.id
            })) || []

          },
          {
            key: "base_amount",
            label: "Montant",
            sortable: true,
            editable: true,
            type: "number"
          }
        ]}
        getRowId={(row) => row.id}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        onSearchChange={setSearch}
        onEditRow={handleEdit}
        onDeleteRow={handleDelete}
        isLoading={loadingFeesSheets}
        onCellEdit={handleCellEdit}
        isPaginated={true}
        error={errorFeesSheets ? "Erreur lors du chargement des donnees" : null}
        onBackendFiltersChange={setfilterBackend}
        onBackendOrderingChange={setOrderingBackend}

      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={edditing ? "Modification de la Configuration " : "Configuration"}
      >
        <form onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }} className="space-y-4">

          <div className="space-y-4">
            <SingleSelectDropdown
              label="Entité concernée"
              required
              placeholder="Sélectionner une cible..."
              options={[
                {
                  group: "Facultés",
                  options: facultyData?.results?.map(f => ({
                    id: f.id,
                    label: f.faculty_name,
                    value: f.id
                  })) || []
                },
                {
                  group: "departements",
                  options: departymentsData?.results?.map(d => {
                    const isCommon = d.abreviation.toUpperCase().includes("AC");
                    const facName = d.faculty?.faculty_name
                    return {
                      id: d.id,
                      label: isCommon && facName ? `${d.department_name} {${facName}}` : d.department_name,
                      value: d.id
                    };
                  }) || []
                },
                {
                  group: "classes",
                  options: classesData?.results?.map(c => {
                    const dept = c.department;
                    const deptName = dept?.abreviation || "";
                    const isCommon = deptName.toUpperCase().includes("AC");
                    const facName = dept?.faculty?.faculty_name

                    return {
                      id: c.id,
                      label: `${c.class_name} ${isCommon && facName ? `{${facName}}` : `— [${deptName || "N/A"}]`}`,
                      value: c.id
                    };
                  }) || []
                }
              ]}
              value={formData.class_fk || formData.department || formData.faculty}

              onChange={(e) => {
                const val = e;
                const isFac = facultyData?.results?.some(f => f.id === val);
                const isDept = departymentsData?.results?.some(d => d.id === val);
                setFormData({
                  ...formData,
                  faculty: isFac ? val : "",
                  department: isDept ? val : "",
                  class_fk: (!isFac && !isDept) ? val : ""
                });
              }}
            />
            <Label
              htmlFor="montant"
              className="flex text-xs items-center gap-1 text-gray-900 dark:text-gray-100 font-medium"
            >
              Montant
            </Label>
            <Input
              placeholder="0"
              type="number"
              id="montant"
              value={formData.base_amount}
              onChange={(e) => setFormData({ ...formData, base_amount: Number(e.target.value) })}
            />

            <SingleSelectDropdown
              required
              label="Type de frais"
              placeholder="Type de frais..."
              options={wordings?.results?.map(w => ({
                id: w.id,
                label: w.wording_name,
                value: w.id
              })) || []}
              value={formData.wording}
              onChange={(e) => setFormData({ ...formData, wording: e })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"

            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={createFeesSheet.isPending || updateFeesSheets.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createFeesSheet.isPending || updateFeesSheets.isPending
                ? 'Chargement...'
                : edditing
                  ? 'Modifier'
                  : 'Créer'}
            </button>
          </div>
        </form>
      </Modal>




    </div>
  );
}
