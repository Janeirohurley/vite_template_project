
import { StatsCard } from '../components';
import {
  Calendar,
  BookOpen,
  Users,
  TrendingUp,
  CheckCircle,
  Award,
  Handshake,
  GraduationCap,
  NotebookPen,
  Activity
} from 'lucide-react';
import { QuickActionCard } from '@/components/ui/QuickActionCard';
import { useNavigate } from '@tanstack/react-router';
import { useGetStateDean } from '../hooks';
import StatsGridLoader from '@/components/ui/StatsGridLoader';
import type { StatsCardProps } from '@/components/ui/StatsCard';
import { useAppStore } from '@/lib';
import { ErrorDisplay } from '@/components/ErrorDisplay';

export function DashboardPage() {
  const navigate = useNavigate();
  const { selectedAcademicYear } = useAppStore();
  const { data: deanSats, isPending: statsPending, error } = useGetStateDean({ academic_year_id: selectedAcademicYear?.id })

  if (error) {
    return (
      <ErrorDisplay
        title="Erreur de chargement des données"
        message={error.message}
        showBackButton={false}
        fullScreen={true}
      />
    );
  }
  const dashboardStats: StatsCardProps[] = [
    {
      label: 'Emplois du Temps',
      value: deanSats?.total_timetables as string,
      change: `${deanSats?.published_timetables} publiés, ${deanSats?.pending_timetables} en attente`,
      icon: Calendar,
      color: 'blue' as const
    },
    {
      label: 'Cours Actifs',
      value: deanSats?.active_courses as string,
      change: `${deanSats?.total_workload_hours}/${deanSats?.assigned_workload_hours} Heures termine`,
      icon: BookOpen,
      color: 'emerald' as const
    },
    {
      label: 'Enseignants',
      value: deanSats?.total_teachers as string,
      change: `${deanSats?.permanent_teachers} permanents, ${deanSats?.visiting_teachers} visiteurs`,
      icon: Users,
      color: 'purple' as const
    },
    // {
    //   label: 'Cours à Jour',
    //   value: onTrackCourses,
    //   change: `${delayedCourses} en retard`,
    //   icon: CheckCircle,
    //   color: 'indigo' as const
    // },
    {
      label: 'Cours Attribues',
      value: deanSats?.total_attributions as string,
      change: `${deanSats?.accepted_attributions}/${deanSats?.pending_attributions} Cours acceptes`,
      icon: Handshake,
      color: 'red' as const
    },
    {
      label: 'Etudiants',
      value: deanSats?.total_students as string,
      icon: GraduationCap,
      change: "Dans votre Facutlte",
      color: 'purple' as const
    },
    {
      label: 'Notes en attente',
      value: deanSats?.pending_secretary_notes as string,
      icon: NotebookPen,
      change: "Pour votre secraitaire",
      color: 'red' as const
    },
    {
      label: 'Progression',
      value: deanSats?.teaching_progress_avg as string,
      icon: Activity,
      change: "Dans votre Facutlte",
      color: 'purple' as const
    },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Statistique </h3>
      <StatsGridLoader
        isPending={statsPending}
        data={dashboardStats ?? []} // évite les erreurs si undefined
        renderItem={(stat, index) => (
          <StatsCard
            key={stat.label} // tu peux garder ta clé ici si tu veux
            {...stat}
            delay={index * 0.1}
          />
        )}
      />


      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Actions Rapides</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <QuickActionCard
            title="Créer Emploi du Temps"
            icon={Calendar}
            color="blue"
            onClick={() => navigate({ to: '/dean/schedules' })}
          />
          <QuickActionCard
            title="Gérer Cours"
            icon={BookOpen}
            color="emerald"
            onClick={() => navigate({ to: '/dean/programs' })}
          />
          <QuickActionCard
            title="Gérer Enseignants"
            icon={Users}
            color="purple"
            onClick={() => navigate({ to: '/dean/teachers' })}
          />
          <QuickActionCard
            title="Suivi Progression"
            icon={TrendingUp}
            color="indigo"
            onClick={() => navigate({ to: '/dean/progress' })}
          />
          <QuickActionCard
            title="Résultats Académiques"
            icon={Award}
            color="pink"
            onClick={() => navigate({ to: '/dean/results' })}
          />
          <QuickActionCard
            title="Délibérations"
            icon={CheckCircle}
            color="orange"
            onClick={() => navigate({ to: '/dean/deliberations' })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Alertes</h3>
          {/* <div className="space-y-3">
            {delayedCourses > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-900 dark:text-red-100">
                      {delayedCourses} cours en retard
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                      Action requise
                    </p>
                  </div>
                </div>
              </div>
            )}

            {schedules.length - publishedSchedules > 0 && (
              <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                  <div>
                    <p className="font-semibold text-orange-900 dark:text-orange-100">
                      {schedules.length - publishedSchedules} emploi(s) du temps non publié(s)
                    </p>
                    <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                      En attente de publication
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
}
