import { ChartBase } from './ChartBase';
import type { ChartOptions } from 'chart.js/auto';

export interface LineChartProps {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        borderColor?: string;
        backgroundColor?: string;
        tension?: number;
    }[];
    darkMode?: boolean;
    className?: string;
    title?: string;
}

export function LineChart({ labels, datasets, darkMode = false, className, title }: LineChartProps) {
    const data = {
        labels,
        datasets: datasets.map(dataset => ({
            ...dataset,
            borderColor: dataset.borderColor || '#3B82F6',
            backgroundColor: dataset.backgroundColor || 'rgba(59, 130, 246, 0.1)',
            tension: dataset.tension ?? 0.4,
            fill: true,
        })),
    };

    const options: ChartOptions = {
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

    return <ChartBase type="line" data={data} options={options} darkMode={darkMode} className={className} />;
}
