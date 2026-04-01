import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type AdminAlertType = 'warning' | 'error' | 'success' | 'info';

export interface AdminAlertProps {
    type?: AdminAlertType;
    title: string;
    message?: string;
    timestamp?: string;
    icon?: React.ComponentType<{ className?: string }>;
    className?: string;
}

const alertStyles = {
    warning: {
        light: "bg-yellow-50 border-yellow-200 text-yellow-800",
        dark: "dark:bg-yellow-950 dark:border-yellow-900 dark:text-yellow-200",
        icon: AlertTriangle,
    },
    error: {
        light: "bg-red-50 border-red-200 text-red-800",
        dark: "dark:bg-red-950 dark:border-red-900 dark:text-red-200",
        icon: XCircle,
    },
    success: {
        light: "bg-green-50 border-green-200 text-green-800",
        dark: "dark:bg-green-950 dark:border-green-900 dark:text-green-200",
        icon: CheckCircle,
    },
    info: {
        light: "bg-blue-50 border-blue-200 text-blue-800",
        dark: "dark:bg-blue-950 dark:border-blue-900 dark:text-blue-200",
        icon: Info,
    },
} as const;

export function AdminAlert({
    type = 'info',
    title,
    message,
    timestamp,
    icon,
    className,
}: AdminAlertProps) {
    const styles = alertStyles[type];
    const Icon = icon || styles.icon;

    return (
        <div
            className={cn(
                "border rounded-md p-2.5",     // plus petit
                "text-sm leading-tight",        // textes compacts
                styles.light,
                styles.dark,
                className
            )}
        >
            <div className="flex items-start space-x-2">
                <Icon className="h-4 w-4 mt-0.5 flex-shrink-0 opacity-80" /> {/* icône réduite */}

                <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold">{title}</p>

                    {message && (
                        <p className="text-[11px] opacity-75 mt-0.5 leading-snug">
                            {message}
                        </p>
                    )}

                    {timestamp && (
                        <p className="text-[10px] opacity-60 mt-0.5 leading-none">
                            {timestamp}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
