import de from '@/config/i18/de';
import fr from '@/config/i18/fr';

const dictionaries: Record<string, Record<string, string>> = {
    en: {}, // English keys are the keys themselves
    fr,
    de,
};

export default function useTranslation() {
    // Try to read the language from localStorage, default to 'en'
    const lang = typeof window !== 'undefined' ? localStorage.getItem('locale') || 'en' : 'en';

    const t = (key: string): string => {
        if (lang === 'en') return key; // English uses key as-is
        return dictionaries[lang]?.[key] ?? key; // fallback to key if translation missing
    };

    return { t };
}
