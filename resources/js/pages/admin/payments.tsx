import FullPagination from '@/components/common/FullPagination';
import PageTitle from '@/components/common/PageTitle';
import { PaymentTableColumns } from '@/components/payment/payment-meta';
import { SearchEngine } from '@/components/shared/search-engine';
import SimpleTable from '@/components/ui/table';
import { useSimpleForm } from '@/hooks/use-simple-form';
import useTranslation from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout/app-layout';
import useAppStore from '@/store';
import { useEffect } from 'react';

export default function PaymentPages() {
    const store = useAppStore();
    const searchForm = useSimpleForm({ keyword: '', status: '' });

    const search = ({ page = 1, per_page = 10 } = {}) => {
        store.payment.fetch({ page, per_page, ...searchForm.values });
    };

    useEffect(() => {
        search({});
    }, []);

    const { t } = useTranslation();

    return (
        <>
            <AppLayout breadcrumbds={[]}>
                <section className="mx-auto max-w-5xl px-4 md:px-0">
                    <PageTitle title={t('Payments')} actions={<></>} />
                    <div className="mt-4"></div>
                    <SearchEngine form={searchForm} inputSize="w-full md:w-[400px]" onSubmit={undefined} selects={[]} />

                    <SimpleTable
                        items={store.payment.items}
                        columns={PaymentTableColumns({
                            onView: (item: any) => {
                                store.payment.setCurrent(item);
                                store.display.show('view_expense');
                            },

                            onDelete: async (item: any) => {
                                await store.payment.destroy(item.id);
                            },
                        })}
                    />

                    {store.payment.items.length > store.payment.pagination.per_page && (
                        <FullPagination
                            className="mt-8"
                            pagination={store.payment.pagination}
                            onGoto={(pageNumber: number) => search({ page: pageNumber })}
                            onPerPage={(perPage) => search({ per_page: perPage })}
                        />
                    )}
                </section>
            </AppLayout>
        </>
    );
}
