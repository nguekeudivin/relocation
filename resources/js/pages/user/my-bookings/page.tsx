import BookingTable from '@/components/booking/booking-table';
import PageTitle from '@/components/common/PageTitle';
import AppLayout from '@/layouts/app-layout/app-layout';
import useAppStore from '@/store';

export default function MyBookingPage() {
    const store = useAppStore();

    return (
        <>
            <AppLayout breadcrumbds={[]}>
                <PageTitle title="Bookings" />
                <BookingTable />
            </AppLayout>
        </>
    );
}
