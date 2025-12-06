import useTranslation from '@/hooks/use-translation';
import useAppStore from '@/store';
import { Globe } from 'lucide-react';
import { useEffect, useState } from 'react';
import Dropdown from '../ui/dropdown';

const LANGUAGES = [
    { code: 'en', label: 'English', flag: 'https://flagcdn.com/w80/en.png' },
    { code: 'fr', label: 'French', flag: 'https://flagcdn.com/w80/fr.png' },
    { code: 'de', label: 'Deutsch', flag: 'https://flagcdn.com/w80/de.png' },
];

export default function ChangeLanguage() {
    const { t } = useTranslation();
    const [currentLang, setCurrentLang] = useState<string>('en');
    const store = useAppStore();

    useEffect(() => {
        const storedLang = localStorage.getItem('locale') || 'en';
        setCurrentLang(storedLang);
    }, []);

    const handleChangeLanguage = (lang: string) => {
        localStorage.setItem('locale', lang);
        setCurrentLang(lang);
        // Optional: reload the page to apply language globally
        window.location.reload();
    };

    return (
        <Dropdown.Root>
            <Dropdown.Trigger>
                <button className="flex items-center justify-center rounded-md p-2 hover:bg-gray-100">
                    <Globe className="h-4 w-4 text-gray-600" />
                </button>
            </Dropdown.Trigger>

            <Dropdown.Content>
                {LANGUAGES.map((lang) => (
                    <Dropdown.Item key={lang.code} onClick={() => handleChangeLanguage(lang.code)} className="flex items-center gap-2">
                        <span
                            className="h-6 w-6 shrink-0 rounded-full bg-gray-200 bg-cover bg-center"
                            style={{ backgroundImage: `url(${lang.flag})` }}
                        ></span>
                        <span className={currentLang === lang.code ? 'font-semibold' : ''}>{t(lang.label)}</span>
                    </Dropdown.Item>
                ))}
            </Dropdown.Content>
        </Dropdown.Root>
    );
}
