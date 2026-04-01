export interface TimeSlot {
  id: string;
  day: string;
  date: string;
  timeRange: string;
  classroomId: string;
}

export interface Classroom {
  id: string;
  name: string;
  room: string;
}

export interface Room {
  id: string;
  name: string;
  color: string;
}

export interface Event {
  id: string;
  title: string;
  type: 'event' | 'exam' | 'course';
  icon: string;
  timeSlotId: string;
  classroomId: string;
  room?: string;
  duration?: string;
  startTime?: string;
  courseId?: string;
  instructor?: string;
  breakConfig?: string;
  repeatType?: 'single' | 'weekly' | 'specific';
  specificDays?: string[];
}

export interface TimetableData {
  classrooms: Classroom[];
  timeSlots: TimeSlot[];
  events: Event[];
}

export interface Course {
  id: string;
  name: string;
  color: string;
}

export const EVENT_TYPES = {
  event: { color: 'bg-blue-500', label: 'Événement' },
  exam: { color: 'bg-red-500', label: 'Examen' },
  course: { color: 'bg-green-500', label: 'Cours' }
} as const;