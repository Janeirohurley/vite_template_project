// ActivityLog avec support Dark Mode
import { User, Shield, Lock, Unlock, UserPlus, UserMinus, Settings, Database, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { TruncatedText } from '@/components/ui/Tooltip';

export type ActivityType = 'login' | 'logout' | 'user_created' | 'user_deleted' | 'permission_change' | 'settings_change' | 'backup' | 'security_alert';

export interface ActivityLogItem {
    id: string;
    type: ActivityType;
    user: string;
    action: string;
    timestamp: string;
    ip?: string;
    status?: 'success' | 'failed' | 'warning';
}

export interface ActivityLogProps {
    activities: ActivityLogItem[];
    maxItems?: number;
    showIp?: boolean;
    className?: string;
}

const activityIcons: Record<ActivityType, { icon: React.ComponentType<{ className?: string }>; color: string; darkColor: string }> = {
    login: { icon: Unlock, color: 'text-green-600', darkColor: 'text-green-400' },
    logout: { icon: Lock, color: 'text-gray-600', darkColor: 'text-gray-300' },
    user_created: { icon: UserPlus, color: 'text-blue-600', darkColor: 'text-blue-400' },
    user_deleted: { icon: UserMinus, color: 'text-red-600', darkColor: 'text-red-400' },
    permission_change: { icon: Shield, color: 'text-purple-600', darkColor: 'text-purple-300' },
    settings_change: { icon: Settings, color: 'text-orange-600', darkColor: 'text-orange-300' },
    backup: { icon: Database, color: 'text-indigo-600', darkColor: 'text-indigo-300' },
    security_alert: { icon: AlertCircle, color: 'text-red-600', darkColor: 'text-red-400' },
};

const statusColors = {
    success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
};

export function ActivityLog({ activities, maxItems = 10, showIp = true, className }: ActivityLogProps) {
    const displayedActivities = activities.slice(0, maxItems);

    return (
        <div className={cn('bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700', className)}>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Activité</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Utilisateur</th>
                            {showIp && (
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">IP</th>
                            )}
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Heure</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Statut</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                        {displayedActivities.map((activity, index) => {
                            const { icon: Icon, color, darkColor } = activityIcons[activity.type];

                            return (
                                <motion.tr
                                    key={activity.id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center space-x-3">
                                            <motion.div
                                                initial={{ scale: 0, rotate: -180 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                transition={{ type: 'spring', stiffness: 200, delay: index * 0.05 }}
                                            >
                                                <Icon className={cn('h-5 w-5', color, `dark:${darkColor}`)} />
                                            </motion.div>
                                            <TruncatedText
                                                text={activity.action}
                                                maxLength={50}
                                                className="text-sm text-gray-900 dark:text-gray-100"
                                            />
                                        </div>
                                    </td>

                                    <td className="px-4 py-3">
                                        <div className="flex items-center space-x-2">
                                            <User className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                            <TruncatedText
                                                text={activity.user}
                                                maxLength={25}
                                                className="text-sm text-gray-700 dark:text-gray-300"
                                            />
                                        </div>
                                    </td>

                                    {showIp && (
                                        <td className="px-4 py-3">
                                            <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">{activity.ip || '-'}</span>
                                        </td>
                                    )}

                                    <td className="px-4 py-3">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">{activity.timestamp}</span>
                                    </td>

                                    <td className="px-4 py-3">
                                        {activity.status && (
                                            <motion.span
                                                className={cn(
                                                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                                                    statusColors[activity.status]
                                                )}
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: 'spring', delay: index * 0.05 + 0.1 }}
                                            >
                                                {activity.status === 'success'
                                                    ? 'Succès'
                                                    : activity.status === 'failed'
                                                        ? 'Échec'
                                                        : 'Attention'}
                                            </motion.span>
                                        )}
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {activities.length > maxItems && (
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 text-center">
                    <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
                        Voir tous les logs ({activities.length})
                    </button>
                </div>
            )}
        </div>
    );
}