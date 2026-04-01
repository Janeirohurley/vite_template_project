export type FinanceOverview = {
  academic_year: { id: string; label: string } | null;
  kpis: {
    total_expected: number;
    total_collected: number;
    outstanding: number;
    recovery_rate: number;
    overdue_installments_count: number;
    pending_payments_amount: number;
    verified_payments_count: number;
    unverified_payments_count: number;
  };
  trends: {
    period?: "daily" | "weekly" | "monthly";
    monthly_collections: { month: string; amount: number }[];
    monthly_expected: { month: string; amount: number }[];
    monthly_summary: {
      month: string;
      expected: number;
      collected: number;
      outstanding: number;
      recovery_rate: number;
    }[];
    monthly_outstanding: { month: string; amount: number }[];
    monthly_recovery_rate: { month: string; rate: number }[];
    cumulative_collections: {
      month: string;
      expected: number;
      collected: number;
      outstanding: number;
    }[];
  };
  breakdowns: {
    by_faculty: {
      id: string;
      name: string;
      expected: number;
      collected: number;
      outstanding: number;
      recovery_rate: number;
    }[];
    by_payment_method: { method: string; amount: number }[];
  };
  recent_payments: {
    id: string;
    student_name: string;
    matricule: string;
    amount: number;
    method: string;
    date: string;
    status: string;
  }[];
  assets: {
    buildings_count: number;
    rooms_count: number;
    rooms_available_count: number;
    rooms_by_type: { type: string; count: number }[];
    equipment_total: number;
    equipment_by_status: { status: string; count: number }[];
    equipment_under_maintenance_count: number;
    equipment_allocations_active_count: number;
  };
};
