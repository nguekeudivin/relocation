import PageTitle from '@/components/common/PageTitle';
import MemberLayout from '@/layouts/member-layout/member-layout';

export default function MyBookingPage() {
    return (
        <>
            <MemberLayout breadcrumbds={[]}>
                <div className="mx-auto max-w-4xl">
                    <PageTitle title="My profile" />
                </div>
            </MemberLayout>
        </>
    );
}
