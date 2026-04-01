import { useInscriptions, useStudentServiceStats } from '../hooks/useStudentService';
import { QuickActionCard } from '@/components/ui/QuickActionCard';
import { Users, FileText, CheckCircle, Clock, Gift, Activity, AlertTriangle, UserCheck, MessageSquare, RefreshCw, ArrowLeft, UserMinus, XCircle, PlusCircle, Calendar, RefreshCcw, Play } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import StatsGridLoader from '@/components/ui/StatsGridLoader';
import { StatsCard } from '@/modules/doyen';
import type { StatsCardProps } from '@/components/ui/StatsCard';
import { useAppStore } from '@/lib';
import TableLoadingSkeleton from '../components/TableLoadingSkeleton';
import { UserAvatar } from '@/components/common/UserAvatar';
import CollapsibleComponent from '@/components/ui/CollapsibleComponent';

export function DashboardPage() {
  const navigate = useNavigate();
  const { selectedAcademicYear } = useAppStore();
  const nav = () => navigate({ to: '/student-service/inscriptions' });

  const { data: inscriptionsData, isLoading: inscLoading } = useInscriptions({ academic_year_id: selectedAcademicYear?.id, page_size: 5 });


  // get stats from inscriptions and students
  const { data: statsData, isLoading: statsLoading } = useStudentServiceStats({ academic_year_id: selectedAcademicYear?.id });


  const inscriptions = inscriptionsData?.results || [];
  const generalStats: StatsCardProps[] = [
    {
      label: 'Total Étudiants',
      value: statsData?.total_students || 0,
      icon: Users,
      color: 'blue',
      change: 'Inscrits au total'
    },
    {
      label: 'Documents',
      value: statsData?.pending_documents || 0,
      icon: FileText,
      color: 'purple',
      change: 'En attente'
    },
    {
      label: 'Absences',
      value: statsData?.pending_absences || 0,
      icon: Clock,
      color: 'red',
      change: 'À justifier'
    },
    {
      label: 'Bourses',
      value: statsData?.active_scholarships || 0,
      icon: Gift,
      color: 'indigo',
      change: 'Bénéficiaires'
    },
  ];

  const inscriptionStats: StatsCardProps[] = [
    {
      label: 'Total Flux',
      value: statsData?.inscriptions_total || 0,
      icon: Activity,
      color: 'cyan',
      change: 'Toutes catégories'
    },
    {
      label: 'Actives',
      value: statsData?.inscriptions_active || 0,
      icon: CheckCircle,
      color: 'emerald',
      change: 'Inscriptions validées'
    },
    {
      label: 'En Attente',
      value: statsData?.inscriptions_pending || 0,
      icon: AlertTriangle,
      color: 'orange',
      change: 'Dossiers incomplets'
    },
    {
      label: 'Suspendues',
      value: statsData?.inscriptions_suspended || 0,
      icon: RefreshCw,
      color: 'yellow',
      change: 'En pause'
    },
  ];

  const miniStats: StatsCardProps[] = [
    {
      label: 'Complétées',
      value: statsData?.inscriptions_completed || 0,
      icon: CheckCircle,
      color: 'green',
      change: 'Avances sans complement' // Signifie la réussite du processus
    },
    {
      label: 'Abandonnées',
      value: statsData?.inscriptions_withdrawn || 0,
      icon: ArrowLeft,
      color: 'indigo',
      change: 'N\'a pas termine son annee academique' // Contexte administratif
    },
    {
      label: 'Refusées',
      value: statsData?.inscriptions_dropped || 0,
      icon: UserMinus,
      color: 'orange',  
      change: 'Inscriptions refusées' // Précision temporelle
    },
    {
      label: 'Annulées',
      value: statsData?.inscriptions_canceled || 0,
      icon: XCircle,  
      color: 'red',
      change: 'Dossiers rejetés' // Clarification du statut
    },
    {
      label: 'Reorientations',
      value: statsData?.inscriptions_replaced || 0,
      icon: RefreshCcw,
      color: 'blue',
      change: 'Mises à jour' // Signifie un changement de programme/filière
    },
    {
      label: 'Compléments',
      value: statsData?.inscriptions_complement || 0,
      icon: PlusCircle,
      color: 'teal',
      change: 'Unités ajoutées' // Contexte pédagogique
    },
    {
      label: 'Sessions',
      value: statsData?.upcoming_sessions || 0,
      icon: Calendar,
      color: 'purple',
      change: 'À venir' // Notions de futur
    },
    {
      label: 'Activités',
      value: statsData?.active_activities || 0,
      icon: Play,
      color: 'pink',
      change: 'En cours' // État actuel
    },
  ];
  return (

    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Tableau de Bord
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Service des Étudiants - Vue d'ensemble
        </p>
      </div>

      <StatsGridLoader
        isPending={statsLoading}
        data={generalStats ?? []} // évite les erreurs si undefined
        renderItem={(stat, index) => (
          <StatsCard
            key={stat.label} // tu peux garder ta clé ici si tu veux
            {...stat}
            delay={index * 0.1}
          />
        )}
      />
      <CollapsibleComponent
        title='Statistique pour inscriptions'
        className='p-2'
        defaultCollapsed
      >
        <StatsGridLoader
          isPending={statsLoading}
          data={inscriptionStats ?? []} // évite les erreurs si undefined
          renderItem={(stat, index) => (
            <StatsCard
              key={stat.label} // tu peux garder ta clé ici si tu veux
              {...stat}
              delay={index * 0.1}
            />
          )}
        />
      </CollapsibleComponent>

      <CollapsibleComponent
        title='Statistique pour mini'
        className='p-2'
        defaultCollapsed
      >
        <StatsGridLoader
          isPending={statsLoading}
          data={miniStats ?? []} // évite les erreurs si undefined
          renderItem={(stat, index) => (
            <StatsCard
              key={stat.label} // tu peux garder ta clé ici si tu veux
              {...stat}
              delay={index * 0.1}
            />
          )}
        />
      </CollapsibleComponent>

      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Actions Rapides</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <QuickActionCard
            title="Nouvelle Inscription"
            icon={UserCheck}
            color="blue"
            onClick={() => navigate({ to: '/student-service/inscriptions' })}
          />
          <QuickActionCard
            title="Traiter Documents"
            icon={FileText}
            color="purple"
            onClick={() => navigate({ to: '/student-service/absences' })}
          />
          <QuickActionCard
            title="Gérer Absences"
            icon={Clock}
            color="red"
            onClick={() => navigate({ to: '/student-service/scholarships' })}
          />
          <QuickActionCard
            title="Bourses"
            icon={Gift}
            color="emerald"
            onClick={() => navigate({ to: '/student-service/activities' })}
          />
          <QuickActionCard
            title="Activités"
            icon={Activity}
            color="indigo"
            onClick={() => navigate({ to: '/student-service/clubs' })}
          />
          <QuickActionCard
            title="Orientation"
            icon={MessageSquare}
            color="orange"
            onClick={() => navigate({ to: '/student-service/orientation' })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* <div className="col-span-1">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Alertes</h3>
          <div className="space-y-3">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-900 dark:text-red-100">5 étudiants dépassent le seuil d'absence</p>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">Action requise</p>
                </div>
              </div>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                <div>
                  <p className="font-semibold text-orange-900 dark:text-orange-100">24 demandes de documents en attente</p>
                  <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">À traiter</p>
                </div>
              </div>
            </div>
          </div>
        </div> */}
        {
          inscLoading ?? <TableLoadingSkeleton rows={10} columns={5} />
        }
        <div className="col-span-3">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Inscriptions Récentes
            </h3>
            <button onClick={nav} className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
              Voir tout
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-50/50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Étudiant
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Matricule
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {inscriptions.map((insc) => (
                    <tr
                      key={insc.id}
                      className="hover:bg-gray-50/80 dark:hover:bg-gray-700/40 transition-colors duration-200"
                    >
                      {/* Colonne Étudiant avec Avatar */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <UserAvatar size='md' fullName={insc.student_first_name.concat(insc.student_last_name)} />
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                            {insc.student_first_name}
                          </span>
                        </div>
                      </td>

                      {/* Matricule avec style Code */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 rounded">
                          {insc.student_matricule}
                        </span>
                      </td>

                      {/* Statut avec Badge Moderne */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold ring-1 ring-inset ${insc.regist_status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20'
                            : 'bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/20'
                            }`}
                        >
                          <span className={`mr-1.5 h-1.5 w-1.5 rounded-md ${insc.regist_status === 'Active' ? 'bg-emerald-600' : 'bg-rose-600'
                            }`} />
                          {insc.regist_status}
                        </span>
                      </td>

                      {/* Date formatée */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(insc.date_inscription).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}
