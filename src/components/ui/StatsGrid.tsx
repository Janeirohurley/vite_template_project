// src/components/StatsGrid.tsx
import clsx from 'clsx';
import type { LucideIcon } from 'lucide-react';
import { StatCard } from './StatCard';

export interface StatItem {
    label: string;
    value: string | number;
    change?: string;
    icon: LucideIcon;
    color?: 'blue' | 'emerald' | 'red' | 'purple' | 'orange' | 'indigo' | 'pink' | 'yellow';
}

interface StatsGridProps {
    stats: StatItem[];
    columns?: {
        sm?: 1 | 2 | 3 | 4;
        md?: 1 | 2 | 3 | 4;
        lg?: 1 | 2 | 3 | 4 | 5 | 6;
        xl?: 1 | 2 | 3 | 4 | 5 | 6 | 8;
    };
    className?: string;
}

export function StatsGrid({ stats, columns = {}, className }: StatsGridProps) {
    const gridClasses = clsx(
        'grid grid-cols-1 gap-4',
        {
            // Mobile → toujours 1 colonne
            'sm:grid-cols-2': columns.sm === 2 || (!columns.sm && true),
            'sm:grid-cols-3': columns.sm === 3,
            'sm:grid-cols-4': columns.sm === 4,

            'md:grid-cols-3': columns.md === 3,
            'md:grid-cols-4': columns.md === 4,

            'lg:grid-cols-3': columns.lg === 3,
            'lg:grid-cols-4': columns.lg === 4 || (!columns.lg && true), // défaut = 4
            'lg:grid-cols-5': columns.lg === 5,
            'lg:grid-cols-6': columns.lg === 6,

            'xl:grid-cols-5': columns.xl === 5,
            'xl:grid-cols-6': columns.xl === 6,
            'xl:grid-cols-8': columns.xl === 8,
        },
        className // classe personnalisée en dernier (priorité)
    );

    return (
        <div className={gridClasses}>
            {stats.map((stat, index) => (
                <StatCard
                    key={`${stat.label}-${index}`}
                    label={stat.label}
                    value={stat.value}
                    change={stat.change}
                    icon={stat.icon}
                    color={stat.color}
                />
            ))}
        </div>
    );
}