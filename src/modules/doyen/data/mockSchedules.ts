import type { Schedule, ScheduleSession } from '../types';

// Mock data pour les sessions de cours
const mockSessions: ScheduleSession[] = [
  {
    id: '1',
    schedule: 'schedule-1',
    course: 'course-1',
    course_name: 'Mathématiques Appliquées',
    teacher: 'teacher-1',
    teacher_name: 'Dr. Martin Dubois',
    day_of_week: 'Monday',
    start_time: '08:00',
    end_time: '10:00',
    room: 'room-1',
    room_name: 'Amphi A',
    session_type: 'Cours'
  },
  {
    id: '2',
    schedule: 'schedule-1',
    course: 'course-2',
    course_name: 'Programmation Java',
    teacher: 'teacher-2',
    teacher_name: 'Prof. Sarah Leroy',
    day_of_week: 'Monday',
    start_time: '10:15',
    end_time: '12:15',
    room: 'room-2',
    room_name: 'Salle Info 1',
    session_type: 'TP'
  },
  {
    id: '3',
    schedule: 'schedule-1',
    course: 'course-3',
    course_name: 'Base de Données',
    teacher: 'teacher-3',
    teacher_name: 'Dr. Ahmed Ben Ali',
    day_of_week: 'Tuesday',
    start_time: '08:00',
    end_time: '09:30',
    room: 'room-3',
    room_name: 'Salle 201',
    session_type: 'TD'
  },
  {
    id: '4',
    schedule: 'schedule-1',
    course: 'course-4',
    course_name: 'Anglais Technique',
    teacher: 'teacher-4',
    teacher_name: 'Ms. Jennifer Smith',
    day_of_week: 'Wednesday',
    start_time: '14:00',
    end_time: '15:30',
    room: 'room-4',
    room_name: 'Salle 105',
    session_type: 'Cours'
  },
  {
    id: '5',
    schedule: 'schedule-1',
    course: 'course-5',
    course_name: 'Systèmes d\'Exploitation',
    teacher: 'teacher-5',
    teacher_name: 'Prof. Michel Rousseau',
    day_of_week: 'Thursday',
    start_time: '09:00',
    end_time: '11:00',
    room: 'room-5',
    room_name: 'Lab Système',
    session_type: 'TP'
  },
  {
    id: '6',
    schedule: 'schedule-1',
    course: 'course-6',
    course_name: 'Réseaux Informatiques',
    teacher: 'teacher-6',
    teacher_name: 'Dr. Fatima Zahra',
    day_of_week: 'Friday',
    start_time: '08:00',
    end_time: '10:00',
    room: 'room-6',
    room_name: 'Salle Réseau',
    session_type: 'Cours'
  }
];

// Sessions pour L2 Informatique
const mockSessionsL2: ScheduleSession[] = [
  {
    id: '7',
    schedule: 'schedule-2',
    course: 'course-7',
    course_name: 'Algorithmes Avancés',
    teacher: 'teacher-7',
    teacher_name: 'Prof. Jean-Pierre Moreau',
    day_of_week: 'Monday',
    start_time: '08:00',
    end_time: '10:00',
    room: 'room-7',
    room_name: 'Amphi B',
    session_type: 'Cours'
  },
  {
    id: '8',
    schedule: 'schedule-2',
    course: 'course-8',
    course_name: 'Développement Web',
    teacher: 'teacher-8',
    teacher_name: 'Mme. Claire Dupont',
    day_of_week: 'Tuesday',
    start_time: '14:00',
    end_time: '17:00',
    room: 'room-8',
    room_name: 'Salle Web',
    session_type: 'TP'
  },
  {
    id: '9',
    schedule: 'schedule-2',
    course: 'course-9',
    course_name: 'Génie Logiciel',
    teacher: 'teacher-9',
    teacher_name: 'Dr. Hassan Alami',
    day_of_week: 'Wednesday',
    start_time: '10:00',
    end_time: '12:00',
    room: 'room-9',
    room_name: 'Salle 301',
    session_type: 'TD'
  }
];

