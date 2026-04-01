export interface JurySession {
  id: string;
  session_name: string;
  session_date: string;
  class_group: string;
  class_group_name: string;
  class_name: string;
  jury_members: JuryMember[];
  status: 'scheduled' | 'in_progress' | 'completed';
  minutes_document: string | null;
  created_by: string;
  created_at: string;
}

export interface JuryMember {
  id: string;
  teacher_id: string;
  teacher_name: string;
  role: 'Président' | 'Membre' | 'Secrétaire';
}

export interface JuryDecision {
  id: string;
  jury_session: string;
  student_id: string;
  student_matricule: string;
  student_name: string;
  average_score: number;
  total_credits_obtained: number;
  decision: 'Admis' | 'Ajourné' | 'Redoublement';
  remarks: string;
  created_at: string;
}

export interface GradeComplaint {
  id: string;
  student_id: string;
  student_matricule: string;
  student_name: string;
  course_id: string;
  course_name: string;
  academic_year: string;
  complaint_date: string;
  reason: string;
  status: 'En attente' | 'Acceptée' | 'Rejetée';
  response: string;
  reviewed_by: string;
  reviewed_at: string;
}

export interface CreateJurySessionData {
  session_name: string;
  session_date: string;
  class_group: string;
  jury_members: string[];
  minutes_document?: string;
}

export interface UpdateJurySessionData extends Partial<CreateJurySessionData> {
  status?: 'scheduled' | 'in_progress' | 'completed';
}

export interface CreateJuryDecisionData {
  jury_session: string;
  student_id: string;
  average_score: number;
  total_credits_obtained: number;
  decision: 'Admis' | 'Ajourné' | 'Redoublement';
  remarks?: string;
}

export interface UpdateGradeComplaintData {
  status?: 'En attente' | 'Acceptée' | 'Rejetée';
  response?: string;
}
