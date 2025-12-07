import PageTitle from '@/components/common/PageTitle';
import { UsersModals } from '@/components/users/users-modals';
import UsersTable from '@/components/users/users-table';
import useTranslation from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout/app-layout';

export default function UsersPage() {
    const { t } = useTranslation();

    return (
        <>
            <UsersModals />
            <AppLayout breadcrumbds={[]}>
                <section className="mx-auto max-w-5xl px-4 md:px-0">
                    <PageTitle title={t('Clients')} actions={<></>} />
                    <div className="mt-4"></div>
                    <UsersTable />
                </section>
            </AppLayout>
        </>
    );
}
