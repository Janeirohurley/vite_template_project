import { ChartBase } from './ChartBase';
import type { ChartOptions } from 'chart.js/auto';

export interface PieChartProps {
    labels: string[];
    data: number[];
    backgroundColor?: string[];
    darkMode?: boolean;
    className?: string;
    title?: string;
    doughnut?: boolean;
}

export function PieChart({ labels, data: chartData, backgroundColor, darkMode = false, className, title, doughnut = false }: PieChartProps) {
    const defaultColors = [
        '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'
    ];

    const data = {
        labels,
        datasets: [{
            data: chartData,
            backgroundColor: backgroundColor || defaultColors,
            borderWidth: 0,
        }],
    };

    const options: ChartOptions = {
        plugins: {
            title: {
                display: !!title,
                text: title,
            },
            legend: {
                display: true,
                position: 'bottom',
            },
        },
    };

    return <ChartBase type={doughnut ? 'doughnut' : 'pie'} data={data} options={options} darkMode={darkMode} className={className} />;
}
