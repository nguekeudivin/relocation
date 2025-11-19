import PageTitle from '@/components/common/PageTitle';
import AppLayout from '@/layouts/app-layout/app-layout';
import useAppStore from '@/store';

export default function ContributionsPage() {
    const store = useAppStore();

    return (
        <>
            <AppLayout breadcrumbds={[]}>
                <PageTitle title="Bookings" />
                <ContributionsPage />
            </AppLayout>
        </>
    );
}
