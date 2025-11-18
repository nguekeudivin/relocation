import { Card, CardContent } from '@/components/ui/card';
import ApexChart from 'react-apexcharts';

interface PieChartProps {
    title: string;
    series: number[];
    labels: string[];
    colors?: string[];
}

export const PieGraph = ({ title, series, labels, colors = [] }: PieChartProps) => {
    // If no colors are provided, generate dynamic pastel colors
    const generatedColors = colors.length ? colors : labels.map((_, i) => `hsl(${(i * 360) / labels.length}, 70%, 60%)`);
    return (
        <Card className="rounded-xl bg-gray-50 shadow">
            <CardContent className="p-4">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">{title}</h3>
                <ApexChart
                    options={{
                        chart: { type: 'pie' },
                        labels,
                        colors: generatedColors,
                        legend: { position: 'bottom' },
                        dataLabels: { enabled: true },
                    }}
                    series={series}
                    type="pie"
                    height={300}
                />
            </CardContent>
        </Card>
    );
};
