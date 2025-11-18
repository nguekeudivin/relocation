import { Card, CardContent } from '@/components/ui/card';
import ApexChart from 'react-apexcharts';

interface LineGraphProps {
    title: string;
    //options: any;
    series: any;
    colors: string[];
}

export const LineGraph = ({ title, series, colors }: LineGraphProps) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return (
        <Card className="rounded-xl bg-gray-50 shadow">
            <CardContent className="p-2">
                <div className="flex items-center justify-between px-4 pt-4">
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                </div>
                <div className="w-full">
                    <ApexChart
                        options={{
                            chart: { type: 'line', toolbar: { show: false } },
                            xaxis: {
                                categories: months,
                            },
                            stroke: {
                                curve: 'smooth',
                                width: 2,
                            },
                            markers: {
                                size: 4,
                            },
                            colors,
                        }}
                        series={series as any}
                        type="line"
                        height={300}
                    />
                </div>
            </CardContent>
        </Card>
    );
};
