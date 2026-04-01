import { useMemo } from 'react';
import { Link } from '@tanstack/react-router';
import {
  User,
  HelpCircle,
  FileText,
  Clock,
  CheckCircle,
  Search,
  XCircle,
  AlertCircle,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  StatusBanner,
  WelcomeCard,
  ProgressTracker,
  ProfileCompletionCard,
  PermissionsList,
  ActionCard,
  WaitingAnimation,
  NotificationPopover,
} from '../components';
import {
  GUEST_MESSAGES,
  GUEST_STATUS_CONFIG,
} from '../constants';
import {
  useGuestProfile,
  useGuestStatus,
  useGuestNotifications,
  useGuestDocuments,
  useProfileCompletion,
} from '../hooks';
import { useGuestStore } from '../store';
import GuestDashboardSkeleton from '../components/shimmer/GuestDashboardSkeleton';

export function GuestDashboard() {
  const { user, isLoading: isLoadingProfile, refetch: refetchProfile } = useGuestProfile();

  const { status, isLoading: isLoadingStatus, checkStatus } = useGuestStatus();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    getActionRequired,
  } = useGuestNotifications();
  const {
    documents,
    documentRequirements,
    getMissingDocuments,
    getRejectedDocuments,
  } = useGuestDocuments();
  const { completion, missingFields, isComplete } = useProfileCompletion();
  const { isProfileSubmitted ,stats} = useGuestStore();


  // Calculer les étapes de progression dynamiquement
 

  // Calculer l'étape actuelle
  const currentStep = useMemo(() => {
    if (user?.progress_steps) {
      const currentIndex = user?.progress_steps.findIndex(step => step.current);
      return currentIndex !== -1 ? currentIndex + 1 : user?.progress_steps.filter(s => s.completed).length + 1;
    }
  }, [user?.progress_steps]);

  // Actions requises
  const actionRequired = getActionRequired();
  const rejectedDocs = getRejectedDocuments();
  const missingDocs = getMissingDocuments();

  // Icône de statut
  const StatusIcon = useMemo(() => {
    switch (status) {
      case 'pending':
        return Clock;
      case 'under_review':
        return Search;
      case 'approved':
        return CheckCircle;
      case 'rejected':
        return XCircle;
      default:
        return Clock;
    }
  }, [status]);

  // Nom du rôle demandé - afficher directement le nom du rôle depuis le backend
  const requestedRoleName = user?.requested_role || 'Non défini';

  const isLoading = isLoadingProfile || isLoadingStatus

  if (isLoading) {
    return (
      <GuestDashboardSkeleton />
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* En-tête avec notification popover */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Bonjour, {user?.first_name || 'Utilisateur'} 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Bienvenue sur votre espace personnel UMS
          </p>
        </div>
        <NotificationPopover
          notifications={notifications}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
        />
      </div>

      {/* Bannière de statut */}
      <StatusBanner status={status} />

      {/* Alerte pour actions requises */}
      {(actionRequired.length > 0 || rejectedDocs.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 dark:text-red-400">Action requise</h3>
              {rejectedDocs.length > 0 && (
                <p className="text-red-700 dark:text-red-500 text-sm mt-1">
                  {rejectedDocs.length} document(s) ont été refusés. Veuillez les corriger.
                </p>
              )}
              {actionRequired.map((notif) => (
                <p key={notif.id} className="text-red-700 dark:text-red-500 text-sm mt-1">
                  {notif.message}
                </p>
              ))}
              <Link
                to="/guest/profile"
                className="inline-flex items-center gap-1 text-red-700 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 font-medium text-sm mt-2"
              >
                Corriger maintenant
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* Carte de bienvenue */}
      <WelcomeCard />

      {/* Grille principale */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {/* État du profil */}
          <ProfileCompletionCard
            completionPercentage={completion}
            onComplete={() => { }}
          />

          {/* Informations sur le rôle demandé */}
          {user?.requested_role && user.requested_role !== 'guest' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Rôle demandé</h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium">{requestedRoleName}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <span className="text-gray-500 dark:text-gray-400">Documents requis :</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {documents.length} / {documentRequirements.filter(d => d.required).length}
                </span>
              </div>
            </motion.div>
          )}

          {/* Animation d'attente si profil soumis */}
          {isProfileSubmitted && status !== 'approved' && status !== 'rejected' && (
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
              <WaitingAnimation />
            </div>
          )}

          {/* Conseils pendant l'attente */}
          {!isComplete && (
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Complétez votre dossier
              </h3>
              {missingFields.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Éléments manquants :</p>
                  <ul className="space-y-2">
                    {missingFields.slice(0, 5).map((field, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs">
                          !
                        </span>
                        <span className="text-gray-700 dark:text-gray-300">{field}</span>
                      </li>
                    ))}
                    {missingFields.length > 5 && (
                      <li className="text-gray-500 dark:text-gray-400 text-sm pl-7">
                        Et {missingFields.length - 5} autre(s)...
                      </li>
                    )}
                  </ul>
                </div>
              )}
              {missingDocs.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Documents à fournir :</p>
                  <ul className="space-y-2">
                    {missingDocs.map((doc) => (
                      <li key={doc.type} className="flex items-center gap-2 text-sm">
                        <FileText className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        <span className="text-gray-700 dark:text-gray-300">{doc.label}</span>
                        {doc.required && (
                          <span className="text-xs text-red-500">*</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Message de succès si approuvé */}
          {status === 'approved' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center"
            >
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-400">
                {GUEST_MESSAGES.approved.title}
              </h3>
              <p className="text-green-700 dark:text-green-500 mt-2">
                {GUEST_MESSAGES.approved.description}
              </p>
            </motion.div>
          )}

          {/* Actions rapides */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Link to="/guest/profile">
              <ActionCard
                title="Compléter mon profil"
                description={
                  completion < 100
                    ? `${100 - completion}% restant à compléter`
                    : 'Votre profil est complet'
                }
                icon={<User className="w-5 h-5" />}
                onClick={() => { }}
                variant={completion < 100 ? 'primary' : 'default'}
              />
            </Link>

            <Link to="/guest/profile">
              <ActionCard
                title="Documents requis"
                description={
                  missingDocs.length > 0
                    ? `${missingDocs.length} document(s) manquant(s)`
                    : 'Tous les documents sont fournis'
                }
                icon={<FileText className="w-5 h-5" />}
                onClick={() => { }}
                variant={missingDocs.length > 0 ? 'warning' : 'default'}
              />
            </Link>

            <ActionCard
              title="Actualiser le statut"
              description="Vérifier les mises à jour"
              icon={<RefreshCw className="w-5 h-5" />}
              onClick={() => {
                checkStatus();
                refetchProfile();
              }}
            />

            <ActionCard
              title="Besoin d'aide ?"
              description="Contactez notre support"
              icon={<HelpCircle className="w-5 h-5" />}
              onClick={() => {
                window.open('mailto:support@ums.edu', '_blank');
              }}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Statut actuel */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Statut de votre compte
            </h3>
            <div className={`flex items-center gap-3 p-3 rounded-lg ${GUEST_STATUS_CONFIG[status].bgColor}`}>
              <StatusIcon className={`w-5 h-5 ${GUEST_STATUS_CONFIG[status].textColor}`} />
              <div>
                <p className={`font-medium ${GUEST_STATUS_CONFIG[status].textColor}`}>
                  {GUEST_STATUS_CONFIG[status].label}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                  {GUEST_STATUS_CONFIG[status].description}
                </p>
              </div>
            </div>
          </div>

          {/* Progression */}
          <ProgressTracker
            steps={user?.progress_steps || []}
            currentStep={currentStep}
          />

          {/* Statistiques du dossier */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Résumé du dossier
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400 text-sm">Profil</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{completion}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400 text-sm">Documents</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {stats?.documents_uploaded} / {stats?.documents_required}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400 text-sm">Notifications</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{unreadCount} non lue(s)</span>
              </div>
            </div>
          </div>

          {/* Permissions */}
          <PermissionsList />
        </div>
      </div>
    </div>
  );
}
