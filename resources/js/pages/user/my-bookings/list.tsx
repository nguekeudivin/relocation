import BookingCard from '@/components/booking/booking-card';
import PageTitle from '@/components/common/PageTitle';
import { useSimpleForm } from '@/hooks/use-simple-form';
import useTranslation from '@/hooks/use-translation';
import MemberLayout from '@/layouts/member-layout/member-layout';
import useAppStore from '@/store';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';

export default function MyBookings() {
    const store = useAppStore();
    const { auth, success, warning } = usePage<any>().props;

    const searchForm = useSimpleForm({ keyword: '' });

    const search = ({ page = 1, perPage = 10 } = {}) => {
        store.booking.fetch({ page, perPage, ...searchForm.values, user_id: auth.user.id });
    };

    useEffect(() => {
        search();
    }, []);

    const { t } = useTranslation();

    return (
        <>
            <MemberLayout breadcrumbds={[]}>
                <div className="mx-auto max-w-4xl px-4 md:px-0">
                    <PageTitle title={t('My bookings')} />

                    {success != '' && success != null && success != undefined && (
                        <div className="mt-4 mt-6 mb-4 bg-green-100 p-3 text-center text-sm font-medium font-semibold text-green-600">{success}</div>
                    )}

                    {warning != '' && warning != null && warning != undefined && (
                        <div className="mt-4 mt-6 mb-4 bg-red-100 p-3 text-center text-sm font-medium text-red-600">{warning}</div>
                    )}

                    <div className="mt-6"></div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-1">
                        {store.booking.pagination.data.map((booking) => (
                            <BookingCard mode="user" booking={booking} />
                        ))}
                    </div>
                </div>
            </MemberLayout>
        </>
    );
}
