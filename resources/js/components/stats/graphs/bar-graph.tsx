import { Card, CardContent } from '@/components/ui/card';
import ApexChart from 'react-apexcharts';

interface BarGraphProps {
    title: string;
    //options: any;
    series: any;
    colors: string[];
}

export const BarGraph = ({ title, series, colors }: BarGraphProps) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return (
        <Card className="rounded-xl bg-gray-50 shadow">
            <CardContent className="p-2">
                <div className="flex items-center justify-between px-4 pt-4">
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    <select className="rounded-md border border-gray-300 px-2 py-1 text-sm">
                        <option>2023</option>
                        <option>2024</option>
                        <option>2025</option>
                    </select>
                </div>
                <div className="w-full">
                    <ApexChart
                        options={{
                            chart: { type: 'bar', toolbar: { show: false } },
                            xaxis: {
                                categories: months,
                            },
                            plotOptions: {
                                bar: {
                                    borderRadius: 4,
                                    columnWidth: '80%',
                                },
                            },
                            colors,
                        }}
                        series={series as any}
                        type="bar"
                        height={300}
                    />
                </div>
            </CardContent>
        </Card>
    );
};
