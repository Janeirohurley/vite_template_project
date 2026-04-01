interface StatisticsCardProps {
    title: string;
    value: number | string;
    icon?: React.ReactNode;
    color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
    subtitle?: string;
}

export function StatisticsCard({ title, value, icon, color = 'blue', subtitle }: StatisticsCardProps) {
    const colorClasses = {
        blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
        green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
        purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
        orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800',
        red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800',
    };

    return (
        <div className={`p-4 rounded-lg border ${colorClasses[color]}`}>
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h3>
                {icon && <div className="opacity-75">{icon}</div>}
            </div>
            <div className="text-2xl font-bold">{value}</div>
            {subtitle && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
            )}
        </div>
    );
}
