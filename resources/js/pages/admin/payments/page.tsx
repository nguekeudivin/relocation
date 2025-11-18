import FullPagination from '@/components/common/FullPagination';
import PageTitle from '@/components/common/PageTitle';
import { SearchEngine } from '@/components/common/SearchEngine';
import { PaymentTableColumns } from '@/components/payment/payment-meta';
import { Button } from '@/components/ui/button';
import SimpleTable from '@/components/ui/table';
import { useSimpleForm } from '@/hooks/use-simple-form';
import AppLayout from '@/layouts/app-layout/app-layout';
import useAppStore from '@/store';
import { Plus } from 'lucide-react';
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

    return (
        <>
            <AppLayout breadcrumbds={[]}>
                <section className="mx-auto max-w-5xl">
                    <PageTitle
                        title="Les depenses"
                        actions={
                            <div className="space-x-4">
                                <Button onClick={() => store.display.show('create_expense')}>
                                    <Plus className="h-5 w-5" />
                                    Enregister une depense
                                </Button>
                                {/* <Button color="secondary" onClick={() => exportExpenses(store.transaction.items)}>
                                    <FileText className="h-5 w-5" />
                                    Exporter
                                </Button> */}
                            </div>
                        }
                    />
                    <div className="mt-8"></div>
                    <SearchEngine form={searchForm} onSubmit={() => search({})} />

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

                    {store.payment.ipems.length > store.payment.pagination.per_page && (
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
