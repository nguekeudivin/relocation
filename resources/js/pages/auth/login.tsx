import { Head, useForm } from '@inertiajs/react';
import { ChangeEvent, FormEventHandler } from 'react';

import TextLink from '@/components/typography/text-link';
import { Button } from '@/components/ui/button';
import { InputField } from '@/components/ui/form';
import useTranslation from '@/hooks/use-translation';
import AuthLayout from '@/layouts/auth-layout';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    // ✅ Fix: Define change handler
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, type, value, checked } = e.target;
        setData(name as keyof LoginForm, type === 'checkbox' ? checked : value);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const errorsList = Object.values(errors).flat();

    const { t } = useTranslation();

    return (
        <AuthLayout>
            <Head title="Connexion" />

            <h3 className="mt-8 text-center text-3xl font-semibold">{t('Welcome back')}!</h3>
            <h4 className="mt-1 text-center text-gray-700">{t('Connect to your account and manage your bookings')}</h4>

            {status && <div className="my-4 rounded-md bg-green-100 p-4 text-center text-sm font-medium text-green-800">{status}</div>}

            {errorsList.length != 0 && (
                <div className="rounded-md border-red-500 bg-red-50 p-4 text-red-600">
                    <ul className="space-y-2">
                        {errorsList.map((item) => (
                            <li> {item}</li>
                        ))}
                    </ul>
                </div>
            )}

            <form onSubmit={submit} className="mt-6 space-y-6">
                <InputField label="Email address" name="email" value={data.email} onChange={handleChange} canToggleType={true} error={errors.email} />

                <InputField
                    label="Password"
                    name="password"
                    value={data.password}
                    onChange={handleChange}
                    canToggleType={true}
                    type="password"
                    error={errors.password}
                />

                <div className="mt-4 text-sm text-gray-700">
                    {canResetPassword && (
                        <TextLink href="#" className="ml-auto text-sm" tabIndex={5}>
                            <span>{t('Password forget ?')}</span>
                            <span className="ml-1 text-teal-800 hover:underline">{`Yes`}</span>
                        </TextLink>
                    )}
                </div>

                <div className="mt-8">
                    <Button className="w-full" loading={processing} type="submit">
                        {t('Login')}
                    </Button>
                </div>

                <div className="mt-4 text-center">
                    <TextLink href="/" className="text-center text-sm">
                        {t('Back home')}
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
