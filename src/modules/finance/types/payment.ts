export type PaymentMethod = 'bank_deposit' | 'bank_transfert' | 'bank_check' | 'mobile_money' | 'other';
export type PaymentStatus = 'verified' | 'unverified' | 'rejected';

export interface Payment {
    id: string;
    amount_paid: string;
    payment_date: string;
    reception_date: string | null;
    payment_method: PaymentMethod; // Utilise ton type
    transaction_code: string;
    description: string | null;
    remittance_slip: string | null;
    payment_status: PaymentStatus; // Utilise ton type

    // Identifiants (UUID)
    user: string;
    verified_by: string | null;
    verified_at: string | null;

    // Objets de détails (Nested objects du JSON)
    paymentplan_info: PaymentPlanInfo;
    bank_info: BankInfo | null;
    inscription_info: InscriptionInfo;
    user_info: UserInfo;
    verified_by_info: UserInfo | null;
}

// --- Détails des objets imbriqués ---

interface PaymentPlanInfo {
    id: string;
    description: string;
    total_amount: number;
    monthly_amount: number;
    start_date: string;
    end_date: string;
    status: 'active' | 'inactive';
    wording_name: string;
}

export interface BankInfo {
    id: string;
    bank_name: string;
    bank_abreviation: string;
    account_number: string;
    status: string;
}

interface UserInfo {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
}

interface InscriptionInfo {
    id: string;
    regist_status: string;
    date_inscription: string;
    student: {
        id: string;
        matricule: string;
        first_name: string;
        last_name: string;
        email: string;
    };
    class_fk: {
        id: string;
        class_name: string;
        department: string;
    };
    academic_year: {
        id: string;
        academic_year: string;
    };
}
