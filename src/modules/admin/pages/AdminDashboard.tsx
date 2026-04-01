

import { Users, AlertTriangle, Activity, FileText, GraduationCap, LayoutList, Clock, ArrowRight, Layers, School, BookOpen, UserCheck, CreditCard, Bell } from 'lucide-react';
import { QuickActionCard } from "@/components/ui/QuickActionCard";
import { Link, useNavigate } from "@tanstack/react-router";
import { AdminAlert, ActivityTimeline, ActivityLog, SystemMaintenanceCard } from "../components";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useRecentAuditLogs } from "../hooks/useAuditLogs";
import { transformToActivityLogItems, transformToActivityTimelineItems } from "../utils/auditLogTransformers";
import { Loader2 } from "lucide-react";
import StatsGridLoader from "@/components/ui/StatsGridLoader";
import { StatsCard } from "@/modules/doyen";
import type { StatsCardProps } from '@/components/ui/StatsCard';
import { useAdminStatistique } from '../hooks';
import { ErrorDisplay } from '@/components/ErrorDisplay';
export function AdminDashboard() {
    const navigate = useNavigate();
    const [logView, setLogView] = useState<'timeline' | 'table'>('timeline');

    // Récupération des logs d'audit depuis l'API
    const { data: auditLogsData, isLoading, error: errorAudit } = useRecentAuditLogs(10);
    const { data: statistiques, isLoading: statistiqueLoading, error: errorStatistique } = useAdminStatistique()
    const stats = statistiques;



    if (errorStatistique || errorAudit) {
        return <ErrorDisplay showBackButton={false} message={errorStatistique?.message || errorAudit?.message} />
    }
    const dashboardStats: StatsCardProps[] = [
        {
            label: "Étudiants",
            value: stats?.total_students?.toLocaleString() ?? "—",
            change: "Total inscrits",
            icon: Users,
            color: "blue",
        },
        {
            label: "Enseignants",
            value: stats?.total_teachers?.toLocaleString() ?? "—",
            change: "Personnel académique",
            icon: GraduationCap,
            color: "indigo",
        },
        {
            label: "Facultés",
            value: stats?.total_faculties?.toLocaleString() ?? "—",
            change: "Unités académiques",
            icon: School,
            color: "purple",
        },
        {
            label: "Départements",
            value: stats?.total_departments?.toLocaleString() ?? "—",
            change: "Structures actives",
            icon: Layers,
            color: "yellow",
        },
        {
            label: "Cours",
            value: stats?.total_courses?.toLocaleString() ?? "—",
            change: "Offres pédagogiques",
            icon: BookOpen,
            color: "pink",
        },
        {
            label: "Inscriptions actives",
            value: stats?.active_enrollments?.toLocaleString() ?? "—",
            change: "Cette année",
            icon: Activity,
            color: "green",
        },
        {
            label: "Sessions actifs",
            value: stats?.active_users?.toLocaleString() ?? "—",
            change: "En ligne récemment",
            icon: UserCheck,
            color: "teal",
        },
        {
            label: "Paiements en attente",
            value: stats ? `${stats.pending_payments} BIF` : "—",
            change: "À régulariser",
            icon: CreditCard,
            color: "red",
        },
        {
            label: "Demandes de documents",
            value: stats?.pending_document_requests?.toLocaleString() ?? "—",
            change: "En attente",
            icon: FileText,
            color: "orange",
        },
        {
            label: "Notifications",
            value: stats?.pending_notifications?.toLocaleString() ?? "—",
            change: "Non lues",
            icon: Bell,
            color: "cyan",
        },
    ];

    // Transformation des logs d'audit en format utilisable par les composants
    const activityLogsTable = auditLogsData?.results
        ? transformToActivityLogItems(auditLogsData.results)
        : [];

    const activityLogsTimeline = auditLogsData?.results
        ? transformToActivityTimelineItems(auditLogsData.results)
        : [];

    return (
        <div className="space-y-4">
            <StatsGridLoader
                isPending={isLoading || statistiqueLoading}
                data={dashboardStats ?? []} // évite les erreurs si undefined
                renderItem={(stat, index) => (
                    <StatsCard
                        key={stat.label} // tu peux garder ta clé ici si tu veux
                        {...stat}
                        delay={index * 0.1}
                    />
                )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <QuickActionCard title="Gestion des Utilisateurs" icon={Users} color="blue" onClick={() => navigate({ to: '/admin/users' })} />


            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="col-span-1">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Alertes Système</h2>
                    <div className="space-y-4">
                        <AdminAlert
                            type="warning"
                            title="3 tentatives de connexion suspectes détectées"
                            timestamp="il y a 5 min"
                        />
                        <AdminAlert
                            type="error"
                            title="Échec de sauvegarde automatique"
                            message="La dernière sauvegarde a échoué. Veuillez vérifier l'espace disque."
                            timestamp="il y a 1h"
                        />
                        <AdminAlert
                            type="success"
                            title="Mise à jour système terminée"
                            timestamp="il y a 3h"
                        />
                    </div>
                </div>
                {/* partie des logs  */}
                <div className="col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                            Activité Récente
                        </h2>

                        {/* Toggle pour changer de vue */}
                        <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-1">
                            <button
                                onClick={() => setLogView('timeline')}
                                className={cn(
                                    "inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                                    logView === 'timeline'
                                        ? "bg-blue-600 text-white shadow-sm"
                                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                                )}
                            >
                                <Clock className="h-4 w-4" />

                            </button>

                            <button
                                onClick={() => setLogView('table')}
                                className={cn(
                                    "inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                                    logView === 'table'
                                        ? "bg-blue-600 text-white shadow-sm"
                                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                                )}
                            >
                                <LayoutList className="h-4 w-4" />

                            </button>
                        </div>
                    </div>


                    {/* Affichage avec gestion des états de chargement et d'erreur */}
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                            <span className="ml-3 text-gray-600 dark:text-gray-400">Chargement des logs...</span>
                        </div>
                    ) : errorAudit ? (
                        <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-gray-900 rounded-lg border border-red-200 dark:border-red-900">
                            <AlertTriangle className="h-12 w-12 text-red-600 dark:text-red-400 mb-4" />
                            <p className="text-red-600 dark:text-red-400 font-medium">Erreur lors du chargement des logs</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Veuillez réessayer plus tard</p>
                        </div>
                    ) : activityLogsTable.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                            <FileText className="h-12 w-12 text-gray-400 mb-4" />
                            <p className="text-gray-600 dark:text-gray-400 font-medium">Aucun log disponible</p>
                        </div>
                    ) : (
                        <>
                            {/* Affichage conditionnel selon la vue sélectionnée */}
                            {logView === 'timeline' ? (
                                <ActivityTimeline activities={activityLogsTimeline} maxItems={3} />
                            ) : (
                                <ActivityLog activities={activityLogsTable} maxItems={2} showIp={true} />
                            )}

                            {/* Lien vers la page complète des logs */}
                            <div className="mt-4">
                                <Link
                                    to="/admin/logs"
                                    className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                    Voir tous les logs
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <SystemMaintenanceCard />
        </div>



    )
}