import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Filler,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Filler
);

type SparklineChartProps = {
    data: number[];
    priceChange: number;
};

const SparklineChart = ({ data, priceChange }: SparklineChartProps) => {
    const chartColor = priceChange >= 0 ? 'rgba(16, 185, 129, 0.8)' : 'rgba(239, 68, 68, 0.8)';
    const bgColor = priceChange >= 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)';

    const chartData = {
        labels: Array(data.length).fill(''),
        datasets: [
            {
                data: data,
                borderColor: chartColor,
                backgroundColor: bgColor,
                borderWidth: 1,
                tension: 0.4,
                fill: true,
                pointRadius: 0,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: { display: false },
            y: { display: false },
        },
        plugins: {
            legend: { display: false },
            tooltip: { enabled: false },
        },
        elements: {
            line: {
                borderWidth: 1,
            },
        },
    };

    return <Line data={chartData} options={options} />;
};

export default SparklineChart;