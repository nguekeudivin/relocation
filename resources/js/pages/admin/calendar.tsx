import { BookingStatusColors, BookingStatusMap } from '@/components/booking/booking-meta';
import { ViewBookingModal } from '@/components/booking/booking-modals/view-booking-modal';
import PageTitle from '@/components/common/PageTitle';
import Calendar from '@/components/ui/calendar/calendar';
import useTranslation from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout/app-layout';
import { cn } from '@/lib/utils';
import useAppStore from '@/store';
import { format } from 'date-fns';
import { ReactNode, useEffect } from 'react';

export default function CalendarPage() {
    const store = useAppStore();

    const { t, formatDate } = useTranslation();

    const renderItemComponent = (item: any, index: number): ReactNode => {
        console.log(item);
        return (
            <div
                key={`${format(item.date, 'yyyy-MM-dd')}-${index}`}
                onClick={(e: any) => {
                    e.stopPropagation();
                    store.booking.setCurrent(item);
                    store.display.show('view_booking');
                }}
                className="bg-primary-200 h-full cursor-pointer rounded-lg p-2 font-normal text-black dark:text-white"
            >
                <div className="gap-1 text-xs text-gray-800 dark:text-gray-300">
                    <div>{formatDate(new Date(item.date), 'HH:mm')}</div>
                    <div
                        className={cn(
                            'mt-1 rounded-full px-3 py-1 text-xs font-medium capitalize',
                            BookingStatusColors[item.status] || 'bg-gray-100 text-gray-800',
                        )}
                    >
                        {t(BookingStatusMap[item.status])}
                    </div>
                </div>
            </div>
        );
    };

    useEffect(() => {
        store.booking.fetch({});
    }, []);

    return (
        <>
            <AppLayout breadcrumbds={[]}>
                <ViewBookingModal />
                <section className="mx-auto max-w-6xl px-4 md:px-0">
                    <PageTitle title={t('Calendar')} actions={<div className="flex items-center gap-2"></div>} />
                    <div className="mt-4"></div>
                    <Calendar
                        items={store.booking.items.map((item) => {
                            console.log(item);
                            return { startDate: item.date, ...item };
                        })}
                        modes={[]}
                        renderItem={renderItemComponent}
                    />
                </section>
            </AppLayout>
        </>
    );
}
