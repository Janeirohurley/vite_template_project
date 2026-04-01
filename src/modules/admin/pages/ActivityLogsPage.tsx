/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { ActivityTimeline } from "../components";
import type { ActivityTimelineItem, ActivityLogItem, ActivityType } from "../components";
import { BarChart, PieChart } from "../components/charts";
import { Search, Filter, Download, RefreshCw, LayoutList, Clock, X, Calendar, TrendingUp, AlertCircle, Loader2, Check, AlertTriangle } from "lucide-react";
import { SingleSelectDropdown } from "@/components/ui/SingleSelectDropdown";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuditLogs } from "../hooks/useAuditLogs";
import { transformToActivityLogItems } from "../utils/auditLogTransformers";
import { mapAuditLogToTableRow, type AuditLogTableRow } from "../types/auditLogTableTypes";
import DataTable from "@/components/ui/DataTable";

type TimePeriod = 'today' | 'week' | 'month' | 'year' | 'all';

export function ActivityLogsPage() {
    const [logView, setLogView] = useState<'timeline' | 'table'>('timeline');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<ActivityType | 'all'>('all');
    const [filterStatus, setFilterStatus] = useState<'all' | 'success' | 'failed' | 'warning'>('all');
    const [timePeriod, setTimePeriod] = useState<TimePeriod>('all');
    const [showFilters, setShowFilters] = useState(false);
    const [darkMode] = useState(false); // À connecter avec votre système de thème
    const [currentPage, setCurrentPage] = useState(1);

    // Récupération des logs depuis l'API avec pagination et rafraîchissement automatique toutes les 2 minutes
    const { data: auditLogsData, isLoading, isError, refetch } = useAuditLogs({
        page: currentPage,
        page_size: 100,
        // On peut ajouter des filtres backend si nécessaire
    });

    // Transformation des données de l'API en format utilisable
    const allActivityLogs: ActivityLogItem[] = useMemo(() => {
        if (!auditLogsData?.results) return [];
        return transformToActivityLogItems(auditLogsData.results);
    }, [auditLogsData]);


    // Filtrage des logs par période et autres critères
    const filteredLogs = useMemo(() => {
        return allActivityLogs.filter(log => {
            const matchesSearch =
                log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (log.ip && log.ip.includes(searchQuery));

            const matchesType = filterType === 'all' || log.type === filterType;
            const matchesStatus = filterStatus === 'all' || log.status === filterStatus;

            // Filtrage par période (simplification basée sur le timestamp texte)
            let matchesPeriod = true;
            if (timePeriod !== 'all') {
                const timestamp = log.timestamp.toLowerCase();
                switch (timePeriod) {
                    case 'today':
                        matchesPeriod = timestamp.includes('min') || timestamp.includes('heure') || timestamp.includes('h');
                        break;
                    case 'week':
                        matchesPeriod = !timestamp.includes('mois') && !timestamp.includes('année');
                        break;
                    case 'month':
                        matchesPeriod = !timestamp.includes('année');
                        break;
                    case 'year':
                        matchesPeriod = true;
                        break;
                }
            }

            return matchesSearch && matchesType && matchesStatus && matchesPeriod;
        });
    }, [searchQuery, filterType, filterStatus, timePeriod, allActivityLogs]);

    const filteredTimeline: ActivityTimelineItem[] = filteredLogs.map(log => ({
        id: log.id,
        type: log.type,
        user: log.user,
        action: log.action,
        timestamp: log.timestamp,
        details: log.ip ? `IP: ${log.ip}` : undefined
    }));

    // Transformation des données pour le DataTable
    const auditLogsForTable: AuditLogTableRow[] = useMemo(() => {
        if (!auditLogsData?.results) return [];
        return auditLogsData.results.map(mapAuditLogToTableRow);
    }, [auditLogsData]);

    const activityTypes: { value: ActivityType | 'all'; label: string }[] = [
        { value: 'all', label: 'Tous les types' },
        { value: 'login', label: 'Connexions' },
        { value: 'logout', label: 'Déconnexions' },
        { value: 'user_created', label: 'Créations' },
        { value: 'user_deleted', label: 'Suppressions' },
        { value: 'permission_change', label: 'Permissions' },
        { value: 'settings_change', label: 'Paramètres' },
        { value: 'backup', label: 'Sauvegardes' },
        { value: 'security_alert', label: 'Alertes sécurité' },
    ];

    const statusTypes = [
        { value: 'all', label: 'Tous les statuts' },
        { value: 'success', label: 'Succès' },
        { value: 'failed', label: 'Échecs' },
        { value: 'warning', label: 'Avertissements' },
    ];

    const timePeriods: { value: TimePeriod; label: string; icon: any }[] = [
        { value: 'today', label: "Aujourd'hui", icon: Clock },
        { value: 'week', label: 'Cette semaine', icon: Calendar },
        { value: 'month', label: 'Ce mois', icon: Calendar },
        { value: 'year', label: 'Cette année', icon: Calendar },
        { value: 'all', label: 'Tout', icon: Calendar },
    ];

    // Calcul des statistiques
    const statistics = useMemo(() => {
        const total = filteredLogs.length;
        const successCount = filteredLogs.filter(l => l.status === 'success').length;
        const failedCount = filteredLogs.filter(l => l.status === 'failed').length;
        const warningCount = filteredLogs.filter(l => l.status === 'warning').length;

        // Statistiques par type
        const byType: Record<ActivityType, number> = {
            login: filteredLogs.filter(l => l.type === 'login').length,
            logout: filteredLogs.filter(l => l.type === 'logout').length,
            user_created: filteredLogs.filter(l => l.type === 'user_created').length,
            user_deleted: filteredLogs.filter(l => l.type === 'user_deleted').length,
            permission_change: filteredLogs.filter(l => l.type === 'permission_change').length,
            settings_change: filteredLogs.filter(l => l.type === 'settings_change').length,
            backup: filteredLogs.filter(l => l.type === 'backup').length,
            security_alert: filteredLogs.filter(l => l.type === 'security_alert').length,
        };

        // Utilisateurs les plus actifs
        const userActivity: Record<string, number> = {};
        filteredLogs.forEach(log => {
            userActivity[log.user] = (userActivity[log.user] || 0) + 1;
        });
        const topUsers = Object.entries(userActivity)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5);

        return {
            total,
            successCount,
            failedCount,
            warningCount,
            successRate: total > 0 ? ((successCount / total) * 100).toFixed(1) : '0',
            byType,
            topUsers,
        };
    }, [filteredLogs]);

    const handleExport = () => {
        // TODO: Implémenter l'export des logs
        const dataStr = JSON.stringify(filteredLogs, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = `audit-logs-${new Date().toISOString()}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const handleRefresh = () => {
        refetch();
    };

    const clearFilters = () => {
        setSearchQuery('');
        setFilterType('all');
        setFilterStatus('all');
        setTimePeriod('all');
    };

    const hasActiveFilters = searchQuery !== '' || filterType !== 'all' || filterStatus !== 'all' || timePeriod !== 'all';

    return (

<><div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Logs d'Activité</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {filteredLogs.length} {filteredLogs.length > 1 ? 'résultats' : 'résultat'}
                        {hasActiveFilters && ` (filtré${filteredLogs.length > 1 ? 's' : ''} sur ${allActivityLogs.length})`}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleRefresh}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Actualiser
                    </button>
                    <button
                        onClick={handleExport}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                        <Download className="h-4 w-4" />
                        Exporter
                    </button>
                </div>
            </div>

            {/* Filtrage par période */}
            <div className="flex flex-wrap gap-2">
                {timePeriods.map((period) => {
                    const Icon = period.icon;
                    return (
                        <button
                            key={period.value}
                            onClick={() => setTimePeriod(period.value)}
                            className={cn(
                                "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                timePeriod === period.value
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            {period.label}
                        </button>
                    );
                })}
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div
                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total d'activités</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{statistics.total}</p>
                        </div>
                        <TrendingUp className="h-10 w-10 text-blue-600" />
                    </div>
                </motion.div>

                <motion.div
                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Taux de succès</p>
                            <p className="text-2xl font-bold text-green-600 mt-1">{statistics.successRate}%</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Échecs</p>
                            <p className="text-2xl font-bold text-red-600 mt-1">{statistics.failedCount}</p>
                        </div>
                        <AlertCircle className="h-10 w-10 text-red-600" />
                    </div>
                </motion.div>

                <motion.div
                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Avertissements</p>
                            <p className="text-2xl font-bold text-yellow-600 mt-1">{statistics.warningCount}</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                            <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Graphiques */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <motion.div
                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Activités par type</h3>
                    <div className="h-64 md:h-80">
                        <PieChart
                            labels={['Connexions', 'Créations', 'Alertes', 'Sauvegardes', 'Permissions', 'Paramètres', 'Suppressions', 'Déconnexions']}
                            data={[
                                statistics.byType.login,
                                statistics.byType.user_created,
                                statistics.byType.security_alert,
                                statistics.byType.backup,
                                statistics.byType.permission_change,
                                statistics.byType.settings_change,
                                statistics.byType.user_deleted,
                                statistics.byType.logout,
                            ]}
                            darkMode={darkMode}
                            doughnut
                        />
                    </div>
                </motion.div>

                <motion.div
                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.35 }}
                >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Utilisateurs les plus actifs</h3>
                    <div className="h-64 md:h-80">
                        <BarChart
                            labels={statistics.topUsers.map(([user]) => user.split('@')[0])}
                            datasets={[{
                                label: 'Activités',
                                data: statistics.topUsers.map(([, count]) => count),
                            }]}
                            darkMode={darkMode}
                            horizontal
                        />
                    </div>
                </motion.div>
            </div>

            {/* Barre de recherche et filtres */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Recherche */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher par utilisateur, action ou IP..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Toggle filtres */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={cn(
                            "inline-flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors",
                            showFilters || hasActiveFilters
                                ? "bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-400"
                                : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                        )}
                    >
                        <Filter className="h-4 w-4" />
                        Filtres
                        {hasActiveFilters && (
                            <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {[searchQuery !== '', filterType !== 'all', filterStatus !== 'all', timePeriod !== 'all'].filter(Boolean).length}
                            </span>
                        )}
                    </button>

                    {/* Toggle vue */}
                    <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 p-1">
                        <button
                            onClick={() => setLogView('timeline')}
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${logView === 'timeline'
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            <Clock className="h-4 w-4" />
                            Timeline
                        </button>
                        <button
                            onClick={() => setLogView('table')}
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${logView === 'table'
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            <LayoutList className="h-4 w-4" />
                            Tableau
                        </button>
                    </div>
                </div>

                {/* Panneau de filtres */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            
                        >
                            <div className="pt-4 mt-4 border-t border-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Filtre par type */}
                                    <SingleSelectDropdown
                                        value={filterType}
                                        options={activityTypes.map(type => ({
                                            id: type.value,
                                            label: type.label,
                                            value: type.value
                                        }))}
                                        onChange={(value) => setFilterType(value as ActivityType | 'all')}
                                        label="Type d'activité"
                                    />

                                    {/* Filtre par statut */}
                                    <SingleSelectDropdown
                                        value={filterStatus}
                                        options={statusTypes.map(status => ({
                                            id: status.value,
                                            label: status.label,
                                            value: status.value
                                        }))}
                                        onChange={(value) => setFilterStatus(value as 'all' | 'success' | 'failed' | 'warning')}
                                        label="Statut"
                                    />
                                </div>

                                {/* Bouton réinitialiser */}
                                {hasActiveFilters && (
                                    <div className="mt-4 flex justify-end">
                                        <button
                                            onClick={clearFilters}
                                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                                        >
                                            <X className="h-4 w-4" />
                                            Réinitialiser les filtres
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Affichage des logs */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={logView}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                >
                    {isLoading ? (
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
                            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                            <p className="text-gray-500 dark:text-gray-400">Chargement des logs d'activité...</p>
                        </div>
                    ) : isError ? (
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-red-200 dark:border-red-900/50 p-12 text-center">
                            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
                            <p className="text-red-600 dark:text-red-400 font-medium mb-2">Erreur lors du chargement des logs</p>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">Une erreur s'est produite lors de la récupération des données.</p>
                            <button
                                onClick={handleRefresh}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                            >
                                <RefreshCw className="h-4 w-4" />
                                Réessayer
                            </button>
                        </div>
                    ) : filteredLogs.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
                            <p className="text-gray-500 dark:text-gray-400">Aucun log trouvé avec ces critères.</p>
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Réinitialiser les filtres
                                </button>
                            )}
                        </div>
                    ) : logView === 'timeline' ? (
                        <ActivityTimeline activities={filteredTimeline} maxItems={50} />
                    ) : (
                        <DataTable<AuditLogTableRow>
                            columns={[
                                {
                                    key: "timestamp",
                                    label: "Date/Heure",
                                    sortable: true,
                                    editable: false
                                },
                                {
                                    key: "user",
                                    label: "Utilisateur",
                                    sortable: true,
                                    editable: false
                                },
                                {
                                    key: "action",
                                    label: "Action",
                                    sortable: true,
                                    editable: false
                                },
                                {
                                    key: "severity",
                                    label: "Sévérité",
                                    sortable: true,
                                    editable: false,
                                    render: (log) => {
                                        const severityColors = {
                                            info: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
                                            warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
                                            error: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
                                            critical: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
                                        };
                                        return (
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${severityColors[log.severity]}`}>
                                                {log.severity}
                                            </span>
                                        );
                                    },
                                },
                                {
                                    key: "entityType",
                                    label: "Type d'entité",
                                    sortable: true,
                                    editable: false
                                },
                                {
                                    key: "description",
                                    label: "Description",
                                    sortable: false,
                                    editable: false
                                },
                                {
                                    key: "ipAddress",
                                    label: "Adresse IP",
                                    sortable: true,
                                    editable: false
                                },
                                {
                                    key: "success",
                                    label: "Statut",
                                    sortable: true,
                                    editable: false,
                                    render: (log) => (
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${log.success
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                            }`}>
                                            {log.success ? 'Succès' : 'Échec'}
                                        </span>
                                    ),
                                },
                            ]}
                            data={auditLogsForTable}
                            getRowId={(row) => row.id}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            itemsPerPage={20}
                         
                            onSearchChange={setSearchQuery}
                            isLoading={isLoading}
                            error={isError ? "Erreur lors du chargement des logs d'audit" : null}
                            enableDragDrop={false}
                            onAddRow={undefined}
                            onAddRowAfter={undefined}
                            onDeleteRow={undefined}
                            onCellEdit={undefined}
                            onReorder={undefined}
                            onBulkAction={undefined}
                        />
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
</>
        

    );
}


