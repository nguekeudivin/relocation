import BookingCard from '@/components/booking/booking-card';
import { CompleteBookingModal } from '@/components/booking/booking-modals/complete-booking-modal';
import { ConfirmBookingModal } from '@/components/booking/booking-modals/confirm-booking-modal';
import { RejectBookingModal } from '@/components/booking/booking-modals/reject-booking-modal';
import FullPagination from '@/components/common/FullPagination';
import PageTitle from '@/components/common/PageTitle';
import { SearchEngine } from '@/components/shared/search-engine';
import Avatar from '@/components/ui/avatar';
import Show from '@/components/ui/show';
import { useSimpleForm } from '@/hooks/use-simple-form';
import useTranslation from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout/app-layout';
import useAppStore from '@/store';
import { getFullName } from '@/store/User';
import { Check, X } from 'lucide-react';
import { useEffect } from 'react';

export default function BookingsPage() {
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
            <RejectBookingModal />
            <ConfirmBookingModal />
            <CompleteBookingModal />
            <AppLayout breadcrumbds={[]}>
                <div className="mx-auto max-w-5xl px-4 md:px-0">
                    <PageTitle title="Bookings" />

                    <div className="mt-5"></div>

                    <SearchEngine form={searchForm} inputSize="w-full md:w-[400px]" onSubmit={undefined} selects={[]} />

                    <div className="mt-6"></div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-1">
                        {store.booking.pagination.data.map((item) => (
                            <div className="">
                                <BookingCard
                                    mode="admin"
                                    booking={item}
                                    header={
                                        <div className="flex justify-between bg-gray-50 px-4">
                                            <div className="flex gap-2 p-2">
                                                <div className="cursor-pointer">
                                                    <Avatar
                                                        //name={item?.user?.first_name}
                                                        name={`${item.id}`}
                                                        url={undefined}
                                                        className="h-8 w-8 hover:border-1 hover:border-blue-200"
                                                    />
                                                </div>

                                                {item.user ? (
                                                    <div className="text-gray-800">
                                                        <p className="cursor-pointer hover:text-blue-800 hover:underline">{getFullName(item.user)}</p>
                                                        <p className="text-gray-500"> {item.user.email}</p>
                                                        <p className="text-gray-500"> {item.user.phone_number}</p>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <p className="cursor-pointer hover:text-blue-800 hover:underline">{item.email}</p>
                                                        {/* <p className="text-gray-500"> {item.user.email}</p> */}
                                                    </>
                                                )}
                                            </div>
                                            <div>
                                                <div className="mt-4 flex items-center gap-4">
                                                    <Show when={item.status == 'pending'}>
                                                        <button
                                                            onClick={() => {
                                                                store.booking.setCurrent(item as any);
                                                                store.display.show('confirm_booking');
                                                            }}
                                                            className="flex items-center gap-1 border border-green-200 bg-green-50 px-4 py-1.5 font-medium text-green-600 hover:underline"
                                                        >
                                                            <Check className="h-4 w-4" />
                                                            {t('Confirm')}
                                                        </button>

                                                        <button
                                                            onClick={() => {
                                                                store.booking.setCurrent(item as any);
                                                                store.display.show('reject_booking');
                                                            }}
                                                            className="flex items-center gap-1 border border-red-200 bg-red-50 px-4 py-1.5 font-medium text-red-600 hover:underline"
                                                        >
                                                            <X className="h-4 w-4" />
                                                            {t('Reject')}
                                                        </button>
                                                    </Show>
                                                    <Show when={item.status == 'confirmed'}>
                                                        <button
                                                            onClick={() => {
                                                                store.booking.setCurrent(item as any);
                                                                store.display.show('complete_booking');
                                                            }}
                                                            className="flex items-center gap-1 border border-sky-200 bg-sky-50 px-4 py-1.5 font-medium text-sky-600 hover:underline"
                                                        >
                                                            <Check className="h-4 w-4" />
                                                            {t('Complete')}
                                                        </button>
                                                    </Show>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                />
                            </div>
                        ))}
                    </div>

                    <FullPagination
                        className="mt-4"
                        canEdit={true}
                        pagination={store.booking.pagination}
                        onGoto={(page) => search({ page })}
                        onPerPage={(perPage) => search({ perPage })}
                    />
                </div>
            </AppLayout>
        </>
    );
}
