import BookingCard from '@/components/booking/booking-card';
import PageTitle from '@/components/common/PageTitle';
import DataPlaceholder from '@/components/shared/data-placeholder';
import useTranslation from '@/hooks/use-translation';
import MemberLayout from '@/layouts/member-layout/member-layout';
import useAppStore from '@/store';
import { Booking } from '@/store/Booking';
import { usePage } from '@inertiajs/react';
import { Info } from 'lucide-react';

export default function MyBookings() {
    const store = useAppStore();
    const { success, warning, bookings } = usePage<any>().props;

    const { t } = useTranslation();

    return (
        <>
            <MemberLayout breadcrumbds={[]}>
                <div className="mx-auto max-w-5xl px-4 md:px-0">
                    <PageTitle title={t('My bookings')} />

                    {success != '' && success != null && success != undefined && (
                        <div className="mt-4 mt-6 mb-4 bg-green-100 p-3 text-center text-sm font-medium font-semibold text-green-600">{success}</div>
                    )}

                    {warning != '' && warning != null && warning != undefined && (
                        <div className="mt-4 mt-6 mb-4 bg-red-100 p-3 text-center text-sm font-medium text-red-600">{warning}</div>
                    )}

                    <div className="mt-6 mb-6 rounded-2xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
                        <div className="flex items-start gap-4">
                            {/* Icon */}
                            <div className="flex h-10 w-10 items-center justify-center">
                                <Info className="text-blue-800" />
                            </div>

                            {/* Content */}
                            <div>
                                <h3 className="text-sm font-semibold text-blue-900">Additional Information</h3>

                                <p className="mt-1 text-sm leading-relaxed text-blue-800">
                                    If you have any additional details regarding your move, please use the message section to chat with our team. You
                                    can also upload photos and provide specific information about the items you would like us to transport.
                                </p>
                            </div>
                        </div>
                    </div>

                    {bookings.length ? (
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-1">
                            {bookings.map((booking: Booking) => (
                                <BookingCard mode="user" booking={booking} />
                            ))}
                        </div>
                    ) : (
                        <DataPlaceholder className="py-4" />
                    )}
                </div>
            </MemberLayout>
        </>
    );
}
