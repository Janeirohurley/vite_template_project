export type AccountRequestStatus = 'pending' | 'under_review' | 'approved' | 'rejected';
export type DocumentStatus = 'pending' | 'accepted' | 'rejected';

export interface AccountRequestDocument {
  id: string;
  name: string;
  type: string;
  status: DocumentStatus;
  uploaded_at: string;
  url: string;
  comment?: string;
  preview_url?: string;
}

export interface AccountRequest {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  birth_date?: string;
  address?: string;
  profile_image_url?: string;
  requested_role: string;
  status: AccountRequestStatus;
  submitted_at: string;
  documents: AccountRequestDocument[];
}

export interface AccountRequestStats {
  total_requests: number;
  total_account_types: number;
  pending_review: number;
  total_documents: number;
  rejected_documents: number;
  rejected_accounts: number;
}

export interface AccountRequestListItem {
  id: string;
  full_name: string;
  requested_role: string;
  status: AccountRequestStatus;
  submitted_at: string;
  profile_image_url?: string;
}

export interface UpdateDocumentStatusData {
  status: DocumentStatus;
  comment?: string;
}

export interface ReviewAccountData {
  status: 'approved' | 'rejected';
  documents: Record<string, UpdateDocumentStatusData>;
  rejection_reason?: string;
}
