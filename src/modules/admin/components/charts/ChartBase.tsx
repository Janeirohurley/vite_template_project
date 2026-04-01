import { useEffect, useRef } from 'react';
import { Chart as ChartJS } from 'chart.js/auto';
import type { ChartOptions, ChartData } from 'chart.js/auto';
import { cn } from '@/lib/utils';

export interface ChartBaseProps {
    type: 'line' | 'bar' | 'pie' | 'doughnut';
    data: ChartData;
    options?: ChartOptions;
    className?: string;
    darkMode?: boolean;
}

export function ChartBase({ type, data, options, className, darkMode = false }: ChartBaseProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<ChartJS | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        // Détruire le graphique existant
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        // Appliquer les couleurs selon le mode
        const themedOptions = applyTheme(options || {}, darkMode, type);

        // Créer un nouveau graphique
        chartRef.current = new ChartJS(canvasRef.current, {
            type,
            data,
            options: themedOptions,
        });

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, [type, data, options, darkMode]);

    return (
        <div className={cn('relative', className)}>
            <canvas ref={canvasRef} />
        </div>
    );
}

// Fonction pour appliquer le thème (light/dark) au graphique
function applyTheme(options: ChartOptions, darkMode: boolean, chartType: string): ChartOptions {
    const textColor = darkMode ? '#E5E7EB' : '#374151';
    const gridColor = darkMode ? '#374151' : '#E5E7EB';

    return {
        ...options,
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            ...options?.plugins,
            legend: {
                ...options?.plugins?.legend,
                labels: {
                    ...options?.plugins?.legend?.labels,
                    color: textColor,
                },
            },
            tooltip: {
                ...options?.plugins?.tooltip,
                backgroundColor: darkMode ? '#374151' : '#FFFFFF',
                titleColor: textColor,
                bodyColor: textColor,
                borderColor: gridColor,
                borderWidth: 1,
            },
        },
        scales: chartType === 'pie' || chartType === 'doughnut' ? undefined : {
            ...options?.scales,
            x: {
                ...options?.scales?.x,
                ticks: {
                    ...options?.scales?.x?.ticks,
                    color: textColor,
                },
                grid: {
                    ...options?.scales?.x?.grid,
                    color: gridColor,
                },
            },
            y: {
                ...options?.scales?.y,
                ticks: {
                    ...options?.scales?.y?.ticks,
                    color: textColor,
                },
                grid: {
                    ...options?.scales?.y?.grid,
                    color: gridColor,
                },
            },
        },
    };
}
