import { AutocompleteCityInput } from '@/components/shared/autocomplete-city-input';
import { InputField, TextAreaField } from '@/components/ui/form';
import Show from '@/components/ui/show';
import useTranslation from '@/hooks/use-translation';
import useAppStore from '@/store';

interface Props {
    form: any;
    showError?: boolean;
}

export default function BookingLocationStep({ form, showError = true }: Props) {
    const { t } = useTranslation();
    const store = useAppStore();

    return (
        <>
            <h3 className="text-lg font-semibold">{t('What are the addresses for the relocation ?')}</h3>
            <Show when={showError}>{store.errors.render()}</Show>

            <ol className="relative mt-6">
                <li className="border-l-3 border-gray-300 pb-8 pl-4">
                    <div className="bg-primary-100 absolute -top-2 -left-2 flex h-8 w-[80px] items-center justify-center border-4 border-white">
                        <span className="text-primary-500 text-xs font-bold">{t('Pick-up')}</span>
                    </div>

                    <h4 className="text-sm font-semibold">{t('From')}</h4>
                    <div className="mt-3 space-y-3">
                        <div className="md:flex md:gap-2">
                            <div className="w-full">
                                <label className="text-xs text-gray-600">{t('City')}</label>
                                <AutocompleteCityInput
                                    name="from_city"
                                    value={form.values.from_city || ''}
                                    onChange={form.handleChange}
                                    onSelect={form.handleChange}
                                    placeholder={t('Start typing a city...')}
                                />
                            </div>
                            <div className="mt-3 md:mt-0 md:w-[200px] md:shrink-1">
                                <label className="text-xs text-gray-600">{t('Postal code')}</label>
                                <InputField name="from_postal_code" value={form.values.from_postal_code} onChange={form.handleChange} />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-gray-600">{t('Street address')}</label>
                            <TextAreaField
                                name="from_street"
                                value={form.values.from_street}
                                onChange={form.handleChange}
                                rows={2}
                                placeholder={t('Enter full address (street, number, floor...)')}
                            />
                        </div>
                    </div>
                </li>
            </ol>

            <ol className="relative">
                <li className="border-primary-600 pb-8 pl-4">
                    <div className="bg-primary-100 absolute -top-2 -left-2 flex h-8 w-[80px] items-center justify-center border-4 border-white">
                        <span className="text-primary-500 text-xs font-bold">{t('Delivery')}</span>
                    </div>
                    <h4 className="text-sm font-semibold">{t('To')}</h4>
                    <div className="mt-3 space-y-3">
                        <div className="md:flex md:gap-2">
                            <div className="w-full">
                                <label className="text-xs text-gray-600">{t('City')}</label>
                                <AutocompleteCityInput
                                    name="to_city"
                                    value={form.values.to_city || ''}
                                    onChange={form.handleChange}
                                    onSelect={form.handleChange}
                                    placeholder={t('Start typing a city...')}
                                />
                            </div>
                            <div className="mt-3 md:mt-0 md:w-[200px] md:shrink-1">
                                <label className="text-xs text-gray-600">{t('Postal code')}</label>
                                <InputField name="to_postal_code" value={form.values.to_postal_code} onChange={form.handleChange} />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-gray-600">{t('Street address')}</label>
                            <TextAreaField
                                name="to_street"
                                value={form.values.to_street}
                                onChange={form.handleChange}
                                rows={2}
                                placeholder={t('Enter full address (street, number, floor...)')}
                            />
                        </div>
                    </div>
                </li>
            </ol>
        </>
    );
}
