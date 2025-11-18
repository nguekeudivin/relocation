'use client';

import FullPagination from '@/components/common/FullPagination';
import SimpleTable from '@/components/ui/table';
import { useSimpleForm } from '@/hooks/use-simple-form';
import useAppStore from '@/store';
import { useEffect } from 'react';
import { SearchEngine } from '../shared/search-engine';
import { BookingTableColumns } from './booking-meta';

export default function BookingTable() {
    const store = useAppStore();

    const searchForm = useSimpleForm({ keyword: '' });

    const search = ({ page = 1, perPage = 10 } = {}) => {
        store.booking.fetch({ page, perPage, ...searchForm.values });
    };

    useEffect(() => {
        search();
    }, []);

    return (
        <>
            <SearchEngine form={searchForm} onSubmit={undefined} selects={[]} />

            <SimpleTable
                items={store.booking.pagination.data}
                columns={BookingTableColumns({
                    onView: (booking: any) => {
                        store.booking.setCurrent(booking);
                        store.display.show('view_booking');
                    },
                    onEdit: (booking: any) => {
                        store.booking.setCurrent(booking);
                        store.display.show('edit_booking');
                    },
                    onDelete: (booking: any) => {
                        store.booking.setCurrent(booking);
                        store.display.show('delete_booking');
                    },
                })}
            />

            <FullPagination
                className="mt-4"
                canEdit={true}
                pagination={store.booking.pagination}
                onGoto={(page) => search({ page })}
                onPerPage={(perPage) => search({ perPage })}
            />
        </>
    );
}
