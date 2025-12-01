import { TextAreaField } from '@/components/ui/form';
import locations from '@/config/locations.json';
import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import useAppStore from '@/store';
import { useEffect, useRef, useState } from 'react';

interface AutocompleteProps {
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSelect: (city: string) => void;
    placeholder?: string;
    error?: string;
}

const AutocompleteCityInput = ({ name, value, onChange, onSelect, placeholder, error }: AutocompleteProps) => {
    const { t } = useTranslation();
    const [keyword, setKeyword] = useState(value);
    const [filteredCities, setFilteredCities] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Synchroniser la valeur du formulaire avec l'input local
    useEffect(() => {
        setKeyword(value);
    }, [value]);

    // Recherche dans la liste des villes
    const handleSearch = (searchTerm: string) => {
        setKeyword(searchTerm);
        if (!searchTerm.trim()) {
            setFilteredCities([]);
            setIsOpen(false);
            return;
        }

        const results = locations.filter((location) => location.n.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 10); // Limite à 10 résultats

        setFilteredCities(results);
        setIsOpen(results.length > 0);
    };

    const handleSelect = (city: string) => {
        setKeyword(city);
        onSelect({ target: { name, value: city } } as any);
        setIsOpen(false);
    };

    // Fermer le dropdown si on clique à l'extérieur
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative">
            <input
                ref={inputRef}
                type="text"
                name={name}
                value={keyword}
                onChange={(e) => {
                    handleSearch(e.target.value);
                    onChange(e);
                }}
                onFocus={() => keyword.trim() && setIsOpen(filteredCities.length > 0)}
                placeholder={placeholder}
                className={cn(
                    'focus:ring-primary-500 w-full border px-3 py-2 text-sm focus:ring-2 focus:outline-none',
                    error ? 'border-red-500' : 'border-gray-300',
                )}
            />

            {isOpen && filteredCities.length > 0 && (
                <div
                    ref={dropdownRef}
                    className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg"
                >
                    {filteredCities.map((city) => (
                        <button
                            key={city}
                            type="button"
                            onClick={() => handleSelect(city.n)}
                            className="hover:bg-primary-50 hover:text-primary-700 block w-full px-4 py-2 text-left text-sm"
                        >
                            {city.n}
                        </button>
                    ))}
                </div>
            )}

            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
};

export default function BookingLocationStep({ form }: { form: any }) {
    const { t } = useTranslation();
    const store = useAppStore();

    return (
        <>
            <h3 className="text-lg font-semibold">{t('What are the addresses for the relocation ?')}</h3>

            {/* FROM */}
            <ol className="relative mt-6">
                <li className="border-primary-600 border-l-4 pb-8 pl-6">
                    <div className="bg-primary-600 absolute -top-2 -left-2 flex h-8 w-[80px] items-center justify-center rounded-full border-4 border-white">
                        <span className="text-xs font-bold text-white">{t('From')}</span>
                    </div>

                    <h4 className="text-sm font-semibold">{t('From')}</h4>
                    <div className="mt-3 space-y-3">
                        <div>
                            <label className="text-xs text-gray-600">{t('City')}</label>
                            <AutocompleteCityInput
                                name="from_city"
                                value={form.values.from_city || ''}
                                onChange={form.handleChange}
                                onSelect={form.handleChange}
                                placeholder={t('Start typing a city...')}
                            />
                        </div>

                        <div>
                            <label className="text-xs text-gray-600">{t('Street address')}</label>
                            <TextAreaField
                                name="from_street"
                                value={form.values.from_street}
                                onChange={form.handleChange}
                                rows={2}
                                placeholder={t('Enter full address (street, number, floor...)')}
                                error={store.errors.values.from_street}
                            />
                        </div>
                    </div>
                </li>
            </ol>

            {/* TO */}
            <ol className="relative">
                <li className="border-primary-600 pb-8 pl-6">
                    <div className="bg-primary-600 absolute top-0 -left-2 flex h-8 w-[80px] items-center justify-center rounded-full border-4 border-white">
                        <span className="text-xs font-bold text-white">{t('To')}</span>
                    </div>

                    <h4 className="text-sm font-semibold">{t('To')}</h4>
                    <div className="mt-3 space-y-3">
                        <div>
                            <label className="text-xs text-gray-600">{t('City')}</label>
                            <AutocompleteCityInput
                                name="to_city"
                                value={form.values.to_city || ''}
                                onChange={form.handleChange}
                                onSelect={form.handleChange}
                                placeholder={t('Start typing a city...')}
                            />
                        </div>

                        <div>
                            <label className="text-xs text-gray-600">{t('Street address')}</label>
                            <TextAreaField
                                name="to_street"
                                value={form.values.to_street}
                                onChange={form.handleChange}
                                rows={2}
                                placeholder={t('Enter full address (street, number, floor...)')}
                                error={store.errors.values.to_street}
                            />
                        </div>
                    </div>
                </li>
            </ol>
        </>
    );
}
