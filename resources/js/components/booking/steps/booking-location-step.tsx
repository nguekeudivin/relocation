import { SelectField, TextAreaField } from '@/components/ui/form';
import cities from '@/config/cities.json';
import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import useAppStore from '@/store';

export default function BookingLocationStep({ form }: { form: any }) {
    const { t } = useTranslation();
    const store = useAppStore();
    return (
        <>
            <h3 className="text-lg font-semibold">{t('What are the the addresses for the relocation ?')}</h3>
            <ol className="relative mt-6">
                <li className={cn('border-primary-600 border-l-4 pb-4 pl-4')}>
                    <div className="border-primary-600 absolute -start-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-2 bg-white"></div>
                    <h3 className="text-sm font-semibold">{t('From')}</h3>
                    <div className="mt-2 space-y-2 text-sm">
                        <SelectField
                            name="from_city"
                            onChange={form.handleChange}
                            options={cities.map((item) => ({ label: item, value: item }))}
                            value={form.values.from_city}
                            error={store.errors.values.from_city}
                        />
                        <TextAreaField
                            name="from_street"
                            onChange={form.handleChange}
                            rows={2}
                            placeholder={t('Address')}
                            value={form.values.from_street}
                            error={store.errors.values.from_street}
                        />
                    </div>
                </li>
            </ol>
            <ol className="relative">
                <li className={cn('pb-4 pl-4')}>
                    <div className="border-primary-600 absolute -start-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-2 bg-white"></div>
                    <h3 className="text-sm font-semibold">{t('To')}</h3>
                    <div className="mt-2 space-y-2 text-sm">
                        <SelectField
                            name="to_city"
                            onChange={form.handleChange}
                            options={cities.map((item) => ({ label: item, value: item }))}
                            value={form.values.to_city}
                            error={store.errors.values.to_city}
                        />
                        <TextAreaField
                            name="to_street"
                            onChange={form.handleChange}
                            rows={2}
                            placeholder={t('Address')}
                            value={form.values.to_street}
                            error={store.errors.values.to_street}
                        />
                    </div>
                </li>
            </ol>
        </>
    );
}
