import { useState } from 'react';
import { useCourses, useDeleteCourse } from '../hooks';
import { FilterBar } from '../components';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Edit, Trash2, BookOpen } from 'lucide-react';

export function CoursesPage() {
  const [search, setSearch] = useState('');
  const [semesterFilter, setSemesterFilter] = useState<1 | 2 | ''>('');

  const { data, isLoading } = useCourses({
    search,
    semester: semesterFilter || undefined,
  });

  const deleteCourseMutation = useDeleteCourse();

  if (isLoading) return <LoadingSpinner />;

  const courses = data?.results || [];

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
      try {
        await deleteCourseMutation.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Cours</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gérer les cours et modules
          </p>
        </div>
        <button>Add Cours</button>
      </div>

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        placeholder="Rechercher un cours..."
      >
        <select
          value={semesterFilter}
          onChange={(e) => setSemesterFilter(e.target.value as 1 | 2 | '')}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="">Tous les semestres</option>
          <option value="1">Semestre 1</option>
          <option value="2">Semestre 2</option>
        </select>
      </FilterBar>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucun cours</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Commencez par ajouter un nouveau cours.
            </p>
          </div>
        ) : (
          courses.map((course) => (
            <div
              key={course.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs font-semibold rounded">
                      {course.course_code}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Semestre {course.semester}
                    </span>
                  </div>
                  <h3 className="mt-2 font-semibold text-gray-900 dark:text-white">
                    {course.course_name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {course.module_name}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Crédits</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {course.credits} ECTS
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Heures/Semaine</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {course.hours_per_week}h
                  </p>
                </div>
              </div>

              {course.teacher_name && (
                <div className="mt-4 pt-4 border-t dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Enseignant</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {course.teacher_name}
                  </p>
                </div>
              )}

              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => {}}
                  className="flex-1 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 transition text-sm font-medium"
                >
                  <Edit size={14} className="inline mr-1" />
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(course.id)}
                  className="px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition text-sm font-medium"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
