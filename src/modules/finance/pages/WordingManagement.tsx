import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  useCreateWordings, 
  useUpdateWordings, 
  useWordings, 
  useDeleteWordings 
} from "../hooks/useWording";
import { Modal } from "@/modules/admin/components/academic";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { notify, useAppStore } from "@/lib"; // Import du store pour l'année académique
import type { wording } from "../types/finance";
import DataTable from "@/components/ui/DataTable";

export default function FinanceDashboard() {
  // --- États de contrôle standard ---
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [edditing, setEditing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ wording_name: "", id: "" });

  const { selectedAcademicYear } = useAppStore();

  // --- Hooks de données ---
  const { data, isLoading: loadingwording, error: errorWording } = useWordings({
    academic_year_id: selectedAcademicYear?.id,
    page: currentPage,
    page_size: itemsPerPage,
    search: search
  });

  const createWording = useCreateWordings();
  const updateWordings = useUpdateWordings();
  const deleteWordings = useDeleteWordings();

  // --- Logique : Édition en ligne (Cell Edit) ---
  const handleCellEdit = async (rowId: string | number, columnKey: string, newValue: string) => {
    try {
      await updateWordings.mutateAsync({
        id: String(rowId),
        data: { [columnKey]: newValue }
      });
      notify.success("Catégorie mise à jour");
    } catch (error) {
      notify.error("Erreur de modification");
      throw error; 
    }
  };

  // --- Logique : Gestion Modale (Miroir FeesSheets) ---
  const openModal = () => {
    setEditing(false);
    setFormData({ wording_name: "", id: "" });
    setModalOpen(true);
  };

  const handleEdit = (row: wording) => {
    setEditing(true);
    setFormData({ id: row.id, wording_name: row.wording_name });
    setModalOpen(true);
  };

  const handleDelete = async (row: wording) => {
    try {
      await deleteWordings.mutateAsync(row.id);
      notify.success("Catégorie supprimée avec succès");
    } catch {
      notify.error("Erreur lors de la suppression");
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = { 
        wording_name: formData.wording_name,
        academic_year: selectedAcademicYear?.id // Cohérence avec le barème
      };

      if (edditing) {
        await updateWordings.mutateAsync({ id: formData.id, data: payload });
        notify.success("Catégorie modifiée");
      } else {
        await createWording.mutateAsync(payload);
        notify.success("Catégorie créée");
      }

      setModalOpen(false);
      setEditing(false);
    } catch {
      notify.error("Opération échouée.");
    }
  };

  return (
    <div>

      <div className=" space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold ">Les Catégories</h1>
            <p className=" mt-1">Référentiel des types de frais</p>
          </div>
          <Button onClick={openModal} className="bg-blue-600 hover:bg-blue-700">
            <PlusCircle size={18} /> Ajouter une catégorie
          </Button>
        </div>

        <DataTable
          data={data ||[]}
          tableId="wording-table"
          columns={[
            { 
              key: "wording_name", 
              label: "Désignation de la Catégorie", 
              sortable: true, 
              editable: true // Active l'édition en ligne
            },
          ]}
          getRowId={(row) => row.id}
          isLoading={loadingwording}
          // Pagination & Filtres
          isPaginated={true}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          onSearchChange={setSearch}
          // Actions Standardisées
          onEditRow={handleEdit}
          onDeleteRow={handleDelete}
          onCellEdit={handleCellEdit}
          error={errorWording ? "Erreur de chargement" : null}
        />

        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={edditing ? "Modifier la Catégorie" : "Nouvelle Catégorie"}
        >
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="wording" className="text-sm font-semibold">
                Nom du Categorie
              </Label>
              <Input
                placeholder="ex: Minerval, Inscription..."
                id="wording"
                value={formData.wording_name}
                onChange={(e) => setFormData({ ...formData, wording_name: e.target.value })}
                className="h-12"
                required
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={createWording.isPending || updateWordings.isPending}
                className="bg-blue-600 min-w-[100px]"
              >
                {createWording.isPending || updateWordings.isPending ? "Traitement..." : edditing ? "Mettre à jour" : "Créer"}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}