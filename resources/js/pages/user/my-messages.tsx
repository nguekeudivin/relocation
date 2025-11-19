import PageTitle from '@/components/common/PageTitle';
import useTranslation from '@/hooks/use-translation';
import MemberLayout from '@/layouts/member-layout/member-layout';

export default function MyBookingPage() {
    const { t } = useTranslation();
    return (
        <>
            <MemberLayout breadcrumbds={[]}>
                <div className="mx-auto max-w-4xl">
                    <PageTitle title={t('My Messages')} />
                </div>
            </MemberLayout>
        </>
    );
}
