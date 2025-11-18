import { Head, useForm } from '@inertiajs/react';
import { ChangeEvent, FormEventHandler } from 'react';

import TextLink from '@/components/typography/text-link';
import { Button } from '@/components/ui/button';
import { InputField } from '@/components/ui/form';
import PhoneNumberField from '@/components/ui/form/PhoneNumberField';
import AuthLayout from '@/layouts/auth-layout';
import { cn } from '@/lib/utils';

type LoginForm = {
    phone_number: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        phone_number: '+237655660502',
        password: 'password',
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

    return (
        <AuthLayout>
            <Head title="Connexion" />

            <h3 className="mt-8 text-center text-3xl font-semibold">Bienvenue !</h3>
            <h4 className="mt-1 text-center text-gray-700">Connectez-vous pour accéder à votre compte</h4>

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
                <div className="mt-6 space-y-4">
                    <div>
                        <label className={cn('mb-1.5 block text-sm font-medium text-gray-900')}>Phone number</label>
                        <PhoneNumberField
                            value={data.phone_number}
                            onValueChange={(value: string) => {
                                setData('phone_number', value);
                            }}
                            error={errors.phone_number}
                        />
                    </div>
                </div>

                <InputField
                    label="Mot de passe"
                    name="password"
                    value={data.password}
                    onChange={handleChange}
                    canToggleType={true}
                    type="password"
                    error={errors.password}
                />

                <div className="mt-4 text-sm text-gray-700">
                    {canResetPassword && (
                        <TextLink href={route('password.request')} className="ml-auto text-sm" tabIndex={5}>
                            <span>Vous avez oublié votre mot de passe ?</span>
                            <span className="ml-1 text-teal-800 hover:underline">{`Oui j'ai oublié mon mot de passe`}</span>
                        </TextLink>
                    )}
                </div>

                <div className="mt-8">
                    <Button className="w-full" loading={processing} type="submit">
                        Se connecter
                    </Button>
                </div>

                {/* <div className="text-muted-foreground mt-4 text-center text-sm">
                    <TextLink href={route('register')} tabIndex={5}>
                        <span>Vous n'avez pas de compte ?</span>
                        <span className="ml-1 text-teal-800 hover:underline">{`Créer un compte`}</span>
                    </TextLink>
                </div> */}
            </form>
        </AuthLayout>
    );
}
