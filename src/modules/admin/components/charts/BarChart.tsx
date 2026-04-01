import { ChartBase } from './ChartBase';
import type { ChartOptions } from 'chart.js/auto';

export interface BarChartProps {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor?: string | string[];
        borderColor?: string | string[];
    }[];
    darkMode?: boolean;
    className?: string;
    title?: string;
    horizontal?: boolean;
}

export function BarChart({ labels, datasets, darkMode = false, className, title, horizontal = false }: BarChartProps) {
    const data = {
        labels,
        datasets: datasets.map(dataset => ({
            ...dataset,
            backgroundColor: dataset.backgroundColor || [
                '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'
            ],
            borderColor: dataset.borderColor || 'transparent',
            borderWidth: 0,
        })),
    };

    const options: ChartOptions = {
        indexAxis: horizontal ? 'y' : 'x',
        plugins: {
            title: {
                display: !!title,
                text: title,
            },
            legend: {
                display: datasets.length > 1,
            },
        },
    };

    return <ChartBase type="bar" data={data} options={options} darkMode={darkMode} className={className} />;
}
