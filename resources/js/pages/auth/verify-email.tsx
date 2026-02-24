import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import TextLink from '@/components/typography/text-link';
import { Button } from '@/components/ui/button'; // Assuming Button component is available
import useTranslation from '@/hooks/use-translation';
import AuthLayout from '@/layouts/auth-layout';

export default function VerifyEmail({ status }: { status?: string }) {
    const { t } = useTranslation();
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <AuthLayout>
            <Head title={t('Email verification')} />

            {/* Logo and Titles similar to other auth pages */}
            <div className="mx-auto h-[100px] w-[100px] bg-cover" style={{ backgroundImage: `url(/images/logo-1.jpeg)` }}></div>

            <h3 className="mt-8 text-center text-3xl font-semibold">{t('Verify your email address')}</h3>
            <h4 className="mt-1 text-center text-gray-700">
                {t(
                    'Thanks for signing up! Before getting started, please verify your email address by clicking the link we just emailed to you. If you did not receive the email, we will gladly send you another.',
                )}
            </h4>

            {status === 'verification-link-sent' && (
                <div className="mt-6 mb-4 rounded-md bg-green-50 p-3 text-center text-sm font-medium text-green-600">
                    {t('A new verification link has been sent to the email address you provided during registration.')}
                </div>
            )}

            <form onSubmit={submit} className="mt-6 space-y-6 text-center">
                <Button className="w-full" loading={processing} type="submit">
                    {processing ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {t('Resend verification email')}
                </Button>

                <TextLink href={route('logout')} method="post" className="mx-auto block text-sm text-teal-800 hover:underline">
                    {t('Logout')}
                </TextLink>
            </form>
        </AuthLayout>
    );
}
