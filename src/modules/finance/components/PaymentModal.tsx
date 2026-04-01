import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/Textarea";
import { SingleSelectDropdown } from "@/components/ui/SingleSelectDropdown";
import { Modal } from "@/modules/admin/components/academic";
import { notify, useAppStore } from "@/lib";
import { useBanksPayments, useCreatePayment } from "../hooks/usePayments";
import { usePaymentPlans } from "../hooks/usePaymentPlans";
import { useInscriptions } from "@/modules/student-service";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  lockedInscriptionId?: string;
  onSuccess?: () => void;
}

const initialForm = {
  paymentplan: "",
  amount_paid: 0,
  payment_method: "bank_deposit",
  bank: "",
  transaction_code: "",
  inscription: "",
  description: "",
  payment_date: new Date().toISOString().split("T")[0],
};

const paymentMethodOptions = [
  { id: "bank_deposit", label: "Dépôt Bancaire", value: "bank_deposit" },
  { id: "bank_transfert", label: "Virement Bancaire", value: "bank_transfert" },
  { id: "bank_check", label: "Chèque Bancaire", value: "bank_check" },
  { id: "mobile_money", label: "Mobile Money", value: "mobile_money" },
  { id: "other", label: "Autre", value: "other" },
];

export function PaymentModal({
  isOpen,
  onClose,
  title = "Nouvel Encaissement",
  lockedInscriptionId,
  onSuccess,
}: PaymentModalProps) {
  const [formData, setFormData] = useState(initialForm);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { selectedAcademicYear } = useAppStore();
  const { data: banks } = useBanksPayments();
  const { data: plans } = usePaymentPlans({
    academic_year_id: selectedAcademicYear?.id,
    pagination: false,
  });
  const { data: students } = useInscriptions();
  const createMutation = useCreatePayment();

  const studentOptions = students?.results.map((student) => {
    // On prépare les morceaux de texte proprement
    const matricule = student.student_matricule || "N/A";
    const firstName = student.student_first_name || "";
    const lastName = student.student_last_name || "";

    // On assemble le nom complet avec un espace
    const fullName = `${firstName} ${lastName}`.trim();

    return {
      id: student.id,
      label: `${matricule} - ${fullName || "Nom inconnu"}`,
      value: student.id,
    };
  }) || [];

  const planOptions = plans?.results.map((plan) => {
    // 1. On récupère le nom du frais (ex: Inscription, Minerval)
    const wordingName = plan.feessheet_info?.wording.wording_name || "Frais inconnu";

    // 2. On récupère la description du plan (ex: Tranche 1)
    const planDesc = plan.description || "Sans description";

    // 3. Formatage du montant (plus agréable pour l'utilisateur)
    const amount = plan.total_amount ? `${plan.total_amount} BIF` : "";

    return {
      id: plan.id,
      // Résultat : "Inscription - Tranche 1 (50000 BIF)"
      label: `${wordingName} - ${planDesc} ${amount ? `(${amount})` : ""}`.trim(),
      value: plan.id,
    };
  }) || [];

  const bankOptions =
    banks?.results.map((bank) => ({
      id: bank.id,
      label: `No: ${bank.account_number} Nom: ${bank.bank_name || "Banque"}`,
      value: bank.id,
    })) || [];

  useEffect(() => {
    if (!isOpen) return;

    setFormData({
      ...initialForm,
      inscription: lockedInscriptionId || "",
    });
    setSelectedFile(null);
  }, [isOpen, lockedInscriptionId]);

  const handleSubmit = async () => {
    if (!formData.inscription) {
      notify.error("Veuillez sélectionner une inscription");
      return;
    }

    if (!formData.paymentplan) {
      notify.error("Veuillez sélectionner un plan de paiement");
      return;
    }

    if (!formData.amount_paid || Number(formData.amount_paid) <= 0) {
      notify.error("Veuillez saisir un montant valide");
      return;
    }

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (val) payload.append(key, val.toString());
      });

      if (selectedFile) payload.append("remittance_slip", selectedFile);

      await createMutation.mutateAsync(payload);

      notify.success("Paiement enregistré avec succès");
      onSuccess?.();
      onClose();
    } catch {
      notify.error("Échec de l'enregistrement du paiement");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void handleSubmit();
        }}
        className="space-y-4 pt-4"
      >
        {!lockedInscriptionId && (
          <SingleSelectDropdown
            label="Étudiant"
            required
            options={studentOptions}
            value={formData.inscription}
            onChange={(v) => setFormData({ ...formData, inscription: v })}
          />
        )}

        <div className="grid grid-cols-2 gap-4">
          <SingleSelectDropdown
            label="Plan de Paiement"
            required
            options={planOptions}
            value={formData.paymentplan}
            onChange={(v) => setFormData({ ...formData, paymentplan: v })}
          />
          <SingleSelectDropdown
            label="Mode de Paiement"
            required
            options={paymentMethodOptions}
            value={formData.payment_method}
            onChange={(v) => setFormData({ ...formData, payment_method: v })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Montant Versé</Label>
            <Input
              type="number"
              value={formData.amount_paid}
              onChange={(e) => setFormData({ ...formData, amount_paid: Number(e.target.value) })}
              className="bg-slate-50"
            />
          </div>
          <div className="space-y-2">
            <Label>Date du versement</Label>
            <Input
              type="date"
              value={formData.payment_date}
              onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
              className="bg-slate-50"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <SingleSelectDropdown
            label="Banque"
            options={bankOptions}
            value={formData.bank}
            onChange={(v) => setFormData({ ...formData, bank: v })}
          />
          <div className="space-y-2">
            <Label>Code Transaction</Label>
            <Input
              value={formData.transaction_code}
              placeholder="TR-..."
              onChange={(e) => setFormData({ ...formData, transaction_code: e.target.value })}
              className="bg-slate-50"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Description / Commentaire</Label>
          <Textarea
            value={formData.description}
            placeholder="Détails du versement..."
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="bg-slate-50"
          />
        </div>

        <div className="space-y-2">
          <Label>Bordereau (Image/PDF)</Label>
          <Input type="file" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
        </div>

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" disabled={createMutation.isPending} className="bg-blue-600">
            {createMutation.isPending ? "Traitement..." : "Enregistrer"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
