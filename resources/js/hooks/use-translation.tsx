import fr from '@/config/i18/fr';
import { usePage } from '@inertiajs/react';

export default function useTranslation() {
    const { auth, lang } = usePage<any>().props;

    const t = (key: string): string => {
        if (lang === 'en') return key;

        return fr[key] ?? key; // fallback to key if not translated
    };

    return { t };
}
