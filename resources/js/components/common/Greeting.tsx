import useTranslation from '@/hooks/use-translation';
import { getFullName } from '@/store/User';
import { usePage } from '@inertiajs/react';

export const Greeting = () => {
    const { auth } = usePage<any>().props;
    const { t } = useTranslation();
    return (
        <header>
            <h3 className="text-3xl font-semibold">{`Hi, ${getFullName(auth.user)} 👋`}</h3>
            <h4 className="mt-2 text-lg text-gray-600">{t(`Welcome back`)}</h4>
        </header>
    );
};
