// ActivityTimeline avec support Dark Mode
import { User, Shield, Lock, Unlock, UserPlus, UserMinus, Settings, Database, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { TruncatedText } from '@/components/ui/Tooltip';

export type ActivityType = 'login' | 'logout' | 'user_created' | 'user_deleted' | 'permission_change' | 'settings_change' | 'backup' | 'security_alert';

export interface ActivityTimelineItem {
    id: string;
    type: ActivityType;
    user: string;
    action: string;
    timestamp: string;
    details?: string;
}

export interface ActivityTimelineProps {
    activities: ActivityTimelineItem[];
    maxItems?: number;
    className?: string;
}

// Ajout des variantes dark
const activityConfig: Record<ActivityType, { icon: React.ComponentType<{ className?: string }>; color: string; bgColor: string; darkColor: string; darkBg: string }> = {
    login: { icon: Unlock, color: 'text-green-600', bgColor: 'bg-green-100', darkColor: 'text-green-400', darkBg: 'bg-green-900/40' },
    logout: { icon: Lock, color: 'text-gray-600', bgColor: 'bg-gray-100', darkColor: 'text-gray-300', darkBg: 'bg-gray-800' },
    user_created: { icon: UserPlus, color: 'text-blue-600', bgColor: 'bg-blue-100', darkColor: 'text-blue-400', darkBg: 'bg-blue-900/40' },
    user_deleted: { icon: UserMinus, color: 'text-red-600', bgColor: 'bg-red-100', darkColor: 'text-red-400', darkBg: 'bg-red-900/40' },
    permission_change: { icon: Shield, color: 'text-purple-600', bgColor: 'bg-purple-100', darkColor: 'text-purple-300', darkBg: 'bg-purple-900/40' },
    settings_change: { icon: Settings, color: 'text-orange-600', bgColor: 'bg-orange-100', darkColor: 'text-orange-300', darkBg: 'bg-orange-900/40' },
    backup: { icon: Database, color: 'text-indigo-600', bgColor: 'bg-indigo-100', darkColor: 'text-indigo-300', darkBg: 'bg-indigo-900/40' },
    security_alert: { icon: AlertCircle, color: 'text-red-600', bgColor: 'bg-red-100', darkColor: 'text-red-400', darkBg: 'bg-red-900/40' },
};

export function ActivityTimeline({ activities, maxItems = 15, className }: ActivityTimelineProps) {
    const displayedActivities = activities.slice(0, maxItems);

    return (
        <div className={cn('bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4', className)}>
            <div className="space-y-4">
                {displayedActivities.map((activity, index) => {
                    const config = activityConfig[activity.type];
                    const Icon = config.icon;
                    const isLast = index === displayedActivities.length - 1;

                    return (
                        <motion.div
                            key={activity.id}
                            className="relative"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            {!isLast && (
                                <motion.div
                                    className="absolute left-5 top-10 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"
                                    initial={{ scaleY: 0 }}
                                    animate={{ scaleY: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 + 0.1 }}
                                    style={{ transformOrigin: 'top' }}
                                />
                            )}

                            <div className="flex items-start space-x-3">
                                <motion.div
                                    className={cn(
                                        'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
                                        config.bgColor,
                                        `dark:${config.darkBg}`
                                    )}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 200, delay: index * 0.05 }}
                                    whileHover={{ scale: 1.1 }}
                                >
                                    <Icon className={cn('h-5 w-5', config.color, `dark:${config.darkColor}`)} />
                                </motion.div>

                                <div className="flex-1 min-w-0 pt-1">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <TruncatedText
                                                text={activity.action}
                                                maxLength={60}
                                                className="text-sm font-medium text-gray-900 dark:text-gray-100"
                                            />
                                            <div className="flex items-center space-x-2 mt-1">
                                                <User className="h-3 w-3 text-gray-400 dark:text-gray-500" />
                                                <TruncatedText
                                                    text={activity.user}
                                                    maxLength={30}
                                                    className="text-xs text-gray-500 dark:text-gray-400"
                                                />
                                            </div>
                                            {activity.details && (
                                                <TruncatedText
                                                    text={activity.details}
                                                    maxLength={80}
                                                    className="text-xs text-gray-500 dark:text-gray-400 mt-1 block"
                                                />
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap ml-2">
                                            {activity.timestamp}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
