// types/finance.ts

/** * Représente le statut de paiement d'une tranche 
 */
export type PaymentStatus = 'pending' | 'partially_paid' | 'paid' | 'overdue';

export interface StudentInfo {
  id: string;
  name: string;
  matricule: string;
  photo_uri?: string; // Optionnel : utile pour l'UI
}

export interface AcademicContext {
  id: string; // ID de l'inscription ou de la classe
  name: string; // Nom de la classe (ex: Bac 1)
  department: string;
  faculty?: string;
}

export interface FinancialDetail {
  amount: number;            // Montant théorique de la tranche
  paid_amount: number;       // Ce qui a été réellement versé
  remaining_amount: number;  // Solde restant
  completion_percentage: number; 
  currency: string;          // Toujours préciser la devise (ex: "BIF")
}

export interface PaymentPlanInfo {
  id: string;
  total_plan_amount: number; // Montant global du barème
  description: string;
  wording: string;           // Libellé (ex: "Frais d'inscription")
  end_date: string;          // Format ISO 8601
}

export interface PaymentInstallement {
  id: string;
  student: StudentInfo;
  class_info: AcademicContext;
  payment_plan: PaymentPlanInfo;
  financial_info: FinancialDetail;
  
  status_info: {
    status: PaymentStatus;
    status_display: string;   // Label traduit (ex: "En retard")
    is_overdue: boolean;      // Flag calculé par le backend pour l'UI
  };

  dates: {
    due_date: string;         // Date d'échéance
    last_payment_date?: string; // Date du dernier versement reçu
  };

  metadata?: {
    created_at: string;
    updated_at: string;
  };
}

/**
 * Type utilitaire pour la vue consolidée par étudiant
 */
export interface ConsolidatedStudentProgress {
  id: string; // Student ID
  student: StudentInfo;
  total_due: number;
  total_paid: number;
  remaining: number;
  progress_percentage: number;
  installments: PaymentInstallement[]; // Liste des tranches liées
  global_status: PaymentStatus;
}