import { Greeting } from '@/components/common/Greeting';
import { BarGraph, LineGraph, PieGraph } from '@/components/stats/graphs';
import { overviewElements } from '@/components/stats/stats-meta';
import { Card, CardContent } from '@/components/ui/card';
import useTranslation from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout/app-layout';
import { cn, formatNumber } from '@/lib/utils';
import useAppStore from '@/store';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
    const store = useAppStore();
    const [year, setYear] = useState<string>('2025');
    const [overview, setOverview] = useState<any>(overviewElements);
    const { t } = useTranslation();

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
            <div className="mx-auto max-w-5xl px-4 md:px-0">
                <div className="flex items-center justify-between">
                    <Greeting />
                    <div className="flex items-center gap-2">
                        <select
                            value={year}
                            onChange={(e: any) => setYear(e.target.value)}
                            className="border-secondary-200 rounded-md border-2 border-gray-300 px-4 py-1 text-sm"
                        >
                            <option>2023</option>
                            <option>2024</option>
                            <option>2025</option>
                        </select>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-3">
                    {overview.map((stat: any, index: number) => (
                        <Card key={index} className={cn('rounded-2xl bg-blue-100 transition hover:shadow', stat.bg)}>
                            <CardContent className="flex items-center gap-4 p-3">
                                <div className="rounded-full bg-white p-4">
                                    <stat.icon className={cn('h-8 w-8', stat.color)} />
                                </div>
                                <div>
                                    <p className="">{t(stat.label)}</p>
                                    <p className="flex gap-1 text-lg font-semibold">
                                        <span className="text-xl">{formatNumber(stat.value)}</span>
                                        <div>
                                            <span className="text-sm text-gray-600">{stat.surfix}</span>
                                        </div>
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <section className="mt-8 space-y-8">
                    <aside className="w-full space-y-8">
                        <LineGraph
                            title={t('Bookings')}
                            colors={['#155dfc']}
                            series={[
                                {
                                    name: t('Bookings'),
                                    data: [5, 12, 18, 9, 15, 22, 30, 25, 19, 28, 32, 40],
                                },
                            ]}
                        />
                    </aside>

                    <aside className="w-full space-y-8">
                        <BarGraph
                            title={t('Clients')}
                            colors={['#4f39f6']}
                            series={[
                                {
                                    name: t('Clients'),
                                    data: [3, 8, 10, 6, 12, 14, 20, 18, 13, 22, 25, 30],
                                },
                            ]}
                        />
                    </aside>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        <aside className="col-span-2">
                            <LineGraph
                                title={t('Revenue')}
                                colors={['#00a63e']}
                                series={[
                                    {
                                        name: t('Revenue'),
                                        data: [500, 900, 1200, 800, 1500, 2000, 2500, 2300, 1800, 2600, 3200, 4000],
                                    },
                                ]}
                            />
                        </aside>

                        <aside>
                            <PieGraph
                                title={t('Revenue by method')}
                                series={[400, 100]}
                                labels={[t('PayPal'), t('Stripe')]}
                                colors={['#193cb8', '#372aac']}
                            />
                        </aside>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
