import PageTitle from '@/components/common/PageTitle';
import { SlotModals } from '@/components/slot/slot-modals';
import { Button } from '@/components/ui/button';
import Calendar from '@/components/ui/calendar/calendar';
import useTranslation from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout/app-layout';
import useAppStore from '@/store';
import { getFullName } from '@/store/User';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';
import { ReactNode, useEffect } from 'react';

export default function CalendarPage() {
    const store = useAppStore();

    const { t } = useTranslation();

    const renderItemComponent = (item: any, index: number): ReactNode => (
        <div
            key={`${format(item.startDate, 'yyyy-MM-dd')}-${index}`}
            onClick={(e: any) => {
                e.stopPropagation();
                store.slot.setCurrent(item);
                store.display.show('edit_slot');
            }}
            className="bg-secondary-500 h-full cursor-pointer rounded-lg p-2 font-normal text-black dark:text-white"
        >
            <h4 className="text-sm font-semibold">{getFullName(item.user)}</h4>

            <div className="flex items-center gap-1 text-xs text-gray-700 dark:text-gray-300">
                <span>{format(item.startDate, 'hh:mm a')}</span>
            </div>
        </div>
    );

    useEffect(() => {
        store.slot.fetch({});
    }, []);

    return (
        <>
            <SlotModals />
            <AppLayout breadcrumbds={[]}>
                <section className="mx-auto max-w-6xl px-4 md:px-0">
                    <PageTitle
                        title={t('Calendar')}
                        actions={
                            <div className="flex items-center gap-2">
                                <Button onClick={() => store.display.show('create_slot')} className="">
                                    <Plus className="h-5 w-5" />
                                    {t('Add disponibility')}
                                </Button>
                                {/* <Button
                                    onClick={() => store.display.show('generate_meeting')}
                                    color="secondary"
                                    className="flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-white"
                                >
                                    <WandSparkles className="h-5 w-5" />
                                    Generer les reunions
                                </Button> */}
                            </div>
                        }
                    />
                    <div className="mt-4"></div>
                    <Calendar
                        items={store.slot.items}
                        modes={[]}
                        onCreate={(startDate: Date, endDate: Date) => {
                            store.display.show('create_slot', {
                                data: {
                                    startDate,
                                    endDate,
                                },
                            });
                        }}
                        renderItem={renderItemComponent}
                    />
                </section>
            </AppLayout>
        </>
    );
}
