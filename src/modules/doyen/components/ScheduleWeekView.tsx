import type { Schedule } from '../types';

interface ScheduleWeekViewProps {
  schedule: Schedule | null;
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const dayLabels: Record<string, string> = {
  Monday: 'Lundi',
  Tuesday: 'Mardi',
  Wednesday: 'Mercredi',
  Thursday: 'Jeudi',
  Friday: 'Vendredi',
  Saturday: 'Samedi',
};

const sessionTypeColors: Record<string, string> = {
  Cours: 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700',
  TD: 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700',
  TP: 'bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700',
  Examen: 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700',
};

export function ScheduleWeekView({ schedule }: ScheduleWeekViewProps) {
  if (!schedule) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">Aucun emploi du temps sélectionné</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 border-b dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {schedule.class_name} - Semaine {schedule.week_number}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {schedule.is_published ? 'Publié' : 'Brouillon'}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Jour
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Horaire
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Cours
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Enseignant
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Salle
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Type
              </th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-700">
            {daysOfWeek.map((day) => {
              const daySessions = schedule.sessions
                .filter((s) => s.day_of_week === day)
                .sort((a, b) => a.start_time.localeCompare(b.start_time));

              if (daySessions.length === 0) {
                return (
                  <tr key={day} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                      {dayLabels[day]}
                    </td>
                    <td colSpan={5} className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 ">
                      Pas de cours
                    </td>
                  </tr>
                );
              }

              return daySessions.map((session, idx) => (
                <tr key={session.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  {idx === 0 && (
                    <td
                      rowSpan={daySessions.length}
                      className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white align-top"
                    >
                      {dayLabels[day]}
                    </td>
                  )}
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {session.start_time} - {session.end_time}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-medium">
                    {session.course_name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {session.teacher_name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {session.room_name}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold border ${
                        sessionTypeColors[session.session_type] || 'bg-gray-100 dark:bg-gray-700'
                      }`}
                    >
                      {session.session_type}
                    </span>
                  </td>
                </tr>
              ));
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
