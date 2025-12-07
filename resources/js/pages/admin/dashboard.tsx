import { Greeting } from '@/components/common/Greeting';
import { BarGraph, LineGraph } from '@/components/stats/graphs';
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
    const [years, setYears] = useState<string[]>(['2025']);
    const [overview, setOverview] = useState<any>(overviewElements);
    const { t } = useTranslation();

    useEffect(() => {
        setYear(`${new Date().getFullYear()}`);
    }, []);

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
            setOverviewStats('total_bookings', data);
            setOverviewStats('total_new_users', data);
            setOverviewStats('total_revenue', data);
            setYears(data.years);
        });
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
                            {years.map((item) => (
                                <option value={item}>{item}</option>
                            ))}
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
                                    data: store.booking.stats.booking_serie,
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
                                    data: store.booking.stats.new_user_serie,
                                },
                            ]}
                        />
                    </aside>

                    <aside className="w-full">
                        <LineGraph
                            title={t('Revenue')}
                            colors={['#00a63e']}
                            series={[
                                {
                                    name: t('Revenue'),
                                    data: store.booking.stats.revenue_serie,
                                },
                            ]}
                        />
                    </aside>
                </section>
            </div>
        </AppLayout>
    );
}
