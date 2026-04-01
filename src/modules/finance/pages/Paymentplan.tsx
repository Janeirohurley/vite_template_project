import { useState, useMemo } from "react";
import {
  Plus, Edit, ArrowRight,
  Loader2
} from "lucide-react";
import { useCreatePaymentPlans, useDeletePaymentPlans, usePaymentPlans, useUpdatePaymentPlans } from "../hooks/usePaymentPlans";
import { useFeesSheets, useFeesSheetsGroupedOptions } from "../hooks/useFeesSheets";

import { Button } from "@/components/ui/button";
import { Modal } from "@/modules/admin/components/academic";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { notify, useAppStore } from "@/lib";
import DataTable from "@/components/ui/DataTable";
import { SingleSelectDropdown, type Option } from "@/components/ui/SingleSelectDropdown";
import { Badge } from "@/components/ui/badge";
import type { PaymentPlan } from "../types/paymentplan";


export default function PaymentPlansPage() {
  const { selectedAcademicYear } = useAppStore();
  const [filterFees, setFilterFees] = useState<{ type: 'class' | 'department' | 'faculty', id: string } | undefined>(undefined);

  // -- État de la pagination et recherche --
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [tableSearch, setTableSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [filterBackend, setfilterBackend] = useState({})

  const {
    data: FeesSheetsGroupedOptions,
    isLoading: FeesSheetsGroupedOptionsloading,
    error: FeesSheetsGroupedOptionsError
  } = useFeesSheetsGroupedOptions({ academic_year_id: selectedAcademicYear?.id, pagination: false });

  // -- État du formulaire --
  const [formData, setFormData] = useState({
    id: "",
    feessheet: "",
    description: "",
    total_amount: 0,
    monthly_amount: 0,
    start_date: new Date().toISOString().split('T')[0],
    end_date: "",
    status: "active" as "active" | "completed" | "defaulted" | "cancelled"
  });

  // -- Hooks de données --
  const filters = useMemo(() => ({
    academic_year_id: selectedAcademicYear?.id,
    page,
    page_size: pageSize,
    search: tableSearch,
    ...filterBackend
  }), [filterBackend, selectedAcademicYear, page, pageSize, tableSearch]);

  const { data: paymentPlansData, isLoading, refetch } = usePaymentPlans(filters);
  const { data: feesSheetsData } = useFeesSheets({ academic_year_id: selectedAcademicYear?.id, pagination: false });
  const createPlan = useCreatePaymentPlans();
  const updatePlan = useUpdatePaymentPlans();
  const deletePlan = useDeletePaymentPlans();

  const feesSheets = feesSheetsData?.results || [];


  const openModal = (item?: PaymentPlan) => {
    if (item) {
      setIsEditing(true);
      setFormData({
        id: item.id,
        feessheet: item.feessheet || item.feessheet_info?.id || "",
        description: item.description || "",
        total_amount: Number(item.total_amount),
        monthly_amount: Number(item.monthly_amount) || 0,
        start_date: item.start_date || "",
        end_date: item.end_date || "",
        status: item.status || "active"
      });
    } else {
      setIsEditing(false);
      setFormData({
        id: "", feessheet: "", description: "",
        total_amount: 0, monthly_amount: 0,
        start_date: new Date().toISOString().split('T')[0],
        end_date: "", status: "active"
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) await updatePlan.mutateAsync({ id: formData.id, data: formData });
      else await createPlan.mutateAsync(formData);
      notify.success("Enregistré avec succès");
      setModalOpen(false);
    } catch {
      notify.error("Erreur de sauvegarde");
    }
  };

  const handleDeletePaymentPlan = async (row: PaymentPlan) => {
    try {
      await deletePlan.mutateAsync(row.id);
      notify.success('PaymentPlan supprimée avec succès.');
      refetch?.();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      notify.error('Échec de la suppression de l\'inscription.');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold ">Plans de Paiement</h1>
        <Button onClick={() => openModal(undefined)} className="bg-blue-600 hover:bg-blue-700">
          <Plus size={18} className="mr-2" /> Nouveau Paiement
        </Button>
      </div>
      {
        FeesSheetsGroupedOptionsError ? <div>erreur de la recuperation des donnees </div> :
          <SingleSelectDropdown
            disabled={FeesSheetsGroupedOptionsloading}
            placeholder={FeesSheetsGroupedOptionsloading ? "chargement....." : "choisir un cible"}
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
                  type === 'class' ? 'class_id' : type === 'department' ? 'department_id' : 'faculty_id';
                setfilterBackend({ [backendKey]: selectedId });
              }
            }}
            className="mb-5 w-1/3"
          />
      }

      <DataTable
        data={paymentPlansData || []}
        tableId="paymentplan-table"
        isLoading={isLoading}
        currentPage={page}
        setCurrentPage={setPage}
        itemsPerPage={pageSize}
        setItemsPerPage={setPageSize}
        onSearchChange={setTableSearch}
        onDeleteRow={handleDeletePaymentPlan}
        isPaginated={true}
        getRowId={(row) => row.id}
        columns={[
          {
            key: "wording_name",
            label: "Nasture des Frais",
            accessor: "feessheet_info.wording.wording_name",

          },
          {
            key: "description",
            label: "Tranche / Désignation",
            render: (r: PaymentPlan) => (
              <div className="flex flex-col py-2">
                <span className="font-semibold  text-[13px] tracking-tight">
                  {r.description || "Sans titre"}
                </span>
                <span className="text-[9px] text-slate-400 font-medium">Créé le {new Date(r.created_at).toLocaleDateString()}</span>
              </div>
            )
          },
          {
            key: "total_amount",
            label: "Montant à Percevoir",
            render: (r: PaymentPlan) => (
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1">
                  <span className="font-mono font-black  text-sm">
                    {Number(r.total_amount).toLocaleString()}
                  </span>
                  <span className="text-[9px] font-semibold text-slate-400">BIF</span>
                </div>
                {Number(r.monthly_amount || 0) > 0 && (
                  <span className="text-[9px] text-emerald-600 font-semibold ">
                    Dont mensualité : {Number(r.monthly_amount).toLocaleString()} BIF
                  </span>
                )}
              </div>
            )
          },
          {
            key: "dates",
            label: "Période de Validité",
            render: (r: PaymentPlan) => {
              const isExpired = new Date(r.end_date) < new Date();
              return (
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="text-[10px]  font-black">Début</span>
                    <span className="text-[11px] font-semibold ">{r.start_date}</span>
                  </div>
                  <ArrowRight size={12} className="" />
                  <div className="flex flex-col">
                    <span className="text-[10px]  font-black">Échéance</span>
                    <span className={`text-[11px] font-black ${isExpired ? 'text-rose-600' : ''}`}>
                      {r.end_date}
                    </span>
                  </div>
                  {isExpired && (
                    <Badge className="bg-rose-100 text-rose-700 border-none text-[8px] h-4">EXPIRÉ</Badge>
                  )}
                </div>
              );
            }
          },
          {
            key: "status",
            label: "État",
            render: (r: PaymentPlan) => (
              <Badge className={`text-[9px] font-semibold ${r.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : r.status === 'completed' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : r.status === 'defaulted' ? 'bg-rose-100 text-rose-700 border-rose-200' : 'bg-slate-100 text-slate-600'
                }`}>
                {r.status === 'active' ? 'ACTIF' : r.status === 'completed' ? 'TERMINE' : r.status === 'defaulted' ? 'EN DEFAUT' : 'ANNULE'}
              </Badge>
            )
          },
          {
            key: "actions",
            label: "Actions",
            searchable: false,
            render: (r: PaymentPlan) => (
              <div className="flex justify-end gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50" onClick={() => openModal(r)}>
                  <Edit size={14} />
                </Button>
               
              </div>
            )
          }
        ]}
      />
      {/* MODAL CONFIGURATION */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={isEditing ? "🔧 Modifier la Tranche" : "✨ Nouveau Plan de Paiement"}>
        <form onSubmit={handleSubmit} className="space-y-6 pt-6">

          <div className="bg-slate-50 p-6 rounded-md border border-slate-100 space-y-5">
            <div className="space-y-2">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Liaison Barème (Fees Sheet)</Label>
              <SingleSelectDropdown
                required
                options={feesSheets?.map((fs) => ({
                  id: fs.id,
                  value: fs.id,
                  label: `[${fs.faculty_info?.faculty_name || fs.class_info?.faculty_name || fs.department_info?.department_name || 'GEN'}] - ${fs.wording_info?.wording_name || 'Frais'} (${Number(fs.base_amount).toLocaleString()} BIF)`
                })) as Option[] || []}
                value={formData.feessheet}
                onChange={(val) => setFormData({ ...formData, feessheet: val })}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom du Plan</Label>
              <Input placeholder="Ex: Tranche d'installation" className="h-12 rounded-md bg-white border-slate-200 focus-visible:ring-indigo-500 font-semibold" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-700 ml-1">Montant Global (BIF)</Label>
              <Input type="number" className="h-12 rounded-md bg-white border-slate-200 font-mono font-semibold text-indigo-600" value={formData.total_amount} onChange={(e) => setFormData({ ...formData, total_amount: Number(e.target.value) })} required />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-700 ml-1">Mensualité (Option)</Label>
              <Input type="number" className="h-12 rounded-md bg-white border-slate-200 font-mono" value={formData.monthly_amount} onChange={(e) => setFormData({ ...formData, monthly_amount: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-700 ml-1">Date d'Activation</Label>
              <Input type="date" className="h-12 rounded-md bg-white border-slate-200" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-700 ml-1">Date d'Échéance</Label>
              <Input type="date" className={`h-12 rounded-md bg-white border-2 font-semibold ${formData.end_date ? 'border-amber-200 bg-amber-50/20' : 'border-slate-200'}`} value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} required />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-8 border-t border-slate-100">
            <Button variant="ghost" type="button" className="text-slate-400 font-semibold hover:text-slate-600" onClick={() => setModalOpen(false)}>ANNULER</Button>
            <Button type="submit" className="bg-slate-900 text-white min-w-40 rounded-md font-black shadow-xl hover:bg-indigo-600 transition-all uppercase tracking-tighter" disabled={createPlan.isPending || updatePlan?.isPending}>
              {(createPlan.isPending || updatePlan?.isPending) ? <Loader2 className="animate-spin" size={20} /> : isEditing ? "Mettre à jour" : "Créer le Plan"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
