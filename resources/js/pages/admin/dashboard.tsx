import { Greeting } from '@/components/common/Greeting';
import { BarGraph } from '@/components/stats/graphs';
import { overviewElements } from '@/components/stats/stats-meta';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout/app-layout';
import { cn, formatNumber } from '@/lib/utils';
import useAppStore from '@/store';
import { useEffect, useState } from 'react';

export default function MemberDashboard() {
    const store = useAppStore();
    const [year, setYear] = useState<string>('2025');
    const [overview, setOverview] = useState<any>(overviewElements);

    const setOverviewStats = (key: string, data: any) => {
        setOverview((overview: any) => {
            return overview.map((item: any) => {
                if (item.key === key) {
                    return { ...item, value: data[key] };
                } else return item;
            });
        });
    };

    useEffect(() => {
        store.user.getStats(year).then((data) => setOverviewStats('total_actives', data));
        store.booking.getStats(year).then((data) => {
            setOverviewStats('total_paid_amount', data);
            setOverviewStats('total_overdue_amount', data);
        });

        store.payment.getStats(year).then((data: any) => setOverviewStats('total_expenses', data));
    }, []);

    return (
        <AppLayout breadcrumbds={[]}>
            <div className="mx-auto max-w-6xl">
                <div className="flex items-center justify-between">
                    <Greeting />
                    <div className="flex items-center gap-2">
                        <select
                            value={year}
                            onChange={(e: any) => {
                                setYear(e.target.value);
                            }}
                            className="border-secondary-200 rounded-md border-2 border-gray-300 px-4 py-1 text-sm"
                        >
                            <option>2023</option>
                            <option>2024</option>
                            <option>2025</option>
                        </select>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-5">
                    {overview.map((stat: any, index: number) => (
                        <Card key={index} className={cn('rounded-2xl bg-blue-100 transition hover:shadow', stat.bg)}>
                            <CardContent className="flex items-center gap-2 p-3">
                                <div className="rounded-full bg-white p-2">
                                    <stat.icon className={cn('h-5 w-5', stat.color)} />
                                </div>
                                <div>
                                    <p className="text-sm">{stat.label}</p>
                                    <p className="flex gap-1 text-lg font-semibold">
                                        <span>{formatNumber(stat.value)}</span>
                                        <div>
                                            <span className="text-sm text-gray-600">{stat.surfix}</span>
                                        </div>
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <section className="mt-8 flex gap-8">
                    <aside className="w-2/3 space-y-8">
                        <BarGraph
                            title="Bookings"
                            colors={['#00a63e', '#191d24ff', '#ec003f']}
                            series={[
                                {
                                    name: 'Devis',
                                    data: store.booking.stats.created_count_serie,
                                },
                            ]}
                        />
                    </aside>

                    <aside className="w-1/3 space-y-8">
                        {/* <PieGraph
                            title="Répartition des contributions"
                            series={Object.values(contributionStats?.contribution_repartition ?? {})}
                            labels={Object.keys(contributionStats?.contribution_repartition ?? {}).map(
                                (key: any) => (contributionTypesMap as any)[key],
                            )}
                            colors={['#bbf451', '#5ee9b5', '#a3b3ff', '#f4a8ff']}
                        /> */}
                    </aside>
                </section>
            </div>
        </AppLayout>
    );
}
