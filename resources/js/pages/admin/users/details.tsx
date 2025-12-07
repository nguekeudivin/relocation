import BookingCard from '@/components/booking/booking-card';
import PageTitle from '@/components/common/PageTitle';
import { PaymentTableColumns } from '@/components/payment/payment-meta';
import Avatar from '@/components/ui/avatar';
import Show from '@/components/ui/show';
import SimpleTable from '@/components/ui/table';
import { UsersModals } from '@/components/users/users-modals';
import useTranslation from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout/app-layout';
import { cn } from '@/lib/utils';
import useAppStore from '@/store';
import { Booking } from '@/store/Booking';
import { getFullName } from '@/store/User';
import { usePage } from '@inertiajs/react';
import { Banknote, Book, Check, X } from 'lucide-react';
import { useState } from 'react';

export default function UserDetailsPage() {
    const { t } = useTranslation();
    const { user, bookings, payments } = usePage<any>().props;
    const [activeTab, setActiveTab] = useState<any>('bookings');
    const store = useAppStore();

    return (
        <>
            <UsersModals />
            <AppLayout breadcrumbds={[]}>
                <section className="mx-auto max-w-5xl px-4 md:px-0">
                    <PageTitle title={t('Client details')} actions={<></>} />
                    <div className="mt-4"></div>
                    <div className="border-b border-gray-200">
                        <ul className="-mb-px flex flex-wrap text-center text-sm font-medium text-gray-500">
                            {[
                                { name: 'Bookings', icon: Book, key: 'bookings' },
                                {
                                    name: 'Payments',
                                    icon: Banknote,
                                    key: 'payments',
                                },
                            ].map((tab: any) => {
                                const isActive = activeTab === tab.key;
                                return (
                                    <li key={tab.key} className="me-2">
                                        <button
                                            onClick={() => setActiveTab(tab.key)}
                                            className={`group inline-flex items-center justify-center rounded-t-lg border-b-2 p-4 ${isActive ? 'text-secondary-600 border-secondary-600' : 'border-transparent hover:border-gray-300 hover:text-gray-600'} ${tab.disabled ? 'cursor-not-allowed text-gray-400' : ''} `}
                                        >
                                            <tab.icon
                                                className={`me-2 h-4 w-4 ${isActive ? 'text-secondary-600' : 'text-gray-400 group-hover:text-gray-500'}`}
                                            />
                                            {tab.name}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <div className="mt-4">
                        <div
                            className={cn('hidden', {
                                block: activeTab == 'bookings',
                            })}
                        >
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-1">
                                {bookings.map((item: Booking) => (
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
                                                                <p className="cursor-pointer hover:text-blue-800 hover:underline">
                                                                    {getFullName(item.user)}
                                                                </p>
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
                        </div>

                        <div
                            className={cn('hidden', {
                                block: activeTab == 'payments',
                            })}
                        >
                            <SimpleTable
                                items={payments}
                                columns={PaymentTableColumns({
                                    onView: (payment: any) => {
                                        store.payment.setCurrent(payment);
                                        store.display.show('view_payment');
                                    },
                                    onDelete: (payment: any) => {
                                        store.payment.setCurrent(payment);
                                        store.display.show('delete_payment');
                                    },
                                })}
                            />
                        </div>
                    </div>
                </section>
            </AppLayout>
        </>
    );
}
