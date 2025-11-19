import SimpleTable from '@/components/ui/table';
import { useSimpleForm } from '@/hooks/use-simple-form';
import useAppStore from '@/store';
import { User } from '@/store/User';
import { useEffect } from 'react';
import FullPagination from '../common/FullPagination';
import { SearchEngine } from '../shared/search-engine';
import { UsersTableColumns } from './users-meta';

export default function UsersTable() {
    const store = useAppStore();

    const searchForm = useSimpleForm({
        keyword: '',
        status: '',
    });

    const search = ({ page = 1, per_page = 10 }: { page?: number; per_page?: number }) => {
        store.user.fetch({
            page,
            per_page,
            ...searchForm.values,
        });
    };

    useEffect(() => {
        search({});
    }, []);

    return (
        <>
            <SearchEngine form={searchForm} inputSize="w-full md:w-[400px]" onSubmit={undefined} selects={[]} />
            <div className="mt-4"></div>
            <SimpleTable
                headClass="bg-gray-100"
                items={store.user.items}
                columns={UsersTableColumns({
                    onView: (item: User) => {
                        store.user.setCurrent(item);
                        store.display.show('view_user');
                    },
                    onEdit: (item: User) => {
                        store.user.setCurrent(item);
                        store.display.show('edit_user');
                    },
                    onDelete: async (item: User) => {
                        await store.user.destroy(item.id);
                    },
                })}
            />

            {store.user.items.length > store.user.pagination.per_page && (
                <FullPagination
                    className="mt-8"
                    canEdit={true}
                    pagination={store.user.pagination}
                    onGoto={(pageNumber: number) => {
                        search({ page: pageNumber });
                    }}
                    onPerPage={(perPage) => {
                        search({ per_page: perPage });
                    }}
                />
            )}
        </>
    );
}
