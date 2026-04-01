/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useMemo } from "react";
import {
  Plus, Ban, CheckCircle2, Wallet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatsCard, type StatsCardProps } from "@/components/ui/StatsCard";
import StatsGridLoader from "@/components/ui/StatsGridLoader";
import {
  useBanks,
  useCreateBank,
  useUpdateBank,
  useDeleteBank
} from "../hooks/useBanks"; // Assure-toi que ces hooks existent
import { Modal } from "@/modules/admin/components/academic";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SingleSelectDropdown } from "@/components/ui/SingleSelectDropdown";
import { notify } from "@/lib"; // Import de ton utilitaire de notification
import DataTable from "@/components/ui/DataTable";
import type { Banks } from "../types/banks";

const BANK_STATUS_VALUES: Banks["status"][] = ["active", "inactive", "suspended", "closed"];

const isBankStatus = (value: string): value is Banks["status"] => {
  return BANK_STATUS_VALUES.includes(value as Banks["status"]);
};

export default function BankManagementPage() {
  // --- ÉTATS ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBank, setEditingBank] = useState<boolean>(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState<Banks>({
    id: "",
    bank_name: "",
    bank_abreviation: "",
    account_number: "",
    status: "active"
  });

  // --- HOOKS DE DONNÉES ---
  const { data, isLoading, error } = useBanks({
    pagination: true,
    page: currentPage,
    page_size: itemsPerPage,
    search: search
  });
  console.log(data?.results);

  const createBank = useCreateBank();
  const updateBank = useUpdateBank();
  const deleteBank = useDeleteBank();

  // --- STATISTIQUES ---
  const statsData = useMemo<StatsCardProps[]>(() => [
    {
      label: "Total Banques",
      value: data?.count || 0,
      icon: Wallet,
      color: "indigo",
      delay: 0,
    },
    {
      label: "Comptes Actifs",
      value: data?.results?.filter(b => b.status === 'active').length || 0,
      icon: CheckCircle2,
      color: "emerald",
      delay: 100,
    },
    {
      label: "Alertes/Inactifs",
      value: data?.results?.filter(b => b.status !== 'active').length || 0,
      icon: Ban,
      color: "orange",
      delay: 200,
    },
  ], [data]);

  // --- ACTIONS ---
  const openModal = (bank?: Banks) => {
    if (bank) {
      setEditingBank(true);
      setFormData({
        id: bank.id,
        bank_name: bank.bank_name,
        bank_abreviation: bank.bank_abreviation,
        account_number: bank.account_number,
        status: bank.status
      });
    } else {
      setEditingBank(false);
      setFormData({ id: "", bank_name: "", bank_abreviation: "", account_number: "", status: "active" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingBank) {
        await updateBank.mutateAsync({ id: formData.id, data: formData });
        notify.success("Banque mise à jour");
      } else {
        await createBank.mutateAsync(formData);
        notify.success("Nouvelle banque ajoutée");
      }
      setIsModalOpen(false);
    } catch (err) {
      notify.error("Une erreur est survenue");
    }
  };

  const handleCellEdit = async (rowId: string | number, columnKey: string, newValue: string) => {
    try {
      await updateBank.mutateAsync({
        id: String(rowId),
        data: { [columnKey]: newValue },
        isPartial: true
      });
      notify.success("Mise à jour effectuée");
    } catch (error) {
      notify.error("Erreur lors de la modification");
      throw error;
    }
  };

  const handleDelete = async (bank: Banks) => {
    try {
      await deleteBank.mutateAsync(bank.id);
      notify.success("Banque supprimée");
    } catch (error) {
      notify.error("Erreur de suppression");
    }

  };

  return (
    <div >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Les Banques</h1>
          <p className="text-gray-600 mt-1">Système de gestion de trésorerie</p>
        </div>
        <Button onClick={() => openModal()} className="bg-blue-600 hover:bg-blue-700">
          <Plus size={18} /> Ajouter une Banque
        </Button>
      </div>

      {/* STATS */}
      <div className="mb-6">
        <StatsGridLoader
          isPending={isLoading}
          data={statsData}
          renderItem={(stat, index) => (
            <StatsCard key={stat.label} {...stat} delay={index * 0.1} />
          )}
        />
      </div>

      {/* DATATABLE */}
      <DataTable
        tableId="banks-table-accounts"
        data={data || { results: [], count: 0, next: null, previous: null, current_page: 1, total_pages: 1 }}
        columns={[
          {
            key: "bank_name",
            label: "Banque",
            sortable: false,
            editable: true,
            type: "text"
          },
          {
            key: "bank_abreviation",
            label: "Sigle",
            sortable: false,
            editable: true,
            type: "text"
          },
          {
            key: "status",
            label: "statut",
            sortable: false,
            editable: true,
            render: (v) => (
              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${v.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {String(v.status)}
              </span>
            )
          },

        ]}
        getRowId={(row) => row.id}
        isLoading={isLoading}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        onSearchChange={setSearch}
        onEditRow={openModal}
        onDeleteRow={handleDelete}
        onCellEdit={handleCellEdit}
        isPaginated={true}
        error={error ? "Erreur de chargement" : null}
      />

      {/* MODAL DE CONFIGURATION */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBank ? "Modifier la Banque" : "Nouvelle Banque"}
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="bank-name">Nom de l'institution</Label>
              <Input
                id="bank-name"
                placeholder="Ex: Banque Commerciale"
                value={formData.bank_name}
                onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="bank-abbreviation">Sigle / Abréviation</Label>
              <Input
                id="bank-abbreviation"
                placeholder="Ex: BCB"
                value={formData.bank_abreviation}
                onChange={(e) => setFormData({ ...formData, bank_abreviation: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="account_number">Numéro de Compte</Label>
              <Input
                id="account_number"
                placeholder="0000-0000-0000"
                value={formData.account_number}
                onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                required
              />
            </div>

            <SingleSelectDropdown
              label="Statut du compte"
              options={[
                { id: "active", label: "Actif", value: "active" },
                { id: "inactive", label: "Inactif", value: "inactive" },
                { id: "suspended", label: "Suspendu", value: "suspended" },
                { id: "closed", label: "Fermé", value: "closed" }
              ]}
              value={formData.status}
              onChange={(val) => {
                if (!isBankStatus(val)) return;
                setFormData({ ...formData, status: val });
              }}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={createBank.isPending || updateBank.isPending}
            >
              {editingBank ? "Mettre à jour" : "Créer l'institution"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}