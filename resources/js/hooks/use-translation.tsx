// hooks/use-translation.ts
import de from '@/config/i18/de';
import fr from '@/config/i18/fr';

const dictionaries: Record<string, Record<string, string>> = {
    en: {}, // English keys are the keys themselves
    fr,
    de,
};

export default function useTranslation() {
    const lang = typeof window !== 'undefined' ? localStorage.getItem('locale') || 'en' : 'en';

    const t = (key: string, params?: Record<string, string | number>): string => {
        let translation: string;

        if (lang === 'en') {
            translation = key;
        } else {
            translation = dictionaries[lang]?.[key] ?? key;
        }

        // Si pas de paramètres → on retourne la traduction brute
        if (!params || Object.keys(params).length === 0) {
            return translation;
        }

        // Remplacement des {{variable}} par leurs valeurs
        return Object.entries(params).reduce((acc, [paramKey, value]) => {
            const regex = new RegExp(`\\{\\{${paramKey}\\}\\}`, 'g');
            return acc.replace(regex, String(value));
        }, translation);
    };

    return { t };
}
