import PageTitle from '@/components/common/PageTitle';
import { SearchEngine } from '@/components/shared/search-engine';
import { useSimpleForm } from '@/hooks/use-simple-form';
import useTranslation from '@/hooks/use-translation';
import MemberLayout from '@/layouts/member-layout/member-layout';
import { cn } from '@/lib/utils';
import useAppStore from '@/store';
import { format } from 'date-fns';
import { useEffect } from 'react';

export default function MyProfilePage() {
    const store = useAppStore();

    const searchForm = useSimpleForm({ keyword: '' });

    const search = ({ page = 1, perPage = 10 } = {}) => {
        store.booking.fetch({ page, perPage, ...searchForm.values });
    };

    useEffect(() => {
        search();
    }, []);

    const { t } = useTranslation();

    return (
        <>
            <MemberLayout breadcrumbds={[]}>
                <div className="mx-auto max-w-6xl px-4 md:px-0">
                    <PageTitle title="My bookings" />

                    <div className="mt-5"></div>

                    <SearchEngine form={searchForm} onSubmit={undefined} selects={[]} />

                    <div className="mt-6"></div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        {store.booking.pagination.data.map((item) => (
                            <div className="grid grid-cols-1 border border-gray-200 md:grid-cols-2">
                                <div className="p-4">
                                    <div className="font-bold">{format(item.date, 'dd MMM yyyy, HH:mm')}</div>
                                    <div className="mb-4 pl-2">
                                        <ol className="relative mt-2">
                                            <li className={cn('border-primary-600 border-l-4 pb-4 pl-4')}>
                                                <div className="border-primary-600 absolute -start-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-2 bg-white"></div>
                                                <h3 className="text-sm font-semibold">{item.origin.city}</h3>
                                                <p>{item.origin.street}</p>
                                            </li>
                                        </ol>
                                        <ol className="relative">
                                            <li className={cn('pl-4')}>
                                                <div className="border-primary-600 absolute -start-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-2 bg-white"></div>
                                                <h3 className="text-sm font-semibold">{item.destination.city}</h3>
                                                <p>{item.destination.street}</p>
                                            </li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="bg-gray-200 p-4">
                                    <h4 className="font-semibold"> {t('Cost')}</h4>
                                    <ul className="mt-2 text-sm">
                                        <li className="flex justify-between">
                                            <span>
                                                {item.workers} {t('Workers')}
                                            </span>
                                        </li>
                                        <li className="flex justify-between border-t border-gray-300 py-1">
                                            <span>
                                                {item.duration} {t('Hours')}
                                            </span>
                                        </li>
                                        <li className="flex justify-between border-t border-gray-300 py-1">
                                            <span>
                                                {item.cars} {t('Vehicles')}
                                            </span>
                                        </li>
                                    </ul>
                                    <div className="border-primary-600 mb-4 border-t border-dashed"></div>
                                    <div className="font-semibold">
                                        {item.amount}
                                        {` €`}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* <SimpleTable
                        items={store.booking.pagination.data}
                        columns={BookingTableColumns({
                            onView: (booking: any) => {
                                store.booking.setCurrent(booking);
                                store.display.show('view_booking');
                            },
                            onEdit: (booking: any) => {
                                store.booking.setCurrent(booking);
                                store.display.show('edit_booking');
                            },
                            onDelete: (booking: any) => {
                                store.booking.setCurrent(booking);
                                store.display.show('delete_booking');
                            },
                        })}
                    />

                    <FullPagination
                        className="mt-4"
                        canEdit={true}
                        pagination={store.booking.pagination}
                        onGoto={(page) => search({ page })}
                        onPerPage={(perPage) => search({ perPage })}
                    /> */}
                </div>
            </MemberLayout>
        </>
    );
}
