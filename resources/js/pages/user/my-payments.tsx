import FullPagination from '@/components/common/FullPagination';
import PageTitle from '@/components/common/PageTitle';
import { UserPaymentTableColumns } from '@/components/payment/payment-meta';
import { SearchEngine } from '@/components/shared/search-engine';
import SimpleTable from '@/components/ui/table';
import { useSimpleForm } from '@/hooks/use-simple-form';
import useTranslation from '@/hooks/use-translation';
import MemberLayout from '@/layouts/member-layout/member-layout';
import useAppStore from '@/store';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';

export default function MyPayments() {
    const store = useAppStore();
    const { auth } = usePage<any>().props;

    const searchForm = useSimpleForm({ keyword: '' });

    const search = ({ page = 1, perPage = 10 } = {}) => {
        store.payment.fetch({ page, perPage, ...searchForm.values, user_id: auth.user.id });
    };

    useEffect(() => {
        search();
    }, []);

    const { t } = useTranslation();

    return (
        <>
            <MemberLayout breadcrumbds={[]}>
                <div className="mx-auto max-w-5xl px-4 md:px-0">
                    <PageTitle title="My payments" />

                    <div className="mt-5"></div>

                    <SearchEngine form={searchForm} inputSize="w-full md:w-[400px]" onSubmit={undefined} selects={[]} />

                    <div className="mt-6"></div>

                    {/* <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {store.payment.pagination.data.map((item) => (
                            <div className="border border-gray-200 p-4">
                                <p className="text-lg font-semibold">
                                    {item.amount} {` €`}
                                </p>
                                <div className="mt-4 flex items-center gap-4">
                                    <span className={cn('rounded-full px-2 py-1 text-sm', PaymentMethodColors[item.method])}>
                                        {t(PaymentMethodMap[item.method])}
                                    </span>
                                    <span className={cn('rounded-full px-2 py-1 text-sm', PaymentStatusColors[item.status])}>
                                        {t(PaymentStatusMap[item.status])}
                                    </span>
                                </div>
                                <ul className="mt-4 text-sm">
                                    <li className="flex items-center border border-gray-200">
                                        <div className="bg-gray-200 px-4 py-2">{t('Processed At')}</div>
                                        <div className="px-4 py-2">{item.processed_at ? formatDate(item.processed_at) : '—'}</div>
                                    </li>
                                    <li className="flex items-center border border-gray-100 border-gray-200 border-t-gray-100">
                                        <div className="bg-gray-200 px-4 py-2">{t('Registered At')}</div>
                                        <div className="px-4 py-2">{formatDate(item.created_at)}</div>
                                    </li>
                                </ul>
                            </div>
                        ))}
                    </div> */}

                    <SimpleTable
                        items={store.payment.items}
                        columns={UserPaymentTableColumns({
                            onView: (item: any) => {
                                store.payment.setCurrent(item);
                                store.display.show('view_expense');
                            },

                            onDelete: async (item: any) => {
                                await store.payment.destroy(item.id);
                            },
                        })}
                    />

                    {store.booking.pagination.total > store.booking.pagination.per_page && (
                        <FullPagination
                            className="mt-8"
                            canEdit={true}
                            pagination={store.booking.pagination}
                            onGoto={(page) => search({ page })}
                            onPerPage={(perPage) => search({ perPage })}
                        />
                    )}
                </div>
            </MemberLayout>
        </>
    );
}
