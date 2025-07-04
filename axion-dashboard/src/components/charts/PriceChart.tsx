import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale
);

type PriceChartProps = {
    data: [number, number][];
    currency: string;
    theme: string;
};

const PriceChart = ({ data, currency, theme }: PriceChartProps) => {
    const chartData = {
        datasets: [
            {
                label: 'Price',
                data: data.map(([timestamp, price]) => ({
                    x: new Date(timestamp),
                    y: price,
                })),
                borderColor: theme === 'dark' ? '#3b82f6' : '#2563eb',
                backgroundColor: theme === 'dark' ? '#1e3a8a' : '#93c5fd',
                borderWidth: 2,
                tension: 0.1,
                fill: true,
                pointRadius: 0,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: 'time' as const,
                time: {
                    unit: 'day' as const,
                    tooltipFormat: 'PP',
                },
                grid: {
                    color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                },
                ticks: {
                    color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                },
            },
            y: {
                grid: {
                    color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                },
                ticks: {
                    color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                    callback: (value: number) => {
                        return new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: currency.toUpperCase(),
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 8,
                        }).format(value);
                    },
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                mode: 'index' as const,
                intersect: false,
                callbacks: {
                    label: (context: any) => {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: currency.toUpperCase(),
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 8,
                            }).format(context.parsed.y);
                        }
                        return label;
                    },
                },
            },
        },
        interaction: {
            mode: 'nearest' as const,
            intersect: false,
        },
    };

    return <Line data={chartData} options={options} />;
};

export default PriceChart;