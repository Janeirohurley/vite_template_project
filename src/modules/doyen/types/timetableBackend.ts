// Types pour les réponses backend optimisées

export interface TimetableWithMerges {
  id: string; // Identifiant unique de l'emploi du temps
  course_name: string; // Nom du cours (ex: "Mathématiques")
  class_name: string; // Nom de la classe (ex: "L1 Info")
  class_id: string; // ID de la classe
  class_group: string; // ID du groupe de classe
  attribution: string; // ID de l'attribution du cours à l'enseignant
  room: string; // ID de la salle
  room_name: string; // Nom de la salle (ex: "Salle A101")
  status: string; // Statut de l'emploi du temps ("Planned", "Completed", "Cancelled")
  published_date: string | null; // Date de publication (null si non publié)
  start_date: string; // Date de début de l'emploi du temps
  end_date: string; // Date de fin de l'emploi du temps
  schedule_slot: string; // ID du créneau horaire
  day_of_week: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'; // Jour de la semaine (ex: "Lundi")
  is_merged: boolean; // Indique si l'emploi du temps fait partie d'une fusion
  merges: Array<{ // Liste des fusions contenant cet emploi du temps
    id: string; // ID de la fusion
    name: string; // Nom de la fusion
  }>;
  is_shared: boolean; // Indique si l'emploi du temps est partagé avec d'autres groupes
  shared_groups: Array<{ // Liste des groupes avec lesquels l'emploi du temps est partagé
    id: string; // ID du groupe
    group_name: string; // Nom du groupe (ex: "G1")
    class_name: string; // Nom de la classe du groupe (ex: "IG I")
    department_abreviation: string; // Abréviation du département (ex: "IG")
  }>;
  created_at: string; // Date de création de l'emploi du temps
  updated_at: string; // Date de dernière modification de l'emploi du temps
}

export interface TimetableStats {
  total: number;
  drafts: number;
  published: number;
  slots: number;
}

export interface MergeValidationError {
  type: 'CLASS_MISMATCH' | 'STATUS_MISMATCH' | 'PERIOD_NO_OVERLAP' | 'SLOT_CONFLICT' | 'INSUFFICIENT_TIMETABLES';
  message: string;
  details: string[];
}

export interface MergeValidationResponse {
  valid: boolean;
  errors?: MergeValidationError[];
}

export interface MergedTimetableData {
  id: string;
  name: string;
  timetable_ids: string[];
  
  // Informations du cours (peuvent être des objets en cas de conflit)
  course_name: string | { [timetableId: string]: string };
  teacher_name: string | { [timetableId: string]: string };
  room_name: string | { [timetableId: string]: string };
  room?: string | { [timetableId: string]: string };
  attribution?: string | { [timetableId: string]: string };
  
  // Informations de la classe
  class_name: string | { [timetableId: string]: string };
  class_group_name: string | { [timetableId: string]: string };
  class_group?: string | { [timetableId: string]: string };
  
  // Dates
  start_date: string;
  end_date: string;
  
  // Statut
  status: string | { [timetableId: string]: string };
  published_date: string | null;
  
  // Informations de création
  created_by_name?: string | { [timetableId: string]: string };
  created_by?: string | { [timetableId: string]: string };
  created_date?: string;
  
  // Slots
  slots: string[];
  slot_details: Array<{
    origin: string;
    detail: {
      id: string;
      day_of_week: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
      start_time: string;
      end_time: string;
      schedule_name?: string;
      [key: string]: unknown;
    };
  }>;
  
  conflicts: Array<{
    field: string;
    valuesBySource: { [timetableId: string]: unknown };
  }>;
}

export interface MergePreviewResponse {
  merged_data: MergedTimetableData;
}

export interface CreateMergeRequest {
  name: string;
  timetable_ids: string[];
}

export interface CreateMergeResponse {
  id: string;
  name: string;
  timetable_ids: string[];
  merged_data: MergedTimetableData;
  created_at: string;
}

export interface AddToMergeRequest {
  timetable_id: string;
}

export interface AddToMergeResponse {
  success: boolean;
  merged_data?: MergedTimetableData;
  error?: MergeValidationError;
}

export interface ShareTimetableRequest {
  group_ids: string[];
}

export interface ShareTimetableResponse {
  success: boolean;
  timetable: TimetableWithMerges;
}