// Sessions pour L3 Informatique
const mockSessionsL3: ScheduleSession[] = [
  {
    id: '10',
    schedule: 'schedule-3',
    course: 'course-10',
    course_name: 'Intelligence Artificielle',
    teacher: 'teacher-10',
    teacher_name: 'Prof. Youssef Bennani',
    day_of_week: 'Monday',
    start_time: '14:00',
    end_time: '16:00',
    room: 'room-10',
    room_name: 'Lab IA',
    session_type: 'Cours'
  },
  {
    id: '11',
    schedule: 'schedule-3',
    course: 'course-11',
    course_name: 'Sécurité Informatique',
    teacher: 'teacher-11',
    teacher_name: 'Dr. Nadia Cherkaoui',
    day_of_week: 'Thursday',
    start_time: '08:00',
    end_time: '11:00',
    room: 'room-11',
    room_name: 'Lab Sécurité',
    session_type: 'TP'
  }
];

// Mock data pour les emplois du temps
export const mockSchedules: Schedule[] = [
  {
    id: 'schedule-1',
    academic_year: '2024-2025',
    class_fk: 'class-1',
    class_name: 'L1 Informatique',
    week_number: 1,
    is_published: true,
    created_at: '2024-01-15T08:00:00Z',
    updated_at: '2024-01-15T10:30:00Z',
    sessions: mockSessions
  },
  {
    id: 'schedule-2',
    academic_year: '2024-2025',
    class_fk: 'class-2',
    class_name: 'L2 Informatique',
    week_number: 1,
    is_published: false,
    created_at: '2024-01-16T09:00:00Z',
    updated_at: '2024-01-16T11:15:00Z',
    sessions: mockSessionsL2
  },
  {
    id: 'schedule-3',
    academic_year: '2024-2025',
    class_fk: 'class-3',
    class_name: 'L3 Informatique',
    week_number: 2,
    is_published: true,
    created_at: '2024-01-17T07:30:00Z',
    updated_at: '2024-01-17T14:20:00Z',
    sessions: mockSessionsL3
  },
  {
    id: 'schedule-4',
    academic_year: '2024-2025',
    class_fk: 'class-1',
    class_name: 'L1 Informatique',
    week_number: 2,
    is_published: false,
    created_at: '2024-01-18T08:45:00Z',
    updated_at: '2024-01-18T16:10:00Z',
    sessions: [
      {
        id: '12',
        schedule: 'schedule-4',
        course: 'course-12',
        course_name: 'Examen Mathématiques',
        teacher: 'teacher-1',
        teacher_name: 'Dr. Martin Dubois',
        day_of_week: 'Friday',
        start_time: '08:00',
        end_time: '10:00',
        room: 'room-12',
        room_name: 'Amphi Principal',
        session_type: 'Examen'
      }
    ]
  },
  {
    id: 'schedule-5',
    academic_year: '2024-2025',
    class_fk: 'class-4',
    class_name: 'M1 Informatique',
    week_number: 1,
    is_published: true,
    created_at: '2024-01-19T10:00:00Z',
    updated_at: '2024-01-19T15:45:00Z',
    sessions: [
      {
        id: '13',
        schedule: 'schedule-5',
        course: 'course-13',
        course_name: 'Machine Learning',
        teacher: 'teacher-12',
        teacher_name: 'Prof. Rachid Alaoui',
        day_of_week: 'Monday',
        start_time: '09:00',
        end_time: '12:00',
        room: 'room-13',
        room_name: 'Lab ML',
        session_type: 'TP'
      },
      {
        id: '14',
        schedule: 'schedule-5',
        course: 'course-14',
        course_name: 'Architecture Distribuée',
        teacher: 'teacher-13',
        teacher_name: 'Dr. Laila Benali',
        day_of_week: 'Wednesday',
        start_time: '14:00',
        end_time: '17:00',
        room: 'room-14',
        room_name: 'Salle Serveurs',
        session_type: 'TD'
      }
    ]
  }
];

// Fonction pour simuler une API
export const getSchedulesApi = (params?: { 
  academic_year?: string; 
  class_fk?: string; 
  is_published?: boolean;
  week_number?: number;
}) => {
  let filteredSchedules = [...mockSchedules];
  
  if (params?.academic_year) {
    filteredSchedules = filteredSchedules.filter(s => s.academic_year === params.academic_year);
  }
  
  if (params?.class_fk) {
    filteredSchedules = filteredSchedules.filter(s => s.class_fk === params.class_fk);
  }
  
  if (params?.is_published !== undefined) {
    filteredSchedules = filteredSchedules.filter(s => s.is_published === params.is_published);
  }
  
  if (params?.week_number) {
    filteredSchedules = filteredSchedules.filter(s => s.week_number === params.week_number);
  }
  
  return Promise.resolve({
    results: filteredSchedules,
    count: filteredSchedules.length,
    next: null,
    previous: null
  });
};