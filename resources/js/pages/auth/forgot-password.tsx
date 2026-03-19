import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import TextLink from '@/components/typography/text-link';
import { Button } from '@/components/ui/button';
import { InputField } from '@/components/ui/form';
import useTranslation from '@/hooks/use-translation';
import AuthLayout from '@/layouts/auth-layout';

type ForgotPasswordForm = {
    email: string;
};

interface ForgotPasswordProps {
    status?: string;
}

export default function ForgotPassword({ status }: ForgotPasswordProps) {
    const { t } = useTranslation();

    const { data, setData, post, processing, errors } = useForm<ForgotPasswordForm>({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <AuthLayout>
            <Head title={t('Forgot password?')} />

            <div className="mx-auto h-[100px] w-[100px] bg-cover" style={{ backgroundImage: `url(/images/logo-1.jpeg)` }}></div>

            <h3 className="mt-8 text-center text-3xl font-semibold">{t('Forgot password?')}</h3>
            <h4 className="mt-1 text-center text-gray-700">
                {t('No problem. Just enter your email address and we will send you a password reset link so you can choose a new one.')}
            </h4>

            {status && <div className="mt-6 mb-4 rounded-md bg-green-50 p-3 text-center text-sm font-medium text-green-600">{status}</div>}

            <div className="mt-6 space-y-6">
                <InputField
                    label={t('Email address')}
                    name="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    error={errors.email}
                    type="email"
                    autoFocus
                />
            </div>

            <div className="mt-8">
                <Button className="w-full" loading={processing} onClick={submit}>
                    {t('Send password reset link')}
                </Button>
            </div>

            <div className="text-muted-foreground mt-4 text-center text-sm">
                <TextLink href={route('login')} tabIndex={5}>
                    <span>{t('Back to login')}</span>
                </TextLink>
            </div>
        </AuthLayout>
    );
}
