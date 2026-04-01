import { useState, useMemo } from "react";
import { Plus, Wallet, CreditCard } from "lucide-react";
import {
  useDeletePayment,
  usePayments,
  useUpdatePayment,
  useVerifyPayment
} from "../hooks/usePayments";
import { useClasses, useDepartments, useFaculties } from "@/modules/admin/hooks/useAcademicEntities";
import { Button } from "@/components/ui/button";
import { SingleSelectDropdown } from "@/components/ui/SingleSelectDropdown";
import DataTable from "@/components/ui/DataTable";
import StatsGridLoader from "@/components/ui/StatsGridLoader";
import { StatsCard } from "@/modules/doyen";
import { notify, useAppStore } from "@/lib";
import { PaymentModal } from "../components/PaymentModal";
import type { Payment } from "../types/payment";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

export default function PaymentsPage() {
  // --- États ---
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  // États pour les filtres académiques
  const [facultyId, setFacultyId] = useState<string>("");
  const [departmentId, setDepartmentId] = useState<string>("");
  const [classId, setClassId] = useState<string>("");

  const { selectedAcademicYear } = useAppStore();

  // --- États pour la double confirmation ---
  const [confirmStep, setConfirmStep] = useState<null | 'first' | 'second'>(null);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  // --- Hooks de données ---
  const { data: paymentsData, isLoading: loadingPayments, refetch } = usePayments({
    academic_year_id: selectedAcademicYear?.id,
    page: currentPage,
    page_size: itemsPerPage,
    search,
    faculty_id: facultyId,
    department_id: departmentId,
    class_id: classId,
  });
  const deletePaymentMutation = useDeletePayment();
  const verifyPaymentMutation = useVerifyPayment();
  const updatePaymentMutation = useUpdatePayment();

  const handleDeletePayment = async (row: Payment) => {
    try {
      await deletePaymentMutation.mutateAsync(row.id);
      notify.success('Payment supprimée avec succès.');
      refetch?.();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      notify.error('Échec de la suppression de l\'inscription.');
    }
  };

  const handleVerifyClick = (row: Payment) => {
    setSelectedPayment(row);
    setConfirmStep('first');
  };

  const handleConfirmFirst = () => {
    setConfirmStep('second');
  };

  const handleConfirmSecond = async () => {
    if (!selectedPayment) return;
    setConfirmStep(null);
    try {
      await verifyPaymentMutation.mutateAsync(selectedPayment.id);
      notify.success('Paiement vérifié avec succès.');
      refetch?.();
    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
      notify.error('Échec de la vérification du paiement.');
    }
    setSelectedPayment(null);
  };

  const handleCancel = () => {
    setConfirmStep(null);
    setSelectedPayment(null);
  };

  const handleCellEdit = async (rowId: string | number, columnKey: string, newValue: string) => {
    try {
      const payload = new FormData();
      payload.append(columnKey, newValue);
      await updatePaymentMutation.mutateAsync({ id: String(rowId), data: payload });
      notify.success('Paiement mis à jour avec succès.');
      refetch?.();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      notify.error('Échec de la mise à jour du paiement.');
      throw error;
    }
  };

  const { data: faculties } = useFaculties({ pagination: false });
  const { data: departments } = useDepartments({ pagination: false, faculty_id: facultyId });
  const { data: classes } = useClasses({ pagination: false, department_id: departmentId });

  // --- Calcul des Stats ---
  const statsData = useMemo(() => {
    const total = paymentsData?.results?.reduce((acc: number, curr) => acc + Number(curr.amount_paid), 0) || 0;
    return [
      { label: "Transactions", value: String(paymentsData?.count || 0), icon: CreditCard, color: "blue" as const },
      { label: "Total Encaissé", value: `${total.toLocaleString()} BIF`, icon: Wallet, color: "emerald" as const },
    ];
  }, [paymentsData]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Paiements & Versements</h1>
        <Button onClick={() => setCreateModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus size={18} className="mr-2" /> Nouveau Paiement
        </Button>
      </div>

      <div className="mb-6">
        <StatsGridLoader isPending={loadingPayments} data={statsData}
          renderItem={(s, i) => <StatsCard key={i} {...s} />} />
      </div>

      {/* --- Section Filtres Académiques --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-white dark:bg-bg-card p-4 rounded-lg border border-gray-400 ">
        <SingleSelectDropdown
          label="Faculté"
          options={faculties?.results?.map((f) => ({ id: f.id, label: f.faculty_name, value: f.id })) || []}
          value={facultyId}
          onChange={(v) => { setFacultyId(v); setDepartmentId(""); setClassId(""); }}
        />
        <SingleSelectDropdown
          label="Département"
          options={departments?.results?.map((d) => ({ id: d.id, label: d.department_name, value: d.id })) || []}
          value={departmentId}
          onChange={(v) => { setDepartmentId(v); setClassId(""); }}
          disabled={!facultyId}
        />
        <SingleSelectDropdown
          label="Classe"
          options={classes?.results?.map((c) => ({ id: c.id, label: c.class_name, value: c.id })) || []}
          value={classId}
          onChange={(v) => setClassId(v)}
          disabled={!departmentId}
        />
      </div>

      <DataTable
        tableId="payments-list-full"
        data={paymentsData || { results: [], count: 0, next: null, previous: null, current_page: 1, total_pages: 1 }}
        isLoading={loadingPayments}
        getRowId={(r) => r.id}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onSearchChange={setSearch}
        isPaginated={true}
        onDeleteRow={handleDeletePayment}
        onCellEdit={handleCellEdit}
        columns={[
          {
            key: "inscription_info",
            label: "Étudiant",
            render: (row) => (
              <div className="flex flex-col">
                <span className="font-medium">
                  {row.inscription_info?.student?.first_name} {row.inscription_info?.student?.last_name}
                </span>
                <span className="text-xs text-slate-500">{row.inscription_info?.student?.matricule}</span>
              </div>
            )
          },
          {
            key: "amount_paid",
            label: "Montant",
            render: (row) => <span className="font-semibold">{Number(row.amount_paid).toLocaleString()} BIF</span>
          },
          {
            key: "payment_method",
            label: "Mode",
            render: (row) => <span className="capitalize text-xs bg-slate-100 dark:bg-slate-600 px-2 py-1 rounded">{row.payment_method?.replace('_', ' ')}</span>
          },
          {
            key: "paymentplan_info",
            label: "Plan / Tranche",
            render: (row) => row.paymentplan_info?.description
          },
          {
            key: "transaction_code",
            label: "Code Transaction",
            editable: true,
          },
          {
            key: "bank_info",
            label: "Banque",

            render: (row) => row.bank_info?.bank_abreviation || "N/A"
          },
          {
            key: "payment_status",
            label: "Statut",
            sortable: true,
            render: (row) => (
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${row.payment_status === 'verified' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {String(row.payment_status)}
                </span>
                {row.payment_status !== 'verified' && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="ml-2 text-xs"
                    onClick={() => handleVerifyClick(row)}
                    disabled={verifyPaymentMutation.status === 'pending'}
                  >
                    Vérifier
                  </Button>
                )}
              </div>
            )
          },
          { key: "payment_date", label: "Date",type: "date" },
          {
            key: "user_info",
            label: "Par",
            render: (row) => row.user_info?.first_name
          },
          {
            key: "description",
            label: "Description",
            editable: true,
            sortable: true,
          },
          { key: "verified_at", label: "Vérifié le" ,type: "date"},
          { key: "reception_date", label: "Reçu le" },
        ]}
      />

      <PaymentModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Nouvel Encaissement"
      />

      {/* --- Dialogs de confirmation --- */}
      <AlertDialog open={confirmStep === 'first'} onOpenChange={handleCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la vérification</AlertDialogTitle>
            <AlertDialogDescription>
              Voulez-vous vraiment vérifier le paiement de {selectedPayment?.inscription_info?.student?.first_name} {selectedPayment?.inscription_info?.student?.last_name} ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <Button onClick={handleConfirmFirst} className="ml-2">Oui, continuer</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={confirmStep === 'second'} onOpenChange={handleCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Attention ! Action irréversible</AlertDialogTitle>
            <AlertDialogDescription>
              La vérification d'un paiement est définitive. Êtes-vous sûr de vouloir continuer ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSecond}>Oui, vérifier</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
