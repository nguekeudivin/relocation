import BookingCard from '@/components/booking/booking-card';
import { BookingStatusOptions } from '@/components/booking/booking-meta';
import { CompleteBookingModal } from '@/components/booking/booking-modals/complete-booking-modal';
import { ConfirmBookingModal } from '@/components/booking/booking-modals/confirm-booking-modal';
import { RejectBookingModal } from '@/components/booking/booking-modals/reject-booking-modal';
import FullPagination from '@/components/common/FullPagination';
import PageTitle from '@/components/common/PageTitle';
import { SearchEngine } from '@/components/shared/search-engine';
import { useSimpleForm } from '@/hooks/use-simple-form';
import AppLayout from '@/layouts/app-layout/app-layout';
import useAppStore from '@/store';
import debounce from 'lodash.debounce';
import { Package } from 'lucide-react';
import { useEffect, useMemo } from 'react';

export default function BookingsPage() {
    const store = useAppStore();

    const searchForm = useSimpleForm({ keyword: undefined, page: 1, per_page: 10 });

    const search = (params: { page?: number; per_page?: number }) => {
        store.booking.fetch({ ...searchForm.values, ...params });
    };

    const autoCompleteDebounced = useMemo(
        () =>
            debounce((values: any) => {
                store.booking.fetch(values);
            }, 400),
        [],
    );

    useEffect(() => {
        search({});
    }, []);

    return (
        <>
            <RejectBookingModal />
            <ConfirmBookingModal />
            <CompleteBookingModal />
            <AppLayout breadcrumbds={[]}>
                <div className="mx-auto max-w-5xl px-4 md:px-0">
                    <PageTitle title="Bookings" />

                    <div className="mt-5"></div>

                    <SearchEngine
                        form={searchForm}
                        inputSize="w-full md:w-[400px]"
                        onSubmit={undefined}
                        autoComplete={autoCompleteDebounced}
                        selects={[
                            {
                                placeholder: 'All statuses',
                                options: BookingStatusOptions,
                                name: 'status',
                                icon: <Package className="h-4 w-4" />,
                            },
                        ]}
                    />

                    <div className="mt-6"></div>

                    {store.booking.pagination.data.length == 0 ? (
                        <div className="border-2 border-dashed border-gray-300 p-8 text-center">
                            <div>
                                <div className="mx-auto text-center">
                                    <Package className="mx-auto h-8 w-8 text-gray-600" />
                                </div>
                                <div className="mt-2 text-center text-gray-600">No data available</div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-1">
                            {store.booking.pagination.data.map((item) => (
                                <div className="">
                                    <BookingCard mode="admin" booking={item} />
                                </div>
                            ))}
                        </div>
                    )}

                    {store.booking.pagination.last_page > 1 && store.booking.pagination.data.length > store.booking.pagination.per_page && (
                        <FullPagination
                            className="mt-4"
                            canEdit={true}
                            pagination={store.booking.pagination}
                            onGoto={(page) => search({ page })}
                            onPerPage={(perPage) => search({ per_page: perPage })}
                        />
                    )}
                </div>
            </AppLayout>
        </>
    );
}
