import PageTitle from '@/components/common/PageTitle';
import { Button } from '@/components/ui/button';
import { UsersModals } from '@/components/users/users-modals';
import UsersTable from '@/components/users/users-table';
import AppLayout from '@/layouts/app-layout/app-layout';
import useAppStore from '@/store';
import { Plus } from 'lucide-react';

export default function UsersPage() {
    const store = useAppStore();

    return (
        <>
            <UsersModals />
            <AppLayout breadcrumbds={[]}>
                <section className="mx-auto max-w-5xl">
                    <PageTitle
                        title="Membres"
                        actions={
                            <>
                                <Button
                                    onClick={() => store.display.show('create_user')}
                                    className="bg-primary-600 flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-white"
                                >
                                    <Plus className="h-5 w-5" />
                                    Ajouter un membre
                                </Button>
                            </>
                        }
                    />
                    <UsersTable />
                </section>
            </AppLayout>
        </>
    );
}
