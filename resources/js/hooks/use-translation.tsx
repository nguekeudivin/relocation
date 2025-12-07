// hooks/use-translation.ts
import de from '@/../lang/de.json';
import en from '@/../lang/en.json';
import fr from '@/../lang/fr.json';

const dictionaries: Record<string, Record<string, string>> = {
    en, // English keys are the keys themselves
    fr,
    de,
};

export default function useTranslation() {
    const lang = typeof window !== 'undefined' ? localStorage.getItem('locale') || 'en' : 'en';

    const t = (key: string, params?: Record<string, string | number>): string => {
        let translation = dictionaries[lang]?.[key] ?? key;

        if (!params || Object.keys(params).length === 0) {
            return translation;
        }

        // Replace occurrences of :paramKey
        return Object.entries(params).reduce((acc, [paramKey, value]) => {
            const regex = new RegExp(`:${paramKey}(?![A-Za-z0-9_])`, 'g');
            return acc.replace(regex, String(value));
        }, translation);
    };

    return { t };
}
